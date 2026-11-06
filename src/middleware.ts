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
     * - static image/font/style asset extensions
     * - public API routes that never need middleware auth: /api/capture, /api/health, /api/test
     */
    '/((?!_next/static|_next/image|favicon\\.ico|tracker\\.js|brand|robots\\.txt|sitemap\\.xml|api/capture|api/health|api/test|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|css|js\\.map)$).*)',
  ],
};
