import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/supabase/admin'
import AdminLayout from './AdminLayoutClient'

export default async function AdminLayoutRoot({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAdmin } = await getAdminUser()

  if (!user || !isAdmin) {
    redirect('/admin/login')
  }

  return <AdminLayout>{children}</AdminLayout>
}