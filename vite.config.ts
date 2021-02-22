import { defineConfig } from 'vite'
// import copy from 'rollup-plugin-copy'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// import shell from './plugins/vite-plugin-shell-cycles'
import shopify from './plugins/vite-plugin-shopify-theme'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    shopify({
      shopifyPass_var: 'SHOPIFY_PASSWORD',
      shopifyStore_var: 'SHOPIFY_STORE',
      devFolder_url: 'src/shopify',
    }),
  ],
})
