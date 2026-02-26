'use client'

import { Library, Megaphone, Users, ClipboardCheck, Bell, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Features() {
  const { t } = useTranslation()
  const features = [
    {
      icon: <Library className="h-7 w-7" />,
      title: t('landing.features.items.management.title'),
      description: t('landing.features.items.management.description'),
    },
    {
      icon: <Megaphone className="h-7 w-7" />,
      title: t('landing.features.items.announcements.title'),
      description: t('landing.features.items.announcements.description'),
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: t('landing.features.items.members.title'),
      description: t('landing.features.items.members.description'),
    },
    {
      icon: <ClipboardCheck className="h-7 w-7" />,
      title: t('landing.features.items.attendance.title'),
      description: t('landing.features.items.attendance.description'),
    },
    {
      icon: <Bell className="h-7 w-7" />,
      title: t('landing.features.items.notifications.title'),
      description: t('landing.features.items.notifications.description'),
    },
    {
      icon: <Globe className="h-7 w-7" />,
      title: t('landing.features.items.language.title'),
      description: t('landing.features.items.language.description'),
    },
  ]

  return (
    <section id="features" className="py-20 sm:py-24 bg-[#F8FAFC]">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-[#2E8B57] sm:text-4xl mb-12 fade-in-up">
          {t('landing.features.title')}
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="rounded-xl border border-[#E2E8F0] bg-white p-6 hover:shadow-md transition-shadow fade-in-up"
              style={{ ['--fade-delay' as any]: `${60 + index * 70}ms` }}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E6F4EA] text-[#2E8B57] shrink-0">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-[#0F172A] leading-snug">{feature.title}</h3>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
