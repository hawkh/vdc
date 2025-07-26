import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/auth/signin', '/auth/register', '/api/auth', '/admin/login', '/patient/login'];
const adminRoutes = ['/admin'];
const staffRoutes = ['/staff'];

// This function can be marked `async` if using `await` inside
export default withAuth(
  function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.nextauth.token;

    // Redirect to sign-in if not authenticated and trying to access protected routes
    if (!token && !publicRoutes.some(route => pathname.startsWith(route))) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    // Handle role-based access control
    if (token) {
      // Redirect to unauthorized if trying to access admin routes without admin role
      if (adminRoutes.some(route => pathname.startsWith(route)) && token.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // Redirect to unauthorized if trying to access staff routes without staff or admin role
      if (staffRoutes.some(route => pathname.startsWith(route)) && 
          !['staff', 'admin'].includes(token.role as string)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // Only redirect dashboard route, not homepage
      if (pathname === '/dashboard') {
        const dashboardPath = token.role === 'admin' ? '/admin' : '/patient';
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};