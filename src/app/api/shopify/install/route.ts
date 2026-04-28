import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL))
    }

    const shopParam = request.nextUrl.searchParams.get('shop')
    const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64')
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/shopify/callback`
    const shopifyHost = (shopParam || process.env.SHOPIFY_HOST || 'myshopify.com').replace(/^https?:\/\//, '')

    const installUrl = `https://${shopifyHost}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${process.env.SHOPIFY_SCOPES}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`

    return NextResponse.redirect(installUrl)
  } catch (error) {
    console.error('Shopify install error:', error)
    return NextResponse.redirect(new URL('/settings?shopify_error=Failed to initiate OAuth', process.env.NEXT_PUBLIC_BASE_URL))
  }
}