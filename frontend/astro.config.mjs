// @ts-check

import path from 'node:path';
import url from 'node:url';
// import node from "@astrojs/node";
import react from '@astrojs/react';
// import vercel from "@astrojs/vercel";
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import honoAstro from 'hono-astro-adapter';
import viteCompression from 'vite-plugin-compression';
import TanStackRouterVite from '@tanstack/router-plugin/vite';

import typesafeRoutes from 'astro-typesafe-routes';

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
      // Gzip compression
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        filter: (file) => /\.(js|mjs|json|css|html|svg)$/.test(file),
        deleteOriginFile: false,
      }),
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        filter: (file) => /\.(js|mjs|json|css|html|svg)$/.test(file),
        deleteOriginFile: false,
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          // Manual chunking to split large deps and reduce main bundle size
          manualChunks: {
            // Core React + Query chunk (~150 kB)
            vendor: ['react', 'react-dom', '@tanstack/react-query'],
            // UI primitives (Radix, icons, utils) (~100 kB)
            ui: [
              '@radix-ui/react-*', // All Radix deps (tree-shaken automatically)
              'lucide-react',
              'class-variance-authority',
              'clsx',
              'tailwind-merge',
            ],
            // Charts (recharts + D3) - heavy, so split (~200 kB)
            charts: [
              'recharts',
              // D3 sub-deps will be inlined/tree-shaken
            ],
            // Animations (framer-motion) - another heavy one (~150 kB)
            motion: ['framer-motion', 'motion'],
            // Auth and forms (~50 kB)
            auth: ['better-auth', 'react-hook-form', 'zod'],
          },
        },
        // Externalize node_modules for SSR (avoids bundling server-only code)
        external: (id) => id.startsWith('node:') || id === 'better-auth',
      },
      // Target modern browsers for better tree-shaking
      target: 'es2022',
      chunkSizeWarningLimit: 1000,
    },
    // Dep optimization (pre-bundles critical deps)
    // optimizeDeps: {
    //   include: [
    //     'react',
    //     'react-dom',
    //     '@tanstack/react-query', // Pre-bundle to avoid runtime warnings
    //   ],
    //   // Exclude heavy libs for dynamic imports if needed
    //   exclude: ['recharts'],
    // },
    // CSS handling (Tailwind is already optimized)
    // Dep optimization (pre-bundles critical deps)

    // TanStackRouterVite({
    //   routesDirectory: './src/dashboard/routes',
    //   generatedRouteTree: './src/dashboard/routeTree.gen.ts',
    //   routeFileIgnorePrefix: '-',
    //   quoteStyle: 'double',
    // }),
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
  integrations: [react({ include: ['**/reactcomp/**/*'] }), typesafeRoutes()],
});