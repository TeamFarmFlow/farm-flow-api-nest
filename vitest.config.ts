import { resolve } from 'node:path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    root: './',
    environment: 'node',
    exclude: ['node_modules', 'dist'],
    coverage: {
      exclude: ['src/**/enum.ts', 'src/**/index.ts', 'src/**/types.ts', 'src/**/*.port.ts'],
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      '@apps/api': resolve(__dirname, './apps/api/src'),
      '@apps/worker': resolve(__dirname, './apps/worker/src'),
      '@apps/migration': resolve(__dirname, './apps/migration/src'),
      '@libs/shared': resolve(__dirname, './libs/shared/src'),
      '@libs/config': resolve(__dirname, './libs/config/src'),
      '@libs/http': resolve(__dirname, './libs/http/src'),
      '@libs/datetime': resolve(__dirname, './libs/datetime/src'),
      '@libs/persistence': resolve(__dirname, './libs/persistence/src'),
      '@libs/redis': resolve(__dirname, './libs/redis/src'),
    },
  },
});
