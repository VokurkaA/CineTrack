"use client";

import { useEffect } from "react";

export default function AuthCallbackPage() {
    useEffect(() => {
        if (window.opener) {
            window.opener.postMessage("auth_complete", window.location.origin);
        }
        window.close();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-sm text-muted-foreground">Authenticating...</p>
        </div>
    );
}
