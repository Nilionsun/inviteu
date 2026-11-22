'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import Link from 'next/link';
import { cn, formatDate, formatCurrency } from '@/lib/utils';
import { Button, Card } from '@/components/ui';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
  href?: string;
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
        {href && (
          <Link href={href} className="block group-hover:text-primary-gold transition-colors">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-body-sm text-text-muted mb-1">{title}</p>
                  <p className="font-display font-medium text-3xl text-text-primary">{value}</p>
                </div>
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', `bg-${color}/10`)}>
                  <span style={{ color }} className="text-2xl">{icon}</span>
                </div>
              </div>
              {change && (
                <div className="mt-4 flex items-center gap-2">
                  <span className={cn(
                    'text-body-sm font-medium flex items-center gap-1',
                    changeType === 'positive' ? 'text-green-600' :
                    changeType === 'negative' ? 'text-red-600' : 'text-text-muted'
                  )}>
                    {changeType === 'positive' && <ArrowUpRight className="w-4 h-4" />}
                    {changeType === 'negative' && <ArrowDownRight className="w-4 h-4" />}
                    {change}
                  </span>
                  <span className="text-body-xs text-text-muted">vs last month</span>
                </div>
              )}
            </div>
          </Link>
        )}
      </Card>
    </motion.div>
  );
}

interface RecentActivityProps {
  activities: Array<{
    id: string;
    type: 'rsvp' | 'blessing' | 'contribution';
    name: string;
    details: string;
    time: string;
    status: 'accepted' | 'declined' | 'pending' | 'completed';
    amount?: number;
  }>;
}

function RecentActivity({ activities }: RecentActivityProps) {
  const getStatusIcon = (type: string, status: string) => {
    if (type === 'rsvp') {
      return status === 'accepted' ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <XCircle className="w-5 h-5 text-red-500" />
      );
    }
    if (type === 'contribution') {
      return <Gift className="w-5 h-5 text-primary-gold" />;
    }
    return <MessageCircle className="w-5 h-5 text-blue-500" />;
  };

  const getStatusLabel = (type: string, status: string) => {
    if (type === 'rsvp') return status === 'accepted' ? 'Attending' : 'Not Attending';
    if (type === 'contribution') return 'Completed';
    return 'New Blessing';
  };

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
  );
}

interface UpcomingEventsProps {
  events: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    slug: string;
    rsvpCount: number;
    status: 'upcoming' | 'today' | 'past';
  }>;
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
  );
}

// Mock data
const mockStats = [
  { title: 'Total Invitations', value: '24', change: '+12%', changeType: 'positive' as const, icon: Users, color: 'blue-500', href: '/admin/events' },
  { title: 'RSVP Responses', value: '1,234', change: '+8%', changeType: 'positive' as const, icon: CheckCircle, color: 'green-500', href: '/admin/rsvp' },
  { title: 'Blessings Received', value: '567', change: '+23%', changeType: 'positive' as const, icon: MessageCircle, color: 'blue-500', href: '/admin/blessings' },
  { title: 'Total Contributions', value: '₹2,45,678', change: '+15%', changeType: 'positive' as const, icon: Gift, color: 'primary-gold', href: '/admin/contributions' },
];

const mockActivities = [
  { id: '1', type: 'rsvp' as const, name: 'Priya Sharma', details: 'RSVP\'d for Priya & Arjun\'s Wedding', time: '2 min ago', status: 'accepted' as const },
  { id: '2', type: 'blessing' as const, name: 'Rajesh Kumar', details: 'Sent a blessing for the couple', time: '15 min ago', status: 'pending' as const },
  { id: '3', type: 'contribution' as const, name: 'Anita Patel', details: 'Contributed to Priya & Arjun\'s new beginning', time: '1 hour ago', status: 'completed' as const, amount: 5001 },
  { id: '4', type: 'rsvp' as const, name: 'Vikram Singh', details: 'RSVP\'d for Priya & Arjun\'s Wedding', time: '3 hours ago', status: 'declined' as const },
  { id: '5', type: 'blessing' as const, name: 'Meera Joshi', details: 'Sent a blessing for the couple', time: '5 hours ago', status: 'pending' as const },
];

const mockEvents = [
  { id: '1', title: 'Priya & Arjun\'s Wedding', date: '2025-02-15', time: '4:30 PM', venue: 'The Grand Palace, Bengaluru', slug: 'priya-arjun-wedding', rsvpCount: 156, status: 'upcoming' as const },
  { id: '2', title: 'Meera & Rohan\'s Reception', date: '2025-03-01', time: '7:00 PM', venue: 'Taj Hotel, Mumbai', slug: 'meera-rohan-reception', rsvpCount: 89, status: 'upcoming' as const },
  { id: '3', title: 'Anjali & Karan\'s Sangeet', date: '2025-01-28', time: '6:00 PM', venue: 'JW Marriott, Delhi', slug: 'anjali-karan-sangeet', rsvpCount: 234, status: 'upcoming' as const },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {mockStats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={<stat.icon className="w-6 h-6" />}
            color={stat.color}
            href={stat.href}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Full Width on Mobile, 2/3 on Desktop */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity activities={mockActivities} />

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
          <UpcomingEvents events={mockEvents} />

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
    </div>
  );
}