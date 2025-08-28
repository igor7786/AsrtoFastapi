import { Hono } from 'hono';
import { serveStatic } from 'hono/bun'; // Import the serveStatic from your favorite runtime
import { handler as ssrHandler } from '../dist/server/entry.mjs';
import { api } from '@/lib/hono-adapt/hono-api.ts'; // Import the handler from the built project

const app = new Hono();

// API routes first
app.route('/api', api);
// Serve the static files by Hono in production have to serve Nginx
// app.use('/*', serveStatic({ root: './dist/client/' }));
// Static assets (if not using Nginx/CDN)
app.use('/_astro/*', serveStatic({ root: './dist/client/' }));
app.use('/favicon.svg', serveStatic({ root: './dist/client/' }));
app.use('/robots.txt', serveStatic({ root: './dist/client/' }));

// SSR fallback
app.use(ssrHandler);

// Start the server as inidicated by the runtime in the hono documentation
console.log('Server is running on http://localhost:4321');
export default {
  fetch: app.fetch,
  port: process.env.PORT ?? 4321,
};
