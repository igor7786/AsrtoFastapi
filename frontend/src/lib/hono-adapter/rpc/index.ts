// src/lib/hono-adapt/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import todosApi, { type TodosType } from '@hono-adapt/rpc/routes/todos';
import timeApi, { type TimeType } from '@hono-adapt/rpc/routes/time';
import apiShema, { type ApiShemaType } from '@hono-adapt/rpc/routes/openapi';
import { auth } from '@/lib/auth';
import todoApi, { type TodoType } from '@hono-adapt/rpc/routes/todo';
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
// // ########## //
// //? Better-Auth
// app.on(['POST', 'GET'], '/auth/**', (c) => auth.handler(c.req.raw));
// //? Serve OpenAPI JSON at /api/openapi
// app.route('/openapi', apiShema as ApiShemaType);
// //? Health check
// app.get('/', (c) => c.json({ message: 'server is healthy' }));
// //? Test routes //
// app.route('/todos', todosApi as TodosType);
// app.route('/time', timeApi as TimeType);
// export type AppType = typeof app;
// export default app;

const routers = app
  .get('/', async (c) => c.json({ message: 'server is healthy' }))
  .on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))
  .route('/openapi', apiShema as ApiShemaType)
  .route('/todos', todosApi as TodosType)
  .route('/todo', todoApi as TodoType)
  .route('/time', timeApi as TimeType)
  .all('/*', async (c) => {
    return c.json({ code: 404, message: 'Page not found' }, 404);
  });
export type AppType = typeof routers;
export default routers;
