import {useState} from "react";
import {toast} from "@heroui/react";
import {authClient} from "@/lib/auth-client";
import {AuthProvider, useAuth} from "@/hooks/useAuth";

type UseTwoFactorOptions = {
    lastLoginMethod?: string | null;
    onNeedsPassword: () => void;
    onEnableSuccess: (totpURI: string, backupCodes: string[]) => void;
    onDisableSuccess: () => void;
    onRegenerateSuccess: (backupCodes: string[]) => void;
};

export function useTwoFactor({
                                 lastLoginMethod,
                                 onNeedsPassword,
                                 onEnableSuccess,
                                 onDisableSuccess,
                                 onRegenerateSuccess,
                             }: UseTwoFactorOptions) {
    const {reAuth, resolvePassword} = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const runTask = (task: (password?: string) => Promise<void>) => {
        if (isLoading) return;
        setIsLoading(true);
        reAuth((lastLoginMethod ?? 'email') as AuthProvider, {
            onSuccess: (password) => task(password),
            onNeedsPassword,
            onError: (err) => toast.danger(err || "Authentication failed"),
        }).finally(() => setIsLoading(false));
    };

    const enable = async (password?: string) => {
        await authClient.twoFactor.enable({
            password, fetchOptions: {
                onSuccess: (res) => onEnableSuccess(res.data.totpURI, res.data.backupCodes), onError: (ctx) => {
                    toast.danger(ctx.error.message)
                },
            },
        });
    };

    const disable = async (password?: string) => {
        await authClient.twoFactor.disable({
            password, fetchOptions: {
                onSuccess: onDisableSuccess, onError: (ctx) => {
                    toast.danger(ctx.error.message)
                },
            },
        });
    };

    const regenerateCodes = async (password?: string) => {
        await authClient.twoFactor.generateBackupCodes({
            password, fetchOptions: {
                onSuccess: (res) => onRegenerateSuccess(res.data.backupCodes), onError: (ctx) => {
                    toast.danger(ctx.error.message)
                },
            },
        });
    };

    const verifyTotp = async (code: string) => {
        setIsLoading(true);
        await authClient.twoFactor.verifyTotp({
            code, fetchOptions: {
                onError: (ctx) => {
                    toast.danger(ctx.error.message)
                },
            },
        });
        setIsLoading(false);
    };

    return {
        isLoading,
        toggle: (isEnabled: boolean) => runTask(isEnabled ? disable : enable),
        regenerateCodes: () => runTask(regenerateCodes),
        verifyTotp,
        resolvePassword,
    };
}