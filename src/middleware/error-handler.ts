import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { logger } from '../lib/logger.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error({ err, path: req.path, method: req.method }, 'Request error');

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      details: err.errors,
    });
    return;
  }

  // Handle Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      // Unique constraint violation
      res.status(409).json({ 
        error: 'Duplicate entry',
        message: 'A record with this value already exists',
      });
      return;
    }
    if (err.code === 'P2025') {
      // Record not found
      res.status(404).json({ 
        error: 'Record not found',
        message: 'The requested record does not exist',
      });
      return;
    }
    if (err.code === 'P2003') {
      // Foreign key constraint violation
      res.status(400).json({ 
        error: 'Invalid reference',
        message: 'Referenced record does not exist',
      });
      return;
    }
    // Log other Prisma errors for debugging
    logger.error({ err, code: err.code }, 'Unhandled Prisma error');
  }

  // Handle authentication/authorization errors
  if (err.name === 'UnauthorizedError' || err.message === 'Unauthorized') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Handle known service errors
  if (err.message === 'Invalid credentials' || err.message === 'User not found' || err.message === 'User not found or inactive') {
    res.status(401).json({ error: err.message });
    return;
  }

  if (err.message === 'Forbidden') {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  if (err.message === 'Incident not found' || err.message === 'Record not found') {
    res.status(404).json({ error: err.message });
    return;
  }

  if (err.message === 'Invalid refresh token' || err.message === 'Token already revoked') {
    res.status(401).json({ error: err.message });
    return;
  }

  // Default error response
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}
