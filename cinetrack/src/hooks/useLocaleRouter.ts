"use client";
import { useRouter, usePathname } from "next/navigation";

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
    const locale = segments[1];
    const cleanPathname = "/" + segments.slice(2).join("/");
    
    const prefix = (path: string) => `/${locale}${path}`;

    return {
        push:    (path: string) => router.push(prefix(path)),
        replace: (path: string) => router.replace(prefix(path)),
        refresh: () => router.refresh(),
        locale,
        cleanPathname,
    };
}