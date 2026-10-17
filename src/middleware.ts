import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - tracker.js (public autocapture script)
     * - brand (public brand images)
     * - robots.txt, sitemap.xml
     * - static image/asset extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|tracker.js|brand|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
