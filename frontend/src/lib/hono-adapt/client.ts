import { envConfig } from '@/lib/env-vars';
import app from '@/lib/hono-adapt';
import { hc } from 'hono/client';

// this is a trick to calculate the type when compiling
export type Client = ReturnType<typeof hc<typeof app>>;

export const hcWithType = (...args: Parameters<typeof hc>): Client => hc<typeof app>(...args);
const clientHonoRpC = hcWithType(envConfig.PUBLIC_URL);
export default clientHonoRpC;
