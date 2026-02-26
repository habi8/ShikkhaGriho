'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const { t } = useTranslation()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string
    const password = form.get('password') as string

    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(t('errors.login_failed'))
      setIsPending(false)
      return
    }

    const role = data.user?.user_metadata?.role
    const dest = role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'
    router.push(dest)
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4"
      style={{ background: '#F8FAFC' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-4 fade-in-up">
          <div className="rounded-2xl bg-white p-4 ring-2 shadow-xl" style={{ ringColor: '#E2E8F0', border: '2px solid #E2E8F0' }}>
            <Image
              src="/images/logo.png"
              alt={t('logo.alt')}
              width={110}
              height={110}
              className="object-contain"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#2E8B57' }}>{t('brand.name')}</h1>
            <p className="text-base mt-1 font-medium" style={{ color: '#475569' }}>{t('auth.login.tagline')}</p>
          </div>
        </div>

        <Card className="border-0 shadow-2xl rounded-2xl bg-white/95" style={{ ['--fade-delay' as any]: '120ms' }}>
          <CardHeader className="pb-4 pt-7 px-8">
            <CardTitle className="text-3xl font-extrabold text-foreground">{t('auth.login.title')}</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-1">{t('auth.login.subtitle')}</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 px-8">
              {error && (
                <div className="flex items-center gap-2.5 rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold text-foreground">{t('auth.fields.email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('auth.placeholders.email')}
                  required
                  autoComplete="email"
                  className="h-12 text-base rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold text-foreground">{t('auth.fields.password')}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t('auth.placeholders.password')}
                  required
                  autoComplete="current-password"
                  className="h-12 text-base rounded-xl"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-8 pb-8 pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 text-base font-bold rounded-xl"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('auth.login.signing_in')}
                  </span>
                ) : (
                  t('auth.login.sign_in')
                )}
              </Button>
              <p className="text-base text-muted-foreground text-center">
                {t('auth.login.no_account')}{' '}
                <Link href="/auth/sign-up" className="text-accent font-bold hover:underline">
                  {t('auth.login.create_one')}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}
