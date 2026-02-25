import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left: text */}
          <div className="flex-1 text-left">
            <div className="inline-flex items-center rounded-full bg-[#2E8B57] px-4 py-1.5 text-sm font-semibold text-white mb-6">
              Transforming Education in Bangladesh
            </div>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-[#1E293B] sm:text-6xl text-balance">
              Empowering Digital<br />Classrooms
            </h1>
            <p className="mt-5 text-lg text-[#475569] leading-relaxed max-w-[480px]">
              A smarter way to manage, teach, and learn online,
              designed for the modern classroom in Bangladesh.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/auth/sign-up">
                <Button className="bg-[#2E8B57] hover:bg-[#228B22] text-white rounded-lg px-7 py-3 text-base font-semibold h-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="border-[#2E8B57] text-[#2E8B57] hover:bg-[#2E8B57]/5 rounded-lg px-7 py-3 text-base font-semibold h-auto"
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
