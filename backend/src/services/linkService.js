const bcrypt = require("bcryptjs");
const prisma = require("../database/prisma");
const ApiError = require("../utils/ApiError");
const cache = require("./cacheService");
const { generateShortCode, isReserved } = require("../utils/shortCode");

const SALT_ROUNDS = 10;
const CACHE_TTL_MS = 30_000;

function publicLink(link) {
  const { passwordHash, ...rest } = link;
  return { ...rest, hasPassword: Boolean(passwordHash) };
}

async function createUniqueShortCode(preferred) {
  if (preferred) {
    if (isReserved(preferred)) throw new ApiError(400, "That alias is reserved, choose another");
    const existing = await prisma.link.findUnique({ where: { shortCode: preferred } });
    if (existing) throw new ApiError(409, "That alias is already taken");
    return preferred;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateShortCode();
    const existing = await prisma.link.findUnique({ where: { shortCode: code } });
    if (!existing) return code;
  }
  throw new ApiError(500, "Could not generate a unique short code, please try again");
}

async function createLink(userId, input) {
  const shortCode = await createUniqueShortCode(input.customAlias);
  const passwordHash = input.password ? await bcrypt.hash(input.password, SALT_ROUNDS) : null;

  const link = await prisma.link.create({
    data: {
      userId: userId ?? null,
      originalUrl: input.originalUrl,
      shortCode,
      passwordHash,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      isPrivate: Boolean(input.isPrivate),
      oneTimeUse: Boolean(input.oneTimeUse),
    },
  });

  return publicLink(link);
}

async function listLinks(userId, { search, status, sort, page = 1, pageSize = 20 }) {
  const where = { userId };

  if (search) {
    where.OR = [
      { shortCode: { contains: search } },
      { originalUrl: { contains: search } },
    ];
  }

  const now = new Date();
  if (status === "active") {
    where.isActive = true;
    where.AND = [{ OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }];
  } else if (status === "expired") {
    where.OR = [...(where.OR || [])];
    where.expiresAt = { lte: now };
  } else if (status === "disabled") {
    where.isActive = false;
  }

  const orderBy =
    sort === "clicks" ? { clickCount: "desc" } :
    sort === "oldest" ? { createdAt: "asc" } :
    { createdAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.link.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.link.count({ where }),
  ]);

  return { items: items.map(publicLink), total, page, pageSize };
}

async function getOwnedLink(userId, id) {
  const link = await prisma.link.findUnique({ where: { id: Number(id) } });
  if (!link) throw new ApiError(404, "Link not found");
  if (link.userId !== userId) throw new ApiError(403, "You do not have access to this link");
  return link;
}

async function getLinkForOwner(userId, id) {
  const link = await getOwnedLink(userId, id);
  return publicLink(link);
}

async function updateLink(userId, id, input) {
  const link = await getOwnedLink(userId, id);

  const data = {};
  if (input.originalUrl !== undefined) data.originalUrl = input.originalUrl;
  if (input.isActive !== undefined) data.isActive = input.isActive;
  if (input.isPrivate !== undefined) data.isPrivate = input.isPrivate;
  if (input.oneTimeUse !== undefined) data.oneTimeUse = input.oneTimeUse;
  if (input.expiresAt !== undefined) data.expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
  if (input.password !== undefined) {
    data.passwordHash = input.password ? await bcrypt.hash(input.password, SALT_ROUNDS) : null;
  }

  const updated = await prisma.link.update({ where: { id: link.id }, data });
  cache.del(`link:${link.shortCode}`);
  return publicLink(updated);
}

async function deleteLink(userId, id) {
  const link = await getOwnedLink(userId, id);
  await prisma.link.delete({ where: { id: link.id } });
  cache.del(`link:${link.shortCode}`);
}

async function toggleActive(userId, id) {
  const link = await getOwnedLink(userId, id);
  const updated = await prisma.link.update({
    where: { id: link.id },
    data: { isActive: !link.isActive },
  });
  cache.del(`link:${link.shortCode}`);
  return publicLink(updated);
}

async function findByShortCode(shortCode) {
  const cached = cache.get(`link:${shortCode}`);
  if (cached) return cached;

  const link = await prisma.link.findUnique({ where: { shortCode } });
  if (link) cache.set(`link:${shortCode}`, link, CACHE_TTL_MS);
  return link;
}

function evaluateLinkState(link) {
  if (!link) return { ok: false, reason: "not_found" };
  if (!link.isActive) return { ok: false, reason: "disabled" };
  if (link.expiresAt && link.expiresAt < new Date()) return { ok: false, reason: "expired" };
  if (link.oneTimeUse && link.used) return { ok: false, reason: "used" };
  return { ok: true };
}

module.exports = {
  publicLink,
  createLink,
  listLinks,
  getLinkForOwner,
  getOwnedLink,
  updateLink,
  deleteLink,
  toggleActive,
  findByShortCode,
  evaluateLinkState,
};
