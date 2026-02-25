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
        <Logo size={40} />
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link href={role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'}
                className="text-base font-medium text-[#0F172A] hover:text-[#1E3A8A] transition-colors">
                Dashboard
              </Link>
              <form action={signOut}>
                <button type="submit" className="text-base font-medium text-[#0F172A] hover:text-[#1E3A8A] transition-colors">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="#about" className="text-base font-medium text-[#0F172A] hover:text-[#1E3A8A] transition-colors">About</Link>
              <Link href="#features" className="text-base font-medium text-[#0F172A] hover:text-[#1E3A8A] transition-colors">Features</Link>
              <Link href="/auth/login" className="text-base font-medium text-[#0F172A] hover:text-[#1E3A8A] transition-colors">Login</Link>
              <Link href="/auth/sign-up">
                <Button className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white rounded-lg px-5 py-2 text-base font-semibold">
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
