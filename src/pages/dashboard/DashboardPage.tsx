import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useDashboardSummary } from '@/hooks/useDashboardSummary'
import { useMemberProfile } from '@/hooks/useMemberProfile'
import { formatDate, formatTime } from '@/lib/format'

export function DashboardPage() {
  const { data: summary, isLoading } = useDashboardSummary()
  const { data: member } = useMemberProfile()

  if (isLoading || !summary) {
    return <Card title="Loading" subtitle="Just a moment..." />
  }

  const membership = summary.memberships[0]

  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-xl)' }}>
      <div
        style={{
          display: 'grid',
          gap: 'var(--spacing-lg)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}
      >
        <Card title="Membership" subtitle={membership?.name}>
          <dl
            style={{
              display: 'grid',
              gap: 'var(--spacing-sm)',
              margin: 0,
            }}
          >
            <div>
              <dt
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--font-size-xs)',
                }}
              >
                Status
              </dt>
              <dd style={{ margin: 0, fontWeight: 600 }}>
                {summary.memberships[0]?.status}
              </dd>
            </div>
            <div>
              <dt
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--font-size-xs)',
                }}
              >
                Renews on
              </dt>
              <dd style={{ margin: 0 }}>
                {membership ? formatDate(membership.renewsOn) : '—'}
              </dd>
            </div>
          </dl>
        </Card>
        <Card title="Check-ins" subtitle="This month">
          <p style={{ fontSize: 'var(--font-size-xxl)', margin: 0 }}>
            {member?.stats.checkInsThisMonth}
          </p>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--spacing-xs)' }}>
            Current streak: {summary.stats.currentStreak} days
          </p>
        </Card>
        <Card title="Classes" subtitle="Attended this month">
          <p style={{ fontSize: 'var(--font-size-xxl)', margin: 0 }}>
            {member?.stats.classesAttended}
          </p>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--spacing-xs)' }}>
            Attendance up {summary.stats.attendanceChange}% vs last month
          </p>
        </Card>
        <Card title="Badges" subtitle="Progress">
          <p style={{ fontSize: 'var(--font-size-xxl)', margin: 0 }}>
            {member?.stats.badgesEarned}
          </p>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--spacing-xs)' }}>
            Last visit {formatDate(summary.stats.lastVisit)}
          </p>
        </Card>
      </div>

      <Card
        title="Upcoming classes"
        subtitle={`You have ${summary.upcomingClasses.length} sessions scheduled`}
        actions={<Button variant="ghost">View all</Button>}
      >
        <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
          {summary.upcomingClasses.map((session) => (
            <div
              key={session.id}
              style={{
                display: 'grid',
                gap: 'var(--spacing-sm)',
                gridTemplateColumns: '2fr 1fr 1fr',
                alignItems: 'center',
                padding: 'var(--spacing-sm) 0',
                borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
              }}
            >
              <div>
                <strong>{session.name}</strong>
                <div
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  with {session.instructor}
                </div>
              </div>
              <div>
                <div>{formatDate(session.startTime)}</div>
                <div
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  {formatTime(session.startTime)} · {session.durationMinutes} mins
                </div>
              </div>
              <div style={{ textAlign: 'right', color: 'var(--color-text-muted)' }}>
                {session.spotsRemaining} spots left
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
