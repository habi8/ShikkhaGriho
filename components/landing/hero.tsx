'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left: text */}
          <div className="flex-1 text-center lg:text-left">
            <div
              className="inline-flex items-center rounded-full bg-[#2E8B57] px-4 py-1.5 text-xs font-semibold text-white mb-6 sm:text-sm mx-auto lg:mx-0 fade-in-up"
              style={{ ['--fade-delay' as any]: '40ms' }}
            >
              {t('landing.hero.badge')}
            </div>
            <h1
              className="text-4xl font-extrabold leading-tight tracking-tight text-[#1E293B] sm:text-5xl lg:text-6xl text-balance fade-in-up"
              style={{ ['--fade-delay' as any]: '110ms' }}
            >
              {t('landing.hero.title_line1')}
              <br />
              {t('landing.hero.title_line2')}
            </h1>
            <p
              className="mt-5 text-base text-[#475569] leading-relaxed max-w-[520px] mx-auto lg:mx-0 sm:text-lg fade-in-up"
              style={{ ['--fade-delay' as any]: '180ms' }}
            >
              {t('landing.hero.subtitle')}
            </p>
            <div
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start fade-in-up"
              style={{ ['--fade-delay' as any]: '240ms' }}
            >
              <Link href="/auth/sign-up">
                <Button className="bg-[#2E8B57] hover:bg-[#228B22] text-white rounded-lg px-7 py-3 text-base font-semibold h-auto w-full sm:w-auto">
                  {t('common.get_started')}
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="border-[#2E8B57] text-[#2E8B57] hover:bg-[#2E8B57]/5 rounded-lg px-7 py-3 text-base font-semibold h-auto w-full sm:w-auto"
                >
                  {t('common.login')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: product mockup */}
          <div
            className="flex-1 flex items-center justify-center fade-in-up"
            style={{ ['--fade-delay' as any]: '280ms' }}
          >
            <div className="relative w-full max-w-2xl">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-[#22C55E]/15 via-white to-[#2E8B57]/10 soft-gradient-move" />
              <div className="relative flex flex-row flex-nowrap items-center justify-center gap-4 sm:items-start sm:gap-6">
                {/* Desktop mockup */}
                <div className="relative w-[min(62vw,520px)] sm:w-[min(65vw,640px)] rounded-3xl border border-[#E2E8F0] bg-white/90 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
                    </div>
                    <div className="text-xs font-semibold text-[#64748B]">{t('landing.hero.dashboard_title')}</div>
                    <div className="h-6 w-6 rounded-full bg-[#F1F5F9]" />
                  </div>

                  <div className="grid grid-cols-[150px_1fr] gap-4 p-4 sm:grid-cols-[170px_1fr]">
                    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <p className="text-xs font-semibold text-[#2E8B57]">{t('landing.hero.nav_title')}</p>
                      <div className="mt-3 space-y-2 text-xs text-[#64748B]">
                        <div className="rounded-lg bg-white px-2 py-1">{t('landing.hero.nav.overview')}</div>
                        <div className="rounded-lg bg-white px-2 py-1">{t('landing.hero.nav.classrooms')}</div>
                        <div className="rounded-lg bg-[#DCFCE7] px-2 py-1 font-semibold text-[#166534]">{t('landing.hero.nav.attendance')}</div>
                        <div className="rounded-lg bg-white px-2 py-1">{t('landing.hero.nav.assignments')}</div>
                        <div className="rounded-lg bg-white px-2 py-1">{t('landing.hero.nav.members')}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-3">
                        <p className="text-xs font-semibold text-[#0F172A]">{t('landing.hero.classroom_title')}</p>
                        <p className="mt-1 text-xs text-[#64748B]">{t('landing.hero.classroom_subtitle')}</p>
                      </div>
                      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-3">
                        <p className="text-xs font-semibold text-[#0F172A]">{t('landing.hero.announcement_title')}</p>
                        <p className="mt-2 text-xs text-[#64748B]">
                          {t('landing.hero.announcement_body')}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[#22C55E]/40 bg-[#F0FDF4] p-3 attendance-glow">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-[#166534]">{t('landing.hero.attendance_title')}</p>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[#22C55E]">
                            {t('common.open')}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] text-[#166534]">
                          <div className="rounded-md bg-white px-2 py-1 text-center">{t('landing.hero.attendance.present', { count: 24 })}</div>
                          <div className="rounded-md bg-white px-2 py-1 text-center">{t('landing.hero.attendance.late', { count: 2 })}</div>
                          <div className="rounded-md bg-white px-2 py-1 text-center">{t('landing.hero.attendance.absent', { count: 1 })}</div>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-3">
                        <p className="text-xs font-semibold text-[#0F172A]">{t('landing.hero.invite_title')}</p>
                        <div className="mt-2 flex items-center justify-between rounded-lg border border-[#E2E8F0] px-2 py-1 text-[10px] text-[#64748B]">
                          <span>{t('landing.hero.class_code')}</span>
                          <span className="font-semibold text-[#2E8B57]">{t('landing.hero.sample_code')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile mockup */}
                <div className="relative mx-auto w-[min(28vw,220px)] shrink-0 rounded-[2rem] border border-[#E2E8F0] bg-white shadow-[0_16px_40px_-24px_rgba(15,23,42,0.5)] sm:mt-8 sm:w-[220px]">
                  <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#E2E8F0]" />
                  <div className="space-y-3 p-4">
                    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <p className="text-xs font-semibold text-[#2E8B57]">{t('landing.hero.attendance_title')}</p>
                      <p className="mt-1 text-[10px] text-[#64748B]">{t('landing.hero.attendance_today')}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-3 py-2">
                        <span className="text-xs font-semibold text-[#0F172A]">{t('landing.hero.sample_student_1')}</span>
                        <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-semibold text-[#166534]">
                          {t('common.present')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-3 py-2">
                        <span className="text-xs font-semibold text-[#0F172A]">{t('landing.hero.sample_student_2')}</span>
                        <span className="text-[10px] text-[#94A3B8]">{t('common.pending')}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-3 py-2">
                        <span className="text-xs font-semibold text-[#0F172A]">{t('landing.hero.sample_student_3')}</span>
                        <span className="text-[10px] text-[#94A3B8]">{t('common.pending')}</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#22C55E]/30 bg-[#F0FDF4] px-3 py-2 text-[11px] font-semibold text-[#166534]">
                      {t('landing.hero.present_notice')}
                    </div>
                  </div>

                  {/* Floating UI elements */}
                  <div className="absolute -left-6 top-10 rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-[#166534] shadow-md present-badge">
                    {t('common.present')}
                  </div>
                  <div className="absolute -right-4 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#22C55E] text-xs font-bold text-white shadow-md notif-bounce">
                    1
                  </div>
                  <div className="absolute -bottom-5 right-8 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md">
                    <span className="h-4 w-5 rounded-md border border-[#2E8B57] text-[10px] font-semibold text-[#2E8B57] leading-4 text-center">
                      {t('landing.hero.msg_short')}
                    </span>
                  </div>
                  <div className="absolute -bottom-8 left-8 h-14 w-14 rounded-full bg-[#22C55E]/20 blur-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
