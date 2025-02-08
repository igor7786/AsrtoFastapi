// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import node from '@astrojs/node';

import qwikdev from '@qwikdev/astro';
// @ts-ignore
import htmx from 'astro-htmx';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'server', // server-side render output
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    // htmx(),
    tailwind({ applyBaseStyles: false }),
    react({ include: ['**/reactcomp/*'] }),
    qwikdev({ include: ['**/qwikcomp/*'] }),
  ],
});
