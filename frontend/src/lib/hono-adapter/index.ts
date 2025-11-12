// src/orpc/server.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { openApiHandler } from './orpc/open-api-spec';

// ------------------------------
// 1️⃣ Create Hono app
// ------------------------------
const app = new Hono({ strict: false });

// Enable CORS globally for /api routes
app.use(
  '/api/*',
  cors({
    origin: '*', // replace with your frontend origin in production
    allowHeaders: ['Content-Type'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
  })
);

// ------------------------------
// 2️⃣ Mount RPC routes via OpenAPI handler
// ------------------------------
app.use('/api/rpc/*', async (c, next) => {
  const { matched, response } = await openApiHandler.handle(c.req.raw, {
    prefix: '/api/rpc',
    context: {}, // You can inject user/session context here
  });

  if (matched) return c.newResponse(response.body, response);
  await next();
});

// ------------------------------
// 3️⃣ Health check endpoint
// ------------------------------
app.get('/api', (c) => c.json({ message: 'Server healthy' }));

export default app;
