class Store {
  constructor(options = {}) {
    this._state = Object.assign({}, options.state)
    this._actions = options.actions
    this._mutations = options.mutations
  }
  dispatch(action, payload) {
    if (!this._actions[action]) {
      throw new Error(`[Error] action ${action} is undefined`)
    }
    this._actions[action](
      {
        commit: this.commit.bind(this),
        state: this._clone(this._state),
      },
      payload
    )
  }
  commit(type, payload) {
    if (!this._mutations[type]) {
      throw new Error(`[Error] mutation ${type} is undefined`)
    }
    this._mutations[type].call(null, this._state, payload)
  }
  _clone(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
}

function install(Vue, options): void {
  Vue.$store = Vue.mixin({
    created() {
      if (this.$options.store) {
        this.$store = this.$options.store
      } else if (this.$options.parent && this.$options.parent.$store) {
        this.$store = this.$options.parent.$store
        Vue.util.defineReactive(this, 'state', this.$store)
      }
    },
  })
}

export default {
  install,
  Store,
}
