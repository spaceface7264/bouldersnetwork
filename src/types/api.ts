export interface MemberProfile {
  id: string
  name: string
  avatarUrl: string
  membershipTier: 'Basic' | 'Unlimited' | 'Family'
  joinDate: string
  nextBillingDate: string
  email: string
  phone: string
  emergencyContact: {
    name: string
    phone: string
  }
  preferences: {
    newsletter: boolean
    reminders: boolean
    personalCoaching: boolean
  }
  stats: {
    checkInsThisMonth: number
    classesAttended: number
    badgesEarned: number
  }
}

// For API requests to update profile
export interface MemberProfileUpdate {
  name?: string
  email?: string
  phone?: string
  emergencyContact?: {
    name: string
    phone: string
  }
  preferences?: {
    newsletter: boolean
    reminders: boolean
    personalCoaching: boolean
  }
}

// For form validation
export interface ProfileFormData {
  name: string
  email: string
  phone: string
  emergencyContactName: string
  emergencyContactPhone: string
}

// API response wrapper
export interface ProfileUpdateResponse {
  member: MemberProfile
  message: string
}

export interface ClassSchedule {
  id: string
  name: string
  instructor: string
  startTime: string
  durationMinutes: number
  capacity: number
  spotsRemaining: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  location: string
}

export interface ActivityRecord {
  id: string
  date: string
  type: 'Check-in' | 'Class' | 'Milestone'
  description: string
  value: number
  unit: string
}

export interface ActivityMetric {
  month: string
  visits: number
}

export interface PaymentRecord {
  id: string
  date: string
  amount: number
  status: 'Paid' | 'Pending' | 'Failed'
  method: 'Card' | 'Account'
  invoiceUrl?: string
}

export interface DashboardSummary {
  greeting: string
  memberships: Array<{
    name: string
    status: 'Active' | 'Paused'
    renewsOn: string
  }>
  upcomingClasses: ClassSchedule[]
  stats: {
    currentStreak: number
    attendanceChange: number
    lastVisit: string
  }
}

export interface ClassesResponse {
  upcoming: ClassSchedule[]
  saved: ClassSchedule[]
}

export interface ActivityResponse {
  recentActivity: ActivityRecord[]
  monthlyVisits: ActivityMetric[]
}

export interface PaymentsResponse {
  upcomingAmount: number
  paymentMethod: string
  history: PaymentRecord[]
}

// Membership Management Types
export interface MembershipPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  features: string[]
  isPopular?: boolean
}

export interface MembershipSubscription {
  id: string
  planId: string
  planName: string
  status: 'active' | 'paused' | 'cancelled' | 'pending_cancellation'
  startDate: string
  renewalDate: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  pausedUntil?: string
  cancellationDate?: string
  cancellationReason?: string
}

export interface MembershipInvoice {
  id: string
  subscriptionId: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  issueDate: string
  dueDate: string
  paidDate?: string
  downloadUrl: string
  description: string
}

export interface MembershipAction {
  type: 'freeze' | 'cancel' | 'upgrade' | 'downgrade' | 'resume'
  planId?: string
  reason?: string
  effectiveDate?: string
  duration?: number // for freeze duration in days
}

export interface MembershipResponse {
  currentSubscription: MembershipSubscription
  availablePlans: MembershipPlan[]
  recentInvoices: MembershipInvoice[]
  upcomingPayment?: {
    amount: number
    date: string
    method: string
  }
}
