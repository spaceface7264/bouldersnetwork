import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useMembershipData, useMembershipAction } from '@/hooks/useMembershipData'
import { useModal } from '@/context/ModalContext'
import { MembershipAction } from '@/types/api'
import { formatDate, formatCurrency } from '@/lib/format'

export function MembershipPage() {
  const { data: membership, isLoading } = useMembershipData()
  const membershipAction = useMembershipAction()
  const { openModal, closeModal } = useModal()
  const [selectedAction, setSelectedAction] = useState<MembershipAction | null>(null)

  const handleFreezeMembership = () => {
    const action = { type: 'freeze', duration: 30 } as MembershipAction
    setSelectedAction(action)
    openModal({
      title: 'Freeze Membership',
      description:
        'Your membership will be paused for 30 days. You can resume at any time.',
      content: (
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-sm)',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="ghost" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={confirmAction}
            disabled={membershipAction.isPending}
          >
            {membershipAction.isPending ? 'Processing...' : 'Confirm Freeze'}
          </Button>
        </div>
      ),
    })
  }

  const handleCancelMembership = () => {
    const action = { type: 'cancel' } as MembershipAction
    setSelectedAction(action)
    openModal({
      title: 'Cancel Membership',
      description:
        'Are you sure you want to cancel your membership? This action cannot be undone. Your membership will remain active until your next billing date.',
      content: (
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-sm)',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="ghost" onClick={closeModal}>
            Keep Membership
          </Button>
          <Button
            variant="primary"
            onClick={confirmAction}
            disabled={membershipAction.isPending}
            style={{ background: 'var(--color-danger)' }}
          >
            {membershipAction.isPending ? 'Processing...' : 'Confirm Cancellation'}
          </Button>
        </div>
      ),
    })
  }

  const handleChangePlan = (planId: string, isUpgrade: boolean) => {
    const action = {
      type: isUpgrade ? 'upgrade' : 'downgrade',
      planId,
    } as MembershipAction
    setSelectedAction(action)
    openModal({
      title: `${isUpgrade ? 'Upgrade' : 'Downgrade'} Plan`,
      description: `Your plan change will take effect immediately. ${isUpgrade ? 'You will be charged the prorated amount.' : 'You will receive a credit for the unused portion.'}`,
      content: (
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-sm)',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="ghost" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={confirmAction}
            disabled={membershipAction.isPending}
          >
            {membershipAction.isPending ? 'Processing...' : `Confirm ${action.type}`}
          </Button>
        </div>
      ),
    })
  }

  const confirmAction = async () => {
    if (!selectedAction) return

    try {
      await membershipAction.mutateAsync(selectedAction)
      closeModal()
      setSelectedAction(null)
    } catch (error) {
      console.error('Failed to execute membership action:', error)
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: 'var(--spacing-xl)' }}>
        <div>Loading membership information...</div>
      </div>
    )
  }

  if (!membership) {
    return (
      <div style={{ padding: 'var(--spacing-xl)' }}>
        <div>Unable to load membership information.</div>
      </div>
    )
  }

  const { currentSubscription, availablePlans, recentInvoices, upcomingPayment } =
    membership
  const isActive = currentSubscription.status === 'active'
  const isPaused = currentSubscription.status === 'paused'

  return (
    <div
      style={{ padding: 'var(--spacing-xl)', display: 'grid', gap: 'var(--spacing-xl)' }}
    >
      {/* Page Header */}
      <div>
        <h1
          style={{
            fontSize: 'var(--font-size-xxl)',
            margin: 0,
            marginBottom: 'var(--spacing-sm)',
            color: 'var(--color-text-primary)',
          }}
        >
          Membership Management
        </h1>
        <p
          style={{
            color: 'var(--color-text-muted)',
            margin: 0,
            fontSize: 'var(--font-size-md)',
          }}
        >
          Manage your climbing membership, view invoices, and modify your plan
        </p>
      </div>

      {/* Current Membership */}
      <Card>
        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'var(--font-size-lg)',
                  margin: 0,
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                Current Membership
              </h2>
              <div
                style={{
                  display: 'inline-flex',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--radius)',
                  background: isActive
                    ? 'var(--color-success)'
                    : isPaused
                      ? 'var(--color-warning)'
                      : 'var(--color-danger)',
                  color: 'white',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {currentSubscription.status.replace('_', ' ')}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              {isActive && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleFreezeMembership}
                    disabled={membershipAction.isPending}
                  >
                    Freeze
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelMembership}
                    disabled={membershipAction.isPending}
                    style={{ color: 'var(--color-danger)' }}
                  >
                    Cancel
                  </Button>
                </>
              )}
              {isPaused && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => confirmAction()}
                  disabled={membershipAction.isPending}
                >
                  Resume
                </Button>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-lg)',
            }}
          >
            <div>
              <div
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                Plan
              </div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>
                {currentSubscription.planName}
              </div>
            </div>
            <div>
              <div
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                Price
              </div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>
                {formatCurrency(currentSubscription.price, currentSubscription.currency)}{' '}
                / {currentSubscription.billingCycle}
              </div>
            </div>
            <div>
              <div
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                Next Renewal
              </div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>
                {formatDate(currentSubscription.renewalDate)}
              </div>
            </div>
            {currentSubscription.pausedUntil && (
              <div>
                <div
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  Paused Until
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--color-warning)',
                  }}
                >
                  {formatDate(currentSubscription.pausedUntil)}
                </div>
              </div>
            )}
          </div>

          {upcomingPayment && (
            <div
              style={{
                padding: 'var(--spacing-md)',
                background: 'var(--color-surface-muted)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>Upcoming Payment</div>
                  <div
                    style={{
                      color: 'var(--color-text-muted)',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    {formatCurrency(upcomingPayment.amount)} on{' '}
                    {formatDate(upcomingPayment.date)}
                  </div>
                </div>
                <div
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  {upcomingPayment.method}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Available Plans */}
      <div>
        <h2
          style={{
            fontSize: 'var(--font-size-lg)',
            margin: 0,
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--color-text-primary)',
          }}
        >
          Change Plan
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--spacing-lg)',
          }}
        >
          {availablePlans.map((plan) => {
            const isCurrent = plan.id === currentSubscription.planId
            const isUpgrade = plan.price > currentSubscription.price

            return (
              <Card
                key={plan.id}
                className={
                  isCurrent ? 'current-plan' : plan.isPopular ? 'popular-plan' : ''
                }
              >
                {plan.isPopular && !isCurrent && (
                  <div className="plan-badge plan-badge--popular">POPULAR</div>
                )}

                {isCurrent && (
                  <div className="plan-badge plan-badge--current">CURRENT PLAN</div>
                )}

                <div
                  style={{
                    display: 'grid',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md) 0',
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>
                      {plan.name}
                    </h3>
                    <p
                      style={{
                        margin: 'var(--spacing-xs) 0 0',
                        color: 'var(--color-text-muted)',
                        fontSize: 'var(--font-size-sm)',
                      }}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-xxl)',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                      }}
                    >
                      {formatCurrency(plan.price, plan.currency)}
                      <span
                        style={{
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 400,
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        /{plan.billingCycle}
                      </span>
                    </div>
                  </div>

                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: 'none',
                      display: 'grid',
                      gap: 'var(--spacing-xs)',
                    }}
                  >
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-xs)',
                          fontSize: 'var(--font-size-sm)',
                        }}
                      >
                        <span style={{ color: 'var(--color-success)' }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {!isCurrent && (
                    <Button
                      variant={isUpgrade ? 'primary' : 'secondary'}
                      onClick={() => handleChangePlan(plan.id, isUpgrade)}
                      disabled={membershipAction.isPending}
                      style={{ marginTop: 'var(--spacing-sm)' }}
                    >
                      {isUpgrade ? 'Upgrade' : 'Downgrade'} to {plan.name}
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Invoices */}
      <Card>
        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2
              style={{
                fontSize: 'var(--font-size-lg)',
                margin: 0,
                color: 'var(--color-text-primary)',
              }}
            >
              Recent Invoices
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>

          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--spacing-md)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{invoice.description}</div>
                  <div
                    style={{
                      color: 'var(--color-text-muted)',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    {formatDate(invoice.issueDate)} •{' '}
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                  }}
                >
                  <div
                    style={{
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius)',
                      background:
                        invoice.status === 'paid'
                          ? 'var(--color-success)'
                          : 'var(--color-warning)',
                      color: 'white',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    {invoice.status}
                  </div>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
