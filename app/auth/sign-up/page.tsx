import Link from 'next/link'
import Image from 'next/image'
import { signUp } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="ShikkhaGriho"
            width={64}
            height={64}
            className="object-contain"
            priority
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Create an account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join ShikkhaGriho today</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign up</CardTitle>
            <CardDescription>Fill in the details below to get started</CardDescription>
          </CardHeader>
          <form action={signUp}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              {/* Role selection */}
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-foreground">I am a...</legend>
                <div className="grid grid-cols-2 gap-3">
                  <label className="relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-border p-4 hover:border-primary transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input type="radio" name="role" value="student" className="sr-only" defaultChecked />
                    <span className="text-2xl" aria-hidden>🎓</span>
                    <span className="text-sm font-medium">Student</span>
                  </label>
                  <label className="relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-border p-4 hover:border-primary transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input type="radio" name="role" value="teacher" className="sr-only" />
                    <span className="text-2xl" aria-hidden>👩‍🏫</span>
                    <span className="text-sm font-medium">Teacher</span>
                  </label>
                </div>
              </fieldset>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full">
                Create account
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary font-medium hover:underline">
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
