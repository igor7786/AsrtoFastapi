import { envConfig } from '@/lib/env';
import type { AppType } from '@/lib/hono-adapter';
import { hc } from 'hono/client';

// this is a trick to calculate the type when compiling
export type Client = ReturnType<typeof hc<AppType>>;

export const hcWithType = (...args: Parameters<typeof hc>): Client => hc<AppType>(...args);
const clientHonoRpC = hcWithType(envConfig.PUBLIC_URL, {
  init: {
    credentials: 'include',
  },
});
export default clientHonoRpC;
