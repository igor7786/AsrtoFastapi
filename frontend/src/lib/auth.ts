import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@db/db-instance'; // your drizzle instance
import { openAPI } from 'better-auth/plugins';
import * as schema from '@db/shema-index';
import { hashPassword, verifyPassword } from '@/lib/argon2';
import { envServer } from '@/lib/env/env.server';
import { resend } from '@/lib/resend-email';

export const auth = betterAuth({
  basePath: '/api/auth',
  trustedOrigins: [
    'http://localhost:4321',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://192.168.0.71:4321',
    'http://172.30.233.210:4321',
  ],
  database: drizzleAdapter(db, {
    provider: 'sqlite', // or "mysql", "sqlite"
    schema: schema,
    camelCase: false,
  }),
  socialProviders: {
    google: {
      clientId: envServer.GOOGLE_CLIENT_ID,
      clientSecret: envServer.GOOGLE_CLIENT_SECRET,
      accessType: 'offline',
      prompt: 'select_account consent',
    },
    github: {
      clientId: envServer.GITHUB_CLIENT_ID,
      clientSecret: envServer.GITHUB_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
    maxPasswordLength: 20,
    minPasswordLength: 4,
    requireEmailVerification: true,
    autoSignIn: false,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
  emailVerification: {
    sendOnSignUp: true, // Automatically sends a verification email at signup
    autoSignInAfterVerification: true, // Automatically signIn the user after verification
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: 'Acme <astrofastapi@resend.dev>', // You could add your custom domain
        to: user.email, // email of the user to want to end
        subject: 'Email Verification', // Main subject of the email
        html: `Click the link to verify your email: ${url}`, // Content of the email
        // you could also use "React:" option for sending the email template and there content to user
      });
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 1 day — recheck session validity daily
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days — total DB session lifetime
    updateAge: 60 * 60 * 24, // 1 day — refresh session expiry if user active
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  plugins: [openAPI()],
});
