import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useClassesData } from '@/hooks/useClassesData'
import { formatDate, formatTime } from '@/lib/format'
import { useModal } from '@/context/ModalContext'

export function ClassesPage() {
  const { data, isLoading } = useClassesData()
  const { openModal, closeModal } = useModal()

  if (isLoading || !data) {
    return <Card title="Loading classes" subtitle="Fetching your schedule" />
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-xl)' }}>
      <Card title="Upcoming classes" subtitle="Sessions you're registered for">
        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
          {data.upcoming.map((session) => (
            <div
              key={session.id}
              style={{
                display: 'grid',
                gap: 'var(--spacing-sm)',
                gridTemplateColumns: '1.5fr 1fr auto',
                alignItems: 'center',
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
                  {session.location} · {session.difficulty}
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
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--spacing-sm)',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    openModal({
                      title: session.name,
                      description: `Led by ${session.instructor} · ${formatDate(session.startTime)} · ${formatTime(session.startTime)}`,
                      content: (
                        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                          <p style={{ margin: 0 }}>
                            Difficulty: <strong>{session.difficulty}</strong>
                          </p>
                          <p style={{ margin: 0 }}>Location: {session.location}</p>
                          <p style={{ margin: 0 }}>
                            Capacity: {session.capacity} · Spots remaining:{' '}
                            {session.spotsRemaining}
                          </p>
                        </div>
                      ),
                      actions: (
                        <>
                          <Button variant="ghost" onClick={closeModal}>
                            Close
                          </Button>
                          <Button onClick={closeModal}>Check in</Button>
                        </>
                      ),
                    })
                  }
                >
                  Details
                </Button>
                <Button size="sm">Check in</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Saved classes" subtitle="You're watching these sessions">
        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
          {data.saved.map((session) => (
            <div
              key={session.id}
              style={{
                display: 'grid',
                gap: 'var(--spacing-sm)',
                gridTemplateColumns: '1.5fr 1fr auto',
                alignItems: 'center',
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
                  {session.location} · {session.difficulty}
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
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  openModal({
                    title: 'Join waitlist',
                    description: session.name,
                    content: (
                      <p style={{ margin: 0 }}>
                        We&apos;ll notify you by email at least 12 hours before class if a
                        spot opens up.
                      </p>
                    ),
                    actions: (
                      <>
                        <Button variant="ghost" onClick={closeModal}>
                          Cancel
                        </Button>
                        <Button onClick={closeModal}>Confirm</Button>
                      </>
                    ),
                  })
                }
              >
                Join waitlist
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
