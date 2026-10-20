import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/db';
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
  try {
    const existing = await prisma.user.findUnique({
      where: { supabaseUserId },
    });
    if (existing) {
      // Idempotently update name/organization if changed
      const shouldUpdateName = cleanName && existing.name !== cleanName;
      const shouldUpdateEmail = existing.email !== cleanEmail;
      if (shouldUpdateName || shouldUpdateEmail) {
        return await prisma.user.update({
          where: { id: existing.id },
          data: {
            email: cleanEmail,
            name: cleanName || existing.name,
            organization: organization !== undefined ? organization : existing.organization,
          },
        });
      }
      return existing;
    }
  } catch (findErr) {
    console.warn('[WIQN AUTH] findUnique by supabaseUserId warning:', findErr);
  }

  // 2. Check if user with same email exists from previous registration or migration
  try {
    const existingByEmail = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingByEmail) {
      return await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          supabaseUserId, // Link to verified Supabase identity
          name: cleanName || existingByEmail.name,
          organization: organization !== undefined ? organization : existingByEmail.organization,
        },
      });
    }
  } catch (emailErr) {
    console.warn('[WIQN AUTH] findUnique by email warning:', emailErr);
  }

  // 3. Atomically upsert by supabaseUserId
  try {
    return await prisma.user.upsert({
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
    });
  } catch (upsertErr: any) {
    console.warn('[WIQN AUTH] Atomic upsert race condition caught, recovering:', upsertErr?.message);
    const fallbackUser = await prisma.user.findFirst({
      where: {
        OR: [{ supabaseUserId }, { email: cleanEmail }],
      },
    });

    if (fallbackUser) {
      if (fallbackUser.supabaseUserId !== supabaseUserId) {
        return await prisma.user.update({
          where: { id: fallbackUser.id },
          data: { supabaseUserId },
        });
      }
      return fallbackUser;
    }
    throw upsertErr;
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
    let user = null;

    // 1. Check Authorization header for Bearer access token
    if (req && typeof req.headers?.get === 'function') {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7).trim();
        if (token) {
          user = await verifySupabaseToken(token);
        }
      }
    }

    // 2. If no valid Bearer token provided, check HTTP-only cookies
    if (!user) {
      try {
        const supabase = await createServerSupabaseClient();
        const {
          data: { user: cookieUser },
          error: cookieError,
        } = await supabase.auth.getUser();

        if (!cookieError && cookieUser) {
          user = cookieUser;
        }
      } catch (cErr) {
        // Safe bypass if cookies are inaccessible in current context
      }
    }

    if (!user || !user.id || !user.email) {
      return null;
    }

    // Self-healing: Ensure application profile exists in Neon PostgreSQL
    const metadata = user.user_metadata || {};
    const name = metadata.name || metadata.full_name || user.email.split('@')[0];
    const organization = metadata.organization || null;

    let appUser = null;
    try {
      appUser = await ensureApplicationUser({
        supabaseUserId: user.id,
        email: user.email,
        name,
        organization,
      });
    } catch (syncErr: any) {
      console.error('[getCurrentUser] Self-healing profile sync error:', syncErr?.message || syncErr);
    }

    if (!appUser) {
      return null;
    }

    return {
      supabaseUser: {
        id: user.id,
        email: user.email,
      },
      applicationUser: appUser,
    };
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
    const experiment = await prisma.experiment.findUnique({
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
    });

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
