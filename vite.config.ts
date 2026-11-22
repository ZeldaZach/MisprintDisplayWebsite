import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    // The site is served from https://zachhalpern.com/misprints/
    base: '/misprints/',
    plugins: [
        react(),
        // Builds src/service-worker.js (Workbox) to build/service-worker.js,
        // the same URL the CRA build used, so existing visitors pick it up.
        // Registration stays in src/serviceWorkerRegistration.ts.
        VitePWA({
            strategies: 'injectManifest',
            srcDir: 'src',
            filename: 'service-worker.js',
            injectRegister: false,
            manifest: false,
            injectManifest: {
                globPatterns: ['**/*.{js,css,html,woff2}'],
            },
        }),
    ],
    build: {
        // rebuild.sh and the nginx "misprints" symlink expect build/
        outDir: 'build',
    },
    server: {
        open: '/misprints/',
    },
});
