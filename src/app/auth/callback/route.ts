import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getPublicAppUrl } from '@/lib/urls';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const searchParams = requestUrl.searchParams;

  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Determine the canonical public base URL of the Wiqn application
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  
  let rawOrigin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : requestUrl.origin;

  // Safety check: Never redirect users to any Vercel dashboard or management URLs (vercel.com)
  if (rawOrigin.includes('vercel.com') && !rawOrigin.includes('.vercel.app')) {
    rawOrigin = getPublicAppUrl({ forceProduction: true });
  }

  const cleanOrigin = rawOrigin.replace(/\/+$/, '');

  // Handle errors emitted by Supabase (e.g. link expired, already verified, or invalid token)
  if (error || errorDescription) {
    const errorMsg = encodeURIComponent(errorDescription || error || 'Confirmation failed');
    return NextResponse.redirect(`${cleanOrigin}/login?error=${errorMsg}`);
  }

  // Determine next destination safely (prevent open redirect vulnerabilities)
  let next = searchParams.get('next');
  if (next && (!next.startsWith('/') || next.startsWith('//') || (next.includes('vercel.com') && !next.includes('.vercel.app')))) {
    next = null;
  }

  const supabase = await createClient();

  // 1. Handle PKCE authorization code exchange flow
  if (code) {
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      const destination = next || '/dashboard';
      return NextResponse.redirect(`${cleanOrigin}${destination}`);
    }
    console.error('[Auth Callback] Code exchange failed:', exchangeError);
  }

  // 2. Handle OTP / Token Hash verification flow (email signup confirmation)
  const effectiveTokenHash = tokenHash || searchParams.get('token');
  if (effectiveTokenHash) {
    const verifyType = (type || 'signup') as any;
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: effectiveTokenHash,
      type: verifyType,
    });
    if (!verifyError) {
      if (data?.session) {
        const destination = next || '/dashboard';
        return NextResponse.redirect(`${cleanOrigin}${destination}`);
      } else {
        return NextResponse.redirect(`${cleanOrigin}/login?verified=true`);
      }
    }
    console.error('[Auth Callback] Token hash verification failed:', verifyError);
  }

  // If verification failed or params were missing, redirect to login with user-friendly notice
  return NextResponse.redirect(`${cleanOrigin}/login?error=auth_exchange_failed`);
}

