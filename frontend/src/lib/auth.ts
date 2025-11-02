import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@db/db-instance'; // your drizzle instance
import { openAPI } from 'better-auth/plugins';
import * as schema from '@db/shema-index';

export const auth = betterAuth({
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
