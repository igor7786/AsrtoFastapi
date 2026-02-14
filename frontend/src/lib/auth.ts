import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@db/db-instance'; // your drizzle instance
import { openAPI } from 'better-auth/plugins';
// import { admin } from 'better-auth/plugins';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import * as schema from '@db/shema-index';
import { hashPassword, verifyPassword } from '@/lib/argon2';
import { envServer } from '@/lib/env/env.server';
import { emailQueue } from '@/lib/queues/email-queue';
import { redis } from '@/lib/queues/redis'; // Import the Redis client
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
    provider: 'pg', // or "mysql", "sqlite"
    schema: schema,
    camelCase: false,
    debugLogs: false,
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
    expiresIn: 60 * 15, // 15 minutes

    sendVerificationEmail: async ({ user, url, token }) => {
      await redis.set(token, JSON.stringify(user), 'EX', 60 * 15); // Store user ID with expiration
      const getUrl = new URL(url);
      getUrl.port = '443'; // Ensure the port is correct for the verification link
      getUrl.pathname = '/api/rpc/verify-email';
      const newUrl = getUrl.toString();
      await emailQueue.add('verifyEmail', {
        email: user.email,
        verifyUrl: newUrl,
        user,
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
  advanced: {
    ipAddress: {
      ipAddressHeaders: [
        'x-forwarded-for',
        'x-real-ip',
        'cf-connecting-ip',
        'fastly-client-ip',
        'true-client-ip',
        'x-cluster-client-ip',
        'x-forwarded',
        'forwarded-for',
        'forwarded',
      ],
    },
  },
  plugins: [openAPI()],
});
