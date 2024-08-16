import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow requests to /login without checking for the token
    if (pathname === "/auth/login" || pathname === "/auth/register") {
        return NextResponse.next();
    }

    // Check for the token in cookies
    const token = req.cookies.get("connexiaToken");

    if (!token) {
        // Redirect to /login if token is missing
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Allow the request if the token is present
    return NextResponse.next();
}

export const config = {
    matcher: ['/'],
}
