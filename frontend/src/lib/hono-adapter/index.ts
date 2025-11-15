// src/orpc/server.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { openApiHandler } from './orpc/open-api-docs/open-api-spec';
import { auth } from '@/lib/auth';
import { Scalar } from '@scalar/hono-api-reference';

// ------------------------------
// 1️⃣ Create Hono app
// ------------------------------
const app = new Hono({ strict: false });

// Enable CORS globally for /api routes
app.use(
  '/api/rpc/auth/*',
  cors({
    origin: ['http://localhost:4321', 'http://localhost:5173', 'http://localhost:3000'], // replace with your
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
);

// ------------------------------
// 2️⃣ Mount RPC routes via OpenAPI handler

// ------------------------------

app
  .use('/api/rpc/*', async (c, next) => {
    const { matched, response } = await openApiHandler.handle(c.req.raw, {
      prefix: '/api/rpc',
      context: {}, // You can inject user/session context here
    });

    if (matched) return c.newResponse(response.body, response);
    await next();
  })
  .on(['POST', 'GET'], '/api/rpc/auth/*', (c) => auth.handler(c.req.raw))
  .get(
    'api/rpc/docs',
    Scalar({
      pageTitle: 'API Documentation',
      sources: [
        // ORCP OpenAPI spec endpoint
        { url: '/api/rpc/generate-schema', title: 'ORCP API' },
        // Better Auth schema generation endpoint
        { url: '/api/rpc/auth/open-api/generate-schema', title: 'Better Auth API' },
      ],
    })
  );

// ------------------------------
// 3️⃣ Health check endpoint
// ------------------------------
app.get('/api/test', (c) => c.json({ message: 'Server healthy' }));

export default app;
