export default function execute(i) {
  return new ShopifyPlugin(i)
}

class ShopifyPlugin {
  name: string
  constructor(i) {
    this.name = 'shopify-plugin'
  }
}
