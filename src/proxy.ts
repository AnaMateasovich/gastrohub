import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value
    const isAuthPage = req.nextUrl.pathname === '/login';
    const isProtectedPage = req.nextUrl.pathname.startsWith("/admin")

    if(!token && isProtectedPage) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    if(token && isAuthPage) {
        return NextResponse.redirect(new URL("/home", req.url))
    }

    return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/admin","/admin/:path"],
};