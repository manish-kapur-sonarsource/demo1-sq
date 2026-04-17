import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { ApiResponse } from '../types';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    res.status(400).json({
      success: false,
      error: 'Validation error',
      message: messages.join(', '),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
}
