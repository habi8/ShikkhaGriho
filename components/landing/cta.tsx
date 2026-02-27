'use client'

import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function CTA() {
  const { t } = useTranslation()

  return (
    <section id="about" className="relative mt-10 py-16 sm:mt-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Our Story */}
        <div className="rounded-3xl bg-gradient-to-br from-[#F0FDF4] via-white to-[#F8FAFC] px-6 py-12 text-center sm:px-10 sm:py-14 fade-in-up">
          <h2 className="text-3xl font-bold text-[#1E293B] sm:text-5xl fade-in-up" style={{ ['--fade-delay' as any]: '80ms' }}>
            {t('landing.cta.story_title')}
          </h2>
          <p className="mx-auto mt-6 max-w-[680px] text-base text-[#475569] leading-relaxed sm:text-lg fade-in-up" style={{ ['--fade-delay' as any]: '150ms' }}>
            {t('landing.cta.story_body_1')}
          </p>
          <p className="mx-auto mt-4 max-w-[680px] text-base text-[#475569] leading-relaxed sm:text-lg fade-in-up" style={{ ['--fade-delay' as any]: '210ms' }}>
            {t('landing.cta.story_body_2')}
          </p>
        </div>

        {/* Two-column cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div
            className="rounded-2xl bg-white p-6 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.35)] sm:p-8 fade-in-up"
            style={{ ['--fade-delay' as any]: '120ms' }}
          >
            <h3 className="text-xl font-bold text-[#2E8B57] sm:text-2xl">{t('landing.cta.offer_title')}</h3>
            <p className="mt-4 text-base text-[#475569] leading-relaxed sm:text-lg">
              {t('landing.cta.offer_body')}
            </p>
          </div>

          <div
            className="rounded-2xl bg-white p-6 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.35)] sm:p-8 fade-in-up"
            style={{ ['--fade-delay' as any]: '200ms' }}
          >
            <h3 className="text-xl font-bold text-[#2E8B57] sm:text-2xl">{t('landing.cta.mission_title')}</h3>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-6 w-6 text-[#22C55E] shrink-0" />
                <p className="text-base text-[#475569] leading-relaxed sm:text-lg">
                  {t('landing.cta.mission_item_1')}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-6 w-6 text-[#22C55E] shrink-0" />
                <p className="text-base text-[#475569] leading-relaxed sm:text-lg">
                  {t('landing.cta.mission_item_2')}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
