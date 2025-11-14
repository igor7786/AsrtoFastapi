import type { JsonifiedClient } from '@orpc/openapi-client';
import type { ContractRouterClient } from '@orpc/contract';
import { createORPCClient, onError } from '@orpc/client';
import { OpenAPILink } from '@orpc/openapi-client/fetch';
import { router } from '@hono-adapt/orpc/routes/router';
import { envConfig } from '@/lib/env';

const link = new OpenAPILink(router, {
  // ✅ Dynamically resolve URL for server or client
  url: () => {
    return envConfig.PUBLIC_API_URL;
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
export const client: JsonifiedClient<ContractRouterClient<typeof router>> = createORPCClient(link);
