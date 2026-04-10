"use client";

import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

export function SessionGuard() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname.split("/")[1];

    useEffect(() => {
        if (!isPending && !session) {
            router.replace(`/${locale}/login?callbackURL=${pathname}`);
        }
    }, [session, isPending, router, locale, pathname]);

    return null;
}