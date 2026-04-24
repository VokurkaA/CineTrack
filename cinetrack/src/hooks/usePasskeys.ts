import {useCallback, useEffect, useState} from "react";
import {authClient} from "@/lib/auth-client";

export type Passkey = (typeof authClient extends {
    passkey: { listUserPasskeys(): Promise<{ data: (infer T)[] | null }> }
} ? T : never) & { aaguid?: string };

export function usePasskeys() {
    const [passkeys, setPasskeys] = useState<Passkey[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const load = useCallback(async () => {
        setIsLoading(true);
        const {data} = await authClient.passkey.listUserPasskeys();
        if (data) setPasskeys(data);
        setIsLoading(false);
    }, []);

    const add = useCallback(async (name?: string) => {
        const {data, error} = await authClient.passkey.addPasskey({name});
        if (!error) await load();
        return {data, error};
    }, [load]);

    const rename = useCallback(async (id: string, name: string) => {
        const {error} = await authClient.passkey.updatePasskey({id, name});
        if (!error) await load();
        return error;
    }, [load]);

    const remove = useCallback(async (id: string) => {
        const {error} = await authClient.passkey.deletePasskey({id});
        if (!error) await load();
        return error;
    }, [load]);

    useEffect(() => {
        (async () => {
            await load();
        })();
    }, [load]);

    return {passkeys, isLoading, add, rename, remove};
}