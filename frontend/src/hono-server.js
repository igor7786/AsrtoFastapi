// src/hono-server.ts

import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { handler as ssrHandler } from '../dist/server/entry.mjs';
import { page as apiPage } from '../dist/server/pages/api/_---path_.astro.mjs';

const app = new Hono();

// -------------------------------
// 1️⃣ API Routes
// -------------------------------
const api = new Hono();

api.all('*', async (c) => {
  const req = new Request(c.req.url, {
    method: c.req.method,
    headers: c.req.raw.headers, // preserves cookies
    body: c.req.method !== 'GET' && c.req.method !== 'HEAD' ? c.req.raw.body : undefined,
  });

  // Forward to Astro API handler
  return apiPage().ALL({ request: req });
});

app.route('/api', api);

// -------------------------------
// 2️⃣ Static Files
// -------------------------------
app.use('/_astro/*', serveStatic({ root: './dist/client/' }));
app.use('/favicon.svg', serveStatic({ root: './dist/client/' }));
app.use('/robots.txt', serveStatic({ root: './dist/client/' }));

// -------------------------------
// 3️⃣ SSR Fallback
// -------------------------------
app.use(ssrHandler);

// -------------------------------
// 4️⃣ Start the Server
// -------------------------------
console.log('🚀 Server running at http://localhost:4321');

export default {
  fetch: app.fetch,
  port: process.env.PORT ?? 4321,
};
