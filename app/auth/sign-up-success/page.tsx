'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MailCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function SignUpSuccessPage() {
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
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
              <MailCheck className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('auth.signup_success.title')}</h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
                {t('auth.signup_success.body')}
              </p>
            </div>
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full">
                {t('auth.signup_success.back_to_signin')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
