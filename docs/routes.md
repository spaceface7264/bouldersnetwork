# Routes

| Route        | Description                                                         | Page Component  | Notes                                                     |
| ------------ | ------------------------------------------------------------------- | --------------- | --------------------------------------------------------- |
| `/login`     | Standalone login experience with email/password inputs.             | `LoginPage`     | Navigates to `/dashboard` after submit (mocked).          |
| `/dashboard` | Home view with membership stats and upcoming classes summary.       | `DashboardPage` | Loads `useDashboardSummary` and `useMemberProfile`.       |
| `/classes`   | Session management with upcoming bookings and saved waitlist items. | `ClassesPage`   | Uses modal manager for session details and waitlist flow. |
| `/activity`  | Recent activity feed and monthly visits chart.                      | `ActivityPage`  | Renders Recharts bar chart backed by `useActivityData`.   |
| `/profile`   | Member profile details and preference toggles.                      | `ProfilePage`   | Uses `Toggle` UI primitive for contextual settings.       |
| `/payments`  | Upcoming payment overview and history ledger.                       | `PaymentsPage`  | Formatting utilities render currency and dates.           |

### Navigation Pattern

- `/` redirects to `/dashboard`.
- Unknown paths redirect to `/dashboard`.
- Authenticated routes share the `MainLayout` shell (sidebar navigation + header).
