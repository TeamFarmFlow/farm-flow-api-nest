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
      '@app/config': resolve(__dirname, './src/config'),
      '@app/core': resolve(__dirname, './src/core'),
      '@app/shared': resolve(__dirname, './src/shared'),
      '@app/infra': resolve(__dirname, './src/infra'),
      '@app/module': resolve(__dirname, './src/module'),
    },
  },
});
