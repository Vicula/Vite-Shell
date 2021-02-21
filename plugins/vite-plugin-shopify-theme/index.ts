import { exec } from 'child_process'
import path, { resolve } from 'path'
import fs from 'fs'

export default function execute(i) {
  return new ShopifyPlugin(i)
}

// take in variable names

class ShopifyPlugin {
  name: string
  env: { [k: string]: string }
  buildStart: () => Promise<void>

  constructor(i) {
    this.name = 'shopify-plugin'
    this.setEnv().then(() => {
      this.createBuildStartHook()
    })
  }

  private configureServerMiddleware() {
    // need to inject middleware for making requests to shopify
  }

  private async setEnv() {
    this.env = await this.getEnv()
  }

  private async getEnv() {
    const envFilePath = path.resolve(__dirname, './.env')
    try {
      const res = {}
      const data = fs.readFileSync(envFilePath, 'utf8')

      data.split('\n').forEach((kv) => {
        const [key, value] = kv.replace(/\s*/g, '').split('=')
        if (key && value) {
          res[key] = value
        }
      })

      return res
    } catch (err) {
      console.error(err)
    }
  }

  private createConfig(r: () => void) {
    exec(
      `theme get --list -p=${this.env.SHOPIFY_PASSWORD} -s=${this.env.SHOPIFY_STORE}`,
      (s, e) => {
        console.log(s, e)
        r()
      }
    )

    // fs.writeFile('config.yml', `config yaml `, (err) => {
    //   if (err) console.log(err)
    // })
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
    // if (this.checkFolders()) this.initTheme()
  }
  private checkFolders() {
    if (!fs.existsSync('shopify')) {
      fs.mkdirSync('shopify')
    }
  }
  private createBuildStartHook() {
    this.buildStart = () =>
      new Promise((resolve, reject) => {
        this.createConfig(resolve)
      })
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
