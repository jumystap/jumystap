import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        minify: 'esbuild',
        sourcemap: false,
        rollupOptions: {
            output: {
                // Добавление хэша к именам файлов для сброса кэша
                entryFileNames: `assets/[name]-[hash].js`,
                chunkFileNames: `assets/[name]-[hash].js`,
                assetFileNames: `assets/[name]-[hash].[ext]`,
            },
        },
        commonjsOptions: {
            include: [/node_modules/],
        },
    },
});
