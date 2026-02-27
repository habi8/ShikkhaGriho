'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { LanguageToggle } from '@/components/language-toggle'
import { signOut } from '@/lib/actions/auth'

export function NavbarClient({
  isAuthenticated,
  role,
}: {
  isAuthenticated: boolean
  role?: string
}) {
  const { t } = useTranslation()
  const dashboardHref = role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'

  return (
    <header className="sticky top-0 z-50 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-3 sm:flex-row sm:justify-between sm:gap-6">
        <Logo size={52} />
        <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end sm:gap-6">
          <div className="inline-flex">
            <LanguageToggle />
          </div>

          {isAuthenticated ? (
            <>
              <Link
                href={dashboardHref}
                className="text-sm font-medium text-[#0F172A] hover:text-[#2E8B57] transition-colors sm:text-base"
              >
                {t('nav.dashboard')}
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm font-medium text-[#0F172A] hover:text-[#2E8B57] transition-colors sm:text-base cursor-pointer"
                >
                  {t('nav.sign_out')}
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="#about" className="text-sm font-medium text-[#0F172A] hover:text-[#2E8B57] transition-colors sm:text-base">
                {t('nav.about')}
              </Link>
              <Link href="#reviews" className="text-sm font-medium text-[#0F172A] hover:text-[#2E8B57] transition-colors sm:text-base">
                {t('nav.reviews')}
              </Link>
              <Link href="/auth/login" className="text-sm font-medium text-[#0F172A] hover:text-[#2E8B57] transition-colors sm:text-base">
                {t('nav.login')}
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-[#2E8B57] hover:bg-[#228B22] text-white rounded-lg px-4 py-2 text-sm font-semibold sm:px-5 sm:text-base">
                  {t('nav.get_started')}
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
