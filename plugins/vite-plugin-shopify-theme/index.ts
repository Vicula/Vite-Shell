import { exec } from 'child_process'
import fs from 'fs'

export default function execute(i) {
  return new ShopifyPlugin(i)
}

// take in variable names

class ShopifyPlugin {
  name: string
  buildStart: () => void
  constructor(i) {
    this.name = 'shopify-plugin'
  }

  private configureServerMiddleware() {
    // need to inject middleware for making requests to shopify
  }

  private createConfig() {
    process.env.SHOPIFY_PASSWORD
    process.env.SHOPIFY_STORE
    fs.writeFile('config.yml', `config yaml `, (err) => {
      if (err) console.log(err)
    })
  }
  private createJSONFiles() {
    fs.writeFile('layout.json.liquid', `{{products | json}} `, (err) => {
      if (err) console.log(err)
    })
  }
  private initTheme() {
    this.runScript(
      'theme get --password=[your-api-password] --store=[your-store.myshopify.com] --themeid=[your-theme-id]'
    )
  }
  private checkBranch() {
    this.runScript('git branch --show-current')
    this.runScript('theme get --list')
    if (this.checkFolders()) this.initTheme()
  }
  private checkFolders() {
    if (!fs.existsSync('shopify')) {
      fs.mkdirSync('shopify')
    }
  }
  private createBuildStartHook() {
    this.createConfig()
    this.createJSONFiles()
    this.checkBranch()
  }
  private runScript(c: string) {
    exec(c)
  }
}

// BUILD START on dev env

// create config file from env file

// git branch --show-current
// theme get --list

// check if branch is in the theme list
// if not then do

// theme new --password=${process.env.SHOPIFY_PASSWORD} --store=${process.env.SHOPIFY_STORE} --name=${gitBranch}
// theme deploy
// theme watach
// theme open

// if theme does exist then

// theme configure --password=${process.env.SHOPIFY_PASSWORD} --store=${process.env.SHOPIFY_STORE} --themeid=${themeID}
//theme watch
// theme open

// check for shopify folders like below
// var fs = require('fs');
// var dir = './tmp';

// if (!fs.existsSync(dir)){
//     fs.mkdirSync(dir);
// }

// if not then we need to run
// theme get

// TRANSFORM HTML FROM SHOPIFY

// BUILD END
// we will just run a simple theme deploy from dist
