import { PrismaClient, AuditLog } from '@prisma/client';

const prisma = new PrismaClient();

export class AuditLogRepository {
  async create(data: {
    actorId: string;
    entityType: string;
    entityId: string;
    action: string;
    diffJson?: Record<string, unknown> | null;
  }): Promise<AuditLog> {
    return prisma.auditLog.create({
      data,
    });
  }

  async findManyByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
