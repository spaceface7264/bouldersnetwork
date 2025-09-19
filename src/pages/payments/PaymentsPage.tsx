import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { usePaymentsData } from '@/hooks/usePaymentsData'
import { formatCurrency, formatDate } from '@/lib/format'

export function PaymentsPage() {
  const { data, isLoading } = usePaymentsData()

  if (isLoading || !data) {
    return <Card title="Loading payments" subtitle="Retrieving billing history" />
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-xl)' }}>
      <Card
        title="Upcoming payment"
        subtitle="Your next billing cycle"
        actions={<Button variant="ghost">Update payment method</Button>}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 700 }}>
              {formatCurrency(data.upcomingAmount)}
            </div>
            <div
              style={{ color: 'var(--color-text-muted)', marginTop: 'var(--spacing-xs)' }}
            >
              Charged to {data.paymentMethod}
            </div>
          </div>
          <Button size="sm" variant="secondary">
            View invoice
          </Button>
        </div>
      </Card>

      <Card title="Payment history" subtitle="Last 3 months">
        <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
          {data.history.map((payment) => (
            <div
              key={payment.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1fr auto',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
              }}
            >
              <div>
                <strong>{formatDate(payment.date)}</strong>
                <div
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  {payment.method}
                </div>
              </div>
              <div>{formatCurrency(payment.amount)}</div>
              <div>
                <span style={{ color: 'var(--color-success)' }}>{payment.status}</span>
              </div>
              <Button size="sm" variant="ghost">
                Download receipt
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
