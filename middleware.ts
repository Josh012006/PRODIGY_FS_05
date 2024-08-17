import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Check for the token in cookies
    const token = req.cookies.get("connexiaToken");

    // Allow requests to /login without checking for the token
    if (pathname === "/auth/login" || pathname === "/auth/register") {
        if(!token) {
            return NextResponse.next();
        }
        else {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    if (!token) {
        // Redirect to /login if token is missing
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Allow the request if the token is present
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/post/:path*', '/search', '/auth/login', '/auth/register', '/profile/:path*'],
}
