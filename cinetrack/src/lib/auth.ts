import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {i18n} from "@better-auth/i18n";
import {db} from "../db";
import * as schema from "../db/schema";
import {admin} from "better-auth/plugins/admin";
import {twoFactor} from "better-auth/plugins/two-factor";
import {passkey} from "@better-auth/passkey";
import {lastLoginMethod, multiSession, oneTap} from "better-auth/plugins";
import {emailHarmony} from "better-auth-harmony";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    database: drizzleAdapter(db, {
        provider: "pg", schema: schema,
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000", 'http://10.251.77.1:3000'],

    emailAndPassword: {
        enabled: true,

        sendResetPassword: async ({user, url}) => {
            console.log(`[EMAIL] Password reset for ${user.email}`);
            console.log(`[EMAIL] URL: ${url}`);
        },

        onExistingUserSignUp: async ({user}) => {
            console.log(`[EMAIL] Duplicate sign-up attempt for ${user.email}`);
        },
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },

    emailVerification: {
        sendOnSignUp: true, sendVerificationEmail: async ({user, url}) => {
            console.log(`[EMAIL] Verify email for ${user.email}`);
            console.log(`[EMAIL] URL: ${url}`);
        },
    },

    user: {
        additionalFields: {
            normalizedEmail: {
                type: "string", required: false,
            }, lastLoginMethod: {
                type: "string", required: false,
            },
        }, changeEmail: {
            enabled: true, sendChangeEmailConfirmation: async ({user, newEmail, url}) => {
                console.log(`[EMAIL] Change email confirmation for ${user.email} -> ${newEmail}`,);
                console.log(`[EMAIL] URL: ${url}`);
            },
        },
    },

    plugins: [admin(), emailHarmony(), passkey(), oneTap(), multiSession(), lastLoginMethod({
        storeInDatabase: true,
    }), twoFactor({
        allowPasswordless: true, issuer: "App name", otpOptions: {
            async sendOTP({user, otp}, ctx) {
                console.log(`[2FA OTP] 2FA verification request for ${user.email}`,);
                console.log(`[2FA OTP] Code: ${otp}`);
            },
        },
    }),

        i18n({
            defaultLocale: "en", detection: ["cookie", "header"], translations: {
                cs: {
                    USER_NOT_FOUND: "Uživatel nenalezen",
                    USER_ALREADY_EXISTS: "Uživatel s tímto e-mailem již existuje",
                    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "E-mail je již používán. Použijte prosím jiný.",
                    INVALID_EMAIL: "Neplatná e-mailová adresa",
                    INVALID_PASSWORD: "Neplatné heslo",
                    INVALID_EMAIL_OR_PASSWORD: "Neplatný e-mail nebo heslo",
                    PASSWORD_TOO_SHORT: "Heslo je příliš krátké",
                    PASSWORD_TOO_LONG: "Heslo je příliš dlouhé",
                    EMAIL_NOT_VERIFIED: "Nejprve prosím ověřte svůj e-mail",
                    SESSION_EXPIRED: "Vaše relace vypršela. Přihlaste se prosím znovu",
                    TOKEN_EXPIRED: "Odkaz vypršel",
                    INVALID_TOKEN: "Neplatný odkaz nebo kód",
                    FAILED_TO_CREATEx_USER: "Nepodařilo se vytvořit uživatele",
                    SOCIAL_ACCOUNT_ALREADY_LINKED: "Tento sociální účet je již propojen s jiným uživatelem",
                    PROVIDER_NOT_FOUND: "Poskytovatel přihlášení nebyl nalezen",
                    TOO_MANY_ATTEMPTS: "Příliš mnoho pokusů. Zkuste to prosím později",
                    INTERNAL_SERVER_ERROR: "Vnitřní chyba serveru. Zkuste to prosím později",
                    UNKNOWN_ERROR: "Došlo k neznámé chybě",
                },
            },
        }),],
});
