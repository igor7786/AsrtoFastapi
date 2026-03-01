// src/pages/api/[...path].ts
import type { APIRoute } from 'astro';
import app from '@/lib/hono-adapter/orpc';
import { findIp } from '@arcjet/ip';

// Forward all requests to Hono app
export const ALL: APIRoute = ({ request }) => {
  // Get IP from headers
  const ip = findIp(request) || 'unknown';
  console.log('Request Headers:', request.headers);
  // Build fingerprint explicitly with IP
  console.log('API request IP:', ip);

  return app.fetch(request);
};
