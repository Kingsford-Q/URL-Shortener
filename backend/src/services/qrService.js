const QRCode = require("qrcode");

// Prefer the host the request actually arrived on -- it's automatically
// correct whether the server is reached via localhost, a LAN IP, a tunnel,
// or a real production domain, so there's nothing to update when moving
// environments. BASE_URL is only needed to force a specific public domain
// (e.g. a CDN/custom domain that differs from the literal request host).
function deriveBaseUrl(req) {
  if (process.env.BASE_URL) return process.env.BASE_URL.replace(/\/+$/, "");
  if (req) return `${req.protocol}://${req.get("host")}`;
  return "http://localhost:4000";
}

function shortUrlFor(shortCode, req) {
  return `${deriveBaseUrl(req)}/${shortCode}`;
}

async function generatePng(shortCode, req) {
  return QRCode.toBuffer(shortUrlFor(shortCode, req), { type: "png", width: 320, margin: 1 });
}

async function generateSvg(shortCode, req) {
  return QRCode.toString(shortUrlFor(shortCode, req), { type: "svg", width: 320, margin: 1 });
}

module.exports = { generatePng, generateSvg, shortUrlFor };
