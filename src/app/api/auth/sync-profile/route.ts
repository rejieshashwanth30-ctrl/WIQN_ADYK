import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    let user = null;

    // 1. Check Authorization header for Bearer access token
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
          console.warn('[WIQN AUTH SYNC] Bearer token verification warning:', tErr);
        }
      }
    }

    // 2. If no valid bearer token was provided, fall back to cookies
    if (!user) {
      try {
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

    if (!user || !user.email) {
      console.error('[WIQN AUTH] Profile sync rejected: Unauthenticated session');
      return NextResponse.json(
        { error: 'Unauthorized: Valid Supabase session required to sync profile' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const name = body.name?.trim() || user.user_metadata?.name || user.email.split('@')[0];

    // Idempotent Neon profile synchronization
    // Match strictly by supabaseUserId as primary identity mapping
    let appUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id },
    });

    if (!appUser) {
      // Check if user with same email exists from previous registration or migration
      const existingEmailUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingEmailUser) {
        appUser = await prisma.user.update({
          where: { id: existingEmailUser.id },
          data: {
            supabaseUserId: user.id,
            name: name || existingEmailUser.name,
          },
        });
      } else {
        appUser = await prisma.user.create({
          data: {
            supabaseUserId: user.id,
            email: user.email,
            name: name,
            role: 'FOUNDER',
          },
        });
      }
    } else {
      // Update profile fields idempotently
      appUser = await prisma.user.update({
        where: { id: appUser.id },
        data: {
          email: user.email,
          name: name || appUser.name,
        },
      });
    }

    console.log('[WIQN AUTH] Profile synchronized in Neon successfully:', appUser.id, appUser.email);

    return NextResponse.json({
      status: 'success',
      user: {
        id: appUser.id,
        supabaseUserId: appUser.supabaseUserId,
        email: appUser.email,
        name: appUser.name,
        role: appUser.role,
      },
    });
  } catch (error: any) {
    console.error('[WIQN AUTH] Profile synchronization failed:', error?.message || error);
    return NextResponse.json(
      { error: 'Profile synchronization failed. Please try again.' },
      { status: 500 }
    );
  }
}
