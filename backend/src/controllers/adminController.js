const asyncHandler = require("../utils/asyncHandler");
const prisma = require("../database/prisma");
const ApiError = require("../utils/ApiError");
const cache = require("../services/cacheService");
const { toPublicUser } = require("../services/authService");

const listUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { links: true } } },
  });
  res.json({
    users: users.map((u) => ({ ...toPublicUser(u), isActive: u.isActive, linkCount: u._count.links })),
  });
});

const disableUser = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (id === req.user.id) throw new ApiError(400, "You cannot disable your own account");

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, "User not found");

  const updated = await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
  });
  res.json({ user: { ...toPublicUser(updated), isActive: updated.isActive } });
});

const deleteLink = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const link = await prisma.link.findUnique({ where: { id } });
  if (!link) throw new ApiError(404, "Link not found");

  await prisma.link.delete({ where: { id } });
  cache.del(`link:${link.shortCode}`);
  res.status(204).send();
});

const stats = asyncHandler(async (req, res) => {
  const [userCount, linkCount, activeLinkCount, visitCount, clicksAgg] = await Promise.all([
    prisma.user.count(),
    prisma.link.count(),
    prisma.link.count({ where: { isActive: true } }),
    prisma.visit.count(),
    prisma.link.aggregate({ _sum: { clickCount: true } }),
  ]);

  res.json({
    userCount,
    linkCount,
    activeLinkCount,
    visitCount,
    totalClicks: clicksAgg._sum.clickCount || 0,
  });
});

module.exports = { listUsers, disableUser, deleteLink, stats };
