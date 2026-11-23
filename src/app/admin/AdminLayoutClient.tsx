'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Calendar,
  Image,
  Users,
  MessageCircle,
  Gift,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  Globe
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AdminLayoutClientProps {
  children: ReactNode
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/rsvp', label: 'RSVP', icon: Users },
  { href: '/admin/blessings', label: 'Blessings', icon: MessageCircle },
  { href: '/admin/contributions', label: 'Contributions', icon: Gift },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-primary-background flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed lg:relative z-50 w-72 bg-surface-cream border-r border-border-gold/50 h-screen flex flex-col transform lg:translate-x-0"
        role="navigation"
        aria-label="Admin navigation"
      >
        {/* Logo */}
        <div className="p-6 border-b border-border-gold/30">
          <Link href="/admin/dashboard" className="flex items-center gap-3" aria-label="InviteAura Admin Home">
            <div className="w-10 h-10 rounded-xl bg-primary-gold/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary-gold" />
            </div>
            <div>
              <h1 className="font-display font-medium text-xl text-text-primary">InviteAura</h1>
              <p className="text-body-xs text-text-muted">Admin Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-body transition-all duration-200',
                  isActive
                    ? 'bg-primary-gold/10 text-primary-gold'
                    : 'text-text-secondary hover:bg-primary-cream/50 hover:text-text-primary'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-gold" aria-hidden="true" />}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border-gold/30">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-body text-text-secondary hover:bg-primary-cream/50 hover:text-text-primary transition-all duration-200"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-10 h-10 rounded-full bg-primary-gold/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary-gold" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-text-primary truncate">Admin User</p>
                <p className="text-body-xs text-text-muted truncate">admin@inviteaura.com</p>
              </div>
              <ChevronDown className={cn('w-4 h-4 text-text-muted transition-transform', userMenuOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full left-4 right-4 mb-2 bg-surface-cream rounded-xl border border-border-gold/50 shadow-xl py-2 z-10"
                  role="menu"
                >
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-4 py-2 text-body text-text-secondary hover:bg-primary-cream/50 hover:text-text-primary transition-colors"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </Link>
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-2 text-body text-text-secondary hover:bg-primary-cream/50 hover:text-text-primary transition-colors"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Globe className="w-5 h-5" />
                    View Site
                  </Link>
                  <hr className="my-2 border-border-gold/30" />
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full flex items-center gap-3 px-4 py-2 text-body text-text-secondary hover:bg-primary-cream/50 hover:text-red-600 transition-colors disabled:opacity-50"
                    role="menuitem"
                  >
                    <LogOut className="w-5 h-5" />
                    {isSigningOut ? 'Signing out...' : 'Sign Out'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 flex flex-col min-w-0">
        {/* Top Bar - Mobile */}
        <header className="sticky top-0 z-30 bg-surface-cream/80 backdrop-blur-sm border-b border-border-gold/30 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-text-secondary hover:bg-primary-cream/50 hover:text-text-primary transition-colors"
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-display font-medium text-lg text-text-primary">InviteAura Admin</h1>
            <div className="w-10" />
          </div>
        </header>

        {/* Top Bar - Desktop */}
        <header className="hidden lg:sticky lg:top-0 z-30 bg-surface-cream/80 backdrop-blur-sm border-b border-border-gold/30">
          <div className="flex items-center justify-between h-16 px-6 lg:px-8">
            <h1 className="font-display font-medium text-xl text-text-primary">InviteAura Admin</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="p-2 rounded-xl text-text-secondary hover:bg-primary-cream/50 hover:text-text-primary transition-colors"
                aria-label="View live site"
              >
                <Globe className="w-5 h-5" />
              </Link>
              <div className="w-px h-6 bg-border-gold/30" />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-gold/10 text-primary-gold text-body-sm font-medium">
                <span className="relative flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                  Live
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>

      <style jsx global>{`
        /* Custom scrollbar for sidebar */
        aside::-webkit-scrollbar {
          width: 6px;
        }
        aside::-webkit-scrollbar-track {
          background: transparent;
        }
        aside::-webkit-scrollbar-thumb {
          background: #D4A574;
          border-radius: 3px;
        }
        aside::-webkit-scrollbar-thumb:hover {
          background: #C49564;
        }
      `}</style>
    </div>
  )
}