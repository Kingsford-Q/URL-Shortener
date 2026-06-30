const asyncHandler = require("../utils/asyncHandler");
const analyticsService = require("../services/analyticsService");

const getAnalytics = asyncHandler(async (req, res) => {
  const days = req.query.days ? Number(req.query.days) : 30;
  const data = await analyticsService.getAnalytics(req.user.id, req.params.id, { days });
  res.json(data);
});

module.exports = { getAnalytics };
