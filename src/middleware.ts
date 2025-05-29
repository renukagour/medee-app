import { NextResponse, NextRequest, NextFetchEvent } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import User from './models/user.model';
import { connect } from './db';

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  // Check if the path is an admin route
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin');
  if (!isAdminRoute) {
    return (await import('@clerk/nextjs/server')).clerkMiddleware()(req, event);
  }

  const { sessionClaims } = await auth();
  const clerkId = sessionClaims?.sub;

  if (!clerkId) {
    // Not authenticated
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  await connect();
  const user = await User.findOne({ clerkId });
  if (!user || user.role !== 'admin') {
    // For API routes, return 403
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }
    // For pages, redirect to home
    return NextResponse.redirect(new URL('/', req.url));
  }

  return (await import('@clerk/nextjs/server')).clerkMiddleware()(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};