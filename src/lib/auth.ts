import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { prisma, withDbRetry } from '@/lib/db';
import { redirect } from 'next/navigation';

export interface AuthenticatedContext {
  supabaseUser: {
    id: string;
    email?: string;
  };
  applicationUser: {
    id: string;
    supabaseUserId: string;
    email: string;
    name: string | null;
    organization: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

/**
 * Creates a stateless Supabase client for securely verifying Bearer access tokens
 * without cookie or storage dependencies.
 */
function getStatelessSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    'https://placeholder.supabase.co';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    'placeholder-anon-key';

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Securely verifies a Supabase access token directly against Supabase Auth.
 * Returns the verified Supabase user object or null.
 */
export async function verifySupabaseToken(token: string) {
  if (!token || typeof token !== 'string') return null;
  const cleanToken = token.trim();
  if (!cleanToken) return null;

  try {
    const client = getStatelessSupabaseClient();
    const { data, error } = await client.auth.getUser(cleanToken);
    if (!error && data?.user) {
      return data.user;
    }
    if (error) {
      console.warn('[WIQN AUTH] Bearer token verification rejected:', error.message);
    }
  } catch (err) {
    console.warn('[WIQN AUTH] Bearer token verification unexpected exception:', err);
  }
  return null;
}

/**
 * Idempotently provisions or updates the WIQN application user profile in Neon PostgreSQL.
 * Strict identity source of truth is Supabase Auth user.id -> User.supabaseUserId.
 * Safe against concurrent race conditions and email migration duplicates.
 */
export async function ensureApplicationUser({
  supabaseUserId,
  email,
  name,
  organization,
}: {
  supabaseUserId: string;
  email: string;
  name?: string | null;
  organization?: string | null;
}) {
  if (!supabaseUserId || !email) {
    throw new Error('supabaseUserId and email are mandatory for profile provisioning');
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = (name || '').trim() || cleanEmail.split('@')[0];

  // 1. Try finding by supabaseUserId (primary identity mapping)
  const existing = await withDbRetry(() =>
    prisma.user.findUnique({
      where: { supabaseUserId },
    })
  );

  if (existing) {
    // Non-blocking best-effort update of name or organization if changed
    if ((cleanName && existing.name !== cleanName) || (organization && organization !== existing.organization)) {
      try {
        return await withDbRetry(() =>
          prisma.user.update({
            where: { id: existing.id },
            data: {
              name: cleanName || existing.name,
              organization: organization !== undefined ? organization : existing.organization,
            },
          })
        );
      } catch (updErr) {
        console.warn('[WIQN AUTH] Best-effort user profile sync update notice:', updErr);
        return existing;
      }
    }
    return existing;
  }

  // 2. Check if user with same email exists from previous registration or migration
  const existingByEmail = await withDbRetry(() =>
    prisma.user.findUnique({
      where: { email: cleanEmail },
    })
  );

  if (existingByEmail) {
    return await withDbRetry(() =>
      prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          supabaseUserId, // Link to verified Supabase identity
          name: cleanName || existingByEmail.name,
          organization: organization !== undefined ? organization : existingByEmail.organization,
        },
      })
    );
  }

  // 3. Atomically upsert by supabaseUserId
  try {
    return await withDbRetry(() =>
      prisma.user.upsert({
        where: { supabaseUserId },
        update: {
          email: cleanEmail,
          name: cleanName,
          organization: organization ?? undefined,
        },
        create: {
          supabaseUserId,
          email: cleanEmail,
          name: cleanName,
          organization: organization ?? null,
          role: 'FOUNDER',
        },
      })
    );
  } catch (upsertErr: any) {
    console.warn('[WIQN AUTH] Atomic upsert race condition caught, recovering:', upsertErr?.message || upsertErr);
    const fallbackUser = await withDbRetry(() =>
      prisma.user.findFirst({
        where: {
          OR: [{ supabaseUserId }, { email: cleanEmail }],
        },
      })
    );

    if (fallbackUser) {
      if (fallbackUser.supabaseUserId !== supabaseUserId) {
        return await withDbRetry(() =>
          prisma.user.update({
            where: { id: fallbackUser.id },
            data: { supabaseUserId },
          })
        );
      }
      return fallbackUser;
    }
    throw upsertErr;
  }
}

/**
 * Canonical server authentication function.
 * Verifies Supabase user from:
 * 1. Authorization: Bearer <access_token> header (via stateless client)
 * 2. Supabase HTTP-only session cookies (via server client)
 * Returns the verified Supabase user or null.
 */
export interface VerifiedSupabaseUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

export async function getAuthenticatedSupabaseUser(
  req?: Request | any
): Promise<VerifiedSupabaseUser | null> {
  try {
    // 1. Check Authorization header for Bearer access token
    if (req) {
      let authHeader: string | null = null;
      if (typeof req.headers?.get === 'function') {
        authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
      } else if (req.headers && typeof req.headers === 'object') {
        authHeader = req.headers['authorization'] || req.headers['Authorization'] || null;
      }

      if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        const token = authHeader.substring(7).trim();
        if (token) {
          const verified = await verifySupabaseToken(token);
          if (verified && verified.id && verified.email) {
            return {
              id: verified.id,
              email: verified.email,
              user_metadata: verified.user_metadata || {},
            };
          }
        }
      }
    }

    // 2. Check HTTP-only cookies via createServerSupabaseClient
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user: cookieUser },
        error: cookieError,
      } = await supabase.auth.getUser();

      if (!cookieError && cookieUser && cookieUser.id && cookieUser.email) {
        return {
          id: cookieUser.id,
          email: cookieUser.email,
          user_metadata: cookieUser.user_metadata || {},
        };
      }
    } catch (cErr) {
      // Cookies not accessible or invalid
    }

    return null;
  } catch (err: any) {
    console.error('[WIQN AUTH] getAuthenticatedSupabaseUser unexpected error:', err?.message || err);
    return null;
  }
}

