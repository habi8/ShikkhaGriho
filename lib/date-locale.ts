import { bn, enUS } from 'date-fns/locale'

export function getDateLocale(language: string) {
  return language === 'bn' ? bn : enUS
}
