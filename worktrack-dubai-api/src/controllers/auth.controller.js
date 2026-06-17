const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');

const COOKIE_OPTS = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.register(fullName, email, password);
  res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
  res.status(201).json({ user: sanitize(user), accessToken });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(email, password);
  res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
  res.json({ user: sanitize(user), accessToken });
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token' });
  const { accessToken, refreshToken } = await authService.refresh(token);
  res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
  res.json({ accessToken });
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  await authService.logout(token);
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});

function sanitize(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

module.exports = { register, login, refresh, logout };
