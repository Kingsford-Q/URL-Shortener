const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../database/prisma");
const ApiError = require("../utils/ApiError");

const SALT_ROUNDS = 10;

function signToken(user) {
  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };
}

async function register({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "An account with that email already exists");

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });

  return { user: toPublicUser(user), token: signToken(user) };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, "Invalid email or password");
  if (!user.isActive) throw new ApiError(403, "This account has been disabled");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid email or password");

  return { user: toPublicUser(user), token: signToken(user) };
}

module.exports = { register, login, toPublicUser, SALT_ROUNDS };
