const adminService = require('../services/admin.service');
const asyncHandler = require('../utils/asyncHandler');

const listUsers = asyncHandler(async (req, res) => {
  const result = await adminService.listUsers(req.query);
  res.json(result);
});

const getUserDetail = asyncHandler(async (req, res) => {
  const result = await adminService.getUserDetail(req.params.id);
  res.json(result);
});

const setUserStatus = asyncHandler(async (req, res) => {
  const user = await adminService.setUserStatus(req.params.id, req.body.isActive);
  res.json({ user });
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getStats();
  res.json(stats);
});

module.exports = { listUsers, getUserDetail, setUserStatus, getStats };
