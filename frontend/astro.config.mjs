// @ts-check

import path from 'node:path';
import url from 'node:url';
// import node from "@astrojs/node";
import react from '@astrojs/react';
// import vercel from "@astrojs/vercel";
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import honoAstro from 'hono-astro-adapter';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: 'server',
  // adapter: vercel({
  //   imageService: true,
  //   devImageService: 'sharp',
  //   imagesConfig: {
  //     sizes: [320, 640, 1280],
  //   },
  //   edgeMiddleware: true,
  //   maxDuration: 60,
  //   skewProtection: true,
  //   isr: {
  //     expiration: 60 * 60 * 24,
  //     bypassToken: '005556d774a9',
  //     exclude: [
  //       '/preview', // dynamic preview pages
  //       '/auth/[page]', // auth pages
  //       /^\/api\/.+/, // ✅ exclude all API routes
  //     ], // cache each page for 1 day
  //   },
  // }),
  adapter: honoAstro(),
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'print-auth-url',
        configureServer(server) {
          server.httpServer?.once('listening', () => {
            console.log('scalar api served: http://localhost:4321/api/auth/reference');
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@db': path.resolve(__dirname, './db'),
        '@rcomp': path.resolve(__dirname, './src/components/reactcomp'),
        '@layout': path.resolve(__dirname, './src/layouts'),
        '@acomp': path.resolve(__dirname, './src/components/astrocomp'),
      },
    },
  },
  integrations: [react({ include: ['**/reactcomp/**/*'] })],
});
