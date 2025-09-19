import { useQuery } from '@tanstack/react-query'
import { mockApi } from '@/data/mockApi'
import { queryKeys } from '@/data/queryKeys'

export function useMemberProfile() {
  return useQuery({
    queryKey: queryKeys.member,
    queryFn: () => mockApi.fetchMemberProfile(),
  })
}
