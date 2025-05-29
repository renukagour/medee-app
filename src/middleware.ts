import { NextResponse, NextRequest, NextFetchEvent } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  try {
    console.log('Middleware: path', req.nextUrl.pathname);
    // Check if the path is an admin route
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin');
    if (!isAdminRoute) {
      return (await import('@clerk/nextjs/server')).clerkMiddleware()(req, event);
    }

    let sessionClaims;
    try {
      ({ sessionClaims } = await auth());
      console.log('Middleware: sessionClaims', sessionClaims);
    } catch {
      // If auth fails, treat as not authenticated
      sessionClaims = undefined;
    }

    const role = sessionClaims?.metadata?.role;
    // Debug logging (may not show in all environments)
    console.log('Middleware: path', req.nextUrl.pathname, 'role', role, 'type', typeof role, 'sessionClaims', sessionClaims);

    if (typeof role === 'string' && role.trim().toLowerCase() === 'admin') {
      return (await import('@clerk/nextjs/server')).clerkMiddleware()(req, event);
    }

    if (req.nextUrl.pathname.startsWith('/api/')) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }
    return NextResponse.redirect(new URL('/', req.url));
  } catch {
    // Catch-all for any unexpected errors
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};