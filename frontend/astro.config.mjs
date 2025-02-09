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
  server: {
    host: '0.0.0.0',
    port: 4321,
  },
  integrations: [
    // htmx(),
    tailwind({ applyBaseStyles: false }),
    react({ include: ['**/reactcomp/**/*'] }),
    qwikdev({ include: ['**/qwikcomp/**/*'] }),
  ],
  vite: {
    resolve: {
      alias: {
        '/scripts-lib': '/public/scripts-lib',
      },
    },
  },
});
