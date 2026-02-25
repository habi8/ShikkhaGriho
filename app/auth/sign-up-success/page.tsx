import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MailCheck } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/logo.png"
            alt="ShikkhaGriho"
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
              <h1 className="text-xl font-bold text-foreground">Check your email</h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
                We sent a confirmation link to your email address. Please click it to activate your account.
              </p>
            </div>
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full">
                Back to sign in
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
