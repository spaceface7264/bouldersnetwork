import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MembershipResponse, MembershipAction } from '@/types/api'
import { queryKeys } from '@/data/queryKeys'

// Mock data for development
const mockMembershipData: MembershipResponse = {
  currentSubscription: {
    id: 'sub_123456',
    planId: 'plan_unlimited',
    planName: 'Unlimited Climbing',
    status: 'active',
    startDate: '2024-01-15',
    renewalDate: '2024-12-15',
    price: 899,
    currency: 'DKK',
    billingCycle: 'yearly',
  },
  availablePlans: [
    {
      id: 'plan_basic',
      name: 'Basic',
      description: '8 visits per month with access to bouldering areas',
      price: 299,
      currency: 'DKK',
      billingCycle: 'monthly',
      features: [
        '8 climbing sessions per month',
        'Access to bouldering areas',
        'Equipment rental included',
        'Basic fitness area access',
      ],
    },
    {
      id: 'plan_unlimited',
      name: 'Unlimited',
      description: 'Unlimited climbing with premium benefits',
      price: 599,
      currency: 'DKK',
      billingCycle: 'monthly',
      features: [
        'Unlimited climbing sessions',
        'Access to all areas',
        'Equipment rental included',
        'Premium fitness area access',
        'Free guest passes (2/month)',
        'Priority class booking',
      ],
      isPopular: true,
    },
    {
      id: 'plan_family',
      name: 'Family',
      description: 'Perfect for families with children',
      price: 999,
      currency: 'DKK',
      billingCycle: 'monthly',
      features: [
        'Unlimited climbing for family (up to 4)',
        'Access to kids climbing area',
        'Equipment rental included',
        'Family fitness area access',
        'Kids climbing classes included',
        'Birthday party discounts',
      ],
    },
  ],
  recentInvoices: [
    {
      id: 'inv_2024_001',
      subscriptionId: 'sub_123456',
      amount: 899,
      currency: 'DKK',
      status: 'paid',
      issueDate: '2024-01-15',
      dueDate: '2024-01-22',
      paidDate: '2024-01-16',
      downloadUrl: '/api/invoices/inv_2024_001/download',
      description: 'Unlimited Climbing - Annual Subscription',
    },
    {
      id: 'inv_2023_012',
      subscriptionId: 'sub_123456',
      amount: 599,
      currency: 'DKK',
      status: 'paid',
      issueDate: '2023-12-15',
      dueDate: '2023-12-22',
      paidDate: '2023-12-16',
      downloadUrl: '/api/invoices/inv_2023_012/download',
      description: 'Unlimited Climbing - Monthly Subscription',
    },
  ],
  upcomingPayment: {
    amount: 899,
    date: '2024-12-15',
    method: 'Visa ending in 4242',
  },
}

export function useMembershipData() {
  return useQuery({
    queryKey: queryKeys.membership(),
    queryFn: async (): Promise<MembershipResponse> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // In production, replace with:
      // const response = await fetch('/api/ver3/customers/me/membership')
      // return response.json()

      return mockMembershipData
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useMembershipAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (_action: MembershipAction) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In production, replace with:
      // const response = await fetch('/api/ver3/customers/me/membership/actions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(action)
      // })
      // return response.json()

      return { success: true, message: 'Action completed successfully' }
    },
    onSuccess: () => {
      // Invalidate and refetch membership data
      queryClient.invalidateQueries({ queryKey: queryKeys.membership() })
    },
  })
}
