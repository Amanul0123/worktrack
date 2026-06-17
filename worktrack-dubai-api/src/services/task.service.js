const prisma = require('../config/db');

async function listTasks(userId, query) {
  const { status, priority, category, search, sort = 'createdAt', page = 1, limit = 20 } = query;
  const where = { userId };
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (category) where.category = category;
  if (search) where.title = { contains: search };
  const skip = (Number(page) - 1) * Number(limit);
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { [sort]: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.task.count({ where }),
  ]);
  return { tasks, total, page: Number(page), limit: Number(limit) };
}

async function createTask(userId, data) {
  const task = await prisma.task.create({
    data: { userId, ...data, dueDate: data.dueDate ? new Date(data.dueDate) : null },
  });
  await prisma.activityLog.create({
    data: { userId, action: 'task_created', metadata: { taskId: task.id, title: task.title } },
  });
  return task;
}

async function updateTask(userId, taskId, data) {
  await ensureOwner(userId, taskId);
  const task = await prisma.task.update({
    where: { id: taskId },
    data: { ...data, dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined },
  });
  await prisma.activityLog.create({
    data: { userId, action: 'task_updated', metadata: { taskId, title: task.title } },
  });
  return task;
}

async function toggleStatus(userId, taskId, status) {
  await ensureOwner(userId, taskId);
  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      status,
      completedAt: status === 'done' ? new Date() : null,
    },
  });
  await prisma.activityLog.create({
    data: {
      userId,
      action: status === 'done' ? 'task_completed' : 'task_updated',
      metadata: { taskId, title: task.title },
    },
  });
  return task;
}

async function deleteTask(userId, taskId) {
  const task = await ensureOwner(userId, taskId);
  await prisma.task.delete({ where: { id: taskId } });
  await prisma.activityLog.create({
    data: { userId, action: 'task_deleted', metadata: { taskId, title: task.title } },
  });
}

async function ensureOwner(userId, taskId) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== userId) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }
  return task;
}

module.exports = { listTasks, createTask, updateTask, toggleStatus, deleteTask };
