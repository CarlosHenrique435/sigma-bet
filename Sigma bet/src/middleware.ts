import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken, JWT_COOKIE_NAME } from "@/lib/middleware-auth";

const userRoutes = [
  "/dashboard",
  "/game",
  "/wallet",
  "/history",
  "/profile",
];

const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(JWT_COOKIE_NAME)?.value;
  const user = token ? await verifyAuthToken(token) : null;

  const isUserRoute = userRoutes.some((r) => pathname.startsWith(r));
  const isAdminRoute =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isAuthPage = authRoutes.some((r) => pathname === r);
  const isAdminAuthPage = pathname.startsWith("/admin/login");

  if ((isUserRoute || isAdminRoute) && !user) {
    const loginUrl = new URL(
      isAdminRoute ? "/admin/login" : "/login",
      request.url
    );
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isUserRoute && user?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isAdminRoute && user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAdminAuthPage && user?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isAuthPage && user) {
    const dest = user.role === "ADMIN" ? "/admin" : "/dashboard";
    const redirect = request.nextUrl.searchParams.get("redirect");
    const safeRedirect =
      redirect && redirect.startsWith("/") && !redirect.startsWith("//")
        ? redirect
        : dest;
    return NextResponse.redirect(new URL(safeRedirect, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/game/:path*",
    "/wallet/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/admin",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
