import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Отдельный конфиг, а не vite.config.js: laravel-vite-plugin рассчитывает на
// запущенный Laravel и в тестах не нужен. Вместе с ним теряется алиас «@»,
// который он подставляет сам, — объявляем его здесь.
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: { '@': path.resolve(__dirname, 'resources/js') },
    },
    define: {
        // Используется в resources/js/i18n.js для сброса кэша переводов.
        __APP_VERSION__: JSON.stringify('test'),
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/js/setup.js'],
        include: ['tests/js/**/*.test.{js,jsx}'],
        env: {
            // Без ключа компонент карты уходит в состояние «не настроено».
            VITE_YANDEX_MAPS_API_KEY: 'test-key',
        },
    },
});
