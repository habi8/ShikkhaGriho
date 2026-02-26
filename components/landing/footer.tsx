'use client'

import { Logo } from '@/components/logo'
import { Mail, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-[#E2E8F0] bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:items-start sm:gap-6">

          {/* Left: Get in Touch */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-bold text-[#2E8B57] mb-4 sm:text-xl sm:mb-5">{t('landing.footer.get_in_touch')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-center gap-3 text-sm text-[#475569] sm:justify-start">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F4EA] text-[#2E8B57] shrink-0">
                  <Mail className="h-4 w-4" />
                </span>
                {t('landing.footer.email')}
              </li>
              <li className="flex items-center justify-center gap-3 text-sm text-[#475569] sm:justify-start">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F4EA] text-[#2E8B57] shrink-0">
                  <Phone className="h-4 w-4" />
                </span>
                {t('landing.footer.phone')}
              </li>
            </ul>
          </div>

          {/* Center: Logo */}
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Logo size={48} textColor="#2E8B57" />
            <p className="text-sm text-[#475569] font-medium mt-1">{t('landing.footer.tagline')}</p>
          </div>

        </div>

        <div className="mt-10 border-t border-[#E2E8F0] pt-6 text-center text-xs text-[#94A3B8]">
          {t('landing.footer.copyright', { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  )
}
