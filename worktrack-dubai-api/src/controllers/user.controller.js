const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');
const { uploadAvatar: cloudinaryUpload } = require('../config/cloudinary');

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user.id);
  res.json({ user });
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  res.json({ user });
});

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const result = await cloudinaryUpload(req.file.buffer);
  const user = await userService.updateAvatar(req.user.id, result.secure_url);
  res.json({ user });
});

const updateLanguage = asyncHandler(async (req, res) => {
  const user = await userService.updateLanguage(req.user.id, req.body.language);
  res.json({ user });
});

const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  res.json({ message: 'Password updated' });
});

module.exports = { getMe, updateMe, uploadAvatar, updateLanguage, changePassword };
