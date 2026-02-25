import { Logo } from '@/components/logo'
import { Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:items-start">

          {/* Left: Get in Touch */}
          <div>
            <h4 className="text-xl font-bold text-[#2E8B57] mb-5">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-[#475569]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F4EA] text-[#2E8B57] shrink-0">
                  <Mail className="h-4 w-4" />
                </span>
                support@shikkhagriho.com
              </li>
              <li className="flex items-center gap-3 text-sm text-[#475569]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F4EA] text-[#2E8B57] shrink-0">
                  <Phone className="h-4 w-4" />
                </span>
                +830-1234-567990
              </li>
            </ul>
          </div>

          {/* Center: Logo */}
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Logo size={48} textColor="#2E8B57" />
            <p className="text-sm text-[#475569] font-medium mt-1">Your Digital Classrooms</p>
          </div>

        </div>

        <div className="mt-10 border-t border-[#E2E8F0] pt-6 text-center text-xs text-[#94A3B8]">
          &copy; {new Date().getFullYear()} ShikkhaGriho. Built for Bangladesh.
        </div>
      </div>
    </footer>
  )
}
