// src/lib/hono-adapt/time.ts
import { Hono } from 'hono';
const timeApi = new Hono();
timeApi.get('/', (c) => c.json({ now: new Date().toISOString() }));
export default timeApi;
export type TimeType = typeof timeApi;
