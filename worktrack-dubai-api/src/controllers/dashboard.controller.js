const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');

const summary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary(req.user.id);
  res.json(data);
});

module.exports = { summary };
