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

import {
  createApp,
  defineComponent,
  resolveComponent,
  h,
  VNode,
  VNodeArrayChildren,
  computed,
} from 'vue'
import testcomp from './utilities/testcomp'

const initWrap__name = '#init__wrapper'
const app__name = 'CherryBlossoms'

interface attr {
  name: string
  value: string
}

interface DomEl {
  tag: string
  props: attr[]
  children: (DomEl | string)[]
}

const createAttributes = (o: HTMLElement) => {
  const atr = o.attributes
  //   const atrOb: { [k: string]: string } = {}
  const atrAr: attr[] = []
  for (let i = 0; atr.length > i; i++) {
    atrAr.push({
      name: atr[i].name,
      value: atr[i].value,
    } as attr)
  }
  return atrAr
}

// The h() function is a utility to create VNodes.
// https://v3.vuejs.org/guide/render-function.html#h-arguments

const createChildren = (b: ChildNode | HTMLElement) => {
  const ar: (DomEl | string)[] = []
  ;(b.childNodes as NodeListOf<HTMLElement>).forEach((cr: HTMLElement) => {
    cr.nodeName !== '#text'
      ? ar.push({
          tag: computed(() => cr.nodeName).value,
          props: computed(() => createAttributes(cr)).value,
        } as DomEl)
      : ar.push('' + cr.nodeValue)
  })
  return ar
}

// const createPage = (b: HTMLElement): VNode => {
//   return h('div', { id: initWrap__name }, { default: () => createChildren(b) })
// }
// h(
//
//
//     {
//       default: () => (cr.childNodes.length ? createChildren(cr) : ['']),
//     }
//   )

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
      return hydrateComponents(initContent)
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

const hydrateComponents = (v: VNode): VNode => {
  console.log(v)
  if (v.children) {
    const c = v.children as VNodeArrayChildren
    c.map((b) => {
      const p = b as VNode
      if (typeof p === 'object') {
        resolveComponent(p.type as string)
      }
    })
  }
  return v
}

app.use(testcomp)
app.mount('body')
