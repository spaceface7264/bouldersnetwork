import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { useModal } from '@/context/ModalContext'
import { format } from '@/lib/format'

interface Membership {
  id: string
  customerId: string
  planId: string
  planName: string
  status: 'active' | 'frozen' | 'cancelled' | 'expired'
  startDate: string
  renewalDate: string
  freezeDate?: string
  freezeEndDate?: string
  cancellationDate?: string
  monthlyPrice: number
  currency: string
  features: string[]
}

interface MembershipPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  isPopular?: boolean
}

interface Invoice {
  id: string
  membershipId: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'overdue' | 'failed'
  issueDate: string
  dueDate: string
  paidDate?: string
  downloadUrl?: string
}

interface MembershipError {
  errorCode: string
  errorMessage: string
  fieldErrors?: Array<{
    field: string
    errorCode: string
    errorMessage: string
  }>
}

// API functions
async function fetchMembership(): Promise<Membership> {
  const token = localStorage.getItem('accessToken')
  const response = await fetch('/api/ver3/customers/current/subscriptions', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch membership')
  }

  const data = await response.json()
  return data[0] // Assuming single active membership
}

async function fetchMembershipPlans(): Promise<MembershipPlan[]> {
  const token = localStorage.getItem('accessToken')
  const response = await fetch('/api/ver3/membership/plans', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch membership plans')
  }

  return response.json()
}

async function fetchInvoices(membershipId: string): Promise<Invoice[]> {
  const token = localStorage.getItem('accessToken')
  const response = await fetch(`/api/ver3/customers/current/payments?subscriptionId=${membershipId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch invoices')
  }

  return response.json()
}

async function freezeMembership(membershipId: string, freezeUntil: string): Promise<void> {
  const token = localStorage.getItem('accessToken')
  const response = await fetch(`/api/ver3/subscriptions/${membershipId}/freeze`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ freezeUntil }),
  })

  if (!response.ok) {
    const error: MembershipError = await response.json()
    throw error
  }
}

async function unfreezemembership(membershipId: string): Promise<void> {
  const token = localStorage.getItem('accessToken')
  const response = await fetch(`/api/ver3/subscriptions/${membershipId}/unfreeze`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error: MembershipError = await response.json()
    throw error
  }
}

async function cancelMembership(membershipId: string, cancellationDate: string, reason?: string): Promise<void> {
  const token = localStorage.getItem('accessToken')
  const response = await fetch(`/api/ver3/subscriptions/${membershipId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cancellationDate, reason }),
  })

  if (!response.ok) {
    const error: MembershipError = await response.json()
    throw error
  }
}

async function changeMembershipPlan(membershipId: string, newPlanId: string): Promise<void> {
  const token = localStorage.getItem('accessToken')
  const response = await fetch(`/api/ver3/subscriptions/${membershipId}/change-plan`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ planId: newPlanId }),
  })

  if (!response.ok) {
    const error: MembershipError = await response.json()
    throw error
  }
}

