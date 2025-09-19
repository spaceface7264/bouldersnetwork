import { useQuery } from '@tanstack/react-query'
import { mockApi } from '@/data/mockApi'
import { queryKeys } from '@/data/queryKeys'

export function usePaymentsData() {
  return useQuery({
    queryKey: queryKeys.payments,
    queryFn: () => mockApi.fetchPayments(),
  })
}
