import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    // Note: Using auth-helpers-nextjs might require installation if not present. 
    // But standard supabase client can also be used.
    // Given package.json only has @supabase/supabase-js, I'll use a simpler approach if possible
    // or install the helper.

    // For now, I'll bypass middleware to avoid dependency errors until I'm sure what's installed.
    // Let's check if I should install @supabase/auth-helpers-nextjs or @supabase/ssr.
    return res;
}

export const config = {
    matcher: ['/care/:path*', '/pro/:path*'],
};
