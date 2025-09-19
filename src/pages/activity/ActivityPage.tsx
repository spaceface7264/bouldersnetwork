import { Card } from '@/components/ui/Card'
import { useActivityData } from '@/hooks/useActivityData'
import { formatDate } from '@/lib/format'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function ActivityPage() {
  const { data, isLoading } = useActivityData()

  if (isLoading || !data) {
    return <Card title="Loading activity" subtitle="Gathering your progress" />
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-xl)' }}>
      <Card title="Monthly visits" subtitle="Your climbing cadence">
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthlyVisits}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis
                dataKey="month"
                stroke="var(--color-text-muted)"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-text-muted)"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                }}
              />
              <Bar dataKey="visits" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Recent activity" subtitle="Your latest sessions">
        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
          {data.recentActivity.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 'var(--spacing-sm)',
                borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
              }}
            >
              <div>
                <strong>{item.type}</strong>
                <div
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  {item.description}
                </div>
              </div>
              <div style={{ textAlign: 'right', color: 'var(--color-text-muted)' }}>
                <div>{formatDate(item.date)}</div>
                <div style={{ fontSize: 'var(--font-size-sm)' }}>
                  {item.value} {item.unit}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
