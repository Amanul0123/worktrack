const taskService = require('../services/task.service');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const result = await taskService.listTasks(req.user.id, req.query);
  res.json(result);
});

const create = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user.id, req.body);
  res.status(201).json({ task });
});

const update = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
  res.json({ task });
});

const toggleStatus = asyncHandler(async (req, res) => {
  const task = await taskService.toggleStatus(req.user.id, req.params.id, req.body.status);
  res.json({ task });
});

const remove = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.user.id, req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = { list, create, update, toggleStatus, remove };
