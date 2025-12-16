import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@db/db-instance'; // your drizzle instance
import { openAPI } from 'better-auth/plugins';
import * as schema from '@db/shema-index';
import { hashPassword, verifyPassword } from '@/lib/argon2';

export const auth = betterAuth({
  basePath: '/api/auth',
  trustedOrigins: [
    'http://localhost:4321',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://192.168.0.71:4321',
  ],
  database: drizzleAdapter(db, {
    provider: 'sqlite', // or "mysql", "sqlite"
    schema: schema,
    camelCase: false,
  }),
  emailAndPassword: {
    enabled: true,
    maxPasswordLength: 20,
    minPasswordLength: 2,
    requireEmailVerification: false,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
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
