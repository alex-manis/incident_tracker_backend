import { AuditLog } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { AuditLogWithActor } from '../lib/types.js';

export class AuditLogRepository {
  async create(data: {
    actorId: string;
    entityType: string;
    entityId: string;
    action: string;
    diffJson?: Record<string, unknown> | null;
  }): Promise<AuditLog> {
    return prisma.auditLog.create({
      data: {
        ...data,
        diffJson: data.diffJson ? JSON.stringify(data.diffJson) : null,
      },
    });
  }

  async findManyByEntity(entityType: string, entityId: string): Promise<AuditLogWithActor[]> {
    return prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        actor: true,
      },
    });
  }
}
