import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useDashboardSummary } from '@/hooks/useDashboardSummary'
import { useMemberProfile } from '@/hooks/useMemberProfile'
import { useModal } from '@/context/ModalContext'
import { formatDate, formatTime } from '@/lib/format'

export function DashboardPage() {
  const { data: summary, isLoading } = useDashboardSummary()
  const { data: member } = useMemberProfile()
  const { openModal, closeModal } = useModal()
  const [editingGoal, setEditingGoal] = useState(false)
  const [monthlyGoal, setMonthlyGoal] = useState(15)

  if (isLoading || !summary) {
    return (
      <div className="stats-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="ui-skeleton" style={{ height: 140 }} />
        ))}
      </div>
    )
  }

  const membership = summary.memberships[0]
  const progressPercentage = member ? (member.stats.checkInsThisMonth / monthlyGoal) * 100 : 0

  const handleGoalEdit = () => {
    openModal({
      title: 'Update Monthly Goal',
      description: 'Set your target number of climbing sessions for this month',
      content: (
        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
          <Input
            id="goal-input"
            type="number"
            label="Monthly Check-ins Goal"
            value={monthlyGoal}
            onChange={(e) => setMonthlyGoal(Number(e.target.value))}
            min="1"
            max="31"
          />
          <p style={{ 
            margin: 0, 
            fontSize: 'var(--font-size-sm)', 
            color: 'var(--color-text-muted)' 
          }}>
            Based on your current pace, you're on track to hit {Math.round((member?.stats.checkInsThisMonth || 0) * 2.2)} sessions this month.
          </p>
        </div>
      ),
      actions: (
        <>
          <Button variant="ghost" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={closeModal}>
            Save Goal
          </Button>
        </>
      ),
    })
  }

  const handleQuickAction = (action: string) => {
    openModal({
      title: `${action}`,
      description: 'Quick action confirmation',
      content: (
        <p style={{ margin: 0 }}>
          Are you ready to {action.toLowerCase()}?
        </p>
      ),
      actions: (
        <>
          <Button variant="ghost" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={closeModal}>
            Confirm
          </Button>
        </>
      ),
    })
  }

  return (
    <div className="content-section">
      {/* Welcome Banner */}
      <Card 
        premium
        className="ui-hover-lift"
        style={{ 
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.12) 0%, var(--color-surface) 40%, var(--color-surface-muted) 100%)',
          border: '1px solid rgba(255, 107, 53, 0.3)'
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--spacing-lg)'
        }}>
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: 'var(--font-size-xxl)', 
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--color-text-primary), var(--color-accent))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Welcome back, {member?.name.split(' ')[0]} 🧗‍♂️
            </h2>
            <p style={{ 
              margin: 'var(--spacing-sm) 0 0 0',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--font-size-lg)'
            }}>
              Ready to crush your climbing goals today?
            </p>
            <div className="member-badge">
              Premium Member
            </div>
          </div>
          <div className="action-bar">
            <Button 
              variant="secondary" 
              onClick={() => handleQuickAction('Check In Now')}
              className="ui-hover-lift"
            >
              🎯 Quick Check-in
            </Button>
            <Button 
              onClick={() => handleQuickAction('Book Session')}
              className="ui-hover-lift"
            >
              📅 Book Session
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="stats-grid">
        <Card 
          title="Membership Status" 
          subtitle={membership?.name}
          status="premium"
          className="ui-hover-lift"
        >
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            <div>
              <div style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Status
              </div>
              <div style={{ 
                fontSize: 'var(--font-size-lg)', 
                fontWeight: 600,
                color: 'var(--color-success)'
              }}>
                {membership?.status} ✓
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Renews on
              </div>
              <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 500 }}>
                {membership ? formatDate(membership.renewsOn) : '—'}
              </div>
            </div>
          </div>
        </Card>

        <Card 
          title="Monthly Progress" 
          subtitle="Check-ins this month"
          editable
          onEdit={handleGoalEdit}
          className="ui-hover-lift"
        >
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-sm)' }}>
              <span style={{ fontSize: 'var(--font-size-xxxl)', fontWeight: 700, color: 'var(--color-accent)' }}>
                {member?.stats.checkInsThisMonth}
              </span>
              <span style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-muted)' }}>
                / {monthlyGoal}
              </span>
            </div>
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-muted)'
              }}>
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="ui-progress">
                <div 
                  className="ui-progress__bar" 
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>
            <div style={{ 
              fontSize: 'var(--font-size-sm)', 
              color: 'var(--color-text-muted)' 
            }}>
              Current streak: <strong style={{ color: 'var(--color-secondary)' }}>
                {summary.stats.currentStreak} days 🔥
              </strong>
            </div>
          </div>
        </Card>

        <Card 
          title="Classes" 
          subtitle="Training sessions"
          className="ui-hover-lift"
        >
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            <div>
              <span style={{ fontSize: 'var(--font-size-xxxl)', fontWeight: 700, color: 'var(--color-secondary)' }}>
                {member?.stats.classesAttended}
              </span>
              <div style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--color-text-muted)',
                marginTop: 'var(--spacing-xs)'
              }}>
                Attended this month
              </div>
            </div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-success)'
            }}>
              <span>↗️</span>
              <span>+{summary.stats.attendanceChange}% vs last month</span>
            </div>
          </div>
        </Card>

        <Card 
          title="Achievements" 
          subtitle="Your progress"
          className="ui-hover-lift"
        >
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            <div>
              <span style={{ fontSize: 'var(--font-size-xxxl)', fontWeight: 700, color: 'var(--color-warning)' }}>
                {member?.stats.badgesEarned}
              </span>
              <div style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--color-text-muted)',
                marginTop: 'var(--spacing-xs)'
              }}>
                New badges earned
              </div>
            </div>
            <div style={{ 
              fontSize: 'var(--font-size-sm)', 
              color: 'var(--color-text-muted)' 
            }}>
              Last visit: <strong>{formatDate(summary.stats.lastVisit)}</strong>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Classes */}
      <Card
        title="Upcoming Sessions"
        subtitle={`${summary.upcomingClasses.length} classes scheduled`}
        actions={
          <Button variant="ghost" className="ui-hover-lift">
            View All Classes
          </Button>
        }
        className="ui-hover-lift"
      >
        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
          {summary.upcomingClasses.map((session, index) => (
            <div
              key={session.id}
              style={{
                display: 'grid',
                gap: 'var(--spacing-sm)',
                gridTemplateColumns: 'auto 1fr auto auto',
                alignItems: 'center',
                padding: 'var(--spacing-lg)',
                background: index === 0 ? 'var(--color-accent-soft)' : 'var(--color-surface-muted)',
                borderRadius: 'var(--radius-lg)',
                border: index === 0 ? '1px solid rgba(255, 107, 53, 0.3)' : '1px solid var(--color-border)',
                transition: 'all var(--transition-base)',
                cursor: 'pointer'
              }}
              className="ui-hover-lift ui-click-scale"
              onClick={() => openModal({
                title: session.name,
                description: `Led by ${session.instructor}`,
                content: (
                  <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                      <div><strong>Date:</strong> {formatDate(session.startTime)}</div>
                      <div><strong>Time:</strong> {formatTime(session.startTime)}</div>
                      <div><strong>Duration:</strong> {session.durationMinutes} minutes</div>
                      <div><strong>Location:</strong> {session.location}</div>
                      <div><strong>Difficulty:</strong> {session.difficulty}</div>
                      <div><strong>Capacity:</strong> {session.capacity} people</div>
                      <div style={{ color: session.spotsRemaining <= 3 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                        <strong>Spots remaining:</strong> {session.spotsRemaining}
                      </div>
                    </div>
                  </div>
                ),
                actions: (
                  <>
                    <Button variant="ghost" onClick={closeModal}>
                      Close
                    </Button>
                    <Button onClick={closeModal}>
                      Join Session
                    </Button>
                  </>
                ),
              })}
            >
              <div style={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                background: index === 0 ? 'var(--color-accent)' : 'var(--color-secondary)',
                flexShrink: 0
              }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>
                  {session.name}
                </div>
                <div style={{ 
                  color: 'var(--color-text-muted)', 
                  fontSize: 'var(--font-size-sm)',
                  marginTop: 'var(--spacing-xs)'
                }}>
                  with {session.instructor} • {session.location}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600 }}>{formatDate(session.startTime)}</div>
                <div style={{ 
                  color: 'var(--color-text-muted)', 
                  fontSize: 'var(--font-size-sm)' 
                }}>
                  {formatTime(session.startTime)}
                </div>
              </div>
              <div style={{ 
                textAlign: 'center',
                color: session.spotsRemaining <= 3 ? 'var(--color-warning)' : 'var(--color-text-muted)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 500
              }}>
                {session.spotsRemaining} spots left
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
} 