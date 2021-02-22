/**
 * Vite Shell Init Script
 * ------------------------------------------------------------------------------
 * A file that inits a vue shell and adds components for
 * site building
 *
 * current features:
 *  - NONE
 *
 * @namespace ViteShell
 */

import {
  createApp,
  defineComponent,
  resolveComponent,
  h,
  VNode,
  computed,
} from "vue";
import testcomp from "./vue/utilities/testcomp";

const initWrap__name = "#init__wrapper";
const app__name = "CherryBlossoms";

interface attr {
  name: string;
  value: string;
}

interface DomEl {
  tag: string;
  props: attr[];
  children: (DomEl | string)[];
}

const body = document.body;
const initContent = createContent(body);

const app = createApp(
  // To let TypeScript properly infer types inside Vue component options,
  // you need to define components with defineComponent
  defineComponent({
    name: app__name,
    mounted() {
      releaseContent(this.$el);
    },
    render() {
      return h(
        "div",
        { id: initWrap__name },
        { default: () => hydrateContent(initContent) }
      );
    },
  })
);

function releaseContent(obj: Node) {
  const p = obj.parentNode;
  while (obj.firstChild) {
    p && p.insertBefore(obj.firstChild, obj);
  }
  p && p.removeChild(obj);
}

function hydrateAttributes(a: attr[]) {
  const ao: { [k: string]: string } = {};
  a.forEach((c) => {
    ao[c.name] = c.value;
  });
  return ao;
}

function hydrateContent(v: (DomEl | string)[]) {
  const ar: (VNode | string)[] = [];
  v.forEach((b) => {
    typeof b !== "string" && typeof resolveComponent(b.tag) !== "string"
      ? ar.push(h(resolveComponent(b.tag)))
      : typeof b !== "string"
      ? ar.push(
          h(
            computed(() => b.tag).value,
            computed(() => hydrateAttributes(b.props)).value,
            {
              default: () =>
                b.children.length ? hydrateContent(b.children) : [""],
            }
          )
        )
      : ar.push(b);
  });
  return ar;
}

function createAttributes(o: HTMLElement) {
  const atr = o.attributes;
  //
  const atrAr: attr[] = [];
  for (let i = 0; atr.length > i; i++) {
    atrAr.push({
      name: atr[i].name,
      value: atr[i].value,
    } as attr);
  }
  return atrAr;
}

function createContent(b: ChildNode | HTMLElement) {
  const ar: (DomEl | string)[] = [];
  (b.childNodes as NodeListOf<HTMLElement>).forEach((cr: HTMLElement) => {
    cr.nodeName !== "#text"
      ? ar.push({
          tag: computed(() => cr.nodeName).value,
          props: computed(() => createAttributes(cr)).value,
          children: cr.childNodes.length ? createContent(cr) : [""],
        } as DomEl)
      : ar.push("" + cr.nodeValue);
  });
  return ar;
}

app.use(testcomp);
app.mount("body");
