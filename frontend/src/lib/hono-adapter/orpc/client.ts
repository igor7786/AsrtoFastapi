import type { JsonifiedClient } from '@orpc/openapi-client';
import type { ContractRouterClient } from '@orpc/contract';
import { createORPCClient, onError } from '@orpc/client';
import { OpenAPILink } from '@orpc/openapi-client/fetch';
import type { Router } from '@hono-adapt/orpc/routes/router';
import { envConfig } from '@/lib/env';
import { ORPCError } from '@orpc/client';

// const contract = await fetch('http://localhost:4321/api/rpc/generate-contract-json').then((res) =>
//   res.json()
// );
import contract from '@hono-adapt/orpc/open-api-docs/contract.json';
const link = new OpenAPILink(contract as any, {
  // ✅ Dynamically resolve URL for server or client
  // for mobile use http://192.168.0.71:4321/api/rpc',
  url: envConfig.PUBLIC_API_URL,
  // ✅ Custom fetch ensures cookies/sessions are included for cross-origin calls
  fetch: (request, init) =>
    fetch(request, {
      ...init,
      credentials: 'include',
    }),

  // ✅ Properly typed interceptor using the helper factory
  interceptors: [
    onError((err) => {
      if (err instanceof ORPCError) {
        console.error('[ORPC Error:]', err.status, err.code, err.message);
      } else {
        console.error('Unexpected Error:', err);
      }
    }),
  ],
});
export const client: JsonifiedClient<ContractRouterClient<Router>> = createORPCClient(link);
