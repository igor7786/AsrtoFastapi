// src/lib/hono-adapt/time.ts
import { Hono } from 'hono';
import { auth } from '@/lib/auth';

const apiShema = new Hono().get('/', async (c) => {
  const openAPISchema = await auth.api.generateOpenAPISchema();
  return c.json(openAPISchema, 200);
});

export default apiShema;
export type ApiShemaType = typeof apiShema;
