'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useActionState } from 'react'
import { signUp } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2, GraduationCap, School } from 'lucide-react'

const initialState = { error: null as string | null }

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: any, formData: FormData) => {
      const result = await signUp(formData)
      return result ?? { error: null }
    },
    initialState,
  )

  return (
    <main
      className="flex min-h-screen items-center justify-center p-4 py-10"
      style={{ background: 'linear-gradient(135deg, oklch(0.22 0.06 255) 0%, oklch(0.29 0.08 255) 60%, oklch(0.32 0.09 220) 100%)' }}
    >
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
            <p className="text-base text-white/70 mt-1">শিক্ষা গৃহ — Join your classroom today</p>
          </div>
        </div>

        <Card className="border-0 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4 pt-6 px-7">
            <CardTitle className="text-2xl font-bold text-foreground">Create an account</CardTitle>
            <CardDescription className="text-base text-muted-foreground">Fill in the details below to get started</CardDescription>
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
                <Label htmlFor="full_name" className="text-sm font-semibold text-foreground">Full name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                  className="h-11 text-base rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="h-11 text-base rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-11 text-base rounded-lg"
                />
              </div>

              {/* Role selection */}
              <fieldset className="space-y-2.5">
                <legend className="text-sm font-semibold text-foreground">I am a...</legend>
                <div className="grid grid-cols-2 gap-3">
                  <label className="relative flex cursor-pointer flex-col items-center gap-2.5 rounded-xl border-2 border-border p-4 hover:border-primary transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:shadow-sm">
                    <input type="radio" name="role" value="student" className="sr-only" defaultChecked />
                    <GraduationCap className="h-7 w-7 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Student</span>
                  </label>
                  <label className="relative flex cursor-pointer flex-col items-center gap-2.5 rounded-xl border-2 border-border p-4 hover:border-primary transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:shadow-sm">
                    <input type="radio" name="role" value="teacher" className="sr-only" />
                    <School className="h-7 w-7 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Teacher</span>
                  </label>
                </div>
              </fieldset>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 px-7 pb-7">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 text-base font-semibold rounded-lg shadow-md"
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
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary font-semibold hover:underline">
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
