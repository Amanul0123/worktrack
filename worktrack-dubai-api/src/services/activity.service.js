const prisma = require('../config/db');

async function getActivity(userId, page = 1, limit = 20) {
  const skip = (Number(page) - 1) * Number(limit);
  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.activityLog.count({ where: { userId } }),
  ]);
  return { logs, total, page: Number(page), limit: Number(limit) };
}

module.exports = { getActivity };
