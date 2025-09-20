import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '@/pages/login/LoginPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { ClassesPage } from '@/pages/classes/ClassesPage'
import { ActivityPage } from '@/pages/activity/ActivityPage'
import { MembershipPage } from '@/pages/membership/MembershipPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { PaymentsPage } from '@/pages/payments/PaymentsPage'
import { AnnouncementsPage } from '@/pages/announcements/AnnouncementsPage'
import { MainLayout } from './MainLayout'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/payments" element={<PaymentsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
