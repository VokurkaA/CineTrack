"use client";
import { authClient } from "@/lib/auth-client";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useEffect } from "react";

export function SessionGuard() {
    const { data: session, isPending } = authClient.useSession();
    const router = useLocaleRouter();

    useEffect(() => {
        if (!isPending && !session) {
                router.replace("/login");
        }
    }, [session, isPending, router]);

    return null;
}