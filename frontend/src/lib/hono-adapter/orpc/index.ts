// src/orpc/server.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { openApiHandler } from '@hono-adapt/orpc/open-api-docs/open-api-spec';
import { auth } from '@/lib/auth';
import { Scalar } from '@scalar/hono-api-reference';
import { minifyContractRouter } from '@orpc/contract';
import { router } from '@hono-adapt/orpc/routes/router';
import type { HonoEnv } from '@db/types';

// ------------------------------
// 1️⃣ Create Hono app
// ------------------------------
const app = new Hono<HonoEnv>({ strict: false }).basePath('/api');
// Enable CORS globally for /api routes
app.use(
  '/rpc/auth/*',
  cors({
    origin: [
      'http://localhost:4321',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://192.168.0.71:4321',
    ], // replace with your
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
);

// ------------------------------
// 2️⃣ Mount RPC routes via OpenAPI handler

app
  .use('/rpc/*', async (c, next) => {
    const { matched, response } = await openApiHandler.handle(c.req.raw, {
      prefix: '/api/rpc',
      context: {
        session: c.get('session'), // ✅ real session object
        user: c.get('user'),
      }, // You can inject user/session context here
    });

    if (matched) return c.newResponse(response.body, response);
    await next();
  })
  .on(['GET'], '/rpc/generate-contract-json', (c) => {
    const minified = minifyContractRouter(router);
    return c.json(minified);
  })
  .on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))
  .get(
    '/rpc/docs',
    Scalar({
      pageTitle: 'API Documentation',
      sources: [
        // ORCP OpenAPI spec endpoint
        { url: '/api/rpc/generate-schema', title: 'ORCP API' },
        // Better Auth schema generation endpoint
        { url: '/api/auth/open-api/generate-schema', title: 'Better Auth API' },
      ],
    })
  );

// ------------------------------
// 3️⃣ Health check endpoint
// ------------------------------
app.get('/test', (c) => c.json({ message: 'Server healthy' }));

export default app;
