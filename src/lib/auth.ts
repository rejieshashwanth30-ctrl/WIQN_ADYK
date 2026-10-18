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
          const { data: userData, error: tokenError } = await supabase.auth.getUser(token);
          if (!tokenError && userData?.user) {
            user = userData.user;
          }
        }
      }
    }

    // 2. If no valid bearer token was provided, fall back to cookies
    if (!user) {
      const {
        data: { user: cookieUser },
        error,
      } = await supabase.auth.getUser();

      if (!error && cookieUser) {
        user = cookieUser;
      }
    }

    if (!user) {
      return null;
    }

    // Look for existing Wiqn application user in Neon
    let appUser = null;
    try {
      appUser = await prisma.user.findUnique({
        where: { supabaseUserId: user.id },
      });
    } catch (dbErr) {
      console.error('[getCurrentUser] Database query error:', dbErr);
    }

    // If not found in Neon, synchronize and create the record
    if (!appUser && user.email) {
      const metadata = user.user_metadata || {};
      const name = metadata.name || metadata.full_name || user.email.split('@')[0];
      const organization = metadata.organization || null;

      try {
        appUser = await prisma.user.upsert({
          where: { supabaseUserId: user.id },
          update: {
            email: user.email,
            name: name,
            organization: organization,
          },
          create: {
            supabaseUserId: user.id,
            email: user.email,
            name: name,
            organization: organization,
            role: 'FOUNDER',
          },
        });
      } catch (upsertErr) {
        // If email uniqueness conflicts or race condition occurs, retry fetch
        try {
          appUser = await prisma.user.findFirst({
            where: {
              OR: [
                { supabaseUserId: user.id },
                { email: user.email },
              ],
            },
          });

          if (appUser && appUser.supabaseUserId !== user.id) {
            appUser = await prisma.user.update({
              where: { id: appUser.id },
              data: { supabaseUserId: user.id },
            });
          }
        } catch (findErr) {
          console.error('[getCurrentUser] Fallback user resolution error:', findErr);
        }
      }
    }

    // Fallback: If Neon PostgreSQL is temporarily connecting or cold,
    // synthesize a valid applicationUser context so an authenticated founder is not blocked
    if (!appUser) {
      appUser = {
        id: user.id,
        supabaseUserId: user.id,
        email: user.email || 'founder@wiqn.app',
        name: user.user_metadata?.name || null,
        organization: user.user_metadata?.organization || null,
        role: 'FOUNDER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return {
      supabaseUser: {
        id: user.id,
        email: user.email,
      },
      applicationUser: appUser,
    };
  } catch (err) {
    console.error('Error resolving authenticated context:', err);
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
 * Protects against Insecure Direct Object References (IDOR).
 */
export async function verifyExperimentOwnership(experimentId: string, applicationUserId: string) {
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

  // Strict ownership check
  if (experiment.userId !== applicationUserId) {
    return { status: 403, error: 'Access denied: unauthorized resource ownership', experiment: null };
  }

  return { status: 200, error: null, experiment };
}
