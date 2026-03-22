import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/', '/dashboard', '/register', '/quick-start'];

// Admin-only routes
const adminOnlyRoutes = ['/dashboard', '/register', '/quick-start'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // For client-side, we need to check localStorage - but middleware runs on server
  // So we'll use a different approach: check if user is trying to access protected routes
  // and redirect to login if no token in cookies
  
  const { pathname } = request.nextUrl;
  
  // Allow access to login page
  if (pathname === '/login') {
    return NextResponse.next();
  }
  
  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isProtectedRoute && !token) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};