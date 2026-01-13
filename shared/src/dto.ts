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

export type UserPublic = z.infer<typeof UserPublicSchema>;

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

export type Incident = z.infer<typeof IncidentSchema>;
export type IncidentWithRelations = z.infer<typeof IncidentWithRelationsSchema>;

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

export type Comment = z.infer<typeof CommentSchema>;
export type CommentWithAuthor = z.infer<typeof CommentWithAuthorSchema>;

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

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    meta: PaginationMetaSchema,
  });

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

// Auth DTOs
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const LoginResponseSchema = z.object({
  user: UserPublicSchema,
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

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

export type CreateIncidentRequest = z.infer<typeof CreateIncidentRequestSchema>;
export type UpdateIncidentRequest = z.infer<typeof UpdateIncidentRequestSchema>;
export type IncidentFilters = z.infer<typeof IncidentFiltersSchema>;

// Comment request DTOs
export const CreateCommentRequestSchema = z.object({
  text: z.string().min(1).max(5000),
});

export type CreateCommentRequest = z.infer<typeof CreateCommentRequestSchema>;

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

export type AuditLog = z.infer<typeof AuditLogSchema>;
export type AuditLogWithActor = z.infer<typeof AuditLogWithActorSchema>;

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

export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;
