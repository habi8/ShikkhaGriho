'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import { LogOut, MoreHorizontal, X, LayoutDashboard, User } from 'lucide-react'
import { useState } from 'react'
import { signOut } from '@/lib/actions/auth'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  const dashboardHref = role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'

  const navItems: NavItem[] = [
    { href: dashboardHref, label: t('nav.dashboard'), icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/profile', label: t('nav.profile'), icon: <User className="h-5 w-5" /> },
  ]

  const SidebarContent = () => (
    <div className="h-full w-72 p-3">
      <aside className="flex h-full flex-col rounded-2xl border border-[#22C55E]/35 bg-gradient-to-br from-[#F0FDF4] via-white to-[#F8FAFC] text-[#14532D] shadow-[0_18px_40px_-28px_rgba(15,23,42,0.5)]">
        {/* Logo header with decorative accent */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#22C55E]/25">
          <Logo size={40} href="/" textColor="#14532D" logoBg textSizeClass="text-xl" />
          <button
            className="md:hidden text-[#14532D]/70 hover:text-[#14532D]"
            onClick={() => setMobileOpen(false)}
            aria-label={t('nav.close_menu')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3.5 rounded-xl px-4 py-3 text-base font-medium transition-all',
              pathname === item.href
                ? 'bg-[#22C55E] text-white shadow-md shadow-black/10'
                : 'text-[#14532D]/70 hover:bg-[#DCFCE7] hover:text-[#14532D]'
            )}
          >
            <span className={cn(
              'shrink-0',
              pathname === item.href ? 'text-white' : 'text-[#14532D]/60'
            )}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}

        {classrooms.length > 0 && (
          <div className="mt-5 pt-4 border-t border-[#22C55E]/25">
            <p className="mb-3 px-4 text-xs font-bold uppercase tracking-widest text-[#14532D]/50">
              {t('nav.my_classrooms')}
            </p>
            {classrooms.map((c) => (
              <Link
                key={c.id}
                href={`/classroom/${c.id}`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-2.5 text-base font-medium transition-all',
                  pathname.startsWith(`/classroom/${c.id}`)
                    ? 'bg-[#DCFCE7] text-[#14532D]'
                    : 'text-[#14532D]/60 hover:bg-[#DCFCE7]/70 hover:text-[#14532D]'
                )}
              >
                <span
                  className="h-3 w-3 rounded-full shrink-0 shadow-sm"
                  style={{ background: c.cover_color }}
                />
                <span className="truncate">{c.name}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <div className="border-t border-[#22C55E]/25 p-4">
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-base font-medium text-[#14532D]/70 hover:bg-red-50 hover:text-red-600 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {t('nav.sign_out')}
          </button>
        </form>
      </div>
      </aside>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed left-1 top-1 z-50 md:hidden rounded-md bg-sidebar px-2 py-1 text-sidebar-foreground shadow-md"
        onClick={() => setMobileOpen(true)}
        aria-label={t('nav.open_menu')}
      >
        <MoreHorizontal className="h-4 w-4" />
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
