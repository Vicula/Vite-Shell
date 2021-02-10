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

import { createApp, defineComponent, h, VNode, computed } from 'vue'

const initWrap__name = '#init__wrapper'
const app__name = 'CherryBlossoms'

const createAttributes = (o: Element) => {
  const atr = o.attributes
  const atrOb: { [k: string]: string } = {}
  for (let i = 0; atr.length > i; i++) {
    atrOb[atr[i].name] = atr[i].value
  }
  return atrOb
}

const createChildren = (b: ChildNode | Element): (VNode | string)[] => {
  const ar: (VNode | string)[] = []
  ;(b.childNodes as NodeListOf<Element>).forEach((cr: Element) => {
    cr.nodeName !== '#text'
      ? ar.push(
          // The h() function is a utility to create VNodes.
          // https://v3.vuejs.org/guide/render-function.html#h-arguments
          h(
            computed(() => cr.nodeName).value,
            computed(() => createAttributes(cr)).value,
            {
              default: () => (cr.childNodes.length ? createChildren(cr) : ['']),
            }
          )
        )
      : ar.push('' + cr.nodeValue)
  })
  return ar
}

const createPage = (b: Element): VNode => {
  return h(
    'div', // TAG
    { id: initWrap__name }, // PROPS
    {
      // CHILDREN
      default: () => createChildren(b),
    }
  )
}

const body = document.body
const initContent = createPage(body)

const app = createApp(
  // To let TypeScript properly infer types inside Vue component options,
  // you need to define components with defineComponent
  defineComponent({
    name: app__name,
    mounted() {
      releaseChildren(this.$el)
    },
    render() {
      return initContent
    },
  })
)

const releaseChildren = (obj: Node) => {
  const p = obj.parentNode
  while (obj.firstChild) {
    p && p.insertBefore(obj.firstChild, obj)
  }
  p && p.removeChild(obj)
}

app.mount('body')
