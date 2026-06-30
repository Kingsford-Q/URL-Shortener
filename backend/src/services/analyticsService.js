const { UAParser } = require("ua-parser-js");
const prisma = require("../database/prisma");
const { getOwnedLink } = require("./linkService");
const cache = require("./cacheService");

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || null;
}

async function recordVisit(req, link) {
  const ua = new UAParser(req.headers["user-agent"] || "");
  const browser = ua.getBrowser().name || "Unknown";
  const os = ua.getOS().name || "Unknown";
  const device = ua.getDevice().type || "desktop";
  const referrer = req.headers["referer"] || req.headers["referrer"] || null;
  const country = req.headers["cf-ipcountry"] || req.headers["x-vercel-ip-country"] || null;

  await prisma.$transaction([
    prisma.visit.create({
      data: {
        linkId: link.id,
        ipAddress: clientIp(req),
        browser,
        os,
        device,
        referrer,
        country,
      },
    }),
    prisma.link.update({
      where: { id: link.id },
      data: {
        clickCount: { increment: 1 },
        ...(link.oneTimeUse ? { used: true } : {}),
      },
    }),
  ]);

  // The cached link (used by findByShortCode) is now stale: clickCount changed,
  // and for one-time-use links `used` flipped to true, so a cache hit within the
  // TTL would otherwise let the link be redeemed again before it expires.
  cache.del(`link:${link.shortCode}`);
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function bucketCounts(visits, days) {
  const buckets = new Map();
  const today = startOfDay(new Date());
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const visit of visits) {
    const key = startOfDay(visit.visitedAt).toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, buckets.get(key) + 1);
  }
  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

function tally(visits, field) {
  const counts = {};
  for (const visit of visits) {
    const key = visit[field] || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

async function getAnalytics(userId, linkId, { days = 30 } = {}) {
  const link = await getOwnedLink(userId, linkId);
  const since = new Date();
  since.setDate(since.getDate() - days);

  const visits = await prisma.visit.findMany({
    where: { linkId: link.id, visitedAt: { gte: since } },
    orderBy: { visitedAt: "desc" },
  });

  const uniqueVisitors = new Set(visits.map((v) => v.ipAddress || "unknown")).size;

  return {
    linkId: link.id,
    shortCode: link.shortCode,
    totalClicks: link.clickCount,
    uniqueVisitors,
    rangeClicks: visits.length,
    daily: bucketCounts(visits, days),
    browsers: tally(visits, "browser"),
    operatingSystems: tally(visits, "os"),
    devices: tally(visits, "device"),
    referrers: tally(visits, "referrer"),
    countries: tally(visits, "country"),
    recent: visits.slice(0, 25),
  };
}

module.exports = { recordVisit, getAnalytics };
