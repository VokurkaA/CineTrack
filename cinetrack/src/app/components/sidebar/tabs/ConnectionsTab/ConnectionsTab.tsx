import {Modal} from "@heroui/react";
import {authClient} from "@/lib/auth-client";
import React from "react";
import {useDictionary} from "@/app/components/DictionaryContext";
import TwoFactor from "@/app/components/sidebar/tabs/ConnectionsTab/TwoFactor";
import Passkeys from "@/app/components/sidebar/tabs/ConnectionsTab/Passkeys";
import {usePasskeys} from "@/hooks/usePasskeys";

export const ConnectionsTab = ({session, passkeyHooks}: {
    session?: ReturnType<typeof authClient.useSession>["data"],
    passkeyHooks: ReturnType<typeof usePasskeys>
}) => {
    const dictionary = useDictionary();
    const t = dictionary.sidebar.settings.connections;

    return (<div className="flex flex-col gap-4">
        <Modal.Heading>{t.twoFactor.title}</Modal.Heading>
        <TwoFactor
            isEnabled={session?.user.twoFactorEnabled ?? false}
            lastLoginMethod={session?.user.lastLoginMethod}
        />

        <Modal.Heading>{t.passkey.title}</Modal.Heading>
        <Passkeys {...passkeyHooks}/>
    </div>)
};
