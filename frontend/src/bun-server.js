// src/hono-server.ts
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { handler as ssrHandler } from '../dist/server/entry';
import { page as apiPage } from '../dist/server/pages/api/_---path_.astro';
import * as fs from 'fs';

const cert = fs.readFileSync(
  '/home/igor7786/PycharmProjects/PythonProject/AsrtoFastapi/frontend/src/ssl/full_chain.pem'
);
const key = fs.readFileSync(
  '/home/igor7786/PycharmProjects/PythonProject/AsrtoFastapi/frontend/src/ssl/_.igorfastapi.co.uk_private_key.key'
);

const app = new Hono();

// 1️⃣ Trust Bun as proxy for IP forwarding
app.use('*', async (c, next) => {
  const ip =
    c.req.header('x-forwarded-for')?.split(',')[0].trim() || c.req.raw.remoteAddr?.hostname || '0.0.0.0';

  c.set('clientIP', ip);
  await next();
});

// 2️⃣ API routes
const api = new Hono();

api.all('*', async (c) => {
  const r = c.req.raw;

  const req = new Request(r.url, {
    method: r.method,
    headers: r.headers,
    body: r.method !== 'GET' && r.method !== 'HEAD' ? r.clone().body : null,
    redirect: 'manual',
  });

  return apiPage().ALL({ request: req });
});

app.route('/api', api);

// 3️⃣ Static files
app.use('/_astro/*', serveStatic({ root: './dist/client/' }));
app.use('/favicon.svg', serveStatic({ root: './dist/client/' }));
app.use('/robots.txt', serveStatic({ root: './dist/client/' }));

// 4️⃣ SSR
app.use(ssrHandler);

// 5️⃣ Start server
console.log('🚀 Server running at https://igorfastapi.co.uk');

Bun.serve({
  hostname: 'igorfastapi.co.uk',
  port: 443,
  tls: { key, cert },
  fetch(req, server) {
    const clientIP = server.requestIP(req)?.address ?? '0.0.0.0';

    const headers = new Headers(req.headers);
    if (!headers.has('x-forwarded-for')) {
      headers.set('x-forwarded-for', clientIP);
    }
    if (!headers.has('x-real-ip')) {
      headers.set('x-real-ip', clientIP);
    }
    const forwardedRequest = new Request(req.url, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.clone().body : undefined,
    });

    return app.fetch(forwardedRequest);
  },
});
