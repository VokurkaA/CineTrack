import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],

  emailAndPassword: {
    enabled: true,

    sendResetPassword: async ({ user, url }) => {
      console.log(`[EMAIL] Password reset for ${user.email}`);
      console.log(`[EMAIL] URL: ${url}`);
    },

    onExistingUserSignUp: async ({ user }) => {
      console.log(`[EMAIL] Duplicate sign-up attempt for ${user.email}`);
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log(`[EMAIL] Verify email for ${user.email}`);
      console.log(`[EMAIL] URL: ${url}`);
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        console.log(
          `[EMAIL] Change email confirmation for ${user.email} -> ${newEmail}`,
        );
        console.log(`[EMAIL] URL: ${url}`);
      },
    },
  },
});
