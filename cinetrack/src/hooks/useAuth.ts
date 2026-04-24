import {authClient} from "@/lib/auth-client";
import {useState} from "react";

export type AuthProvider = 'google' | 'passkey' | 'email'

export type ReAuthConfig = {
    onSuccess: (password?: string) => void; onError?: (error: string | undefined) => void; onNeedsPassword?: () => void;
};


export function useAuth() {
    const [pendingSuccess, setPendingSuccess] = useState<((password?: string) => void) | null>(null);

    const reAuth = async (provider: AuthProvider, config: ReAuthConfig) => {
        const {onSuccess, onError, onNeedsPassword} = config;

        switch (provider) {
            case 'google': {
                await authClient.signIn.social({
                    provider: 'google',
                    disableRedirect: true,
                    callbackURL: window.location.origin + '/auth-callback',
                    fetchOptions: {
                        onSuccess: (ctx) => {
                            if (ctx.data?.url) {
                                const popup = window.open(ctx.data.url, 'auth_popup', 'width=500,height=600');

                                const handleMessage = (event: MessageEvent) => {
                                    if (event.origin === window.location.origin && event.data === "auth_complete") {
                                        onSuccess();
                                        window.removeEventListener("message", handleMessage);
                                    }
                                };

                                window.addEventListener("message", handleMessage);

                                const timer = setInterval(() => {
                                    if (popup?.closed) {
                                        clearInterval(timer);
                                        window.removeEventListener("message", handleMessage);
                                    }
                                }, 1000);
                            }
                        }, onError: (ctx) => {
                            onError?.(ctx.error.message);
                        }
                    }
                });
                break;
            }
            case 'passkey':
                await authClient.signIn.passkey({
                    fetchOptions: {
                        onSuccess: () => {
                            onSuccess();
                        }, onError: (ctx) => {
                            onError?.(ctx.error.message);
                        }
                    }
                });
                break;
            case 'email':
                setPendingSuccess(() => onSuccess);
                onNeedsPassword?.();
                break;
            default:
                setPendingSuccess(() => onSuccess);
                onNeedsPassword?.();
                break;
        }
    }

    const resolvePassword = (password: string) => {
        if (pendingSuccess) {
            pendingSuccess(password);
            setPendingSuccess(null);
        }
    }

    return {
        reAuth, resolvePassword
    }
}
