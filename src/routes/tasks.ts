import { Router, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
} from '../utils/validation';
import {
  createTask,
  findTasksByUserId,
  findTaskByIdAndUserId,
  updateTask,
  deleteTask,
} from '../db/taskRepository';
import { NotFoundError } from '../utils/errors';
import { AuthenticatedRequest, ApiResponse } from '../types';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  (req: AuthenticatedRequest, res: Response<ApiResponse>, next: NextFunction): void => {
    try {
      const userId = req.user!.userId;
      const tasks = findTasksByUserId(userId);

      res.json({
        success: true,
        data: { tasks },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  (req: AuthenticatedRequest, res: Response<ApiResponse>, next: NextFunction): void => {
    try {
      const userId = req.user!.userId;
      const validated = createTaskSchema.parse(req.body);

      const task = createTask(userId, validated);

      res.status(201).json({
        success: true,
        data: { task },
        message: 'Task created successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  (req: AuthenticatedRequest, res: Response<ApiResponse>, next: NextFunction): void => {
    try {
      const userId = req.user!.userId;
      const { id } = taskIdSchema.parse(req.params);
      const validated = updateTaskSchema.parse(req.body);

      const existingTask = findTaskByIdAndUserId(id, userId);
      if (!existingTask) {
        throw new NotFoundError('Task not found');
      }

      const task = updateTask(id, userId, validated);

      res.json({
        success: true,
        data: { task },
        message: 'Task updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  (req: AuthenticatedRequest, res: Response<ApiResponse>, next: NextFunction): void => {
    try {
      const userId = req.user!.userId;
      const { id } = taskIdSchema.parse(req.params);

      const existingTask = findTaskByIdAndUserId(id, userId);
      if (!existingTask) {
        throw new NotFoundError('Task not found');
      }

      deleteTask(id, userId);

      res.json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
