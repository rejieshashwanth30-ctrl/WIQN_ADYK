import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserContext, ensureApplicationUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const authResult = await getAuthenticatedUserContext(req);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await req.json().catch(() => ({}));
    const name = body.name?.trim() || authResult.applicationUser.name;
    const organization = body.organization !== undefined ? body.organization : authResult.applicationUser.organization;

    // If explicit profile details were provided, update them
    let appUser = authResult.applicationUser;
    if (name !== authResult.applicationUser.name || organization !== authResult.applicationUser.organization) {
      appUser = await ensureApplicationUser({
        supabaseUserId: authResult.supabaseUser.id,
        email: authResult.supabaseUser.email,
        name,
        organization,
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: appUser.id,
        supabaseUserId: appUser.supabaseUserId,
        email: appUser.email,
        name: appUser.name,
        organization: appUser.organization,
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

