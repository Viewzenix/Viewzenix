import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

/**
 * Middleware to refresh the auth session on each request
 * This is important for maintaining authentication state
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

/**
 * Matcher for paths that should trigger the middleware
 * Excludes static files, images, etc.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};