import { exec, execSync } from 'child_process'
import rimraf from 'rimraf'
import { resolve } from 'path'
import fs from 'fs'
import chalk from 'chalk'
import { shopifyTheme } from './types'
import { ViteDevServer, UserConfig, ResolvedConfig } from 'vite'

export default function execute(i) {
  return new ShopifyPlugin(i)
}

// take in :
// variable names for shopify pass/store
// directory location for shopify files
// config location

class ShopifyPlugin {
  name: string
  env: { [k: string]: string }
  buildStart: () => Promise<void>
  private server: ViteDevServer
  private resolvedConfig: ResolvedConfig
  configResolved(rc: ResolvedConfig) {
    this.resolvedConfig = rc
  }
  configureServer(_s: ViteDevServer) {
    this.server = _s
  }
  config(c: UserConfig) {
    this.checkHttps(c)
  }

  constructor(i) {
    this.name = 'shopify-plugin'
    this.setEnv().then(() => {
      this.createBuildStartHook()
    })
  }

  private configureServerMiddleware() {
    // need to inject middleware for making requests to shopify
  }

  private print(t: string, m: string): void {
    console.log(`${chalk.blue.bold(`Shopify-Plugin:${t}`)} ${m}`)
    console.log('____________________')
    console.log('')
  }
  private printError(t: string, m: string): void {
    console.error(
      `${chalk.whiteBright.bgRed.bold(
        `Shopify-Plugin:${t}`
      )} ${chalk.underline.red(m)}`
    )
    console.error('____________________')
    console.log('')
  }

  private checkHttps(c: UserConfig) {
    !c.server.https &&
      this.print('Config', 'Https wasnt turned on; Doing so now ...')
    !c.server.https && (c.server.https = true)
  }

  private async setEnv() {
    this.env = await this.getEnv()
  }

  private async getEnv() {
    const f = resolve(__dirname, './.env')
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
  private themeCreate(n: string) {
    !fs.existsSync('.build') && fs.mkdirSync('.build')
    this.print(
      'Create',
      `Couldnt find a theme related to this git branch; so creating one with name ${chalk.underline(
        n
      )} ...`
    )
    execSync(
      `theme new -p=${this.env.SHOPIFY_PASSWORD} -s=${this.env.SHOPIFY_STORE} -n=${n} -d=.build`
    )
    this.print(
      'Create',
      `Theme created called ${chalk.underline(
        n
      )}; Cleaning up and deploying theme ...`
    )
    fs.existsSync('.build') && rimraf.sync('.build')
    execSync(`theme deploy -n -d=src/shopify`)
    this.print('Create', `✨✨ Theme Deployed and cleaned ✨✨`)
  }
  private themeFetch(i: string) {
    this.print('Fetch', `Found theme on shopify; fetching theme files ...`)
    execSync(
      `theme get -p=${this.env.SHOPIFY_PASSWORD} -s=${this.env.SHOPIFY_STORE} -t=${i} -d=src/shopify --ignored-file=assets/* --ignored-file=locales/* --ignored-file=config/*`
    )
    this.print('Fetch', '✨✨ Theme Fetched ✨✨')
  }

  private async createConfig(r: () => void, x: (k: Error) => void) {
    try {
      this.print(
        'Config',
        '🔧 Checking shopify themes and comparing them to git repo 🔧'
      )
      const t = await this.getThemes()
      const b = await this.getBranch()
      if (b !== 'main' && b !== 'master') {
        try {
          const v = t.find((i) => i.live)
          if (v && !v.theme.includes(b)) {
            const w = t.find((i) => i.theme.includes(b))
            w && w.id ? this.themeFetch(w.id) : this.themeCreate(b)
            r()
          } else {
            throw 'Shopify-Plugin:Error Cannot edit a branch direcetly connected to a live theme'
          }
        } catch (ex) {
          this.printError(
            'Error',
            `Cannot edit a branch direcetly connected to a live theme'`
          )
          x(new Error(ex))
        }
      } else {
        throw 'Shopify-Plugin:Error Cannot build on git branch (master|main)'
      }
    } catch (er) {
      this.printError('Error', 'Cannot build on git branch (master|main)')
      x(new Error(er))
    }
  }

  private createJSONFiles() {
    fs.writeFile('layout.json.liquid', `{{products | json}} `, (err) => {
      if (err) console.log(err)
    })
  }

  private createBuildStartHook() {
    this.buildStart = () =>
      new Promise((resolve, reject) => {
        this.createConfig(resolve, reject)
      })
  }
}
