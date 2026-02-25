import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 sm:py-28">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
          <BookOpen className="h-4 w-4" />
          Built for Bangladesh
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
          Your classroom,{' '}
          <span className="text-accent">reimagined</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/75 leading-relaxed text-pretty">
          ShikkhaGriho brings teachers and students together in a simple, powerful platform —
          share announcements, track attendance, and manage classrooms with ease.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 px-8">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white px-8"
            >
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
