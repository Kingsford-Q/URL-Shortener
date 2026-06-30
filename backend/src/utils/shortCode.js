const { customAlphabet } = require("nanoid");

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const generate = customAlphabet(ALPHABET, 7);

const RESERVED = new Set([
  "api", "admin", "login", "register", "dashboard", "static", "favicon.ico",
]);

function generateShortCode() {
  return generate();
}

function isReserved(code) {
  return RESERVED.has(code.toLowerCase());
}

const ALIAS_PATTERN = /^[a-zA-Z0-9_-]{3,32}$/;

module.exports = { generateShortCode, isReserved, ALIAS_PATTERN };
