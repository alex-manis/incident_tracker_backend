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
    // Handle multiple refreshToken cookies (can happen when cookies accumulate)
    // Always parse cookie header to get all tokens, not just the first one from cookie-parser
    let refreshToken: string | undefined;
    const tokenCandidates: string[] = [];
    
    // Get token from cookie-parser (might be the first one if multiple exist)
    if (req.cookies[config.cookieName]) {
      tokenCandidates.push(req.cookies[config.cookieName]);
    }
    
    // Parse cookie header manually to get all refreshToken values
    if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').map(c => c.trim());
      const tokenCookies = cookies
        .filter(c => c.startsWith(`${config.cookieName}=`))
        .map(c => c.substring(config.cookieName.length + 1));
      
      tokenCandidates.push(...tokenCookies);
    }
    
    // Remove duplicates and use the last (most recent) token
    const uniqueTokens = Array.from(new Set(tokenCandidates));
    
    if (uniqueTokens.length > 1) {
      logger.debug({ tokenCount: uniqueTokens.length }, 'Found multiple refreshToken cookies, using the last one');
    }
    
    refreshToken = uniqueTokens[uniqueTokens.length - 1];

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

      // Clear old cookie and set new one
      res.clearCookie(config.cookieName, {
        httpOnly: true,
        secure: config.cookieOptions.secure,
        sameSite: config.cookieOptions.sameSite,
        path: config.cookieOptions.path,
      });
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
