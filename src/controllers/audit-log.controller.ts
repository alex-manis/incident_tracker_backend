import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { AuditLogService } from '../services/audit-log.service.js';

const auditLogService = new AuditLogService();

export class AuditLogController {
  async getByIncident(req: AuthRequest, res: Response): Promise<void> {
    const { id: incidentId } = req.params;
    const logs = await auditLogService.getByEntity('Incident', incidentId);
    res.json(logs);
  }
}
