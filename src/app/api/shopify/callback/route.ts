import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import crypto from 'crypto';


// The base URL where the app is hosted (could be localhost or tunnel URL)
const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
    const searchParams = request.nextUrl.searchParams;

    const shop = searchParams.get('shop');
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const hmac = searchParams.get('hmac');
    const errorParam = searchParams.get('error');
    const errorDesc = searchParams.get('error_description');

    console.log('[Shopify Callback] Received params:', {
      shop,
      code: code ? `${code.substring(0, 8)}...` : null,
      state: state ? 'present' : null,
      hmac: hmac ? 'present' : null,
      error: errorParam,
      error_description: errorDesc,
    });

    // Handle Shopify OAuth error redirect
    if (errorParam) {
      console.error('[Shopify Callback] OAuth error from Shopify:', errorParam, errorDesc);
      return NextResponse.redirect(
        new URL(`/settings?shopify_error=${encodeURIComponent(errorDesc || errorParam)}`, APP_URL)
      );
    }

    if (!shop || !code) {
      return NextResponse.redirect(new URL('/settings?shopify_error=Missing parameters (shop or code)', APP_URL));
    }

    // Validate shop domain format
    if (!/^[a-zA-Z0-9-]+\.myshopify\.com$/.test(shop)) {
      return NextResponse.redirect(new URL('/settings?shopify_error=Invalid shop domain', APP_URL));
    }

    // Verify HMAC signature (required for Shopify OAuth)
    if (!hmac) {
      console.error('[Shopify Callback] HMAC parameter missing');
      return NextResponse.redirect(new URL('/settings?shopify_error=Missing HMAC signature', APP_URL));
    }

    const secret = process.env.SHOPIFY_API_SECRET;
    if (!secret) {
      console.error('[Shopify Callback] SHOPIFY_API_SECRET not configured');
      return NextResponse.redirect(new URL('/settings?shopify_error=Server configuration error', APP_URL));
    }

    if (!verifyShopifyHmac(searchParams, secret, hmac)) {
      console.error('[Shopify Callback] HMAC verification failed for shop:', shop);
      return NextResponse.redirect(new URL('/settings?shopify_error=Invalid HMAC signature', APP_URL));
    }

    console.log('[Shopify Callback] HMAC verified successfully for shop:', shop);

    // Decode state to get user ID (passed from install route)
    let userId: string | null = null;
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        userId = stateData.userId;
      } catch {
        console.error('[Shopify Callback] Failed to parse state parameter');
      }
    }

    if (!userId) {
      console.error('[Shopify Callback] No userId found in state');
      return NextResponse.redirect(new URL('/settings?shopify_error=Unauthorized - please log in and try again', APP_URL));
    }

    console.log('[Shopify Callback] UserId from state:', userId);
    console.log('[Shopify Callback] Exchanging code for access token...');

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

    console.log('[Shopify Callback] Token exchange response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Shopify Callback] Token exchange failed:', response.status, errorText);
      let errorMessage = 'Token exchange failed';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error_description || errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      return NextResponse.redirect(
        new URL(`/settings?shopify_error=${encodeURIComponent(errorMessage)}`, APP_URL)
      );
    }

    const { access_token } = await response.json();
    console.log('[Shopify Callback] Access token received successfully');

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
      console.log('[Shopify Callback] Shop details:', { shopName, shopEmail });
    }

    // Use admin client to bypass RLS
    const supabaseAdmin = createAdminClient();

    // Ensure user profile exists in public.users to avoid foreign key violation
    // We try to get the user from auth to get the email if possible
    const { data: { user: authUser } } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (authUser) {
      await supabaseAdmin
        .from('users')
        .upsert({
          id: userId,
          email: authUser.email,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
        });
    }

    const { error: insertError } = await supabaseAdmin
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
      console.error('[Shopify Callback] Database insert error:', insertError);
      return NextResponse.redirect(
        new URL(`/settings?shopify_error=${encodeURIComponent('Failed to save store connection: ' + insertError.message)}`, APP_URL)
      );
    }

    console.log('[Shopify Callback] Store saved to database successfully!');

    // Success — redirect back to the app
    return NextResponse.redirect(new URL('/settings?shopify_connected=true', APP_URL));
  } catch (error) {
    console.error('[Shopify Callback] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.redirect(
      new URL(`/settings?shopify_error=${encodeURIComponent(errorMessage)}`, APP_URL)
    );
  }
}
