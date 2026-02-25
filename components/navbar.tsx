import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/lib/actions/auth'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.user_metadata?.role as string | undefined

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo size={72} />
        <div className="flex items-center gap-6">
          {/* Language toggle */}
          <div className="hidden sm:inline-flex items-center gap-0 rounded-lg border border-[#E2E8F0] overflow-hidden text-sm font-semibold h-9 shrink-0">
            <button className="px-3 py-1.5 bg-[#2E8B57] text-white hover:bg-[#228B22] transition-colors h-full">
              EN
            </button>
            <span className="px-1 text-[#CBD5E1] bg-white h-full flex items-center">|</span>
            <button className="px-3 py-1.5 text-[#475569] bg-white hover:bg-[#F1F5F9] transition-colors h-full">
              BN
            </button>
          </div>

          {user ? (
            <>
              <Link href={role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'}
                className="text-base font-medium text-[#0F172A] hover:text-[#2E8B57] transition-colors">
                Dashboard
              </Link>
              <form action={signOut}>
                <button type="submit" className="text-base font-medium text-[#0F172A] hover:text-[#2E8B57] transition-colors">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="#about" className="text-base font-medium text-[#0F172A] hover:text-[#2E8B57] transition-colors">About</Link>
              <Link href="#reviews" className="text-base font-medium text-[#0F172A] hover:text-[#2E8B57] transition-colors">Reviews</Link>
              <Link href="/auth/login" className="text-base font-medium text-[#0F172A] hover:text-[#2E8B57] transition-colors">Login</Link>
              <Link href="/auth/sign-up">
                <Button className="bg-[#2E8B57] hover:bg-[#228B22] text-white rounded-lg px-5 py-2 text-base font-semibold">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
