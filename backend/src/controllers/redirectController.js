const bcrypt = require("bcryptjs");
const { z } = require("zod");
const asyncHandler = require("../utils/asyncHandler");
const linkService = require("../services/linkService");
const analyticsService = require("../services/analyticsService");
const qrService = require("../services/qrService");
const ApiError = require("../utils/ApiError");

const STATUS_MESSAGES = {
  not_found: "This short link does not exist.",
  disabled: "This short link has been disabled.",
  expired: "This short link has expired.",
  used: "This short link has already been used.",
};

const verifySchema = z.object({
  body: z.object({ password: z.string().min(1) }),
  params: z.object({ shortCode: z.string() }),
  query: z.object({}).optional(),
});

const qrSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ shortCode: z.string() }),
  query: z.object({ format: z.enum(["png", "svg"]).optional() }),
});

// Same reasoning as qrService's BASE_URL handling: derive the frontend's
// host from the request so a phone visiting the backend on a LAN IP gets
// redirected to the frontend on that same LAN IP, not "localhost" (which on
// the phone means the phone itself). FRONTEND_URL overrides this when set.
function deriveFrontendUrl(req) {
  if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL.replace(/\/+$/, "");
  return `${req.protocol}://${req.hostname}:5173`;
}

// GET /:shortCode -- redirects directly for unprotected links, otherwise
// sends the browser to the frontend's password-entry page.
const resolve = asyncHandler(async (req, res) => {
  const link = await linkService.findByShortCode(req.params.shortCode);
  const state = linkService.evaluateLinkState(link);

  if (!state.ok) {
    return res.redirect(`${deriveFrontendUrl(req)}/link-status?reason=${state.reason}`);
  }

  if (link.passwordHash) {
    return res.redirect(`${deriveFrontendUrl(req)}/protected/${link.shortCode}`);
  }

  await analyticsService.recordVisit(req, link);
  res.redirect(302, link.originalUrl);
});

// POST /api/redirect/:shortCode/verify -- used by the frontend's password page.
const verify = asyncHandler(async (req, res) => {
  const link = await linkService.findByShortCode(req.params.shortCode);
  const state = linkService.evaluateLinkState(link);
  if (!state.ok) throw new ApiError(410, STATUS_MESSAGES[state.reason] || "This link is unavailable.");
  if (!link.passwordHash) throw new ApiError(400, "This link is not password protected");

  const valid = await bcrypt.compare(req.body.password, link.passwordHash);
  if (!valid) throw new ApiError(401, "Incorrect password");

  await analyticsService.recordVisit(req, link);
  res.json({ originalUrl: link.originalUrl });
});

// GET /api/redirect/:shortCode/qr -- public QR generation. No auth or ownership
// check: a QR code only encodes the short URL itself, the same information
// already visible in the link, so there's nothing extra to protect.
const qr = asyncHandler(async (req, res) => {
  const link = await linkService.findByShortCode(req.params.shortCode);
  if (!link) throw new ApiError(404, "Short link not found");

  const format = req.query.format === "svg" ? "svg" : "png";
  if (format === "svg") {
    const svg = await qrService.generateSvg(link.shortCode, req);
    res.type("image/svg+xml").send(svg);
  } else {
    const png = await qrService.generatePng(link.shortCode, req);
    res.type("image/png").send(png);
  }
});

module.exports = { resolve, verify, qr, verifySchema, qrSchema };
