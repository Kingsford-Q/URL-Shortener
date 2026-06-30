const { z } = require("zod");
const asyncHandler = require("../utils/asyncHandler");
const linkService = require("../services/linkService");
const qrService = require("../services/qrService");
const ApiError = require("../utils/ApiError");
const { ALIAS_PATTERN } = require("../utils/shortCode");

const createLinkSchema = z.object({
  body: z.object({
    originalUrl: z.string().trim().url().max(2048),
    customAlias: z.string().regex(ALIAS_PATTERN, "Alias must be 3-32 letters, numbers, _ or -").optional(),
    password: z.string().min(4).max(100).optional(),
    expiresAt: z.string().datetime().optional(),
    isPrivate: z.boolean().optional(),
    oneTimeUse: z.boolean().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateLinkSchema = z.object({
  body: z.object({
    originalUrl: z.string().trim().url().max(2048).optional(),
    password: z.string().min(4).max(100).nullable().optional(),
    expiresAt: z.string().datetime().nullable().optional(),
    isActive: z.boolean().optional(),
    isPrivate: z.boolean().optional(),
    oneTimeUse: z.boolean().optional(),
  }),
  params: z.object({ id: z.string() }),
  query: z.object({}).optional(),
});

const idParamSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: z.string() }),
  query: z.object({}).optional(),
});

const create = asyncHandler(async (req, res) => {
  if (!req.user && req.body.isPrivate) {
    throw new ApiError(401, "You must be signed in to create a private link");
  }
  const link = await linkService.createLink(req.user?.id, req.body);
  res.status(201).json({ link, shortUrl: qrService.shortUrlFor(link.shortCode, req) });
});

const list = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const { search, status, sort, page, pageSize } = req.query;
  const result = await linkService.listLinks(req.user.id, {
    search,
    status,
    sort,
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
  });
  res.json(result);
});

const getOne = asyncHandler(async (req, res) => {
  const link = await linkService.getLinkForOwner(req.user.id, req.params.id);
  res.json({ link, shortUrl: qrService.shortUrlFor(link.shortCode, req) });
});

const update = asyncHandler(async (req, res) => {
  const link = await linkService.updateLink(req.user.id, req.params.id, req.body);
  res.json({ link });
});

const remove = asyncHandler(async (req, res) => {
  await linkService.deleteLink(req.user.id, req.params.id);
  res.status(204).send();
});

const toggle = asyncHandler(async (req, res) => {
  const link = await linkService.toggleActive(req.user.id, req.params.id);
  res.json({ link });
});

const qr = asyncHandler(async (req, res) => {
  const link = await linkService.getLinkForOwner(req.user.id, req.params.id);
  const format = req.query.format === "svg" ? "svg" : "png";

  if (format === "svg") {
    const svg = await qrService.generateSvg(link.shortCode, req);
    res.type("image/svg+xml").send(svg);
  } else {
    const png = await qrService.generatePng(link.shortCode, req);
    res.type("image/png").send(png);
  }
});

module.exports = {
  create, list, getOne, update, remove, toggle, qr,
  createLinkSchema, updateLinkSchema, idParamSchema,
};
