const jwt = require("jsonwebtoken");
const prisma = require("../database/prisma");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

function extractToken(req) {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.slice(7);
  }
  return null;
}

const requireAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) throw new ApiError(401, "Authentication required");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) throw new ApiError(401, "Account not found or disabled");

  req.user = user;
  next();
});

const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (user && user.isActive) req.user = user;
  } catch {
    // Ignore invalid token on optional routes; treat as anonymous.
  }
  next();
});

const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) throw new ApiError(403, "Admin access required");
  next();
});

module.exports = { requireAuth, optionalAuth, requireAdmin };
