import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { useMemberProfile, useMemberProfileUpdate } from '@/hooks/useMemberProfile'
import { formatDate } from '@/lib/format'
import { ProfileFormData, MemberProfileUpdate } from '@/types/api'

export function ProfilePage() {
  const { data: member, isLoading } = useMemberProfile()
  const updateProfile = useMemberProfileUpdate()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  })
  const [preferences, setPreferences] = useState(member?.preferences || {
    newsletter: false,
    reminders: false,
    personalCoaching: false
  })
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
        emergencyContactPhone: member.emergencyContact.phone
      })
      setPreferences(member.preferences)
    }
  }, [member])

  // Track changes to show save/cancel buttons
  useEffect(() => {
    if (member) {
      const hasFormChanges = (
        formData.name !== member.name ||
        formData.email !== member.email ||
        formData.phone !== member.phone ||
        formData.emergencyContactName !== member.emergencyContact.name ||
        formData.emergencyContactPhone !== member.emergencyContact.phone
      )
      
      const hasPreferenceChanges = (
        preferences.newsletter !== member.preferences.newsletter ||
        preferences.reminders !== member.preferences.reminders ||
        preferences.personalCoaching !== member.preferences.personalCoaching
      )
      
      setHasUnsavedChanges(hasFormChanges || hasPreferenceChanges)
    }
  }, [formData, preferences, member])

  if (isLoading || !member) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          Loading profile...
        </div>
      </div>
    )
  }

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
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
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
          phone: formData.emergencyContactPhone
        },
        preferences: preferences
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
        emergencyContactPhone: member.emergencyContact.phone
      })
      setPreferences(member.preferences)
    }
    setIsEditing(false)
    setHasUnsavedChanges(false)
    setFormErrors({})
  }

  const getStatusBadge = (tier: string) => {
    const colors = {
      'Basic': 'var(--color-info)',
      'Unlimited': 'var(--color-success)',
      'Family': 'var(--color-primary)'
    }
    
    return (
      <span style={{
        background: colors[tier as keyof typeof colors] || 'var(--color-text-muted)',
        color: 'white',
        padding: 'var(--spacing-xs) var(--spacing-sm)',
        borderRadius: 'var(--radius)',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 600,
        textTransform: 'uppercase'
      }}>
        {tier}
      </span>
    )
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>Profile & Preferences</h1>
          <p className="page-description">Manage your personal information and communication preferences</p>
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
              <Button 
                onClick={handleSave}
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
          {!hasUnsavedChanges && (
            <Button 
              variant={isEditing ? "secondary" : "primary"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Done Editing' : 'Edit Profile'}
            </Button>
          )}
        </div>
      </header>

      <div style={{ display: 'grid', gap: 'var(--spacing-xl)' }}>
        {/* Personal Information */}
        <Card>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h2 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>Personal Information</h2>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
              Your basic profile information and contact details
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gap: 'var(--spacing-lg)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
          }}>
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              readOnly={!isEditing}
              required
              error={formErrors.name}
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              readOnly={!isEditing}
              required
              error={formErrors.email}
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              readOnly={!isEditing}
              required
              error={formErrors.phone}
            />
          </div>
        </Card>

        {/* Membership Information */}
        <Card>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h2 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>Membership Information</h2>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
              Your membership details and billing information
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gap: 'var(--spacing-lg)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-xs)', 
                fontSize: 'var(--font-size-sm)', 
                fontWeight: 600,
                color: 'var(--color-text-secondary)'
              }}>
                Membership Type
              </label>
              {getStatusBadge(member.membershipTier)}
            </div>
            <Input
              label="Member Since"
              value={formatDate(member.joinDate)}
              readOnly
            />
            <Input
              label="Next Billing Date"
              value={formatDate(member.nextBillingDate)}
              readOnly
            />
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h2 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>Emergency Contact</h2>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
              Contact information for emergencies
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gap: 'var(--spacing-lg)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            maxWidth: '600px'
          }}>
            <Input
              label="Contact Name"
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              readOnly={!isEditing}
              required
              error={formErrors.emergencyContactName}
            />
            <Input
              label="Contact Phone"
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
              readOnly={!isEditing}
              required
              error={formErrors.emergencyContactPhone}
            />
          </div>
        </Card>

        {/* Communication Preferences */}
        <Card>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h2 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>Communication Preferences</h2>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
              Choose how we can contact you
            </p>
          </div>
          
          <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
            <Toggle
              id="pref-newsletter"
              label="Community Newsletter"
              description="Monthly round-up of events, classes, and competition highlights"
              checked={preferences.newsletter}
              onChange={(value) => handlePreferenceChange('newsletter', value)}
            />
            <Toggle
              id="pref-reminders"
              label="Class Reminders"
              description="Reminders 24 hours before your scheduled classes"
              checked={preferences.reminders}
              onChange={(value) => handlePreferenceChange('reminders', value)}
            />
            <Toggle
              id="pref-coaching"
              label="Personal Coaching Offers"
              description="Occasional opportunities to work 1:1 with our coaches"
              checked={preferences.personalCoaching}
              onChange={(value) => handlePreferenceChange('personalCoaching', value)}
            />
          </div>
        </Card>

        {/* Member Stats */}
        <Card>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h2 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>Your Stats</h2>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
              Your activity summary
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gap: 'var(--spacing-lg)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                {member.stats.checkInsThisMonth}
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                Check-ins This Month
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 700, color: 'var(--color-success)' }}>
                {member.stats.classesAttended}
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                Classes Attended
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 700, color: 'var(--color-warning)' }}>
                {member.stats.badgesEarned}
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                Badges Earned
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
