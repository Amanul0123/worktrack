const prisma = require('../config/db');
const { hash, compare } = require('../utils/hash');

const SAFE_FIELDS = {
  id: true, fullName: true, email: true, role: true,
  mobile: true, countryCode: true, country: true,
  gender: true, city: true, avatarUrl: true, bio: true,
  preferredLanguage: true, isActive: true, onboardingDone: true,
  createdAt: true, updatedAt: true,
};

async function getMe(userId) {
  return prisma.user.findUnique({ where: { id: userId }, select: SAFE_FIELDS });
}

async function updateProfile(userId, data) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: SAFE_FIELDS,
  });
  await prisma.activityLog.create({ data: { userId, action: 'profile_updated' } });
  return user;
}

async function updateAvatar(userId, avatarUrl) {
  return prisma.user.update({
    where: { id: userId },
    data: { avatarUrl },
    select: SAFE_FIELDS,
  });
}

async function updateLanguage(userId, language) {
  return prisma.user.update({
    where: { id: userId },
    data: { preferredLanguage: language },
    select: SAFE_FIELDS,
  });
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!(await compare(currentPassword, user.passwordHash))) {
    const err = new Error('Current password is incorrect');
    err.status = 400;
    throw err;
  }
  const passwordHash = await hash(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}

module.exports = { getMe, updateProfile, updateAvatar, updateLanguage, changePassword };
