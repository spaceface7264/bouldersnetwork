import { useQuery } from '@tanstack/react-query'
import { mockApi } from '@/data/mockApi'
import { queryKeys } from '@/data/queryKeys'

export function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => mockApi.fetchDashboard(),
  })
}
