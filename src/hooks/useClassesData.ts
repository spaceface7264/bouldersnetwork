import { useQuery } from '@tanstack/react-query'
import { mockApi } from '@/data/mockApi'
import { queryKeys } from '@/data/queryKeys'

export function useClassesData() {
  return useQuery({
    queryKey: queryKeys.classes,
    queryFn: () => mockApi.fetchClasses(),
  })
}
