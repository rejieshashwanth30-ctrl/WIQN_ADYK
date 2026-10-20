import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { verifySupabaseToken, ensureApplicationUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    let user = null;

    // 1. Verify Authorization Bearer token if provided (client-to-server sync flow)
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      if (token) {
        user = await verifySupabaseToken(token);
      }
    }

    // 2. If no valid Bearer token provided, verify via HTTP-only cookies
    if (!user) {
      try {
        const supabase = await createClient();
        const {
          data: { user: cookieUser },
          error: cookieError,
        } = await supabase.auth.getUser();

        if (!cookieError && cookieUser) {
          user = cookieUser;
        }
      } catch (cErr) {
        console.warn('[WIQN AUTH SYNC] Cookie session read warning:', cErr);
      }
    }

    // Strict authentication verification
    if (!user || !user.id || !user.email) {
      console.error('[WIQN AUTH] Profile sync rejected: Unauthenticated session');
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Valid Supabase session required to sync profile' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const name = body.name?.trim() || user.user_metadata?.name || user.user_metadata?.full_name || user.email.split('@')[0];
    const organization = user.user_metadata?.organization || null;

    // Idempotent Neon profile synchronization using atomic upsert strategy
    const appUser = await ensureApplicationUser({
      supabaseUserId: user.id,
      email: user.email,
      name,
      organization,
    });

    console.log('[WIQN AUTH] Profile synchronized in Neon successfully:', appUser.id, appUser.supabaseUserId);

    return NextResponse.json({
      success: true,
      user: {
        id: appUser.id,
        supabaseUserId: appUser.supabaseUserId,
      },
    });
  } catch (error: any) {
    console.error('[WIQN AUTH] Profile synchronization failed:', error?.message || error);
    return NextResponse.json(
      { success: false, error: 'Profile synchronization failed. Please try again.' },
      { status: 500 }
    );
  }
}

