import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { useMemberProfile } from '@/hooks/useMemberProfile'
import { formatDate } from '@/lib/format'

export function ProfilePage() {
  const { data: member, isLoading } = useMemberProfile()
  const [preferences, setPreferences] = useState(() => member?.preferences ?? null)

  useEffect(() => {
    if (member) {
      setPreferences(member.preferences)
    }
  }, [member])

  if (isLoading || !member || !preferences) {
    return <Card title="Loading profile" subtitle="Preparing your data" />
  }

  const activePreferences = preferences

  function handlePreferenceChange(key: keyof typeof activePreferences, value: boolean) {
    setPreferences((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-xl)' }}>
      <Card title="Profile details" subtitle="Update your personal information">
        <div
          style={{
            display: 'grid',
            gap: 'var(--spacing-lg)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          <Input label="Full name" value={member.name} readOnly />
          <Input label="Email" value={member.email} readOnly />
          <Input label="Phone" value={member.phone} readOnly />
          <Input label="Member since" value={formatDate(member.joinDate)} readOnly />
          <Input
            label="Next billing"
            value={formatDate(member.nextBillingDate)}
            readOnly
          />
        </div>
      </Card>

      <Card title="Emergency contact" subtitle="Used during urgent updates">
        <div style={{ display: 'grid', gap: 'var(--spacing-md)', maxWidth: 360 }}>
          <Input label="Name" value={member.emergencyContact.name} readOnly />
          <Input label="Phone" value={member.emergencyContact.phone} readOnly />
        </div>
      </Card>

      <Card title="Membership preferences" subtitle="Control how we contact you">
        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
          <Toggle
            id="pref-newsletter"
            label="Community newsletter"
            description="Monthly round-up of events, classes, and competition highlights."
            checked={activePreferences.newsletter}
            onChange={(value) => handlePreferenceChange('newsletter', value)}
          />
          <Toggle
            id="pref-reminders"
            label="Class reminders"
            description="Reminders 24 hours before your scheduled classes."
            checked={activePreferences.reminders}
            onChange={(value) => handlePreferenceChange('reminders', value)}
          />
          <Toggle
            id="pref-coaching"
            label="Personal coaching offers"
            description="Occasional opportunities to work 1:1 with our coaches."
            checked={activePreferences.personalCoaching}
            onChange={(value) => handlePreferenceChange('personalCoaching', value)}
          />
        </div>
      </Card>
    </div>
  )
}
