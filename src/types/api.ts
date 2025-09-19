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
