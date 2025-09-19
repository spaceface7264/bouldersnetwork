import { useQuery } from '@tanstack/react-query'
import { mockApi } from '@/data/mockApi'
import { queryKeys } from '@/data/queryKeys'

export function useActivityData() {
  return useQuery({
    queryKey: queryKeys.activity,
    queryFn: () => mockApi.fetchActivity(),
  })
}
