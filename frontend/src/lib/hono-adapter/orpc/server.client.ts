// src/lib/api/orpcClient.ts
import type { JsonifiedClient } from '@orpc/openapi-client';
import type { ContractRouterClient } from '@orpc/contract';

import { createORPCClient, onError } from '@orpc/client';
import { OpenAPILink } from '@orpc/openapi-client/fetch';

import { router, type Router } from '@hono-adapt/orpc/routes/router';
import { envConfig } from '@/lib/env';

// 👇 Context passed into ORPC client
export interface ClientContext {
  cookie?: string;
}

// 👇 Proper ORPC link
const link = new OpenAPILink<ClientContext>(router, {
  url: envConfig.PUBLIC_API_URL,

  // Required so browser calls send cookies
  fetch: (request, init) =>
    fetch(request, {
      ...init,
      credentials: 'include',
    }),

  // CRITICAL: send cookies/auth headers to backend
  headers: async ({ context }) => ({
    'Content-Type': 'application/json',
    ...(context?.cookie ? { Cookie: context.cookie } : {}),
  }),

  interceptors: [
    onError((error) => {
      console.error('API Error:', error);
    }),
  ],
});

// Export client
export const client: JsonifiedClient<ContractRouterClient<Router, ClientContext>> =
  createORPCClient(link);
