import { createAuthClient } from 'better-auth/react';
import { envConfig } from '@/lib/env';
export const authClient = createAuthClient({
  baseURL: envConfig.PUBLIC_URL,
  credentials: 'include', // The base URL of your auth server
});
