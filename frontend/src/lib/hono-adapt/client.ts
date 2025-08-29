import { hc } from 'hono/client';
import type { AppType } from '@/lib/hono-adapt';

const client = hc<AppType>('http://localhost:4321/');

// Now calls are fully typed! 🚀
const res = await client.api.$get('/todos');
const data = await res.json(); // has correct type
