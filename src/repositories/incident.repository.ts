import { Incident, User } from '@prisma/client';
import { IncidentFilters, PaginationParams } from '@incident-tracker/shared';
import { prisma } from '../lib/prisma.js';
import { IncidentWithRelations } from '../lib/types.js';

export class IncidentRepository {
  async findMany(
    filters: IncidentFilters,
    pagination: PaginationParams
  ): Promise<{ items: IncidentWithRelations[]; total: number }> {
    const where: Record<string, unknown> = {};

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
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    orderBy[sortBy] = sortOrder;

    const [items, total] = await Promise.all([
      prisma.incident.findMany({
        where,
        orderBy,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        include: {
          assignee: true,
          reporter: true,
        },
      }),
      prisma.incident.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<IncidentWithRelations | null> {
    return prisma.incident.findUnique({
      where: { id },
      include: {
        assignee: true,
        reporter: true,
      },
    });
  }

  async create(data: {
    title: string;
    description: string;
    severity: string;
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
    severity?: string;
    status?: string;
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
