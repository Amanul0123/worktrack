const prisma = require('../config/db');

async function getSummary(userId) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 864e5);

  const [total, completed, overdue, todayTotal, todayDone] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: 'done' } }),
    prisma.task.count({ where: { userId, status: 'pending', dueDate: { lt: now } } }),
    prisma.task.count({ where: { userId, dueDate: { gte: todayStart, lt: todayEnd } } }),
    prisma.task.count({ where: { userId, status: 'done', dueDate: { gte: todayStart, lt: todayEnd } } }),
  ]);

  return { total, completed, overdue, todayTotal, todayDone };
}

module.exports = { getSummary };
