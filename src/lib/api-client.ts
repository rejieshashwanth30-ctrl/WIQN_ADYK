import { createClient } from '@/utils/supabase/client';

/**
 * Obtains a fresh Supabase access token, auto-refreshing if expired or near expiry.
 * Safe to call repeatedly across client components.
 */
export async function getFreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    const supabase = createClient();

    // 1. Check current session
    let {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    // Check if session is missing, or expiring within 60 seconds
    const isExpiring = session?.expires_at
      ? session.expires_at * 1000 < Date.now() + 60000
      : false;

    if (!session || isExpiring || sessionError) {
      try {
        const refreshResult = await supabase.auth.refreshSession();
        if (refreshResult.data?.session) {
          session = refreshResult.data.session;
        }
      } catch (refErr) {
        // Silently continue to getUser fallback
      }
    }

    // 2. If still no active session, verify with getUser
    if (!session?.access_token) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const secondTry = await supabase.auth.getSession();
          session = secondTry.data?.session || null;
        }
      } catch {
        // Unauthenticated
      }
    }

    return session?.access_token || null;
  } catch (err) {
    console.warn('[WIQN Client API] Session resolution error:', err);
    return null;
  }
}

/**
 * Canonical authenticated fetch helper for all client-side API requests.
 * - Obtains a fresh Supabase session
 * - Injects Authorization: Bearer <access_token> header
 * - Includes credentials: 'include' for cookie fallback
 * - Auto-retries once on 401 if token was stale
 * - Never leaks tokens in console logs
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const token = await getFreshAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  let res = await fetch(url, fetchOptions);

  // If 401 received, attempt ONE silent session refresh and retry
  if (res.status === 401 && typeof window !== 'undefined') {
    try {
      const supabase = createClient();
      const refreshResult = await supabase.auth.refreshSession();
      const refreshedToken = refreshResult.data?.session?.access_token;
      if (refreshedToken) {
        headers.set('Authorization', `Bearer ${refreshedToken}`);
        res = await fetch(url, { ...options, headers, credentials: 'include' });
      }
    } catch {
      // Return original response
    }
  }

  return res;
}

/**
 * Convenience helper for authenticated GET JSON requests
 */
export async function apiGet<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  try {
    const res = await authenticatedFetch(url, { ...options, method: 'GET' });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: json.error || `Request failed with status ${res.status}`,
      };
    }
    return { ok: true, status: res.status, data: json };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      error: err?.message || 'Network error communicating with server',
    };
  }
}

/**
 * Convenience helper for authenticated POST JSON requests
 */
export async function apiPost<T = any>(
  url: string,
  body: any,
  options: RequestInit = {}
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  try {
    const res = await authenticatedFetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: json.error || `Request failed with status ${res.status}`,
      };
    }
    return { ok: true, status: res.status, data: json };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      error: err?.message || 'Network error communicating with server',
    };
  }
}
