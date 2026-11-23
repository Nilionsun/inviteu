'use client'

import { motion } from 'framer-motion'
import {
  Users,
  MessageCircle,
  Gift,
  Image,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { cn, formatDate, formatCurrency } from '@/lib/utils'
import { Button, Card } from '@/components/ui'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
  color: string
  href?: string
}

function StatCard({ title, value, change, changeType = 'neutral', icon, color, href }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl">
        {href ? (
          <Link href={href} className="block group-hover:text-primary-gold transition-colors">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-body-sm text-text-muted mb-1">{title}</p>
                  <p className="font-display font-medium text-3xl text-text-primary">{value}</p>
                </div>
                <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center', `bg-${color}/10`)}>
                  {icon}
                </div>
              </div>
              {change && (
                <div className="mt-4 flex items-center gap-1">
                  <span className={cn(
                    'text-body-sm font-medium',
                    changeType === 'positive' && 'text-green-600',
                    changeType === 'negative' && 'text-red-600',
                    changeType === 'neutral' && 'text-text-muted'
                  )}>
                    {changeType === 'positive' && <ArrowUpRight className="w-4 h-4" />}
                    {changeType === 'negative' && <ArrowDownRight className="w-4 h-4" />}
                    {changeType === 'neutral' && <span className="w-4 h-4" />}
                    {change}
                  </span>
                  <span className="text-body-sm text-text-muted">vs last month</span>
                </div>
              )}
            </div>
          </Link>
        ) : (
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-body-sm text-text-muted mb-1">{title}</p>
                <p className="font-display font-medium text-3xl text-text-primary">{value}</p>
              </div>
              <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center', `bg-${color}/10`)}>
                  {icon}
                </div>
            </div>
            {change && (
              <div className="mt-4 flex items-center gap-1">
                <span className={cn(
                  'text-body-sm font-medium',
                  changeType === 'positive' && 'text-green-600',
                  changeType === 'negative' && 'text-red-600',
                  changeType === 'neutral' && 'text-text-muted'
                )}>
                  {changeType === 'positive' && <ArrowUpRight className="w-4 h-4" />}
                  {changeType === 'negative' && <ArrowDownRight className="w-4 h-4" />}
                  {changeType === 'neutral' && <span className="w-4 h-4" />}
                  {change}
                </span>
                <span className="text-body-sm text-text-muted">vs last month</span>
              </div>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  )
}

interface RecentActivityProps {
  activities: Array<{
    id: string
    type: 'rsvp' | 'blessing' | 'contribution'
    name: string
    details: string
    time: string
    status: 'accepted' | 'declined' | 'pending' | 'completed'
    amount?: number
  }>
}

function RecentActivity({ activities }: RecentActivityProps) {
  const getStatusIcon = (type: string, status: string) => {
    if (type === 'rsvp') return status === 'accepted' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
    if (type === 'contribution') return <Gift className="w-5 h-5 text-primary-gold" />
    return <MessageCircle className="w-5 h-5 text-blue-500" />
  }

  const getStatusLabel = (type: string, status: string) => {
    if (type === 'rsvp') return status === 'accepted' ? 'Attending' : 'Not Attending'
    if (type === 'contribution') return 'Completed'
    return 'New Blessing'
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-border-gold/30 flex items-center justify-between">
        <h2 className="font-medium text-lg text-text-primary">Recent Activity</h2>
        <Link href="/admin/rsvp" className="text-body-sm text-primary-gold hover:underline flex items-center gap-1">
          View All
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
      <div className="divide-y divide-border-gold/30">
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 hover:bg-primary-cream/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-gold/10 flex items-center justify-center flex-shrink-0">
                {getStatusIcon(activity.type, activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-text-primary truncate">{activity.name}</p>
                  <span className={cn(
                    'px-2 py-0.5 text-body-xs rounded-full font-medium',
                    activity.type === 'rsvp' && activity.status === 'accepted' && 'bg-green-100 text-green-700',
                    activity.type === 'rsvp' && activity.status === 'declined' && 'bg-red-100 text-red-700',
                    activity.type === 'blessing' && 'bg-blue-100 text-blue-700',
                    activity.type === 'contribution' && 'bg-primary-gold/20 text-primary-gold'
                  )}>
                    {getStatusLabel(activity.type, activity.status)}
                  </span>
                </div>
                <p className="text-body-sm text-text-secondary mt-0.5 truncate">{activity.details}</p>
                {activity.amount && (
                  <p className="text-body-sm font-medium text-primary-gold mt-1">{formatCurrency(activity.amount)}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-body-xs text-text-muted">{activity.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}

interface UpcomingEventsProps {
  events: Array<{
    id: string
    title: string
    date: string
    time: string
    venue: string
    slug: string
    rsvpCount: number
    status: 'upcoming' | 'today' | 'past'
  }>
}

function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-border-gold/30 flex items-center justify-between">
        <h2 className="font-medium text-lg text-text-primary">Upcoming Events</h2>
        <Link href="/admin/events" className="text-body-sm text-primary-gold hover:underline flex items-center gap-1">
          View All
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
      <div className="divide-y divide-border-gold/30">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 hover:bg-primary-cream/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-display font-medium',
                event.status === 'today' ? 'bg-primary-gold' :
                event.status === 'upcoming' ? 'bg-blue-500' : 'bg-text-muted'
              )}>
                <span className="text-2xl">{event.status === 'today' ? '✦' : new Date(event.date).getDate()}</span>
                <span className="text-body-xs block text-center">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link href={`/${event.slug}`} target="_blank" className="font-medium text-text-primary hover:text-primary-gold transition-colors truncate block">
                    {event.title}
                  </Link>
                  {event.status === 'today' && (
                    <span className="px-2 py-0.5 text-body-xs bg-primary-gold/20 text-primary-gold rounded-full font-medium animate-pulse">
                      Today
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-body-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    {event.venue}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-medium text-text-primary">{event.rsvpCount} RSVPs</p>
                <p className="text-body-xs text-text-muted">responses</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}

interface AdminDashboardClientProps {
  stats: {
    totalInvitations: number
    rsvpCount: number
    blessingsCount: number
    contributionsCount: number
  }
  recentActivities: Array<{
    id: string
    guest_name: string
    message: string
    created_at: string
    events: {
      couple_name_1: string
      couple_name_2: string
    }
  }>
  upcomingEvents: Array<{
    id: string
    couple_name_1: string
    couple_name_2: string
    date: string
    time: string
    venue_name: string
    slug: string
    rsvps: Array<{ id: string }>
  }>
}

export default function AdminDashboardClient({
  stats,
  recentActivities,
  upcomingEvents
}: AdminDashboardClientProps) {
  // Transform activities for display
  const displayActivities = recentActivities.map((a, index) => ({
    id: a.id,
    type: 'blessing' as const,
    name: a.guest_name,
    details: `Sent a blessing for ${a.events?.couple_name_1} & ${a.events?.couple_name_2}'s Wedding`,
    time: new Date(a.created_at).toLocaleString(),
    status: 'pending' as const,
  }))

  // Transform events for display
  const displayEvents = upcomingEvents.map((e) => ({
    id: e.id,
    title: `${e.couple_name_1} & ${e.couple_name_2}'s Wedding`,
    date: e.date,
    time: e.time,
    venue: e.venue_name,
    slug: e.slug,
    rsvpCount: e.rsvps?.length || 0,
    status: 'upcoming' as const,
  }))

  const statCards = [
    { title: 'Total Invitations', value: stats.totalInvitations.toString(), change: '+12%', changeType: 'positive' as const, icon: <Users className="w-7 h-7 text-blue-500" />, color: 'blue-500', href: '/admin/events' },
    { title: 'RSVP Responses', value: stats.rsvpCount.toString(), change: '+8%', changeType: 'positive' as const, icon: <CheckCircle className="w-7 h-7 text-green-500" />, color: 'green-500', href: '/admin/rsvp' },
    { title: 'Blessings Received', value: stats.blessingsCount.toString(), change: '+23%', changeType: 'positive' as const, icon: <MessageCircle className="w-7 h-7 text-blue-500" />, color: 'blue-500', href: '/admin/blessings' },
    { title: 'Total Contributions', value: formatCurrency(stats.contributionsCount), change: '+15%', changeType: 'positive' as const, icon: <Gift className="w-7 h-7 text-primary-gold" />, color: 'primary-gold', href: '/admin/contributions' },
  ]

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-medium text-3xl lg:text-4xl text-text-primary">Dashboard</h1>
          <p className="text-body text-text-secondary mt-1">Welcome back! Here's an overview of your wedding invitations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/events/new" className="hidden sm:inline-flex">
            <Button variant="primary" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              New Event
            </Button>
          </Link>
          <Button variant="primary" size="lg" className="sm:hidden">
            <Plus className="w-5 h-5 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {statCards.map((stat, index) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Activity - Full Width on Mobile, 2/3 on Desktop */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity activities={displayActivities} />

          {/* Quick Actions */}
          <Card>
            <div className="p-6 border-b border-border-gold/30">
              <h2 className="font-medium text-lg text-text-primary">Quick Actions</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Create Event', icon: Plus, href: '/admin/events/new', color: 'blue-500' },
                { label: 'View RSVPs', icon: Users, href: '/admin/rsvp', color: 'green-500' },
                { label: 'Read Blessings', icon: MessageCircle, href: '/admin/blessings', color: 'blue-500' },
                { label: 'Check Contributions', icon: Gift, href: '/admin/contributions', color: 'primary-gold' },
              ].map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                >
                  <Link href={action.href} className="block">
                    <div className={cn(
                      'p-5 rounded-xl border border-border-gold/30 hover:border-primary-gold/50 hover:bg-primary-cream/30 transition-all duration-200 text-center group'
                    )}>
                      <div className={cn('w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors', `bg-${action.color}/10 group-hover:bg-${action.color}/20`)}>
                        <action.icon className="w-6 h-6" style={{ color: action.color }} />
                      </div>
                      <p className="font-medium text-text-primary group-hover:text-primary-gold transition-colors">{action.label}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar - Upcoming Events */}
        <div className="lg:col-span-1 space-y-6">
          <UpcomingEvents events={displayEvents} />

          {/* Quick Stats Summary */}
          <Card>
            <div className="p-6 border-b border-border-gold/30">
              <h2 className="font-medium text-lg text-text-primary">Quick Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary-cream/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-gold/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary-gold" />
                  </div>
                  <div>
                    <p className="text-body-sm text-text-muted">Avg. Response Rate</p>
                    <p className="font-display font-medium text-xl text-text-primary">78%</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary-cream/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-gold/10 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-primary-gold" />
                  </div>
                  <div>
                    <p className="text-body-sm text-text-muted">Avg. Contribution</p>
                    <p className="font-display font-medium text-xl text-text-primary">₹1,992</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary-cream/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-gold/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-body-sm text-text-muted">Blessings per Event</p>
                    <p className="font-display font-medium text-xl text-text-primary">24</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}