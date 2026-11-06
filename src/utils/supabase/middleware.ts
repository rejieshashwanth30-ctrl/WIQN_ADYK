import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseConfig } from './config';

/**
 * Categorizes whether a route is strictly public and never requires authentication.
 * Public routes MUST NEVER hang, timeout, or block rendering due to external auth services.
 */
function isPublicRoute(pathname: string): boolean {
  if (
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/contact' ||
    pathname.startsWith('/test/') ||
    pathname === '/test' ||
    pathname.startsWith('/auth/callback') ||
    pathname.startsWith('/auth/reset-password')
  ) {
    return true;
  }
  return false;
}

/**
 * Categorizes authentication entry routes (/login, /signup).
 */
function isAuthRoute(pathname: string): boolean {
  return pathname === '/login' || pathname === '/signup';
}

/**
 * Categorizes protected founder routes that strictly require authentication.
 */
function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/experiments') ||
    pathname.startsWith('/api/experiments') ||
    pathname.startsWith('/api/auth/sync-profile')
  );
}

/**
 * Checks whether the incoming request contains any Supabase auth cookies.
 */
function hasSupabaseAuthCookies(request: NextRequest): boolean {
  const cookies = request.cookies.getAll();
  return cookies.some(
    (c) =>
      (c.name.startsWith('sb-') && c.name.includes('-auth-token')) ||
      c.name.startsWith('supabase-')
  );
}

/**
 * Safely purges stale or deprecated Supabase cookies to heal corrupted client state
 * and prevent infinite redirect loops.
 */
function clearStaleCookies(response: NextResponse, request: NextRequest) {
  const cookies = request.cookies.getAll();
  for (const c of cookies) {
    if (
      (c.name.startsWith('sb-') && c.name.includes('-auth-token')) ||
      c.name.includes('xfklxcjoyyefovpgysqz') ||
      c.name.startsWith('supabase-')
    ) {
      response.cookies.delete(c.name);
    }
  }
}

/**
 * Executes a promise with a hard timeout ceiling.
 * Guarantees middleware NEVER exceeds platform execution limits.
 */
async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => resolve(fallback), ms);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ---------------------------------------------------------------------------
  // PHASE 1 FAST-PATH: Purely Public Routes
  // Public marketing, informational, and public tester links must ALWAYS render
  // with zero dependency on Supabase or database availability.
  // ---------------------------------------------------------------------------
  if (isPublicRoute(pathname)) {
    return NextResponse.next({ request });
  }

  const hasCookies = hasSupabaseAuthCookies(request);

  // ---------------------------------------------------------------------------
  // PHASE 2 FAST-PATH: Request Has No Auth Cookies
  // If no auth tokens exist, avoid all external network calls entirely (< 0.1ms).
  // ---------------------------------------------------------------------------
  if (!hasCookies) {
    // Unauthenticated access to protected routes -> immediate redirect / 401
    if (isProtectedRoute(pathname)) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Unauthorized: Authentication session required' },
          { status: 401 }
        );
      }
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      const redirectRes = NextResponse.redirect(url);
      redirectRes.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      redirectRes.headers.set('Pragma', 'no-cache');
      redirectRes.headers.set('Expires', '0');
      return redirectRes;
    }

    // Unauthenticated access to /login or /signup -> immediate pass-through
    return NextResponse.next({ request });
  }

  // ---------------------------------------------------------------------------
  // PHASE 3 BOUNDED AUTH: Request Has Auth Cookies
  // Safely initialize Supabase SSR client with strict timeout bounds.
  // ---------------------------------------------------------------------------
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  let supabase;
  try {
    supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });
  } catch (clientErr) {
    console.error('[Supabase Middleware] Client initialization error:', clientErr);
    if (isProtectedRoute(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      const redirectResponse = NextResponse.redirect(url);
      clearStaleCookies(redirectResponse, request);
      return redirectResponse;
    }
    return supabaseResponse;
  }

  // Bounded timeout: 1200ms on login/signup, 2500ms on protected views
  const timeoutLimit = isAuthRoute(pathname) ? 1200 : 2500;

  let user = null;
  try {
    const userPromise = supabase.auth.getUser().then((res) => res.data?.user || null).catch(() => null);
    user = await withTimeout(userPromise, timeoutLimit, null);
  } catch (authErr) {
    // Non-fatal if session check encounters transient network issues
    user = null;
  }

  // ---------------------------------------------------------------------------
  // PHASE 4 ROUTING ENFORCEMENT
  // ---------------------------------------------------------------------------

  // A. Protected Routes: Must have valid user
  if (isProtectedRoute(pathname)) {
    if (!user) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Unauthorized: Session expired or invalid' },
          { status: 401 }
        );
      }
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      const redirectResponse = NextResponse.redirect(url);
      redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      redirectResponse.headers.set('Pragma', 'no-cache');
      redirectResponse.headers.set('Expires', '0');
      clearStaleCookies(redirectResponse, request);
      return redirectResponse;
    }

    // Authenticated access: enforce strict private cache-control
    supabaseResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    supabaseResponse.headers.set('Pragma', 'no-cache');
    supabaseResponse.headers.set('Expires', '0');
    return supabaseResponse;
  }

  // B. Auth Routes (/login, /signup): Redirect authenticated users to /dashboard
  if (isAuthRoute(pathname)) {
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      const redirectResponse = NextResponse.redirect(url);
      redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return redirectResponse;
    }
    // If not authenticated or check timed out, let user view login/signup page cleanly
    return supabaseResponse;
  }

  return supabaseResponse;
}
