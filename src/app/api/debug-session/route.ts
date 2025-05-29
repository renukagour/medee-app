import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { sessionClaims } = await auth();
  console.log("Session Claims (API):", sessionClaims);
  return NextResponse.json({ sessionClaims });
}