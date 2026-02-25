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

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [role, setRole] = useState<'student' | 'teacher'>('student')

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
      setError(signUpError.message)
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
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="rounded-2xl bg-white p-4 shadow-xl" style={{ border: '2px solid #E2E8F0' }}>
            <Image
              src="/images/logo.png"
              alt="ShikkhaGriho"
              width={110}
              height={110}
              className="object-contain"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#1E3A8A' }}>ShikkhaGriho</h1>
            <p className="text-base mt-1 font-medium" style={{ color: '#475569' }}>শিক্ষা গৃহ — Join your classroom today</p>
          </div>
        </div>

        <Card className="border-0 shadow-2xl rounded-2xl bg-white/95">
          <CardHeader className="pb-4 pt-7 px-8">
            <CardTitle className="text-3xl font-extrabold text-foreground">Create an account</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-1">Fill in the details below to get started</CardDescription>
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
                <Label htmlFor="full_name" className="text-base font-semibold text-foreground">Full name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                  className="h-12 text-base rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold text-foreground">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="h-12 text-base rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold text-foreground">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-12 text-base rounded-xl"
                />
              </div>

              {/* Role selection */}
              <fieldset className="space-y-2.5">
                <legend className="text-base font-semibold text-foreground">I am a...</legend>
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
                    <span className="text-base font-semibold text-foreground">Student</span>
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
                    <span className="text-base font-semibold text-foreground">Teacher</span>
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
                    Creating account…
                  </span>
                ) : (
                  'Create account'
                )}
              </Button>
              <p className="text-base text-muted-foreground text-center">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-accent font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}
