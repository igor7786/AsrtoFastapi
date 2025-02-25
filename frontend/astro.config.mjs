// @ts-check
import {defineConfig} from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import qwikdev from '@qwikdev/astro'; // Ensure this package is installed
// @ts-ignore
import htmx from 'astro-htmx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    output: 'server', // server-side render output
    adapter: node({
        mode: 'standalone', // You can keep this for production usage if required
    }),
    server: {
        host: '0.0.0.0', // Allow access from any interface. Change to 'localhost' for local use
        port: 4321, // Port number for your Astro server
    },
    integrations: [
        tailwind({applyBaseStyles: false}),
        react({include: ['**/reactcomp/**/*']}),
        qwikdev({include: ['**/qwikcomp/**/*']}),
    ],
    vite: {
        resolve: {
            alias: {
                '/scripts-lib': '/public/scripts-lib', // Path aliasing for convenience
            },
        },
        server: {
            allowedHosts: [
                'astro-app', // Custom host for your container/host
                'localhost',  // Allow localhost
                '127.0.0.1',  // Loopback interface
                '0.0.0.0',    // Allow all interfaces (check security)
                'igorfastapi.co.uk',  // Add your domain here
            ],
            host: '0.0.0.0', // Listen on all interfaces (use localhost if you prefer security)
            port: 5173,      // Vite default port, make sure it's not conflicting
            hmr: {
                protocol: 'wss',          // WebSocket Secure (use if required for secure connections)
                host: 'igorfastapi.co.uk', // Your domain or IP
                port: 5173,               // Set the same port as the main port above
            },
        },
    },
});
