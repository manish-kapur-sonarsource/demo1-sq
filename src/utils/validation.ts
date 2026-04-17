import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  status: z.enum(['pending', 'completed']).optional().default('pending'),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  dueDate: z.string().datetime({ offset: true }).optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long').optional(),
  description: z.string().max(1000, 'Description is too long').optional().nullable(),
  status: z.enum(['pending', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().datetime({ offset: true }).optional().nullable().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable()),
});

export const taskIdSchema = z.object({
  id: z.string().uuid('Invalid task ID format'),
});
