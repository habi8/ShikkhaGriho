import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="bg-[#F8FAFC] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left: text */}
          <div className="flex-1 text-left">
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-[#1E3A8A] sm:text-6xl text-balance">
              Your Digital<br />Classrooms
            </h1>
            <p className="mt-5 text-lg text-[#475569] leading-relaxed max-w-md">
              A smarter way to manage, teach, and learn online.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/auth/sign-up">
                <Button className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white rounded-lg px-7 py-3 text-base font-semibold h-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/5 rounded-lg px-7 py-3 text-base font-semibold h-auto"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: illustration */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute -inset-4 rounded-3xl bg-[#22C55E]/8" />
              <Image
                src="/images/classroom-illustration.jpg"
                alt="Teacher presenting to students in a digital classroom"
                width={560}
                height={420}
                className="relative rounded-2xl shadow-md object-cover w-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
