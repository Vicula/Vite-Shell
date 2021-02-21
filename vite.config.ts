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
    shopify({}),
    // shell({
    //   buildStart: {
    //     commands: ['echo run my script'],
    //   },
    //   buildEnd: {
    //     commands: ['echo end my script'],
    //   },
    //   closeWatcher: {
    //     commands: ['echo close watcher'],
    //   },
    //   watchChange: {
    //     commands: ['echo watch change'],
    //   },
    //   moduleParsed: {
    //     commands: ['echo moduleParsed'],
    //   },
    //   generateBundle: {
    //     commands: ['echo generateBundle'],
    //   },
    //   renderError: {
    //     commands: ['echo render error'],
    //   },
    //   renderStart: {
    //     commands: ['echo render start'],
    //   },
    //   writeBundle: {
    //     commands: ['echo write bundle'],
    //   },
    //   transformIndexHtml: {
    //     commands: ['echo transform that html'],
    //   },
    // }),
  ],
})
