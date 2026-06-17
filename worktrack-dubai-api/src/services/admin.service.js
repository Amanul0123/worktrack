const prisma = require('../config/db');

const SAFE_USER = {
  id: true, fullName: true, email: true, role: true,
  mobile: true, countryCode: true, country: true,
  gender: true, city: true, avatarUrl: true, bio: true,
  preferredLanguage: true, isActive: true, onboardingDone: true,
  createdAt: true, updatedAt: true,
};

async function listUsers({ search, isActive, country, page = 1, limit = 20 }) {
  const where = { role: 'user' };
  if (search) {
    where.OR = [
      { fullName: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (isActive !== undefined) where.isActive = isActive === 'true';
  if (country) where.country = country;

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    prisma.user.findMany({ where, select: SAFE_USER, orderBy: { createdAt: 'desc' }, skip, take: Number(limit) }),
    prisma.user.count({ where }),
  ]);
  return { users, total, page: Number(page), limit: Number(limit) };
}

async function getUserDetail(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: SAFE_USER });
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  const [tasks, activityLogs] = await Promise.all([
    prisma.task.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
    prisma.activityLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 }),
  ]);
  return { user, tasks, activityLogs };
}

async function setUserStatus(userId, isActive) {
  return prisma.user.update({ where: { id: userId }, data: { isActive }, select: SAFE_USER });
}

async function getStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [totalUsers, totalTasks, activeTodayLogs, completedTasks, pendingTasks] = await Promise.all([
    prisma.user.count({ where: { role: 'user' } }),
    prisma.task.count(),
    prisma.activityLog.findMany({
      where: { action: 'login', createdAt: { gte: todayStart } },
      select: { userId: true },
      distinct: ['userId'],
    }),
    prisma.task.count({ where: { status: 'done' } }),
    prisma.task.count({ where: { status: 'pending' } }),
  ]);

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Completion trend — last 7 days
  const trend = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(todayStart);
    dayStart.setDate(dayStart.getDate() - i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const count = await prisma.task.count({
      where: { status: 'done', completedAt: { gte: dayStart, lt: dayEnd } },
    });
    trend.push({ date: dayStart.toISOString().slice(0, 10), count });
  }

  // Active users trend — last 7 days
  const activeTrend = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(todayStart);
    dayStart.setDate(dayStart.getDate() - i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const logs = await prisma.activityLog.findMany({
      where: { action: 'login', createdAt: { gte: dayStart, lt: dayEnd } },
      select: { userId: true },
      distinct: ['userId'],
    });
    activeTrend.push({ date: dayStart.toISOString().slice(0, 10), count: logs.length });
  }

  return {
    totalUsers,
    totalTasks,
    activeUsersToday: activeTodayLogs.length,
    completionRate,
    completedTasks,
    pendingTasks,
    completionTrend: trend,
    activeUsersTrend: activeTrend,
    statusBreakdown: [
      { name: 'Completed', value: completedTasks },
      { name: 'Pending', value: pendingTasks },
    ],
  };
}

async function exportData({ search, isActive, country }) {
  const where = { role: 'user' };
  if (search) {
    where.OR = [
      { fullName: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (isActive !== undefined) where.isActive = isActive === 'true';
  if (country) where.country = country;

  const users = await prisma.user.findMany({
    where,
    select: {
      ...SAFE_USER,
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const withTaskCounts = await Promise.all(
    users.map(async (u) => {
      const completed = await prisma.task.count({ where: { userId: u.id, status: 'done' } });
      return { ...u, tasksTotal: u._count.tasks, tasksCompleted: completed };
    })
  );

  return withTaskCounts;
}

module.exports = { listUsers, getUserDetail, setUserStatus, getStats, exportData };
