import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="bg-primary py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl text-balance">
          Ready to transform your classroom?
        </h2>
        <p className="mt-4 text-white/75 leading-relaxed text-pretty max-w-xl mx-auto">
          Join thousands of teachers and students already using ShikkhaGriho to make
          learning more organized and effective.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/auth/sign-up">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 px-8"
            >
              Create your account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white px-8"
            >
              Already have an account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
