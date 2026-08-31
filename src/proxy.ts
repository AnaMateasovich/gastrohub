import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth/verify-token";
import { extractSlug } from "./lib/tenant/extract-slug";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const host = req.headers.get("host");

  const pathname = req.nextUrl.pathname;
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProtectedPage = pathname.startsWith("/admin");

  const hostname = host?.split(":")[0] ?? "";
  const slug = extractSlug(hostname);
  const isRootDomain = slug === null;

  const requestHeaders = new Headers(req.headers);
  if (slug) requestHeaders.set("x-tenant-slug", slug);

  let payload: { role: string; organizationId: string } | null = null;

  if (token) {
    try {
      payload = await verifyToken(token);
      requestHeaders.set("x-user-role", payload.role);
      requestHeaders.set("x-user-org-id", payload.organizationId);
    } catch {
    }
  }

  if (pathname === "/register" && !isRootDomain) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && payload) {
    if (isProtectedPage) {
      if (!host) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      if (payload.role !== "ADMIN" && payload.role !== "OWNER") {
        return NextResponse.redirect(new URL("/home", req.url));
      }
    }

    if (isAuthPage) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  } else if (token && !payload) {
   
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("token");
    return response;
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};