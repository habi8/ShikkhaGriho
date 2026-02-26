'use client'

import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'

const LANGUAGE_STORAGE_KEY = 'sg_language'
const LANGUAGE_COOKIE_NAME = 'sg_lang'

export function I18nProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode
  initialLanguage?: string
}) {
  const safeInitial = initialLanguage === 'bn' || initialLanguage === 'en'
    ? initialLanguage
    : 'en'

  useEffect(() => {
    if (i18n.language !== safeInitial) {
      i18n.changeLanguage(safeInitial)
    }
  }, [safeInitial])

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored && stored !== i18n.language) {
      i18n.changeLanguage(stored)
    }
  }, [])

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const safeLng = lng === 'bn' || lng === 'en' ? lng : 'en'
      localStorage.setItem(LANGUAGE_STORAGE_KEY, safeLng)
      document.documentElement.lang = safeLng
      document.cookie = `${LANGUAGE_COOKIE_NAME}=${safeLng}; path=/; max-age=31536000`
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
