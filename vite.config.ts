import { defineConfig } from 'vite'
// import copy from 'rollup-plugin-copy'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import shell from './plugins/rollup-plugin-shell-cycles'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    shell({
      buildStart: {
        commands: [],
      },
    }),
  ],
})
