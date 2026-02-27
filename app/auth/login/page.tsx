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
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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

    const role = data.user?.user_metadata?.role as 'teacher' | 'student' | undefined
    const userId = data.user?.id

    let needsAvatar = false
    if (userId && !data.user?.user_metadata?.avatar_onboarded) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .maybeSingle()
      needsAvatar = !profile?.avatar_url
    }

    if (needsAvatar) {
      router.push('/auth/avatar-setup')
      router.refresh()
      return
    }

    const dest = role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'
    router.push(dest)
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-4 fade-in-up">
          <Link
            href="/"
            className="rounded-2xl bg-white p-3 ring-2 shadow-xl inline-flex"
            style={{ ringColor: '#E2E8F0', border: '2px solid #E2E8F0' }}
            aria-label={t('nav.home')}
          >
            <Image
              src="/images/logo.png"
              alt={t('logo.alt')}
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#2E8B57' }}>{t('brand.name')}</h1>
            <p className="text-sm mt-1 font-medium" style={{ color: '#475569' }}>{t('auth.login.tagline')}</p>
          </div>
        </div>

        <Card className="border-0 shadow-2xl rounded-2xl bg-white/95" style={{ ['--fade-delay' as any]: '120ms' }}>
          <CardHeader className="pb-3 pt-6 px-6">
            <CardTitle className="text-2xl font-extrabold text-foreground">{t('auth.login.title')}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">{t('auth.login.subtitle')}</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 px-6">
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
                  className="h-10 text-base rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold text-foreground">{t('auth.fields.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.placeholders.password')}
                    required
                    autoComplete="current-password"
                    className="h-10 text-base rounded-xl pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? t('auth.password_hide') : t('auth.password_show')}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 px-6 pb-6 pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-10 text-base font-bold rounded-xl"
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
              <p className="text-sm text-muted-foreground text-center">
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
