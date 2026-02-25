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

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

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
      setError(signInError.message)
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
      style={{ background: 'linear-gradient(160deg, #e8f5e9 0%, #c8e6c9 50%, #dcedc8 100%)' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="rounded-2xl bg-white/70 p-4 backdrop-blur-sm ring-1 ring-green-200 shadow-lg">
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
            <h1 className="text-4xl font-extrabold text-green-900 tracking-tight">ShikkhaGriho</h1>
            <p className="text-base text-green-700/80 mt-1 font-medium">শিক্ষা গৃহ — Your Classroom, Your Way</p>
          </div>
        </div>

        <Card className="border-0 shadow-2xl rounded-2xl bg-white/95">
          <CardHeader className="pb-4 pt-7 px-8">
            <CardTitle className="text-3xl font-extrabold text-foreground">Welcome back</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-1">Sign in to your account to continue</CardDescription>
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
                  placeholder="••••••••"
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
                    Signing in…
                  </span>
                ) : (
                  'Sign in'
                )}
              </Button>
              <p className="text-base text-muted-foreground text-center">
                Don&apos;t have an account?{' '}
                <Link href="/auth/sign-up" className="text-primary font-bold hover:underline">
                  Create one
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}
