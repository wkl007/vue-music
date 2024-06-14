import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import registerRouter from './backend/router';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

const resolve = (dir) => path.join(__dirname, dir);

const configureServer = () => ({
  name: 'config-server',
  configureServer(server) {
    const app = server.middlewares;
    registerRouter(app);
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    open: true,
    proxy: {},
  },
  plugins: [
    vue(),
    configureServer(),
    VitePWA({
      manifest: {},
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        lessOptions: {
          modifyVars: {},
          javascriptEnabled: true,
        },
        // 全局引入变量和 mixin
        additionalData: `
          @import "@/assets/styles/variables.less";
          @import "@/assets/styles/mixins.less";
        `,
      },
    },
  },
});
