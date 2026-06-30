const { z } = require("zod");
const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/authService");

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(200),
    password: z.string().min(8).max(200),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(200),
    password: z.string().min(1).max(200),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: authService.toPublicUser(req.user) });
});

module.exports = { register, login, me, registerSchema, loginSchema };
