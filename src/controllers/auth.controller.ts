import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { AuthService } from '../services/auth.service.js';
import { config } from '../config.js';
import { LoginRequestSchema } from '@incident-tracker/shared';
import { logger } from '../lib/logger.js';

const authService = new AuthService();

export class AuthController {
  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const credentials = LoginRequestSchema.parse(req.body);
      const result = await authService.login(credentials);

      res.cookie(config.cookieName, result.refreshToken, config.cookieOptions);

      res.json({ user: result.user, accessToken: result.accessToken });
    } catch (e) {
      if (e instanceof Error && e.message === "Invalid credentials") {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      throw e;
    }
  }

  async refresh(req: AuthRequest, res: Response): Promise<void> {
    const refreshToken = req.cookies[config.cookieName];
    if (!refreshToken) {
      logger.warn({ 
        cookies: Object.keys(req.cookies),
        cookieName: config.cookieName,
        hasCookies: !!req.cookies,
        headers: {
          cookie: req.headers.cookie ? 'present' : 'missing'
        }
      }, 'Refresh token not found in cookies');
      res.status(401).json({ error: 'Refresh token required' });
      return;
    }

    try {
      const result = await authService.refresh(refreshToken);

      res.cookie(config.cookieName, result.refreshToken, config.cookieOptions);

      res.json({
        accessToken: result.accessToken,
      });
    } catch (error) {
      // Error is already logged in auth.service
      throw error;
    }
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    const refreshToken = req.cookies[config.cookieName];
    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    // Clear cookie with the same options used when setting it
    res.clearCookie(config.cookieName, {
      httpOnly: true,
      secure: config.cookieOptions.secure,
      sameSite: config.cookieOptions.sameSite,
      path: config.cookieOptions.path, // Use the same path as when setting
    });
    res.json({ message: 'Logged out' });
  }

  async me(req: AuthRequest, res: Response): Promise<void> {
    res.setHeader('Cache-Control', 'no-store');
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await authService.getCurrentUser(req.user.userId);
    res.json(user);
  }
}