export function MembershipPage() {
  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [freezeUntil, setFreezeUntil] = useState<string>('')
  const [cancellationReason, setCancellationReason] = useState<string>('')

  // Queries
  const { data: membership, isLoading: membershipLoading, error: membershipError } = useQuery({
    queryKey: ['membership'],
    queryFn: fetchMembership,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['membership-plans'],
    queryFn: fetchMembershipPlans,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices', membership?.id],
    queryFn: () => membership ? fetchInvoices(membership.id) : Promise.resolve([]),
    enabled: !!membership?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  // Mutations
  const freezeMutation = useMutation({
    mutationFn: (freezeUntil: string) => membership ? freezeMembership(membership.id, freezeUntil) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership'] })
      closeModal()
    },
  })

  const unfreezeMutation = useMutation({
    mutationFn: () => membership ? unfreezemembership(membership.id) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership'] })
    },
  })

  const cancelMutation = useMutation({
    mutationFn: () => membership ? cancelMembership(membership.id, new Date().toISOString(), cancellationReason) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership'] })
      closeModal()
    },
  })

  const changePlanMutation = useMutation({
    mutationFn: (newPlanId: string) => membership ? changeMembershipPlan(membership.id, newPlanId) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership'] })
      closeModal()
    },
  })

  function handleFreezeMembership() {
    openModal(
      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <h2>Freeze Membership</h2>
        <p>Your membership will be paused and you won't be charged during the freeze period.</p>
        
        <div>
          <label htmlFor="freeze-until">Freeze until:</label>
          <input
            id="freeze-until"
            type="date"
            value={freezeUntil}
            onChange={(e) => setFreezeUntil(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              marginTop: 'var(--spacing-xs)',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={closeModal}>Cancel</Button>
          <Button 
            onClick={() => freezeUntil && freezeMutation.mutate(freezeUntil)}
            disabled={!freezeUntil || freezeMutation.isPending}
          >
            {freezeMutation.isPending ? 'Freezing...' : 'Freeze Membership'}
          </Button>
        </div>
      </div>
    )
  }

  function handleCancelMembership() {
    openModal(
      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <h2>Cancel Membership</h2>
        <p style={{ color: 'var(--color-danger)' }}>
          <strong>Warning:</strong> This action cannot be undone. Your membership will be cancelled immediately.
        </p>
        
        <div>
          <label htmlFor="cancellation-reason">Reason for cancellation (optional):</label>
          <textarea
            id="cancellation-reason"
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            placeholder="Help us improve by telling us why you're cancelling..."
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              marginTop: 'var(--spacing-xs)',
              minHeight: '80px',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={closeModal}>Keep Membership</Button>
          <Button 
            variant="ghost"
            onClick={() => cancelMutation.mutate()}
            disabled={cancelMutation.isPending}
            style={{ color: 'var(--color-danger)' }}
          >
            {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Membership'}
          </Button>
        </div>
      </div>
    )
  }

  function handleChangePlan() {
    openModal(
      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <h2>Change Membership Plan</h2>
        <p>Select a new plan. Changes will be applied on your next billing cycle.</p>
        
        <div>
          <label htmlFor="plan-select">New Plan:</label>
          <Select
            id="plan-select"
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            style={{ marginTop: 'var(--spacing-xs)' }}
          >
            <option value="">Select a plan</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} - {format.currency(plan.monthlyPrice)}/month
              </option>
            ))}
          </Select>
        </div>

        {selectedPlan && (
          <div style={{ 
            padding: 'var(--spacing-md)', 
            background: 'var(--color-surface-muted)', 
            borderRadius: 'var(--radius)' 
          }}>
            {(() => {
              const plan = plans.find(p => p.id === selectedPlan)
              return plan ? (
                <div>
                  <h4>{plan.name}</h4>
                  <p>{plan.description}</p>
                  <ul>
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ) : null
            })()}
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={closeModal}>Cancel</Button>
          <Button 
            onClick={() => selectedPlan && changePlanMutation.mutate(selectedPlan)}
            disabled={!selectedPlan || changePlanMutation.isPending}
          >
            {changePlanMutation.isPending ? 'Changing...' : 'Change Plan'}
          </Button>
        </div>
      </div>
    )
  }

  if (membershipLoading) {
    return (
      <div className="membership-page">
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xxl)' }}>
          Loading membership information...
        </div>
      </div>
    )
  }

  if (membershipError) {
    return (
      <div className="membership-page">
        <Card>
          <div style={{ textAlign: 'center', color: 'var(--color-danger)' }}>
            <h2>Error Loading Membership</h2>
            <p>We couldn't load your membership information. Please try again later.</p>
          </div>
        </Card>
      </div>
    )
  }

  if (!membership) {
    return (
      <div className="membership-page">
        <Card>
          <div style={{ textAlign: 'center' }}>
            <h2>No Active Membership</h2>
            <p>You don't have an active membership. Contact support to get started.</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="membership-page">
      <div className="membership-page__header">
        <div>
          <h1>Membership Management</h1>
          <p>Manage your climbing membership, billing, and account settings</p>
        </div>
      </div>

      <div className="membership-grid">
        {/* Current Membership */}
        <Card>
          <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
            <div>
              <h2>Current Membership</h2>
              <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Plan:</span>
                  <strong>{membership.planName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Status:</span>
                  <span style={{ 
                    color: membership.status === 'active' ? 'var(--color-success)' : 
                           membership.status === 'frozen' ? 'var(--color-warning)' : 'var(--color-danger)' 
                  }}>
                    {membership.status.charAt(0).toUpperCase() + membership.status.slice(1)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Monthly Price:</span>
                  <strong>{format.currency(membership.monthlyPrice)} {membership.currency}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Next Renewal:</span>
                  <span>{format.date(membership.renewalDate)}</span>
                </div>
                {membership.status === 'frozen' && membership.freezeEndDate && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Freeze Ends:</span>
                    <span>{format.date(membership.freezeEndDate)}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
              <h3>Features Included:</h3>
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)' }}>
                {membership.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div style={{ 
              display: 'grid', 
              gap: 'var(--spacing-sm)', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' 
            }}>
              {membership.status === 'active' && (
                <>
                  <Button variant="secondary" onClick={handleFreezeMembership}>
                    Freeze
                  </Button>
                  <Button variant="secondary" onClick={handleChangePlan}>
                    Change Plan
                  </Button>
                  <Button variant="ghost" onClick={handleCancelMembership}>
                    Cancel
                  </Button>
                </>
              )}
              {membership.status === 'frozen' && (
                <Button 
                  onClick={() => unfreezeMutation.mutate()}
                  disabled={unfreezeMutation.isPending}
                >
                  {unfreezeMutation.isPending ? 'Unfreezing...' : 'Unfreeze'}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
            <h2>Recent Invoices</h2>
            
            {invoicesLoading ? (
              <div>Loading invoices...</div>
            ) : invoices.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>No invoices found.</p>
            ) : (
              <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                {invoices.slice(0, 5).map((invoice) => (
                  <div 
                    key={invoice.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 'var(--spacing-sm)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500 }}>
                        {format.currency(invoice.amount)} {invoice.currency}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                        {format.date(invoice.issueDate)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        color: invoice.status === 'paid' ? 'var(--color-success)' : 
                               invoice.status === 'pending' ? 'var(--color-warning)' : 'var(--color-danger)' 
                      }}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </div>
                      {invoice.downloadUrl && (
                        <a 
                          href={invoice.downloadUrl}
                          style={{ 
                            fontSize: 'var(--font-size-sm)', 
                            color: 'var(--color-primary)',
                            textDecoration: 'none'
                          }}
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
