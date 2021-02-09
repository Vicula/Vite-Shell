/**
 * Cherry Blossoms Effect Init Script
 * ------------------------------------------------------------------------------
 * A file that inits a vue shell and adds animation compoenents for
 * site building
 *
 * current features:
 *  - NONE
 *
 * @namespace cherryBlossoms
 */

import { createApp, h } from 'vue'

const body = document.body

const app = createApp({
  name: 'CherryBlossoms',
  mounted() {
    const iw = document.querySelector('#init__wrapper')

    iw && releaseChildren(iw)
  },
  render() {
    // The h() function is a utility to create VNodes.
    // https://v3.vuejs.org/guide/render-function.html#h-arguments
    return h(
      'div', // TAG
      { id: 'init__wrapper' }, // PROPS
      [] // CHILDREN
    )
  },
})

const releaseChildren = (obj: Node) => {
  const p = obj.parentNode
  while (obj.firstChild) {
    p && p.insertBefore(obj.firstChild, obj)
  }
  p && p.removeChild(obj)
}

const createChild = (b: Node) => {
  while (b.firstChild) {}
}

app.mount('body')
