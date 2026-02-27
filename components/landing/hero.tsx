'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { Layers, LayoutGrid, MonitorSmartphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-[88vh] pt-10 pb-11 sm:pt-12 sm:pb-13 lg:pt-14 lg:pb-15">
      <div className="mx-auto flex max-w-6xl flex-col px-6">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-12">
          {/* Left: text */}
          <div className="flex-1 text-center lg:text-left">
            <div
              className="inline-flex items-center rounded-full bg-[#2E8B57] px-4 py-1.5 text-xs font-semibold text-white mb-6 sm:text-sm mx-auto lg:mx-0 fade-in-up"
              style={{ ['--fade-delay' as any]: '40ms' }}
            >
              {t('landing.hero.badge')}
            </div>
            <h1
              className="text-[40px] font-extrabold leading-tight tracking-tight text-[#1E293B] sm:text-[44px] lg:text-[52px] text-balance fade-in-up"
              style={{ ['--fade-delay' as any]: '110ms' }}
            >
              {t('landing.hero.title_line1')}
              <br />
              {t('landing.hero.title_line2')}
            </h1>
            <p
              className="mt-4 text-base text-[#475569] leading-relaxed max-w-[520px] mx-auto lg:mx-0 sm:text-lg fade-in-up"
              style={{ ['--fade-delay' as any]: '180ms' }}
            >
              {t('landing.hero.subtitle')}
            </p>
            <div
              className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start fade-in-up"
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
            className="flex-1 flex items-center justify-center fade-in-up lg:justify-end"
            style={{ ['--fade-delay' as any]: '280ms' }}
          >
            <div className="relative w-full max-w-2xl">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-[#22C55E]/15 via-white to-[#2E8B57]/10 soft-gradient-move" />
              <div className="relative flex flex-row flex-nowrap items-center justify-center gap-4 sm:items-start sm:gap-6 lg:scale-[0.97]">
                {/* Desktop mockup */}
                <div className="relative w-[min(62vw,520px)] sm:w-[min(65vw,640px)] rounded-3xl border-2 border-black bg-white/90 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
                  <div className="flex items-center justify-between bg-white/50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
                      <Logo size={20} href="/" textSizeClass="text-[10px]" textColor="#14532D" />
                      <span>{t('nav.dashboard')}</span>
                    </div>
                    <div className="h-6 w-6 rounded-full bg-[#F1F5F9]" />
                  </div>

                  <div className="grid grid-cols-[150px_1fr] gap-4 p-4 sm:grid-cols-[170px_1fr]">
                    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <p className="text-xs font-semibold text-[#2E8B57]">{t('landing.hero.nav_title')}</p>
                      <div className="mt-3 space-y-2 text-xs text-[#64748B]">
                        <div className="rounded-lg bg-white px-2 py-1">{t('landing.hero.nav.overview')}</div>
                        <div className="rounded-lg bg-white px-2 py-1 hero-tab-target-classrooms">{t('landing.hero.nav.classrooms')}</div>
                        <div className="rounded-lg bg-white px-2 py-1 hero-tab-target-attendance">{t('landing.hero.nav.attendance')}</div>
                        <div className="rounded-lg bg-white px-2 py-1">{t('landing.hero.nav.assignments')}</div>
                        <div className="rounded-lg bg-white px-2 py-1 hero-tab-target-members">{t('landing.hero.nav.members')}</div>
                      </div>
                    </div>

                    <div className="relative min-h-[270px] overflow-hidden sm:min-h-[290px]">
                      <div className="hero-tab-page hero-tab-page-attendance space-y-3">
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

                      <div className="hero-tab-page hero-tab-page-members space-y-3">
                        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-3 hero-panel-click">
                          <p className="text-xs font-semibold text-[#0F172A]">{t('landing.hero.classroom_title')}</p>
                          <p className="mt-1 text-xs text-[#64748B]">{t('landing.hero.classroom_subtitle')}</p>
                        </div>
                        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-3">
                          <p className="text-xs font-semibold text-[#0F172A]">{t('landing.hero.nav.members')}</p>
                          <p className="mt-1 text-xs text-[#64748B]">{t('landing.hero.classroom_subtitle')}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white px-3 py-2">
                            <span className="text-xs font-semibold text-[#0F172A]">{t('landing.hero.sample_student_1')}</span>
                            <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-semibold text-[#166534]">
                              {t('common.present')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white px-3 py-2">
                            <span className="text-xs font-semibold text-[#0F172A]">{t('landing.hero.sample_student_2')}</span>
                            <span className="text-[10px] text-[#94A3B8]">{t('common.pending')}</span>
                          </div>
                          <div className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white px-3 py-2">
                            <span className="text-xs font-semibold text-[#0F172A]">{t('landing.hero.sample_student_3')}</span>
                            <span className="text-[10px] text-[#94A3B8]">{t('common.pending')}</span>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#F0FDF4] p-3">
                          <p className="text-[11px] font-semibold text-[#166534]">{t('landing.hero.present_notice')}</p>
                        </div>
                      </div>

                      <div className="hero-tab-page hero-tab-page-classrooms space-y-3">
                        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-3">
                          <p className="text-xs font-semibold text-[#0F172A]">{t('landing.hero.nav.classrooms')}</p>
                          <p className="mt-1 text-xs text-[#64748B]">{t('landing.hero.classroom_subtitle')}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="rounded-2xl border border-[#E2E8F0] bg-white px-3 py-2">
                            <p className="text-xs font-semibold text-[#0F172A]">{t('landing.hero.sample_class_1')}</p>
                            <p className="text-[10px] text-[#64748B]">{t('landing.hero.sample_class_1_desc')}</p>
                          </div>
                          <div className="rounded-2xl border border-[#E2E8F0] bg-white px-3 py-2">
                            <p className="text-xs font-semibold text-[#0F172A]">{t('landing.hero.sample_class_2')}</p>
                            <p className="text-[10px] text-[#64748B]">{t('landing.hero.sample_class_2_desc')}</p>
                          </div>
                          <div className="rounded-2xl border border-[#E2E8F0] bg-white px-3 py-2">
                            <p className="text-xs font-semibold text-[#0F172A]">{t('landing.hero.sample_class_3')}</p>
                            <p className="text-[10px] text-[#64748B]">{t('landing.hero.sample_class_3_desc')}</p>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#F0FDF4] p-3">
                          <p className="text-[11px] font-semibold text-[#166534]">{t('landing.hero.present_notice')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile mockup */}
                <div className="relative mx-auto h-[360px] w-[min(32vw,200px)] shrink-0 rounded-[2rem] border-2 border-black bg-white shadow-[0_16px_40px_-24px_rgba(15,23,42,0.5)] sm:mt-8 sm:h-[400px] sm:w-[200px] overflow-hidden">
                  <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#E2E8F0]" />
                  <div className="space-y-3 p-3 sm:p-4">
                    <div className="flex items-center justify-center">
                      <Logo size={28} href="/" textSizeClass="text-[11px]" textColor="#14532D" />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-2 text-[9px] font-semibold text-[#64748B] sm:px-3 sm:text-[10px]">
                      <span className="truncate">{t('landing.hero.nav.overview')}</span>
                      <span className="truncate text-[#2E8B57]">{t('landing.hero.nav.attendance')}</span>
                      <span className="truncate">{t('landing.hero.nav.members')}</span>
                    </div>
                    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2 sm:p-3">
                      <p className="text-[11px] font-semibold text-[#2E8B57] sm:text-xs">{t('landing.hero.attendance_title')}</p>
                      <p className="mt-1 text-[9px] text-[#64748B] sm:text-[10px]">{t('landing.hero.attendance_today')}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-2.5 py-2 sm:px-3">
                        <span className="text-[11px] font-semibold text-[#0F172A] sm:text-xs">{t('landing.hero.sample_student_1')}</span>
                        <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[9px] font-semibold text-[#166534] sm:text-[10px]">
                          {t('common.present')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-2.5 py-2 sm:px-3">
                        <span className="text-[11px] font-semibold text-[#0F172A] sm:text-xs">{t('landing.hero.sample_student_2')}</span>
                        <span className="text-[9px] text-[#94A3B8] sm:text-[10px]">{t('common.pending')}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-2.5 py-2 sm:px-3">
                        <span className="text-[11px] font-semibold text-[#0F172A] sm:text-xs">{t('landing.hero.sample_student_3')}</span>
                        <span className="text-[9px] text-[#94A3B8] sm:text-[10px]">{t('common.pending')}</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#22C55E]/30 bg-[#F0FDF4] px-2.5 py-2 text-[10px] font-semibold text-[#166534] sm:px-3 sm:text-[11px]">
                      {t('landing.hero.present_notice')}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-9 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]/80 px-4 py-7 sm:mt-10 sm:px-6 fade-in-up" style={{ ['--fade-delay' as any]: '300ms' }}>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left fade-in-up" style={{ ['--fade-delay' as any]: '340ms' }}>
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-[#22C55E]/40 bg-white text-[#22C55E]">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <h3 className="text-[14px] font-bold text-[#0F172A] sm:text-[16px]">{t('landing.pillars.simple.title')}</h3>
              <p className="mt-1 text-[13px] text-[#64748B] sm:text-[14px]">
                {t('landing.pillars.simple.body')}
              </p>
            </div>
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left fade-in-up" style={{ ['--fade-delay' as any]: '380ms' }}>
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-[#22C55E]/40 bg-white text-[#22C55E]">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-[14px] font-bold text-[#0F172A] sm:text-[16px]">{t('landing.pillars.structured.title')}</h3>
              <p className="mt-1 text-[13px] text-[#64748B] sm:text-[14px]">
                {t('landing.pillars.structured.body')}
              </p>
            </div>
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left fade-in-up" style={{ ['--fade-delay' as any]: '420ms' }}>
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-[#22C55E]/40 bg-white text-[#22C55E]">
                <MonitorSmartphone className="h-5 w-5" />
              </div>
              <h3 className="text-[14px] font-bold text-[#0F172A] sm:text-[16px]">{t('landing.pillars.accessible.title')}</h3>
              <p className="mt-1 text-[13px] text-[#64748B] sm:text-[14px]">
                {t('landing.pillars.accessible.body')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
