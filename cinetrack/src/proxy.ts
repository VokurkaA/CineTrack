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
    // Check for cookie or header
    const cookieLocale = request.cookies.get("better-auth-locale")?.value;
    const acceptLanguage = request.headers.get("accept-language");
    const browserLocale = acceptLanguage?.split(",")[0]?.split("-")[0];

    const locale = (cookieLocale && locales.includes(cookieLocale))
      ? cookieLocale
      : (browserLocale && locales.includes(browserLocale))
      ? browserLocale
      : defaultLocale;

    request.nextUrl.pathname = `/${locale}${pathname}`;
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

  // Pass current locale in headers for easier access in Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // Also set on response for potential client-side use
  response.headers.set("x-locale", locale);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.webp|.*\\.css).*)",
  ],
};
