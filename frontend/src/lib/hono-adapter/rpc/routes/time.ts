// src/lib/hono-adapt/routes/time.ts
import { Hono } from 'hono';
const timeApi = new Hono().get('/', (c) => c.json({ now: new Date().toISOString() }, 200));

export default timeApi;
export type TimeType = typeof timeApi;
