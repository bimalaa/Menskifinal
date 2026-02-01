import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtectedPage = pathname.startsWith("/cart") || pathname.startsWith("/checkout");
  const isAdminPage = pathname.startsWith("/admin");

  if (!token) {
    if (isProtectedPage || isAdminPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);

      if (isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (isAdminPage && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      if (isProtectedPage || isAdminPage) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/admin/:path*", "/login", "/register"],
};
