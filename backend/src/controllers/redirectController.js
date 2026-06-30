const bcrypt = require("bcryptjs");
const { z } = require("zod");
const asyncHandler = require("../utils/asyncHandler");
const linkService = require("../services/linkService");
const analyticsService = require("../services/analyticsService");
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

// GET /:shortCode -- redirects directly for unprotected links, otherwise
// sends the browser to the frontend's password-entry page.
const resolve = asyncHandler(async (req, res) => {
  const link = await linkService.findByShortCode(req.params.shortCode);
  const state = linkService.evaluateLinkState(link);

  if (!state.ok) {
    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontend}/link-status?reason=${state.reason}`);
  }

  if (link.passwordHash) {
    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontend}/protected/${link.shortCode}`);
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

module.exports = { resolve, verify, verifySchema };
