import { z } from 'zod';
import { Role, IncidentSeverity, IncidentStatus } from './enums.js';
// User DTOs
export const UserPublicSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    role: z.nativeEnum(Role),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
// Incident DTOs
export const IncidentSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    severity: z.nativeEnum(IncidentSeverity),
    status: z.nativeEnum(IncidentStatus),
    assigneeId: z.string().uuid().nullable(),
    reporterId: z.string().uuid(),
    dueAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const IncidentWithRelationsSchema = IncidentSchema.extend({
    assignee: UserPublicSchema.nullable(),
    reporter: UserPublicSchema,
});
// Comment DTOs
export const CommentSchema = z.object({
    id: z.string().uuid(),
    incidentId: z.string().uuid(),
    authorId: z.string().uuid(),
    text: z.string(),
    createdAt: z.date(),
});
export const CommentWithAuthorSchema = CommentSchema.extend({
    author: UserPublicSchema,
});
// Pagination DTOs
export const PaginationParamsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});
export const PaginationMetaSchema = z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
});
export const PaginatedResponseSchema = (itemSchema) => z.object({
    items: z.array(itemSchema),
    meta: PaginationMetaSchema,
});
// Auth DTOs
export const LoginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
export const LoginResponseSchema = z.object({
    user: UserPublicSchema,
});
// Incident request DTOs
export const CreateIncidentRequestSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1),
    severity: z.nativeEnum(IncidentSeverity),
    assigneeId: z.string().uuid().nullable().optional(),
    dueAt: z.string().datetime().nullable().optional(),
});
export const UpdateIncidentRequestSchema = CreateIncidentRequestSchema.partial().extend({
    status: z.nativeEnum(IncidentStatus).optional(),
});
export const IncidentFiltersSchema = z.object({
    status: z.nativeEnum(IncidentStatus).optional(),
    severity: z.nativeEnum(IncidentSeverity).optional(),
    assigneeId: z.string().uuid().optional(),
    reporterId: z.string().uuid().optional(),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'severity', 'status']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});
// Comment request DTOs
export const CreateCommentRequestSchema = z.object({
    text: z.string().min(1).max(5000),
});
// Audit Log DTOs
export const AuditLogSchema = z.object({
    id: z.string().uuid(),
    actorId: z.string().uuid(),
    entityType: z.string(),
    entityId: z.string().uuid(),
    action: z.string(),
    diffJson: z.record(z.unknown()).nullable(),
    createdAt: z.date(),
});
export const AuditLogWithActorSchema = AuditLogSchema.extend({
    actor: UserPublicSchema,
});
// Dashboard DTOs
export const DashboardSummarySchema = z.object({
    totalIncidents: z.number(),
    openIncidents: z.number(),
    inProgressIncidents: z.number(),
    resolvedIncidents: z.number(),
    criticalIncidents: z.number(),
    incidentsBySeverity: z.record(z.number()),
    incidentsByStatus: z.record(z.number()),
});
//# sourceMappingURL=dto.js.map