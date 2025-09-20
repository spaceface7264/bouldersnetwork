import {
  ActivityResponse,
  ClassesResponse,
  DashboardSummary,
  MemberProfile,
  PaymentsResponse,
} from '@/types/api'

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

// Mutable member profile for updates
let memberProfile: MemberProfile = {
  id: 'member-001',
  name: 'Alex Johnson',
  avatarUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  membershipTier: 'Unlimited',
  joinDate: '2021-03-15',
  nextBillingDate: '2024-08-01',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  emergencyContact: {
    name: 'Taylor Johnson',
    phone: '+1 (555) 765-4321',
  },
  preferences: {
    newsletter: true,
    reminders: true,
    personalCoaching: false,
  },
  stats: {
    checkInsThisMonth: 12,
    classesAttended: 5,
    badgesEarned: 3,
  },
}

const dashboardSummary: DashboardSummary = {
  greeting: 'Welcome back, Alex!',
  memberships: [
    {
      name: 'Unlimited Climber',
      status: 'Active',
      renewsOn: '2024-08-01',
    },
  ],
  upcomingClasses: [
    {
      id: 'class-001',
      name: 'Strength & Conditioning for Climbers',
      instructor: 'Jordan Blake',
      startTime: '2024-07-03T18:00:00Z',
      durationMinutes: 60,
      capacity: 14,
      spotsRemaining: 3,
      difficulty: 'Intermediate',
      location: 'Training Room A',
    },
    {
      id: 'class-002',
      name: 'Intro to Bouldering',
      instructor: 'Casey Nguyen',
      startTime: '2024-07-05T16:30:00Z',
      durationMinutes: 75,
      capacity: 12,
      spotsRemaining: 5,
      difficulty: 'Beginner',
      location: 'Main Wall',
    },
  ],
  stats: {
    currentStreak: 4,
    attendanceChange: 12,
    lastVisit: '2024-06-28',
  },
}

const classesResponse: ClassesResponse = {
  upcoming: [
    {
      id: 'class-003',
      name: 'Advanced Movement Clinic',
      instructor: 'Morgan Lee',
      startTime: '2024-07-07T15:00:00Z',
      durationMinutes: 90,
      capacity: 10,
      spotsRemaining: 2,
      difficulty: 'Advanced',
      location: 'Training Room B',
    },
    {
      id: 'class-004',
      name: 'Campus Board Fundamentals',
      instructor: 'Sydney Park',
      startTime: '2024-07-09T19:00:00Z',
      durationMinutes: 60,
      capacity: 8,
      spotsRemaining: 1,
      difficulty: 'Intermediate',
      location: 'Training Room A',
    },
    {
      id: 'class-005',
      name: 'Morning Mobility Flow',
      instructor: 'Jamie Fox',
      startTime: '2024-07-10T07:30:00Z',
      durationMinutes: 45,
      capacity: 16,
      spotsRemaining: 6,
      difficulty: 'Beginner',
      location: 'Studio 2',
    },
  ],
  saved: [
    {
      id: 'class-006',
      name: 'Route Reading Workshop',
      instructor: 'Parker Mills',
      startTime: '2024-07-12T18:30:00Z',
      durationMinutes: 60,
      capacity: 12,
      spotsRemaining: 4,
      difficulty: 'Intermediate',
      location: 'Main Wall',
    },
  ],
}

const activityResponse: ActivityResponse = {
  recentActivity: [
    {
      id: 'activity-001',
      date: '2024-06-28',
      type: 'Check-in',
      description: 'Evening session',
      value: 2,
      unit: 'hrs',
    },
    {
      id: 'activity-002',
      date: '2024-06-26',
      type: 'Class',
      description: 'Strength & Conditioning for Climbers',
      value: 60,
      unit: 'mins',
    },
    {
      id: 'activity-003',
      date: '2024-06-24',
      type: 'Milestone',
      description: 'Hit V5 Project “Skyline Ridge”',
      value: 1,
      unit: 'completed',
    },
  ],
  monthlyVisits: [
    { month: 'Jan', visits: 11 },
    { month: 'Feb', visits: 9 },
    { month: 'Mar', visits: 13 },
    { month: 'Apr', visits: 12 },
    { month: 'May', visits: 15 },
    { month: 'Jun', visits: 14 },
  ],
}

const paymentsResponse: PaymentsResponse = {
  upcomingAmount: 119,
  paymentMethod: 'Visa •• 4242',
  history: [
    {
      id: 'pay-001',
      date: '2024-06-01',
      amount: 119,
      status: 'Paid',
      method: 'Card',
      invoiceUrl: '#',
    },
    {
      id: 'pay-002',
      date: '2024-05-01',
      amount: 119,
      status: 'Paid',
      method: 'Card',
      invoiceUrl: '#',
    },
    {
      id: 'pay-003',
      date: '2024-04-01',
      amount: 119,
      status: 'Paid',
      method: 'Card',
      invoiceUrl: '#',
    },
  ],
}

export const mockApi = {
  async fetchMemberProfile(): Promise<MemberProfile> {
    await delay()
    return memberProfile
  },
  async fetchDashboard(): Promise<DashboardSummary> {
    await delay()
    return dashboardSummary
  },
  async fetchClasses(): Promise<ClassesResponse> {
    await delay()
    return classesResponse
  },
  async fetchActivity(): Promise<ActivityResponse> {
    await delay()
    return activityResponse
  },
  async fetchPayments(): Promise<PaymentsResponse> {
    await delay()
    return paymentsResponse
  },

  // Profile update methods
  getCurrentProfile(): MemberProfile {
    return { ...memberProfile }
  },

  updateProfile(updates: Partial<MemberProfile>): void {
    memberProfile = { ...memberProfile, ...updates }
  },
}
