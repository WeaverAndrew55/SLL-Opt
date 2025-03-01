// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Middleware for handling redirects, language detection, and other request manipulations
 * More info: https://nextjs.org/docs/advanced-features/middleware
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Redirect legacy paths if needed
  // For example, redirect old blog paths to new structure
  if (pathname.startsWith('/blog-post/')) {
    const slug = pathname.replace('/blog-post/', '');
    return NextResponse.redirect(new URL(`/blog/${slug}`, request.url));
  }
  
  // Redirect trailing slashes for consistency
  if (pathname !== '/' && pathname.endsWith('/')) {
    return NextResponse.redirect(
      new URL(pathname.slice(0, -1), request.url)
    );
  }
  
  // Add security headers to all responses
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.sanity.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.sanity.io; font-src 'self' data:; connect-src 'self' https://*.api.sanity.io;"
  );
  
  return response;
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /studio (Sanity Studio)
     * 4. /favicon.ico, /robots.txt, etc.
     */
    '/((?!api|_next|studio|images|[\\w-]+\\.\\w+).*)',
  ],
};
