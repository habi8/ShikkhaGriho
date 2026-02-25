'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'

const initialState = { error: null as string | null }

export default function LoginPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(signIn, initialState)

  useEffect(() => {
    if (state?.redirectTo) {
      router.push(state.redirectTo)
    }
  }, [state, router])

  return (
    <main className="flex min-h-screen items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, oklch(0.22 0.06 255) 0%, oklch(0.29 0.08 255) 60%, oklch(0.32 0.09 220) 100%)' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/20 shadow-xl">
            <Image
              src="/images/logo.png"
              alt="ShikkhaGriho"
              width={100}
              height={100}
              className="object-contain"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">ShikkhaGriho</h1>
            <p className="text-base text-white/70 mt-1">শিক্ষা গৃহ — Your Classroom, Your Way</p>
          </div>
        </div>

        <Card className="border-0 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4 pt-6 px-7">
            <CardTitle className="text-2xl font-bold text-foreground">Welcome back</CardTitle>
            <CardDescription className="text-base text-muted-foreground">Sign in to your account to continue</CardDescription>
          </CardHeader>

          <form action={formAction}>
            <CardContent className="space-y-5 px-7">
              {state?.error && (
                <div className="flex items-center gap-2.5 rounded-lg bg-destructive/10 border border-destructive/20 p-3.5 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="h-11 text-base rounded-lg border-border/70 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="h-11 text-base rounded-lg border-border/70 focus-visible:ring-primary"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-7 pb-7">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
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
              <p className="text-sm text-muted-foreground text-center">
                Don&apos;t have an account?{' '}
                <Link href="/auth/sign-up" className="text-primary font-semibold hover:underline">
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
