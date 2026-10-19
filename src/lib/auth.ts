import { createClient } from '@/utils/supabase/server';
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
 * Resolves the authenticated Supabase user and synchronizes
 * with the corresponding Wiqn application user record in Neon PostgreSQL.
 * Supports both HTTP-only cookies and Authorization: Bearer <access_token> headers.
 * Uses the authenticated Supabase identity as the strict source of truth.
 */
export async function getCurrentUser(req?: Request | any): Promise<AuthenticatedContext | null> {
  try {
    const supabase = await createClient();
    let user = null;

    // 1. Check Authorization header for Bearer access token (for mobile & client fetches)
    if (req && typeof req.headers?.get === 'function') {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7).trim();
        if (token) {
          try {
            const { data: userData, error: tokenError } = await supabase.auth.getUser(token);
            if (!tokenError && userData?.user) {
              user = userData.user;
            }
          } catch (tErr) {
            console.warn('[getCurrentUser] Bearer token error:', tErr);
          }
        }
      }
    }

    // 2. If no valid bearer token was provided, fall back to cookies
    if (!user) {
      try {
        const {
          data: { user: cookieUser },
          error,
        } = await supabase.auth.getUser();

        if (!error && cookieUser) {
          user = cookieUser;
        }
      } catch (cErr) {
        // Safe bypass if cookies are inaccessible
      }
    }

    if (!user || !user.id) {
      return null;
    }

    // Look for existing Wiqn application user in Neon strictly by supabaseUserId
    let appUser = null;
    try {
      appUser = await prisma.user.findUnique({
        where: { supabaseUserId: user.id },
      });
    } catch (dbErr) {
      console.error('[getCurrentUser] Database query error:', dbErr);
    }

    // If not found in Neon, synchronize and create the record idempotently
    if (!appUser && user.email) {
      const metadata = user.user_metadata || {};
      const name = metadata.name || metadata.full_name || user.email.split('@')[0];
      const organization = metadata.organization || null;

      try {
        // Check if user with same email exists from previous registration
        const existingEmailUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingEmailUser) {
          appUser = await prisma.user.update({
            where: { id: existingEmailUser.id },
            data: {
              supabaseUserId: user.id,
              name: name || existingEmailUser.name,
              organization: organization || existingEmailUser.organization,
            },
          });
        } else {
          appUser = await prisma.user.create({
            data: {
              supabaseUserId: user.id,
              email: user.email,
              name: name,
              organization: organization,
              role: 'FOUNDER',
            },
          });
        }
      } catch (upsertErr) {
        console.error('[getCurrentUser] Profile sync error:', upsertErr);
        try {
          appUser = await prisma.user.findFirst({
            where: {
              OR: [
                { supabaseUserId: user.id },
                { email: user.email },
              ],
            },
          });
        } catch (findErr) {
          console.error('[getCurrentUser] Fallback user resolution error:', findErr);
        }
      }
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
  } catch (err) {
    console.error('[getCurrentUser] Error resolving authenticated context:', err);
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
