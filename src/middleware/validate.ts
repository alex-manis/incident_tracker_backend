import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Type assertion is safe here because Zod validates the shape
      req.query = schema.parse(req.query) as unknown as typeof req.query;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Type assertion is safe here because Zod validates the shape
      req.params = schema.parse(req.params) as unknown as typeof req.params;
      next();
    } catch (error) {
      next(error);
    }
  };
}
