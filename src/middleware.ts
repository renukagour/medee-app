import { NextResponse, NextRequest, NextFetchEvent } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  // Check if the path is an admin route
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin');
  if (!isAdminRoute) {
    return (await import('@clerk/nextjs/server')).clerkMiddleware()(req, event);
  }

  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;
  if (role === 'admin') {
    return (await import('@clerk/nextjs/server')).clerkMiddleware()(req, event);
  }

  if (req.nextUrl.pathname.startsWith('/api/')) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }
  return NextResponse.redirect(new URL('/', req.url));
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};