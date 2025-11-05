import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple password protection for admin routes
// In production, use proper authentication (NextAuth, Clerk, etc.)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Check if user is authenticated
    const authCookie = request.cookies.get('admin-auth');
    
    if (!authCookie || authCookie.value !== ADMIN_PASSWORD) {
      // Redirect to login page or show basic auth
      const url = request.nextUrl.clone();
      
      // Create a response with basic auth challenge
      const response = new NextResponse(
        JSON.stringify({ 
          error: 'Authentication required',
          message: 'Please login to access admin panel' 
        }),
        {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Admin Area"',
            'Content-Type': 'application/json',
          },
        }
      );

      return response;
    }
  }

  // Security headers for all routes
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
