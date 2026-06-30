const QRCode = require("qrcode");

function shortUrlFor(shortCode) {
  return `${process.env.BASE_URL || "http://localhost:4000"}/${shortCode}`;
}

async function generatePng(shortCode) {
  return QRCode.toBuffer(shortUrlFor(shortCode), { type: "png", width: 320, margin: 1 });
}

async function generateSvg(shortCode) {
  return QRCode.toString(shortUrlFor(shortCode), { type: "svg", width: 320, margin: 1 });
}

module.exports = { generatePng, generateSvg, shortUrlFor };
