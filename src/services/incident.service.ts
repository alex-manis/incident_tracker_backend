import { IncidentRepository } from '../repositories/incident.repository.js';
import { AuditLogRepository } from '../repositories/audit-log.repository.js';
import {
  CreateIncidentRequest,
  UpdateIncidentRequest,
  IncidentFilters,
  PaginationParams,
  IncidentWithRelations as IncidentWithRelationsDTO,
  DashboardSummary,
} from '@incident-tracker/shared';
import { logger } from '../lib/logger.js';
import { IncidentWithRelations } from '../lib/types.js';

const incidentRepo = new IncidentRepository();
const auditLogRepo = new AuditLogRepository();

function toIncidentWithRelations(incident: IncidentWithRelations): IncidentWithRelationsDTO {
  return {
    id: incident.id,
    title: incident.title,
    description: incident.description,
    severity: incident.severity,
    status: incident.status,
    assigneeId: incident.assigneeId,
    reporterId: incident.reporterId,
    dueAt: incident.dueAt,
    createdAt: incident.createdAt,
    updatedAt: incident.updatedAt,
    assignee: incident.assignee
      ? {
          id: incident.assignee.id,
          name: incident.assignee.name,
          email: incident.assignee.email,
          role: incident.assignee.role,
          isActive: incident.assignee.isActive,
          createdAt: incident.assignee.createdAt,
          updatedAt: incident.assignee.updatedAt,
        }
      : null,
    reporter: {
      id: incident.reporter.id,
      name: incident.reporter.name,
      email: incident.reporter.email,
      role: incident.reporter.role,
      isActive: incident.reporter.isActive,
      createdAt: incident.reporter.createdAt,
      updatedAt: incident.reporter.updatedAt,
    },
  };
}

export class IncidentService {
  async getMany(
    filters: IncidentFilters,
    pagination: PaginationParams
  ): Promise<{ items: IncidentWithRelationsDTO[]; meta: { page: number; limit: number; total: number; totalPages: number } }> {
    const { items, total } = await incidentRepo.findMany(filters, pagination);

    const itemsWithRelations = items.map((incident: IncidentWithRelations) => {
      if (!incident.reporter) {
        throw new Error('Reporter not found');
      }
      return toIncidentWithRelations(incident);
    });

    return {
      items: itemsWithRelations,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async getById(id: string): Promise<IncidentWithRelationsDTO> {
    const incident = await incidentRepo.findById(id);
    if (!incident) {
      throw new Error('Incident not found');
    }

    if (!incident.reporter) {
      throw new Error('Reporter not found');
    }

    return toIncidentWithRelations(incident);
  }

  async create(data: CreateIncidentRequest, reporterId: string, actorId: string): Promise<IncidentWithRelationsDTO> {
    const incident = await incidentRepo.create({
      ...data,
      reporterId,
      assigneeId: data.assigneeId ?? null,
      dueAt: data.dueAt ? new Date(data.dueAt) : null,
    });

    await auditLogRepo.create({
      actorId,
      entityType: 'Incident',
      entityId: incident.id,
      action: 'CREATE',
      diffJson: { ...data, reporterId },
    });

    logger.info({ 
      incidentId: incident.id, 
      reporterId, 
      actorId, 
      severity: data.severity,
      status: data.status 
    }, 'Incident created');

    return this.getById(incident.id);
  }

  async update(
    id: string,
    data: UpdateIncidentRequest,
    actorId: string
  ): Promise<IncidentWithRelationsDTO> {
    const existing = await incidentRepo.findById(id);
    if (!existing) {
      throw new Error('Incident not found');
    }

    const updateData: Partial<{
      title: string;
      description: string;
      severity: string;
      status: string;
      assigneeId: string | null;
      dueAt: Date | null;
    }> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.severity !== undefined) updateData.severity = data.severity;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId ?? null;
    if (data.dueAt !== undefined) updateData.dueAt = data.dueAt ? new Date(data.dueAt) : null;

    const updated = await incidentRepo.update(id, updateData);

    const diff: Record<string, unknown> = {};
    Object.keys(updateData).forEach((key) => {
      if (existing[key as keyof typeof existing] !== updateData[key as keyof typeof updateData]) {
        diff[key] = { from: existing[key as keyof typeof existing], to: updateData[key as keyof typeof updateData] };
      }
    });

    await auditLogRepo.create({
      actorId,
      entityType: 'Incident',
      entityId: id,
      action: 'UPDATE',
      diffJson: diff,
    });

    logger.info({ 
      incidentId: id, 
      actorId, 
      updatedFields: Object.keys(updateData),
      statusChange: data.status ? { from: existing.status, to: data.status } : undefined
    }, 'Incident updated');

    return this.getById(id);
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    const summary = await incidentRepo.getSummary();

    return {
      totalIncidents: summary.total,
      openIncidents: summary.byStatus.OPEN || 0,
      inProgressIncidents: summary.byStatus.IN_PROGRESS || 0,
      resolvedIncidents: summary.byStatus.RESOLVED || 0,
      criticalIncidents: summary.bySeverity.CRITICAL || 0,
      incidentsBySeverity: summary.bySeverity,
      incidentsByStatus: summary.byStatus,
    };
  }
}
