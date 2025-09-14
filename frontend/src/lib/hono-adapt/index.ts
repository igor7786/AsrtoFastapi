// src/lib/hono-adapt/index.ts
import decoys from '@/lib/hono-adapt/routes/decoys';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import todosApi, { type TodosType } from '@/lib/hono-adapt/routes/todos';
import timeApi, { type TimeType } from '@/lib/hono-adapt/routes/time';
import apiShema, { type ApiShemaType } from '@/lib/hono-adapt/routes/openapi';
import { auth } from '@/lib/auth';
const app = new Hono({ strict: false }).basePath('/api');

//? CORS middleware
app.use(
  '/auth/*', // or replace with "*" to enable cors for all routes
  cors({
    origin: 'http://localhost:4321', // replace with your origin
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
);

//? Routes
// ########## //
//? Better-Auth
// app.on(['POST', 'GET'], '/auth/**', (c) => auth.handler(c.req.raw));
// // //? Serve OpenAPI JSON at /api/openapi
// app.route('/openapi', apiShema as ApiShemaType);
// // //? Health check
// app.get('/', (c) => c.json({ message: 'server is healthy' }));
// // //? Test routes //
// app.route('/todos', todosApi as TodosType);
// app.route('/time', timeApi as TimeType);
// export type AppType = typeof app;

const routes = app
  .get('/', (c) => c.json({ message: 'server is healthy' }))
  .route('/decoys', decoys)
  .on(['POST', 'GET'], '/auth/**', (c) => auth.handler(c.req.raw))
  .route('/openapi', apiShema as ApiShemaType)
  .route('/todos', todosApi as TodosType)
  .route('/time', timeApi as TimeType);

// Catch-all 404 for unmatched /api/* routes
app.all('/*', (c) => {
  return c.json({ code: 404, message: 'Page not found' }, 404);
});
export default app;
export type AppType = typeof routes;
