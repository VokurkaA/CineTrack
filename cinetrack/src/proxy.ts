import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "cs"];
const defaultLocale = "en";
const publicRoutes = ["login", "register", "reset-password", "set-password"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Locale redirect
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // 2. Auth guard
  const locale = pathname.split("/")[1];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(`/${locale}/${route}`),
  );

  if (!isPublicRoute) {
    const session = getSessionCookie(request);

    if (!session) {
      const url = new URL(`/${locale}/login`, request.url);
      const isRoot = pathname === `/${locale}` || pathname === `/${locale}/`;
      if (!isRoot) {
        url.searchParams.set("callbackURL", pathname);
      }
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/en/:path*", "/cs/:path*", "/"],
};
