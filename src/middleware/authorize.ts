import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { Role } from '@incident-tracker/shared';

export function requireRole(allowedRoles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role as Role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
}
