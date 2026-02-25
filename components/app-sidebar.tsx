'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  Bell,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/actions/auth'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

interface AppSidebarProps {
  role: 'teacher' | 'student'
  classrooms?: { id: string; name: string; cover_color: string }[]
}

export function AppSidebar({ role, classrooms = [] }: AppSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const dashboardHref = role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'

  const navItems: NavItem[] = [
    { href: dashboardHref, label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { href: '/profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  ]

  const SidebarContent = () => (
    <aside className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between p-4 pb-6">
        <Logo size={36} href={dashboardHref} />
        <button
          className="md:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        {classrooms.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              My Classrooms
            </p>
            {classrooms.map((c) => (
              <Link
                key={c.id}
                href={`/classroom/${c.id}`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  pathname.startsWith(`/classroom/${c.id}`)
                    ? 'bg-sidebar-accent text-sidebar-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: c.cover_color }}
                />
                <span className="truncate">{c.name}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed left-4 top-4 z-50 md:hidden rounded-md bg-sidebar p-2 text-sidebar-foreground shadow-md"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:shrink-0">
        <SidebarContent />
      </div>
    </>
  )
}
