// src/pages/api/[...path].ts
import type { APIRoute } from 'astro';
import app from '@hono-adapt';

// Forward all requests to Hono app
export const ALL: APIRoute = ({ request }) => {
  return app.fetch(request);
};
