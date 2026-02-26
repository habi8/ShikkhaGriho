'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2, GraduationCap, School } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const { t } = useTranslation()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string
    const password = form.get('password') as string
    const full_name = form.get('full_name') as string

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, role },
      },
    })

    if (signUpError) {
      setError(t('errors.signup_failed'))
      setIsPending(false)
      return
    }

    router.push('/auth/sign-up-success')
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center p-4 py-10"
      style={{ background: '#F8FAFC' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-4 fade-in-up">
          <div className="rounded-2xl bg-white p-4 shadow-xl" style={{ border: '2px solid #E2E8F0' }}>
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
            <p className="text-base mt-1 font-medium" style={{ color: '#475569' }}>{t('auth.signup.tagline')}</p>
          </div>
        </div>

        <Card className="border-0 shadow-2xl rounded-2xl bg-white/95" style={{ ['--fade-delay' as any]: '120ms' }}>
          <CardHeader className="pb-4 pt-7 px-8">
            <CardTitle className="text-3xl font-extrabold text-foreground">{t('auth.signup.title')}</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-1">{t('auth.signup.subtitle')}</CardDescription>
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
                <Label htmlFor="full_name" className="text-base font-semibold text-foreground">{t('auth.fields.full_name')}</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder={t('auth.placeholders.full_name')}
                  required
                  autoComplete="name"
                  className="h-12 text-base rounded-xl"
                />
              </div>
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
                  placeholder={t('auth.placeholders.password_length')}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-12 text-base rounded-xl"
                />
              </div>

              {/* Role selection */}
              <fieldset className="space-y-2.5">
                <legend className="text-base font-semibold text-foreground">{t('auth.signup.role_label')}</legend>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`relative flex cursor-pointer flex-col items-center gap-2.5 rounded-xl border-2 p-4 transition-all ${
                      role === 'student' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      className="sr-only"
                      checked={role === 'student'}
                      onChange={() => setRole('student')}
                    />
                    <GraduationCap className="h-7 w-7 text-primary" />
                    <span className="text-base font-semibold text-foreground">{t('roles.student')}</span>
                  </label>
                  <label
                    className={`relative flex cursor-pointer flex-col items-center gap-2.5 rounded-xl border-2 p-4 transition-all ${
                      role === 'teacher' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="teacher"
                      className="sr-only"
                      checked={role === 'teacher'}
                      onChange={() => setRole('teacher')}
                    />
                    <School className="h-7 w-7 text-primary" />
                    <span className="text-base font-semibold text-foreground">{t('roles.teacher')}</span>
                  </label>
                </div>
              </fieldset>
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
                    {t('auth.signup.creating')}
                  </span>
                ) : (
                  t('auth.signup.create_account')
                )}
              </Button>
              <p className="text-base text-muted-foreground text-center">
                {t('auth.signup.have_account')}{' '}
                <Link href="/auth/login" className="text-accent font-bold hover:underline">
                  {t('auth.signup.sign_in')}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}
