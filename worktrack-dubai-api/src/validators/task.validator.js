const { z } = require('zod');

const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  category: z.string().max(100).optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional().nullable(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  category: z.string().max(100).optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
});

const toggleStatusSchema = z.object({
  status: z.enum(['pending', 'done']),
});

module.exports = { createTaskSchema, updateTaskSchema, toggleStatusSchema };
