import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  let supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    'https://xwwpvtmvbujtynyanywl.supabase.co'
  ).trim().replace(/^["']|["']$/g, '');

  if (supabaseUrl.includes('xfklxcjoyyefovpgysqz')) {
    supabaseUrl = 'https://xwwpvtmvbujtynyanywl.supabase.co';
  }

  let supabaseKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    'sb_publishable_6rNhhVwAY04T2dInW6eUaw_1MbDHiL0'
  ).trim().replace(/^["']|["']$/g, '');

  if (supabaseUrl.includes('xwwpvtmvbujtynyanywl') && (!supabaseKey.startsWith('sb_publishable_') || supabaseKey.length > 80)) {
    supabaseKey = 'sb_publishable_6rNhhVwAY04T2dInW6eUaw_1MbDHiL0';
  }

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  let supabase;
  try {
    supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });
  } catch (clientErr) {
    console.error('[Supabase Middleware] Failed to create Supabase client:', clientErr);
    return supabaseResponse;
  }

  let user = null;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch {
    // Non-fatal if session check encounters transient network/cookie issues
  }

  const pathname = request.nextUrl.pathname;

  // Strict protected route check: all /dashboard and /experiments routes require authentication
  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/experiments');

  // Prevent browser back/forward cache (bfcache) or proxies from caching private views
  if (isProtected) {
    supabaseResponse.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    supabaseResponse.headers.set('Pragma', 'no-cache');
    supabaseResponse.headers.set('Expires', '0');
  }

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    redirectResponse.headers.set('Pragma', 'no-cache');
    redirectResponse.headers.set('Expires', '0');
    return redirectResponse;
  }

  // Redirect authenticated users away from /login and /signup
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
