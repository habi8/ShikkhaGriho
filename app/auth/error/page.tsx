'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function AuthErrorPage() {
  const { t } = useTranslation()
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/logo.png"
            alt={t('logo.alt')}
            width={56}
            height={56}
            className="object-contain"
          />
        </div>

        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('auth.error.title')}</h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
                {t('auth.error.default_message')}
              </p>
            </div>
            <div className="flex w-full flex-col gap-2">
              <Link href="/auth/login" className="w-full">
                <Button className="w-full">{t('common.try_again')}</Button>
              </Link>
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full">{t('common.go_home')}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
