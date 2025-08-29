// src/hono-server.ts
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { handler as ssrHandler } from '../dist/server/entry.mjs';
import { page as apiPage } from '../dist/server/pages/api/_---path_.astro.mjs'; // Astro API routes

const app = new Hono();

// -------------------------------
// 1️⃣ API Routes
// -------------------------------
const api = new Hono();

api.all('*', async (c) => {
  const resp = await apiPage().ALL({ request: c.req.raw });

  const contentType = resp.headers.get('content-type') || '';

  // 🚀 Fast path: JSON responses
  if (contentType.includes('application/json')) {
    const data = await resp.json();
    return c.json(data, resp.status); // Bun-native JSON serialization
  }

  // 🌀 Fallback: stream everything else (HTML, streams, big payloads, etc.)
  return new Response(resp.body, {
    status: resp.status,
    headers: resp.headers,
  });
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
app.use(ssrHandler); // All other routes handled by Astro SSR

// -------------------------------
// 4️⃣ Start the Server
// -------------------------------
console.log('🚀 Server running at http://localhost:4321');

export default {
  fetch: app.fetch,
  port: process.env.PORT ?? 4321,
};
