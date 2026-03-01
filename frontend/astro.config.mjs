// @ts-check
import fs from 'node:fs';
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
  // session: {
  //   driver: 'redis',
  //   options: {
  //     url: 'redis://:eYVX7EwVmmxKPCDmwMtyKVge8oLd2t82@localhost:6379',
  //   },
  // },
  server: {
    host: '0.0.0.0', // bind all interfaces
    port: 4321, // THIS ensures Astro itself uses the correct port
    // strictPort: true,
    // https: {
    //   key: fs.readFileSync(path.resolve('./src/ssl/_.igorfastapi.co.uk_private_key.key')),
    //   cert: fs.readFileSync(path.resolve('./src/ssl/full_chain.pem')),
    // },
  },
  vite: {
    ssr: { resolve: { externalConditions: ['bun', 'node'] } },
    server: {
      host: 'fast-web-tech.co.uk', // bind all interfaces
      port: 4321, // standard HTTPS port
      strictPort: true,
      // https: {
      //   key: fs.readFileSync(path.resolve(__dirname, 'src/ssl/privkey.pem')),
      //   cert: fs.readFileSync(path.resolve(__dirname, 'src/ssl/fullchain.pem')),
      // },
      allowedHosts: [
        'fast-web-tech.co.uk',
        'www.fast-web-tech.co.uk',
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
        '10.87.40.210',
        '192.168.0.71',
        '10.246.81.210',
      ],
      // hmr: {
      //   protocol: 'wss', // WebSocket secure
      //   host: 'igorfastapi.co.uk', // public hostname used by browser
      //   port: 5173,
      // },
    },

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
      TanStackRouterVite({
        routesDirectory: './src/dash/routes', // Adjust to your routes folder
        generatedRouteTree: './src/dash/routeTree.gen.ts',
        routeFileIgnorePrefix: '-',
        quoteStyle: 'double',
      }),
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
        '@hono-adapt/': path.resolve(__dirname, './src/lib/hono-adapter/*'),
      },
    },
  },
  env: {
    // We recommend enabling secret validation
    validateSecrets: true,
  },
  integrations: [
    react({ include: ['**/reactcomp/**/*'] }),
    typesafeRoutes(),

    // // 🚦 Global rate limit for entire site
    // fixedWindow({
    //   mode: 'LIVE',
    //   window: '1m',
    //   max: 200, // 200 req/min globally is safe
    // }),

    // // 🐢 Slow down abusive IPs (soft rate limit)
    // slidingWindow({
    //   mode: 'LIVE',
    //   interval: '10m',
    //   max: 500, // Allow some using, but slow abusers
    // }),
    // validateEmail({
    //   mode: 'LIVE',
    //   deny: ['DISPOSABLE', 'INVALID', 'NO_GRAVATAR', 'NO_MX_RECORDS'],
    // }),
  ],
});
