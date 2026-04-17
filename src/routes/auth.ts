import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../utils/config';
import { registerSchema, loginSchema } from '../utils/validation';
import { createUser, findUserByEmail, emailExists } from '../db/userRepository';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import { ApiResponse, JwtPayload } from '../types';

const router = Router();

router.post(
  '/register',
  async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
    try {
      const validated = registerSchema.parse(req.body);

      if (emailExists(validated.email)) {
        throw new ConflictError('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(validated.password, config.bcryptSaltRounds);
      const user = createUser(validated.email, hashedPassword);

      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
      };

      const token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
          },
          token,
        },
        message: 'User registered successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/login',
  async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
    try {
      const validated = loginSchema.parse(req.body);

      const user = findUserByEmail(validated.email);
      if (!user) {
        throw new UnauthorizedError('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(validated.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }

      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
      };

      const token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
          },
          token,
        },
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
