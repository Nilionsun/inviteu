import { createClient } from '@/lib/supabase/server'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch stats
  const [
    { count: totalInvitations },
    { count: rsvpCount },
    { count: blessingsCount },
    { count: contributionsCount },
    { data: recentActivities },
    { data: upcomingEvents }
  ] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('rsvps').select('*', { count: 'exact', head: true }),
    supabase.from('blessings').select('*', { count: 'exact', head: true }),
    supabase.from('contributions').select('*', { count: 'exact', head: true }),
    supabase
      .from('blessings')
      .select('*, events(couple_name_1, couple_name_2)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('events')
      .select('*, rsvps(id)')
      .order('date', { ascending: true })
      .limit(3)
  ])

  return (
    <AdminDashboardClient
      stats={{
        totalInvitations: totalInvitations || 0,
        rsvpCount: rsvpCount || 0,
        blessingsCount: blessingsCount || 0,
        contributionsCount: contributionsCount || 0,
      }}
      recentActivities={recentActivities || []}
      upcomingEvents={upcomingEvents || []}
    />
  )
}