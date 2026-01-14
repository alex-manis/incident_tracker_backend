import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { AuthService } from '../services/auth.service.js';
import { config } from '../config.js';
import { LoginRequestSchema } from '@incident-tracker/shared';

const authService = new AuthService();

export class AuthController {
  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const credentials = LoginRequestSchema.parse(req.body);
      const result = await authService.login(credentials);

      res.cookie(config.cookieName, result.refreshToken, config.cookieOptions);

      res.json({ user: result.user, accessToken: result.accessToken });
    } catch (e: any) {
      if (e?.message === "Invalid credentials") {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      throw e;
    }
  }

  async refresh(req: AuthRequest, res: Response): Promise<void> {
    const refreshToken = req.cookies[config.cookieName];
    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token required' });
      return;
    }

    const result = await authService.refresh(refreshToken);

    res.cookie(config.cookieName, result.refreshToken, config.cookieOptions);

    res.json({
      accessToken: result.accessToken,
    });
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    const refreshToken = req.cookies[config.cookieName];
    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie(config.cookieName, { path: '/' });
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
