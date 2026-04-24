"use client";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

type LocaleRouter = {
    push: (path: string) => void;
    replace: (path: string) => void;
    refresh: () => void;
    locale: string;
};

export function useLocaleRouter(): LocaleRouter & { cleanPathname: string } {
    const router = useRouter();
    const pathname = usePathname();
    
    const segments = pathname.split("/");
    const locale = segments[1] || "en";
    const cleanPathname = "/" + segments.slice(2).join("/");
    
    const push = useCallback((path: string) => router.push(`/${locale}${path}`), [router, locale]);
    const replace = useCallback((path: string) => router.replace(`/${locale}${path}`), [router, locale]);
    const refresh = useCallback(() => router.refresh(), [router]);

    return useMemo(() => ({
        push,
        replace,
        refresh,
        locale,
        cleanPathname,
    }), [push, replace, refresh, locale, cleanPathname]);
}