export type AuthResult =
  | {
      success: true;
      supabaseUser: { id: string; email: string };
      applicationUser: AuthenticatedContext['applicationUser'];
    }
  | {
      success: false;
      error: string;
      status: number;
    };

/**
 * Resolves both the authenticated Supabase user and the WIQN application profile in Neon PostgreSQL.
 * Performs atomic self-healing profile sync if the user exists in Supabase but not in Neon.
 * Returns { success: true, supabaseUser, applicationUser } or { success: false, error, status }.
 * Never displays an unhelpful generic error if the underlying failure was a connection glitch.
 */
export async function getAuthenticatedUserContext(
  req?: Request | any
): Promise<AuthResult> {
  const supaUser = await getAuthenticatedSupabaseUser(req);
  if (!supaUser) {
    return {
      success: false,
      error: 'Unauthorized: Session required',
      status: 401,
    };
  }

  const metadata = supaUser.user_metadata || {};
  const name = metadata.name || metadata.full_name || supaUser.email.split('@')[0];
  const organization = metadata.organization || null;

  try {
    const appUser = await ensureApplicationUser({
      supabaseUserId: supaUser.id,
      email: supaUser.email,
      name,
      organization,
    });

    if (!appUser) {
      return {
        success: false,
        error: 'Application user profile could not be synchronized',
        status: 500,
      };
    }

    return {
      success: true,
      supabaseUser: {
        id: supaUser.id,
        email: supaUser.email,
      },
      applicationUser: appUser,
    };
  } catch (dbErr: any) {
    const errMsg = dbErr?.message || String(dbErr);
    const errCode = dbErr?.code || 'DB_ERROR';
    console.error('[WIQN AUTH] Database user sync failed during auth resolution:', {
      name: dbErr?.name,
      code: errCode,
      message: errMsg,
    });

    let userMessage = 'Service temporarily unavailable: database error during profile resolution';
    if (errMsg.includes('reach database') || errCode === 'P1001') {
      userMessage = 'Database connection error: unable to reach PostgreSQL database server';
    } else if (errCode === 'P1017' || errMsg.includes('Closed')) {
      userMessage = 'Database connection error: connection was closed by database server';
    } else if (errCode === 'P2002') {
      userMessage = 'Database constraint error: duplicate profile collision';
    } else if (errMsg.includes('does not exist')) {
      userMessage = `Database schema error: ${errMsg.slice(0, 100)}`;
    }

    return {
      success: false,
      error: userMessage,
      status: 503,
    };
  }
}

/**
 * Resolves the authenticated Supabase user and self-heals / synchronizes
 * with the corresponding Wiqn application user record in Neon PostgreSQL.
 * Supports both Authorization: Bearer <access_token> headers and HTTP-only cookies.
 * Uses the authenticated Supabase identity as the strict source of truth.
 */
export async function getCurrentUser(req?: Request | any): Promise<AuthenticatedContext | null> {
  try {
    const result = await getAuthenticatedUserContext(req);
    if (result.success) {
      return {
        supabaseUser: result.supabaseUser,
        applicationUser: result.applicationUser,
      };
    }
    return null;
  } catch (err: any) {
    console.error('[getCurrentUser] Error resolving authenticated context:', err?.message || err);
    return null;
  }
}

/**
 * Requires an authenticated context. If unauthenticated, redirects to /login.
 */
export async function requireAuth(redirectPath?: string): Promise<AuthenticatedContext> {
  const context = await getCurrentUser();
  if (!context) {
    const target = redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : '/login';
    redirect(target);
  }
  return context;
}

/**
 * Verifies that an experiment exists and is owned by the authenticated application user.
 * Protects against Insecure Direct Object References (IDOR) and guarantees account isolation.
 */
export async function verifyExperimentOwnership(experimentId: string, applicationUserId: string) {
  try {
    const experiment = await withDbRetry(() =>
      prisma.experiment.findUnique({
        where: { id: experimentId },
        include: {
          prototypes: true,
          insights: true,
          decisions: true,
          feedback: {
            include: {
              responses: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          _count: {
            select: {
              visitors: true,
              sessions: true,
              events: true,
              feedback: true,
            },
          },
        },
      })
    );

    if (!experiment) {
      return { status: 404, error: 'Experiment not found', experiment: null };
    }

    // Strict account isolation check (IDOR protection)
    if (experiment.userId !== applicationUserId) {
      return { status: 403, error: 'Access denied: unauthorized resource ownership', experiment: null };
    }

    return { status: 200, error: null, experiment };
  } catch (err: any) {
    console.error('[verifyExperimentOwnership] Error verifying experiment ownership:', err);
    return { status: 500, error: 'Database verification failed', experiment: null };
  }
}
