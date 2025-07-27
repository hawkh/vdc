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

    // Allow access to public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Redirect to login if not authenticated and trying to access protected routes
    if (!token) {
      // Redirect admin routes to admin login
      if (adminRoutes.some(route => pathname.startsWith(route))) {
        const url = new URL('/admin/login', request.url);
        url.searchParams.set('callbackUrl', encodeURI(request.url));
        return NextResponse.redirect(url);
      }
      // Redirect other protected routes to general auth signin
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    // Handle role-based access control for authenticated users
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
      authorized: ({ token, req }) => {
        // Always allow access to public routes
        const { pathname } = req.nextUrl;
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }
        // For protected routes, require authentication
        return !!token;
      },
    },
    pages: {
      signIn: '/admin/login',
      error: '/admin/login',
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