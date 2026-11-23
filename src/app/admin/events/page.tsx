import { createClient } from '@/lib/supabase/server'
import AdminEventsClient from './AdminEventsClient'

export default async function AdminEventsPage() {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching events:', error)
  }

  return <AdminEventsClient initialEvents={events || []} />
}