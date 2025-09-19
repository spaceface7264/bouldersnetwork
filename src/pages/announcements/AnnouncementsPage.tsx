import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/format'

const announcements = [
  {
    id: 'summer-setter-series',
    title: 'Summer Setter Series Arrives',
    date: '2024-07-12',
    summary:
      'Five weeks of fresh problems drop every Friday evening. Join the community setting workshop to learn how the routes come together.',
    image:
      'https://images.unsplash.com/photo-1526509177308-025f4a545f4c?auto=format&fit=crop&w=1200&q=80',
    action: {
      label: 'Reserve workshop spot',
      href: '/classes',
    },
  },
  {
    id: 'new-training-zone',
    title: 'Training Zone Upgrade Complete',
    date: '2024-06-28',
    summary:
      'Campus boards, hangboards, and a new spray wall are ready upstairs. Swing by the welcome desk to grab a progression guide tailored to your goals.',
    image:
      'https://images.unsplash.com/photo-1512805668733-07639be5bf68?auto=format&fit=crop&w=1200&q=80',
    action: {
      label: 'Download training guide',
      href: 'https://boulders.dk/training-guide.pdf',
    },
  },
  {
    id: 'member-app-release',
    title: 'Member App 2.0 Released',
    date: '2024-06-10',
    summary:
      'Track check-ins, RSVP for community comps, and sync your progress automatically with Streaks. Update from the App Store or Google Play today.',
    image:
      'https://images.unsplash.com/photo-1562777717-dc6984f65b61?auto=format&fit=crop&w=1200&q=80',
    action: {
      label: 'View release notes',
      href: 'https://boulders.dk/member-app',
    },
  },
]

export function AnnouncementsPage() {
  return (
    <div className="announcements-page">
      <header className="announcements-page__header">
        <div>
          <h1>Member announcements</h1>
          <p>Stay on top of updates, events, and facility changes across Boulders.</p>
        </div>
      </header>

      <div className="announcements-grid">
        {announcements.map((announcement) => {
          const action = announcement.action
          const isExternal = action ? /^https?:/i.test(action.href) : false

          return (
            <Card
              key={announcement.id}
              className="announcement-card"
              title={announcement.title}
              subtitle={formatDate(announcement.date)}
              actions={
                action ? (
                  isExternal ? (
                    <a
                      className="announcement-card__action"
                      href={action.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {action.label}
                    </a>
                  ) : (
                    <Link className="announcement-card__action" to={action.href}>
                      {action.label}
                    </Link>
                  )
                ) : null
              }
            >
              <div className="announcement-card__media">
                <img src={announcement.image} alt="" loading="lazy" />
              </div>
              <p className="announcement-card__summary">{announcement.summary}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
