import { AuditLogRepository } from '../repositories/audit-log.repository.js';
import { AuditLogWithActor } from '@incident-tracker/shared';
const auditLogRepo = new AuditLogRepository();

function toAuditLogWithActor(log: any): AuditLogWithActor {
  return {
    id: log.id,
    actorId: log.actorId,
    entityType: log.entityType,
    entityId: log.entityId,
    action: log.action,
    diffJson: log.diffJson ? JSON.parse(log.diffJson) as Record<string, unknown> : null,
    createdAt: log.createdAt,
    actor: {
      id: log.actor.id,
      name: log.actor.name,
      email: log.actor.email,
      role: log.actor.role,
      isActive: log.actor.isActive,
      createdAt: log.actor.createdAt,
      updatedAt: log.actor.updatedAt,
    },
  };
}

export class AuditLogService {
  async getByEntity(entityType: string, entityId: string): Promise<AuditLogWithActor[]> {
    const logs = await auditLogRepo.findManyByEntity(entityType, entityId);

    const logsWithActors = logs.map((log: any) => {
      if (!log.actor) {
        throw new Error('Actor not found');
      }
      return toAuditLogWithActor(log);
    });

    return logsWithActors;
  }
}
