import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const isProd = process.env.NODE_ENV === 'production';

// Более мягкий лимит для dev/stage, жесткий для prod
const maxAttempts = isProd ? 15 : 30; // 30 для dev/stage, 5 для prod

export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: maxAttempts,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    // Возвращаем JSON вместо text/html
    res.status(429).json({
      error: 'Too many login attempts',
      message: 'Please wait a minute before trying again.',
      retryAfter: Math.ceil(15 * 60), // секунды до сброса лимита
    });
  },
});
