import {useEffect, useState} from "react";
import {authClient} from "@/lib/auth-client";

type Passkey = typeof authClient extends {
    passkey: { listUserPasskeys(): Promise<{ data: (infer T)[] | null }> }
} ? T : never;

export function usePasskeys() {
    const [passkeys, setPasskeys] = useState<Passkey[]>([]);

    const load = async () => {
        const {data} = await authClient.passkey.listUserPasskeys();
        if (data) setPasskeys(data);
    };

    const add = async (name?: string) => {
        const {error} = await authClient.passkey.addPasskey({name});
        if (!error) await load();
        return error;
    };

    const rename = async (id: string, name: string) => {
        const {error} = await authClient.passkey.updatePasskey({id, name});
        if (!error) await load();
        return error;
    };

    const remove = async (id: string) => {
        const {error} = await authClient.passkey.deletePasskey({id});
        if (!error) await load();
        return error;
    };

    useEffect(() => {
        (async () => {
            await load();
        })();
    }, []);

    return {passkeys, add, rename, remove};
}