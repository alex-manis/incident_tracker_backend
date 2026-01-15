import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const isProd = process.env.NODE_ENV === 'production';

// More lenient limit for dev/stage, stricter for prod
const maxAttempts = isProd ? 15 : 30; // 30 for dev/stage, 15 for prod

export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: maxAttempts,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    // Return JSON instead of text/html
    res.status(429).json({
      error: 'Too many login attempts',
      message: 'Please wait a minute before trying again.',
      retryAfter: Math.ceil(60), // seconds until limit reset (1 minute = windowMs)
    });
  },
});
