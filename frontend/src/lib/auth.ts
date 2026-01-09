import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@db/db-instance'; // your drizzle instance
import { openAPI } from 'better-auth/plugins';
// import { admin } from 'better-auth/plugins';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import * as schema from '@db/shema-index';
import { hashPassword, verifyPassword } from '@/lib/argon2';
import { envServer } from '@/lib/env/env.server';
import { resend } from '@/lib/resend-email';
import { WelcomeEmail } from '@rcomp/auth-forms-emails/emails/VerificationEmail';

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
  // hooks: {
  //   before: createAuthMiddleware(async (ctx) => {
  //     console.log('BEFORE', ctx.path, ctx.headers);
  //     if (ctx.path === '/api/rpc/verify-email') {
  //       console.log('BEFORE VERIFY EMAIL', ctx);
  //     }
  //   }),
  //   after: createAuthMiddleware(async (ctx) => {
  //     console.log('AFTER', ctx.path, ctx.method, ctx.params);
  //     if (ctx.path === '/api/rpc/verify-email') {
  //       console.log('AFTER VERIFY EMAIL', ctx);
  //     }
  //   }),
  // },

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
      const getUrl = new URL(url);
      getUrl.pathname = '/api/rpc/verify-email';
      // getUrl.searchParams.set('user', user.email);
      const newUrl = getUrl.toString();
      void resend.emails
        .send({
          from: 'Verification <astrofastapi@igorfastapi.co.uk>',
          to: 'grimuta60@gmail.com',
          subject: 'Email Verification',
          react: WelcomeEmail({ user, newUrl }),
        })
        .then((result) => {
          if (result.error) {
            console.error('[EMAIL ERROR]', {
              userId: user.id,
              email: user.email,
              statusCode: result.error.statusCode,
              message: result.error.message,
              name: result.error.name,
            });
          }
        })
        .catch((err) => {
          // only network / runtime failures
          console.error('[EMAIL FATAL]', {
            userId: user.id,
            email: user.email,
            message: err.message,
            fullError: err,
          });
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
