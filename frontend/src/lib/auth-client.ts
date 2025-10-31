import { createAuthClient } from 'better-auth/react';
export const authClient = createAuthClient({
  baseURL: 'http://localhost:4321',
  credentials: 'include', // The base URL of your auth server
});
