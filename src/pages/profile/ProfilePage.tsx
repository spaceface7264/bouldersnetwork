import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { useMemberProfile, useMemberProfileUpdate } from '@/hooks/useMemberProfile'
import { useDashboardSummary } from '@/hooks/useDashboardSummary'
import { useActivityData } from '@/hooks/useActivityData'
import { formatDate, formatTime } from '@/lib/format'
import { ProfileFormData, MemberProfileUpdate } from '@/types/api'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function ProfilePage() {
  const { data: member, isLoading: memberLoading } = useMemberProfile()
  const { data: dashboard, isLoading: dashboardLoading } = useDashboardSummary()
  const { data: activity, isLoading: activityLoading } = useActivityData()
  const updateProfile = useMemberProfileUpdate()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  })
  const [preferences, setPreferences] = useState(
    member?.preferences || {
      newsletter: false,
      reminders: false,
      personalCoaching: false,
    },
  )
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [formErrors, setFormErrors] = useState<Partial<ProfileFormData>>({})

  // Initialize form data when member data loads
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        emergencyContactName: member.emergencyContact.name,
        emergencyContactPhone: member.emergencyContact.phone,
      })
      setPreferences(member.preferences)
    }
  }, [member])

  // Track changes to show save/cancel buttons
  useEffect(() => {
    if (member) {
      const hasFormChanges =
        formData.name !== member.name ||
        formData.email !== member.email ||
        formData.phone !== member.phone ||
        formData.emergencyContactName !== member.emergencyContact.name ||
        formData.emergencyContactPhone !== member.emergencyContact.phone

      const hasPreferenceChanges =
        preferences.newsletter !== member.preferences.newsletter ||
        preferences.reminders !== member.preferences.reminders ||
        preferences.personalCoaching !== member.preferences.personalCoaching

      setHasUnsavedChanges(hasFormChanges || hasPreferenceChanges)
    }
  }, [formData, preferences, member])

  const isLoading = memberLoading || dashboardLoading || activityLoading

  if (isLoading || !member || !dashboard || !activity) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          Loading your complete profile...
        </div>
      </div>
    )
  }

  const membership = dashboard.memberships[0]

  const validateForm = (): boolean => {
    const errors: Partial<ProfileFormData> = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    }

    if (!formData.emergencyContactName.trim()) {
      errors.emergencyContactName = 'Emergency contact name is required'
    }

    if (!formData.emergencyContactPhone.trim()) {
      errors.emergencyContactPhone = 'Emergency contact phone is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    try {
      const updates: MemberProfileUpdate = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
        },
        preferences: preferences,
      }

      await updateProfile.mutateAsync(updates)
      setIsEditing(false)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleCancel = () => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        emergencyContactName: member.emergencyContact.name,
        emergencyContactPhone: member.emergencyContact.phone,
      })
      setPreferences(member.preferences)
    }
    setIsEditing(false)
    setHasUnsavedChanges(false)
    setFormErrors({})
  }

  const getStatusBadge = (tier: string) => {
    const colors = {
      Basic: 'var(--color-info)',
      Unlimited: 'var(--color-success)',
      Family: 'var(--color-primary)',
    }

    return (
      <span
        style={{
          background: colors[tier as keyof typeof colors] || 'var(--color-text-muted)',
          color: 'white',
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 600,
          textTransform: 'uppercase',
        }}
      >
        {tier}
      </span>
    )
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>My Profile</h1>
          <p className="page-description">
            Your complete member profile, dashboard overview, and activity analytics
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
          {hasUnsavedChanges && (
            <>
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={updateProfile.isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
          {!hasUnsavedChanges && !isEditing && (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
          {!hasUnsavedChanges && isEditing && (
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel Edit
            </Button>
          )}
        </div>
      </header>

      <div style={{ display: 'grid', gap: 'var(--spacing-xl)' }}>
        {/* Profile Overview Card */}
        <Card>
          <div
            className="profile-overview-grid"
            style={{
              display: 'grid',
              gap: 'var(--spacing-xl)',
              gridTemplateColumns: 'auto 1fr auto',
            }}
          >
            {/* Profile Picture */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="profile-picture">
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={`${member.name}'s profile`} />
                ) : (
                  <div className="profile-picture-initials">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info & Contact */}
            <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-md)',
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: 'var(--font-size-xl)' }}>
                    {member.name}
                  </h2>
                  {getStatusBadge(member.membershipTier)}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gap: 'var(--spacing-sm)',
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  <div>📧 {member.email}</div>
                  <div>📱 {member.phone}</div>
                  <div>📅 Member since {formatDate(member.joinDate)}</div>
                  <div>💳 Next billing: {formatDate(member.nextBillingDate)}</div>
                </div>
              </div>

              {/* Editable Personal Information */}
              {isEditing && (
                <div
                  style={{
                    display: 'grid',
                    gap: 'var(--spacing-md)',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    padding: 'var(--spacing-lg)',
                    background: 'var(--color-surface-muted)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    error={formErrors.name}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    error={formErrors.email}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    error={formErrors.phone}
                  />
                </div>
              )}
            </div>

            {/* Member Stats */}
            <div
              className="profile-stats"
              style={{
                display: 'grid',
                gap: 'var(--spacing-md)',
                gridTemplateColumns: '1fr',
                textAlign: 'center',
                minWidth: '160px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                  }}
                >
                  {member.stats.checkInsThisMonth}
                </div>
                <div
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-xs)',
                  }}
                >
                  Check-ins
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 700,
                    color: 'var(--color-success)',
                  }}
                >
                  {member.stats.classesAttended}
                </div>
                <div
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-xs)',
                  }}
                >
                  Classes
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 700,
                    color: 'var(--color-warning)',
                  }}
                >
                  {member.stats.badgesEarned}
                </div>
                <div
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-xs)',
                  }}
                >
                  Badges
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Emergency Contact & Preferences Card */}
        <Card>
          <div
            className="emergency-preferences-grid"
            style={{
              display: 'grid',
              gap: 'var(--spacing-xl)',
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            {/* Emergency Contact */}
            <div>
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>
                  Emergency Contact
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  Contact information for emergencies
                </p>
              </div>

              {isEditing ? (
                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                  <Input
                    label="Contact Name"
                    value={formData.emergencyContactName}
                    onChange={(e) =>
                      handleInputChange('emergencyContactName', e.target.value)
                    }
                    required
                    error={formErrors.emergencyContactName}
                  />
                  <Input
                    label="Contact Phone"
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) =>
                      handleInputChange('emergencyContactPhone', e.target.value)
                    }
                    required
                    error={formErrors.emergencyContactPhone}
                  />
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gap: 'var(--spacing-sm)',
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  <div>
                    <strong>{member.emergencyContact.name}</strong>
                  </div>
                  <div>📱 {member.emergencyContact.phone}</div>
                </div>
              )}
            </div>

            {/* Communication Preferences */}
            <div>
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>
                  Communication Preferences
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  Choose how we can contact you
                </p>
              </div>

              <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <Toggle
                  id="pref-newsletter"
                  label="Community Newsletter"
                  description="Monthly round-up of events and highlights"
                  checked={preferences.newsletter}
                  onChange={(value) => handlePreferenceChange('newsletter', value)}
                />
                <Toggle
                  id="pref-reminders"
                  label="Class Reminders"
                  description="24-hour class reminders"
                  checked={preferences.reminders}
                  onChange={(value) => handlePreferenceChange('reminders', value)}
                />
                <Toggle
                  id="pref-coaching"
                  label="Personal Coaching Offers"
                  description="1:1 coaching opportunities"
                  checked={preferences.personalCoaching}
                  onChange={(value) => handlePreferenceChange('personalCoaching', value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Dashboard Overview Card */}
        <Card>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h2 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>
              Dashboard Overview
            </h2>
            <p
              style={{
                margin: 0,
                color: 'var(--color-text-muted)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              Your membership status and recent activity summary
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gap: 'var(--spacing-lg)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              marginBottom: 'var(--spacing-xl)',
            }}
          >
            {/* Membership Status */}
            <div
              style={{
                padding: 'var(--spacing-lg)',
                background: 'var(--color-surface-muted)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h4
                style={{
                  margin: 0,
                  marginBottom: 'var(--spacing-sm)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Membership
              </h4>
              <div
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 600,
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                {membership?.name}
              </div>
              <div
                style={{
                  display: 'grid',
                  gap: 'var(--spacing-xs)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                <div style={{ color: 'var(--color-text-muted)' }}>
                  Status:{' '}
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                    {membership?.status}
                  </span>
                </div>
                <div style={{ color: 'var(--color-text-muted)' }}>
                  Renews: {membership ? formatDate(membership.renewsOn) : '—'}
                </div>
              </div>
            </div>

            {/* Enhanced Check-ins */}
            <div
              style={{
                padding: 'var(--spacing-lg)',
                background: 'var(--color-surface-muted)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h4
                style={{
                  margin: 0,
                  marginBottom: 'var(--spacing-sm)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Check-ins This Month
              </h4>
              <div
                style={{
                  fontSize: 'var(--font-size-xxl)',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                {member.stats.checkInsThisMonth}
              </div>
              <div
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                Current streak: {dashboard.stats.currentStreak} days
              </div>
            </div>

            {/* Enhanced Classes */}
            <div
              style={{
                padding: 'var(--spacing-lg)',
                background: 'var(--color-surface-muted)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h4
                style={{
                  margin: 0,
                  marginBottom: 'var(--spacing-sm)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Classes This Month
              </h4>
              <div
                style={{
                  fontSize: 'var(--font-size-xxl)',
                  fontWeight: 700,
                  color: 'var(--color-success)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                {member.stats.classesAttended}
              </div>
              <div
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                Up {dashboard.stats.attendanceChange}% vs last month
              </div>
            </div>

            {/* Last Visit */}
            <div
              style={{
                padding: 'var(--spacing-lg)',
                background: 'var(--color-surface-muted)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h4
                style={{
                  margin: 0,
                  marginBottom: 'var(--spacing-sm)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Last Visit
              </h4>
              <div
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 600,
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                {formatDate(dashboard.stats.lastVisit)}
              </div>
              <div
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                {member.stats.badgesEarned} badges earned
              </div>
            </div>
          </div>

          {/* Upcoming Classes */}
          {dashboard.upcomingClasses.length > 0 && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-lg)',
                }}
              >
                <h3 style={{ margin: 0 }}>Upcoming Classes</h3>
                <span
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  {dashboard.upcomingClasses.length} sessions scheduled
                </span>
              </div>
              <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                {dashboard.upcomingClasses.map((session) => (
                  <div
                    key={session.id}
                    style={{
                      display: 'grid',
                      gap: 'var(--spacing-sm)',
                      gridTemplateColumns: '2fr 1fr 1fr',
                      alignItems: 'center',
                      padding: 'var(--spacing-md)',
                      background: 'var(--color-surface)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{session.name}</div>
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
                      <div style={{ fontWeight: 500 }}>
                        {formatDate(session.startTime)}
                      </div>
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
                        textAlign: 'right',
                        color: 'var(--color-text-muted)',
                        fontSize: 'var(--font-size-sm)',
                      }}
                    >
                      {session.spotsRemaining} spots left
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Activity & Analytics Card */}
        <Card>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h2 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>
              Activity & Analytics
            </h2>
            <p
              style={{
                margin: 0,
                color: 'var(--color-text-muted)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              Your climbing activity and progress over time
            </p>
          </div>

          {/* Monthly Visits Chart */}
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h3 style={{ margin: 0, marginBottom: 'var(--spacing-md)' }}>
              Monthly Visits
            </h3>
            <div
              style={{
                height: 280,
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius)',
                padding: 'var(--spacing-md)',
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activity.monthlyVisits}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148, 163, 184, 0.2)"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="var(--color-text-muted)"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <YAxis
                    stroke="var(--color-text-muted)"
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
                    contentStyle={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  />
                  <Bar
                    dataKey="visits"
                    fill="var(--color-primary)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 style={{ margin: 0, marginBottom: 'var(--spacing-md)' }}>
              Recent Activity
            </h3>
            <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
              {activity.recentActivity.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--spacing-md)',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.type}</div>
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
                    <div style={{ fontWeight: 500 }}>{formatDate(item.date)}</div>
                    <div style={{ fontSize: 'var(--font-size-sm)' }}>
                      {item.value} {item.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
