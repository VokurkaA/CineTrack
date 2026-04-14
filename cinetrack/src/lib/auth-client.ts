import { createAuthClient } from "better-auth/react";
import { i18nClient } from "@better-auth/i18n/client";
import { twoFactorClient } from "better-auth/plugins/two-factor";
import { passkeyClient } from "@better-auth/passkey/client";
import {adminClient, lastLoginMethodClient, oneTapClient} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",  
  plugins: [
    adminClient(),
    i18nClient(),
    twoFactorClient(),
    passkeyClient(),
    lastLoginMethodClient(),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      promptOptions: {
        fedCM: true,
      },
    })
  ],
});
