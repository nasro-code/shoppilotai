import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';

const SHOPIFY_HOST = process.env.SHOPIFY_HOST || process.env.NEXT_PUBLIC_BASE_URL || '';

function verifyShopifyHmac(params: URLSearchParams, secret: string, hmac: string): boolean {
  const excludedParams = ['hmac', 'signature'];
  const map: string[] = [];

  params.forEach((value, key) => {
    if (!excludedParams.includes(key)) {
      map.push(`${key}=${value}`);
    }
  });

  const message = map.sort().join('&');
  const generatedHmac = crypto
    .createHmac('sha256', secret)
    .update(message, 'utf8')
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(generatedHmac),
    Buffer.from(hmac)
  );
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;

    const shop = searchParams.get('shop');
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const hmac = searchParams.get('hmac');

    const baseUrl = SHOPIFY_HOST || request.url;

    if (!shop || !code) {
      return NextResponse.redirect(new URL('/settings?shopify_error=Missing parameters', baseUrl));
    }

    // Validate shop domain format
    if (!/^[a-zA-Z0-9-]+\.myshopify\.com$/.test(shop)) {
      return NextResponse.redirect(new URL('/settings?shopify_error=Invalid shop domain', baseUrl));
    }

    // Verify HMAC signature (required for Shopify OAuth)
    if (!hmac) {
      console.error('HMAC parameter missing from Shopify callback');
      return NextResponse.redirect(new URL('/settings?shopify_error=Missing HMAC signature', baseUrl));
    }

    const secret = process.env.SHOPIFY_API_SECRET;
    if (!secret) {
      console.error('SHOPIFY_API_SECRET not configured');
      return NextResponse.redirect(new URL('/settings?shopify_error=Server configuration error', baseUrl));
    }

    if (!verifyShopifyHmac(searchParams, secret, hmac)) {
      console.error('HMAC verification failed for shop:', shop);
      return NextResponse.redirect(new URL('/settings?shopify_error=Invalid HMAC signature', baseUrl));
    }

    // Decode state to get user ID
    let userId: string | null = null;
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        userId = stateData.userId;
      } catch {
        // State parsing failed, continue without it
      }
    }

    // If no userId from state, try to get from auth session
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    }

    if (!userId) {
      return NextResponse.redirect(new URL('/settings?shopify_error=Unauthorized', baseUrl));
    }

    // Exchange code for access token
    const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token exchange error:', errorData);
      return NextResponse.redirect(
        new URL(`/settings?shopify_error=${encodeURIComponent(errorData.error || 'Token exchange failed')}`, baseUrl)
      );
    }

    const { access_token } = await response.json();

    // Get shop details for display name
    const shopResponse = await fetch(`https://${shop}/admin/api/2026-01/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': access_token,
        'Accept': 'application/json',
      },
    });

    let shopName = shop;
    let shopEmail = '';
    if (shopResponse.ok) {
      const shopData = await shopResponse.json();
      shopName = shopData.shop?.name || shop;
      shopEmail = shopData.shop?.email || '';
    }

    // Store in database
    const { error: insertError } = await supabase
      .from('stores')
      .upsert({
        user_id: userId,
        shop_domain: shop,
        access_token,
        shop_name: shopName,
        shop_email: shopEmail,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'shop_domain',
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.redirect(
        new URL(`/settings?shopify_error=${encodeURIComponent('Failed to save store connection')}`, baseUrl)
      );
    }

    // Success - redirect to settings with success message
    return NextResponse.redirect(new URL('/settings?shopify_connected=true', baseUrl));
  } catch (error) {
    console.error('Shopify callback error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.redirect(
      new URL(`/settings?shopify_error=${encodeURIComponent(errorMessage)}`, baseUrl)
    );
  }
}
