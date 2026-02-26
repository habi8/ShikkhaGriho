import { createClient } from '@/lib/supabase/server'
import { NavbarClient } from '@/components/navbar-client'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.user_metadata?.role as string | undefined

  return <NavbarClient isAuthenticated={!!user} role={role} />
}
