import type { JsonifiedClient } from '@orpc/openapi-client';
import type { ContractRouterClient } from '@orpc/contract';
import { createORPCClient, onError } from '@orpc/client';
import { OpenAPILink } from '@orpc/openapi-client/fetch';
import type { Router } from '@hono-adapt/orpc/routes/router';

const contract = await fetch('http://localhost:4321/api/rpc/generate-contract-json').then((res) =>
  res.json()
);

const link = new OpenAPILink(contract as any, {
  // ✅ Dynamically resolve URL for server or client
  url: () => {
    return 'http://localhost:4321/api/rpc';
  },

  // ✅ Custom fetch ensures cookies/sessions are included for cross-origin calls
  fetch: (request, init) =>
    globalThis.fetch(request, {
      ...init,
      credentials: 'include',
    }),

  // ✅ Properly typed interceptor using the helper factory
  interceptors: [
    onError((error) => {
      console.error('API Error:', error);
    }),
  ],
});
export const client: JsonifiedClient<ContractRouterClient<Router>> = createORPCClient(link);
