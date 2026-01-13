import { PrismaClient, Incident, IncidentSeverity, IncidentStatus } from '@prisma/client';
import { IncidentFilters, PaginationParams } from '@incident-tracker/shared';

const prisma = new PrismaClient();

export class IncidentRepository {
  async findMany(
    filters: IncidentFilters,
    pagination: PaginationParams
  ): Promise<{ items: Incident[]; total: number }> {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.severity) {
      where.severity = filters.severity;
    }
    if (filters.assigneeId) {
      where.assigneeId = filters.assigneeId;
    }
    if (filters.reporterId) {
      where.reporterId = filters.reporterId;
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    orderBy[sortBy] = sortOrder;

    const [items, total] = await Promise.all([
      prisma.incident.findMany({
        where,
        orderBy,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      prisma.incident.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<Incident | null> {
    return prisma.incident.findUnique({
      where: { id },
    });
  }

  async create(data: {
    title: string;
    description: string;
    severity: IncidentSeverity;
    reporterId: string;
    assigneeId?: string | null;
    dueAt?: Date | null;
  }): Promise<Incident> {
    return prisma.incident.create({
      data,
    });
  }

  async update(id: string, data: {
    title?: string;
    description?: string;
    severity?: IncidentSeverity;
    status?: IncidentStatus;
    assigneeId?: string | null;
    dueAt?: Date | null;
  }): Promise<Incident> {
    return prisma.incident.update({
      where: { id },
      data,
    });
  }

  async getSummary(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    bySeverity: Record<string, number>;
  }> {
    const [total, byStatus, bySeverity] = await Promise.all([
      prisma.incident.count(),
      prisma.incident.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.incident.groupBy({
        by: ['severity'],
        _count: true,
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
      bySeverity: bySeverity.reduce((acc, item) => {
        acc[item.severity] = item._count;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
