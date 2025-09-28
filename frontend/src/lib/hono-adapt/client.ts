import { hc } from 'hono/client';
import type { AppType } from '@/lib/hono-adapt/index.ts';

const { api } = hc<AppType>('http://localhost:4321');
console.log('api', await api.time.$url());
