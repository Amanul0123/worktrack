const prisma = require('../config/db');
const { hash, compare } = require('../utils/hash');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const crypto = require('crypto');

function buildTokens(user) {
  const payload = { id: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
}

async function register(fullName, email, password) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('An account with that email already exists');
    err.status = 409;
    throw err;
  }
  const passwordHash = await hash(password);
  const user = await prisma.user.create({
    data: { fullName, email, passwordHash },
  });
  const { accessToken, refreshToken } = buildTokens(user);
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({ data: { userId: user.id, tokenHash, expiresAt } });
  return { user, accessToken, refreshToken };
}

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await compare(password, user.passwordHash))) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  if (!user.isActive) {
    const err = new Error('Your account has been deactivated');
    err.status = 403;
    throw err;
  }
  const { accessToken, refreshToken } = buildTokens(user);
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({ data: { userId: user.id, tokenHash, expiresAt } });
  await prisma.activityLog.create({ data: { userId: user.id, action: 'login' } });
  return { user, accessToken, refreshToken };
}

async function refresh(token) {
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  }
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const stored = await prisma.refreshToken.findFirst({
    where: { tokenHash, expiresAt: { gt: new Date() } },
    include: { user: true },
  });
  if (!stored) {
    const err = new Error('Refresh token not recognised');
    err.status = 401;
    throw err;
  }
  await prisma.refreshToken.delete({ where: { id: stored.id } });
  const { accessToken, refreshToken: newRefresh } = buildTokens(stored.user);
  const newHash = crypto.createHash('sha256').update(newRefresh).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({ data: { userId: stored.user.id, tokenHash: newHash, expiresAt } });
  return { accessToken, refreshToken: newRefresh };
}

async function logout(token) {
  if (!token) return;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await prisma.refreshToken.deleteMany({ where: { tokenHash } });
}

module.exports = { register, login, refresh, logout };
