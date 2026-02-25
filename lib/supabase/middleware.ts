import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (err: unknown) {
    // Stale/invalid refresh token — clear all auth cookies and redirect to login
    const isAuthError =
      err !== null &&
      typeof err === 'object' &&
      '__isAuthError' in err &&
      (err as { __isAuthError: boolean }).__isAuthError === true

    if (isAuthError) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/auth/login'
      const redirectResponse = NextResponse.redirect(loginUrl)
      // Delete all Supabase auth cookies so the bad tokens are cleared
      request.cookies.getAll().forEach(({ name }) => {
        if (name.startsWith('sb-')) {
          redirectResponse.cookies.delete(name)
        }
      })
      return redirectResponse
    }
  }

  const protectedPaths = ['/teacher-dashboard', '/student-dashboard', '/classroom', '/notifications', '/profile']
  const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
