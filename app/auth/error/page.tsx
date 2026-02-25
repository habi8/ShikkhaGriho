import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface AuthErrorPageProps {
  searchParams: Promise<{ message?: string }>
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const { message } = await searchParams
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
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
                {message ?? 'An unexpected error occurred. Please try again.'}
              </p>
            </div>
            <div className="flex w-full flex-col gap-2">
              <Link href="/auth/login" className="w-full">
                <Button className="w-full">Try again</Button>
              </Link>
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full">Go home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
