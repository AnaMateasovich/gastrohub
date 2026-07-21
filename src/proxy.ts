import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth/verify-token";
import { getTenantFromHost } from "./lib/tenant";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const isAuthPage =
    req.nextUrl.pathname === "/login" ||
    req.nextUrl.pathname === "/register";

  const isProtectedPage =
    req.nextUrl.pathname.startsWith("/admin");

  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    try {
      const payload = await verifyToken(token);
      if (isProtectedPage) {
        const host = req.headers.get("host");

        if (!host) {
          return NextResponse.redirect(new URL("/login", req.url));
        }

        const tenant = await getTenantFromHost(host);
        if (tenant.id !== payload.organizationId) {
          return NextResponse.redirect(new URL("/login", req.url));
        }

        // Opcional: verificar rol
        if (payload.role !== "ADMIN" && payload.role !== "OWNER") {
          return NextResponse.redirect(new URL("/home", req.url));
        }
      }

      if (isAuthPage) {
        return NextResponse.redirect(new URL("/home", req.url));
      }
    } catch {
      const response = NextResponse.redirect(
        new URL("/login", req.url)
      );

      response.cookies.delete("token");

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};