import { CheckCircle2 } from 'lucide-react'

export function CTA() {
  return (
    <section id="about" className="py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6">

        {/* Centered intro */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-[#1E3A8A] sm:text-4xl mb-6">About ShikkhaGriho</h2>
          <p className="text-base text-[#475569] leading-relaxed">
            <span className="font-semibold text-[#0F172A]">ShikkhaGriho</span> is a structured digital classroom
            platform designed for <span className="font-semibold text-[#0F172A]">modern education</span>. Inspired
            by the meaning <span className="font-semibold text-[#0F172A]">&ldquo;Home of Education&rdquo;</span>, it
            creates a reliable and organized digital learning space built for Bangladesh&apos;s evolving education system.
          </p>
        </div>

        {/* Split card */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
            {/* Left */}
            <div className="p-8 md:p-10">
              <h3 className="text-xl font-bold text-[#1E3A8A] mb-4">About ShikkhaGriho</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                <span className="font-semibold text-[#0F172A]">ShikkhaGriho</span> is a structured digital classroom
                platform designed for <span className="font-semibold text-[#0F172A]">modern education</span>.
                Inspired by the meaning <span className="font-semibold text-[#0F172A]">&ldquo;Home of Education&rdquo;</span>,
                it creates a reliable, and organized digital learning space &mdash; built for Bangladesh&apos;s evolving education system.
              </p>
            </div>

            {/* Right */}
            <div className="p-8 md:p-10">
              <h3 className="text-xl font-bold text-[#1E3A8A] mb-6">Mission</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#22C55E] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#475569] leading-relaxed">
                    To <span className="font-semibold text-[#0F172A]">simplify digital education</span> by providing
                    an accessible, organized, and secure classroom platform
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#22C55E] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#475569] leading-relaxed">
                    To build the <span className="font-semibold text-[#0F172A]">most trusted digital learning
                    environment in Bangladesh</span> where every classroom has a digital home.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
