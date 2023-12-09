import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  plugins: [
    vue(),
    Components({
      deep: true,
      directoryAsNamespace: true,
      resolvers: [
        IconsResolver({
          prefix: 'icon',
        }),
        PrimeVueResolver(),
      ],
    }),
    Icons({
      compiler: 'vue3',
      scale: 1,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
