// src/hono-server.ts
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { handler as ssrHandler } from '../dist/server/entry';
import { page as apiPage } from '../dist/server/pages/api/_---path_.astro';

const app = new Hono();
app.proxyTrust = true;

// Forward /api/* to Astro API (needed for auth/logout)
const api = new Hono();
api.all('*', async (c) => {
  const req = new Request(c.req.url, {
    method: c.req.method,
    headers: c.req.raw.headers,
    body: c.req.method !== 'GET' && c.req.method !== 'HEAD' ? c.req.raw.body : undefined,
  });
  return apiPage().ALL({ request: req });
});
app.route('/api', api);

app.use('/_astro/*', serveStatic({ root: './dist/client/' }));
app.use('/favicon.svg', serveStatic({ root: './dist/client/' }));
app.use('/robots.txt', serveStatic({ root: './dist/client/' }));
app.use(ssrHandler);

Bun.serve({
  hostname: '0.0.0.0',
  port: 4321,
  fetch(req) {
    // ✅ Force correct public origin for auth libs (Better Auth)
    const proto = req.headers.get('x-forwarded-proto') ?? 'http';
    const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? 'localhost:4321';

    const url = new URL(req.url);
    url.protocol = proto + ':';
    url.host = host;

    // Preserve method/headers/body
    const fixedReq = new Request(url.toString(), req);
    return app.fetch(fixedReq);
  },
});
