const activityService = require('../services/activity.service');
const asyncHandler = require('../utils/asyncHandler');

const getActivity = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await activityService.getActivity(req.user.id, page, limit);
  res.json(result);
});

module.exports = { getActivity };
