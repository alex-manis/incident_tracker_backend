import { AuditLogRepository } from '../repositories/audit-log.repository.js';
import { AuditLogWithActor as AuditLogWithActorDTO } from '@incident-tracker/shared';
import { AuditLogWithActor } from '../lib/types.js';

const auditLogRepo = new AuditLogRepository();

function toAuditLogWithActor(log: AuditLogWithActor): AuditLogWithActorDTO {
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
  async getByEntity(entityType: string, entityId: string): Promise<AuditLogWithActorDTO[]> {
    const logs = await auditLogRepo.findManyByEntity(entityType, entityId);

    const logsWithActors = logs.map((log: AuditLogWithActor) => {
      if (!log.actor) {
        throw new Error('Actor not found');
      }
      return toAuditLogWithActor(log);
    });

    return logsWithActors;
  }
}
