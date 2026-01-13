import { z } from 'zod';
import { Role, IncidentSeverity, IncidentStatus } from './enums.js';
export declare const UserPublicSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodNativeEnum<typeof Role>;
    isActive: z.ZodBoolean;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    email: string;
    role: Role;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}, {
    id: string;
    name: string;
    email: string;
    role: Role;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export type UserPublic = z.infer<typeof UserPublicSchema>;
export declare const IncidentSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    severity: z.ZodNativeEnum<typeof IncidentSeverity>;
    status: z.ZodNativeEnum<typeof IncidentStatus>;
    assigneeId: z.ZodNullable<z.ZodString>;
    reporterId: z.ZodString;
    dueAt: z.ZodNullable<z.ZodDate>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: IncidentStatus;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    severity: IncidentSeverity;
    assigneeId: string | null;
    reporterId: string;
    dueAt: Date | null;
}, {
    id: string;
    status: IncidentStatus;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    severity: IncidentSeverity;
    assigneeId: string | null;
    reporterId: string;
    dueAt: Date | null;
}>;
export declare const IncidentWithRelationsSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    severity: z.ZodNativeEnum<typeof IncidentSeverity>;
    status: z.ZodNativeEnum<typeof IncidentStatus>;
    assigneeId: z.ZodNullable<z.ZodString>;
    reporterId: z.ZodString;
    dueAt: z.ZodNullable<z.ZodDate>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
} & {
    assignee: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        role: z.ZodNativeEnum<typeof Role>;
        isActive: z.ZodBoolean;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    reporter: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        role: z.ZodNativeEnum<typeof Role>;
        isActive: z.ZodBoolean;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: IncidentStatus;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    severity: IncidentSeverity;
    assigneeId: string | null;
    reporterId: string;
    dueAt: Date | null;
    assignee: {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null;
    reporter: {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}, {
    id: string;
    status: IncidentStatus;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    severity: IncidentSeverity;
    assigneeId: string | null;
    reporterId: string;
    dueAt: Date | null;
    assignee: {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null;
    reporter: {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}>;
export type Incident = z.infer<typeof IncidentSchema>;
export type IncidentWithRelations = z.infer<typeof IncidentWithRelationsSchema>;
export declare const CommentSchema: z.ZodObject<{
    id: z.ZodString;
    incidentId: z.ZodString;
    authorId: z.ZodString;
    text: z.ZodString;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    incidentId: string;
    authorId: string;
    text: string;
}, {
    id: string;
    createdAt: Date;
    incidentId: string;
    authorId: string;
    text: string;
}>;
export declare const CommentWithAuthorSchema: z.ZodObject<{
    id: z.ZodString;
    incidentId: z.ZodString;
    authorId: z.ZodString;
    text: z.ZodString;
    createdAt: z.ZodDate;
} & {
    author: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        role: z.ZodNativeEnum<typeof Role>;
        isActive: z.ZodBoolean;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    incidentId: string;
    authorId: string;
    text: string;
    author: {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}, {
    id: string;
    createdAt: Date;
    incidentId: string;
    authorId: string;
    text: string;
    author: {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}>;
export type Comment = z.infer<typeof CommentSchema>;
export type CommentWithAuthor = z.infer<typeof CommentWithAuthorSchema>;
export declare const PaginationParamsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const PaginationMetaSchema: z.ZodObject<{
    page: z.ZodNumber;
    limit: z.ZodNumber;
    total: z.ZodNumber;
    totalPages: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}, {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}>;
export declare const PaginatedResponseSchema: <T extends z.ZodTypeAny>(itemSchema: T) => z.ZodObject<{
    items: z.ZodArray<T, "many">;
    meta: z.ZodObject<{
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
}, "strip", z.ZodTypeAny, {
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    items: T["_output"][];
}, {
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    items: T["_input"][];
}>;
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
export declare const LoginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const LoginResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        role: z.ZodNativeEnum<typeof Role>;
        isActive: z.ZodBoolean;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}, "strip", z.ZodTypeAny, {
    user: {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}, {
    user: {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export declare const CreateIncidentRequestSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    severity: z.ZodNativeEnum<typeof IncidentSeverity>;
    assigneeId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dueAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    severity: IncidentSeverity;
    assigneeId?: string | null | undefined;
    dueAt?: string | null | undefined;
}, {
    title: string;
    description: string;
    severity: IncidentSeverity;
    assigneeId?: string | null | undefined;
    dueAt?: string | null | undefined;
}>;
export declare const UpdateIncidentRequestSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    severity: z.ZodOptional<z.ZodNativeEnum<typeof IncidentSeverity>>;
    assigneeId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    dueAt: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
} & {
    status: z.ZodOptional<z.ZodNativeEnum<typeof IncidentStatus>>;
}, "strip", z.ZodTypeAny, {
    status?: IncidentStatus | undefined;
    title?: string | undefined;
    description?: string | undefined;
    severity?: IncidentSeverity | undefined;
    assigneeId?: string | null | undefined;
    dueAt?: string | null | undefined;
}, {
    status?: IncidentStatus | undefined;
    title?: string | undefined;
    description?: string | undefined;
    severity?: IncidentSeverity | undefined;
    assigneeId?: string | null | undefined;
    dueAt?: string | null | undefined;
}>;
export declare const IncidentFiltersSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodNativeEnum<typeof IncidentStatus>>;
    severity: z.ZodOptional<z.ZodNativeEnum<typeof IncidentSeverity>>;
    assigneeId: z.ZodOptional<z.ZodString>;
    reporterId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodOptional<z.ZodEnum<["createdAt", "updatedAt", "severity", "status"]>>;
    sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    status?: IncidentStatus | undefined;
    severity?: IncidentSeverity | undefined;
    assigneeId?: string | undefined;
    reporterId?: string | undefined;
    sortBy?: "status" | "createdAt" | "updatedAt" | "severity" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}, {
    search?: string | undefined;
    status?: IncidentStatus | undefined;
    severity?: IncidentSeverity | undefined;
    assigneeId?: string | undefined;
    reporterId?: string | undefined;
    sortBy?: "status" | "createdAt" | "updatedAt" | "severity" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export type CreateIncidentRequest = z.infer<typeof CreateIncidentRequestSchema>;
export type UpdateIncidentRequest = z.infer<typeof UpdateIncidentRequestSchema>;
export type IncidentFilters = z.infer<typeof IncidentFiltersSchema>;
export declare const CreateCommentRequestSchema: z.ZodObject<{
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
}, {
    text: string;
}>;
export type CreateCommentRequest = z.infer<typeof CreateCommentRequestSchema>;
export declare const AuditLogSchema: z.ZodObject<{
    id: z.ZodString;
    actorId: z.ZodString;
    entityType: z.ZodString;
    entityId: z.ZodString;
    action: z.ZodString;
    diffJson: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    actorId: string;
    entityType: string;
    entityId: string;
    action: string;
    diffJson: Record<string, unknown> | null;
}, {
    id: string;
    createdAt: Date;
    actorId: string;
    entityType: string;
    entityId: string;
    action: string;
    diffJson: Record<string, unknown> | null;
}>;
export declare const AuditLogWithActorSchema: z.ZodObject<{
    id: z.ZodString;
    actorId: z.ZodString;
    entityType: z.ZodString;
    entityId: z.ZodString;
    action: z.ZodString;
    diffJson: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodDate;
} & {
    actor: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        role: z.ZodNativeEnum<typeof Role>;
        isActive: z.ZodBoolean;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    actorId: string;
    entityType: string;
    entityId: string;
    action: string;
    diffJson: Record<string, unknown> | null;
    actor: {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}, {
    id: string;
    createdAt: Date;
    actorId: string;
    entityType: string;
    entityId: string;
    action: string;
    diffJson: Record<string, unknown> | null;
    actor: {
        id: string;
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}>;
export type AuditLog = z.infer<typeof AuditLogSchema>;
export type AuditLogWithActor = z.infer<typeof AuditLogWithActorSchema>;
export declare const DashboardSummarySchema: z.ZodObject<{
    totalIncidents: z.ZodNumber;
    openIncidents: z.ZodNumber;
    inProgressIncidents: z.ZodNumber;
    resolvedIncidents: z.ZodNumber;
    criticalIncidents: z.ZodNumber;
    incidentsBySeverity: z.ZodRecord<z.ZodString, z.ZodNumber>;
    incidentsByStatus: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    totalIncidents: number;
    openIncidents: number;
    inProgressIncidents: number;
    resolvedIncidents: number;
    criticalIncidents: number;
    incidentsBySeverity: Record<string, number>;
    incidentsByStatus: Record<string, number>;
}, {
    totalIncidents: number;
    openIncidents: number;
    inProgressIncidents: number;
    resolvedIncidents: number;
    criticalIncidents: number;
    incidentsBySeverity: Record<string, number>;
    incidentsByStatus: Record<string, number>;
}>;
export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;
//# sourceMappingURL=dto.d.ts.map