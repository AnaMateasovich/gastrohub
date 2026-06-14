import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isAuthPage =
    req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register";
  const isProtectedPage = req.nextUrl.pathname.startsWith("/admin");
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));

      if (isAuthPage) {
        return NextResponse.redirect(new URL("/home", req.url));
      }
    } catch {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin", "/admin/:path*"],
};