export const queryKeys = {
  incidents: {
    all: ['incidents'] as const,
    lists: () => [...queryKeys.incidents.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.incidents.lists(), filters] as const,
    details: () => [...queryKeys.incidents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.incidents.details(), id] as const,
  },
  comments: {
    all: ['comments'] as const,
    byIncident: (incidentId: string) => [...queryKeys.comments.all, 'incident', incidentId] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    current: () => [...queryKeys.users.all, 'current'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    summary: () => [...queryKeys.dashboard.all, 'summary'] as const,
  },
  audit: {
    all: ['audit'] as const,
    byEntity: (entityType: string, entityId: string) =>
      [...queryKeys.audit.all, entityType, entityId] as const,
  },
};
