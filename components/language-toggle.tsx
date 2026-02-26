'use client'

import i18n from '@/lib/i18n'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export function LanguageToggle({ className }: { className?: string }) {
  const { t } = useTranslation()
  const current = i18n.language || 'en'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0 rounded-lg border border-[#E2E8F0] overflow-hidden text-sm font-semibold h-9 shrink-0',
        className,
      )}
      role="group"
      aria-label={t('language.switcher_label')}
    >
      <button
        type="button"
        onClick={() => i18n.changeLanguage('en')}
        className={cn(
          'px-3 py-1.5 transition-colors h-full',
          current === 'en'
            ? 'bg-[#2E8B57] text-white hover:bg-[#228B22]'
            : 'text-[#475569] bg-white hover:bg-[#F1F5F9]',
        )}
      >
        {t('language.english')}
      </button>
      <span className="px-1 text-[#CBD5E1] bg-white h-full flex items-center" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        onClick={() => i18n.changeLanguage('bn')}
        className={cn(
          'px-3 py-1.5 transition-colors h-full',
          current === 'bn'
            ? 'bg-[#2E8B57] text-white hover:bg-[#228B22]'
            : 'text-[#475569] bg-white hover:bg-[#F1F5F9]',
        )}
      >
        {t('language.bangla')}
      </button>
    </div>
  )
}
