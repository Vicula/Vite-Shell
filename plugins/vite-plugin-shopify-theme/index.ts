import { exec } from 'child_process'
import path, { resolve } from 'path'
import fs from 'fs'
import chalk from 'chalk'
import { shopifyTheme } from './types'

export default function execute(i) {
  return new ShopifyPlugin(i)
}

// take in variable names

class ShopifyPlugin {
  name: string
  env: { [k: string]: string }
  buildStart: () => Promise<void>
  closeBundle: () => void

  constructor(i) {
    this.name = 'shopify-plugin'
    this.setEnv().then(() => {
      this.createBuildStartHook()
    })
    this.closeBundle = () => {
      console.error('is this better?')
    }
  }

  private configureServerMiddleware() {
    // need to inject middleware for making requests to shopify
  }

  private async setEnv() {
    this.env = await this.getEnv()
  }

  private async getEnv() {
    const f = path.resolve(__dirname, './.env')
    try {
      const res = {}
      const data = fs.readFileSync(f, 'utf8')

      data.split('\n').forEach((kv) => {
        const [k, v] = kv.replace(/\s*/g, '').split('=')
        if (k && v) {
          res[k] = v
        }
      })

      return res
    } catch (err) {
      console.error(err)
    }
  }

  private getThemes = () =>
    new Promise<shopifyTheme[]>((r) => {
      exec(
        `theme get --list -p=${this.env.SHOPIFY_PASSWORD} -s=${this.env.SHOPIFY_STORE}`,
        (s, e) => {
          const o: shopifyTheme[] = []
          e.split(/\r?\n/).forEach((i) => {
            const m = i.match(/\[(.*?)\]/)
            const p =
              m && i.includes('live')
                ? m && i.split(`[${m[1]}]`)[1].split('[live] ')[1]
                : m && i.split(`[${m[1]}] `)[1]
            m &&
              p &&
              o.push({
                id: m[1],
                theme: p,
                live: i.includes('live'),
              })
          })
          r(o)
        }
      )
    })

  private getBranch = () =>
    new Promise<string>((r) => {
      exec('git branch --show-current', (s, e) => {
        r(e.replace(/\s/g, ''))
      })
    })

  private async createConfig(r: () => void, x: (k: string) => void) {
    try {
      const t = await this.getThemes()
      const b = await this.getBranch()
      if (b !== 'main' && b !== 'master') {
        try {
          const v = t.find((i) => i.theme.includes(b))
          if (!v || !v.live) {
            console.log(t, b)
          } else {
            throw 'Shopify-Plugin:Error Cannot edit a branch direcetly connected to a live theme'
          }
        } catch (ex) {
          console.error(
            `${chalk.white.bgRed.bold(
              'Shopify-Plugin:Error'
            )} ${chalk.underline.red(
              'Cannot edit a branch direcetly connected to a live theme'
            )}`
          )
          x(ex)
        }
      } else {
        throw 'Shopify-Plugin:Error Cannot build on git branch (master|main)'
      }
    } catch (er) {
      console.error(
        `${chalk.white.bgRed.bold(
          'Shopify-Plugin:Error'
        )} ${chalk.underline.red('Cannot build on git branch (master|main)')}`
      )
      x(er)
    }

    // if main or master theme get --live
    // specify -d / --dir for directory of shopify templates

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
        this.createConfig(resolve, reject)
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
