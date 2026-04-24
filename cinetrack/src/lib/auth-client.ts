import {createAuthClient} from "better-auth/react";
import {i18nClient} from "@better-auth/i18n/client";
import {twoFactorClient} from "better-auth/plugins/two-factor";
import {passkeyClient} from "@better-auth/passkey/client";
import {
    adminClient,
    inferAdditionalFields,
    lastLoginMethodClient,
    multiSessionClient,
    oneTapClient
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", plugins: [inferAdditionalFields({
        user: {
            normalizedEmail: {
                type: "string", required: false,
            }, lastLoginMethod: {
                type: "string", required: false,
            },
        }
    }), adminClient(), i18nClient(), passkeyClient(), lastLoginMethodClient(), multiSessionClient(), twoFactorClient({
        onTwoFactorRedirect() {
            const pathSegments = window.location.pathname.split('/');
            const lang = ['en', 'cs'].includes(pathSegments[1]) ? pathSegments[1] : 'en';
            window.location.href = `/${lang}/2fa`;
        }
    }), oneTapClient({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!, promptOptions: {
            fedCM: true,
        },
    })],
});
