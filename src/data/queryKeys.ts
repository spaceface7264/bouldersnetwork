export const queryKeys = {
  dashboard: ['dashboard'] as const,
  member: ['member', 'profile'] as const,
  classes: ['classes'] as const,
  activity: ['activity'] as const,
  payments: ['payments'] as const,
  membership: () => ['membership'] as const,
}
