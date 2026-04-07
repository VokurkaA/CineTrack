import { auth } from "@/lib/auth";
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'cs']
const defaultLocale = 'en'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Handle Locale Redirection
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasLocale) {
    const locale = defaultLocale
    request.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(request.nextUrl)
  }

  // 2. Auth Guard
  const locale = pathname.split('/')[1]
  
  // Public routes that don't require authentication
  const isPublicRoute = 
    pathname === `/${locale}/login` || 
    pathname === `/${locale}/register` ||
    pathname.startsWith('/api/auth')

  if (!isPublicRoute) {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      const url = new URL(`/${locale}/login`, request.url);
      url.searchParams.set("callbackURL", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|api/auth|static|.*\\..*).*)',
  ],
}
