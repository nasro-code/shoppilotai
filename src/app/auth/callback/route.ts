import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    console.log('[Auth Callback] Code received, exchanging for session...')
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('[Auth Callback] Session exchange error:', error.message)
    } else {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      let targetUrl = `${origin}${next}`

      if (!isLocalEnv && forwardedHost) {
        targetUrl = `https://${forwardedHost}${next}`
      }

      console.log('[Auth Callback] Success! Redirecting to:', targetUrl)
      return NextResponse.redirect(targetUrl)
    }
  }

  console.error('[Auth Callback] No code found or exchange failed, returning to login')

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}
