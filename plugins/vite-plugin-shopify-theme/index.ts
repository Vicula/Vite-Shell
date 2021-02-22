import { exec, execSync } from 'child_process'
import rimraf from 'rimraf'
import { resolve } from 'path'
import fs from 'fs'
import chalk from 'chalk'
import { shopifyTheme } from './types'
import { ViteDevServer, UserConfig, ResolvedConfig, HmrContext } from 'vite'

export default function execute(i) {
  return new ShopifyPlugin(i)
}

// take in :
// variable names for shopify pass/store
// directory location for shopify files
// config location

class ShopifyPlugin {
  constructor(i) {
    this.name = 'vite//shopify'
    this.init = true
    this.printLogo()
    this.setEnv().then(() => {
      this.createBuildStartHook()
    })
  }

  name: string
  env: { [k: string]: string }
  private init: boolean
  private server: ViteDevServer
  private resolvedConfig: ResolvedConfig
  private previousFile: string
  private clearPreviousFile: ReturnType<typeof setTimeout>
  buildStart: () => Promise<void>
  configResolved(rc: ResolvedConfig) {
    this.resolvedConfig = rc
  }
  configureServer(_s: ViteDevServer) {
    this.server = _s
  }
  config(c: UserConfig) {
    this.checkHttps(c)
  }
  handleHotUpdate(ctx: HmrContext) {
    this.init && this.printDevReady()
    const f = ctx.file.split(__dirname + '/')[1]
    switch (f.match(/\.[0-9a-z]+$/i)[0]) {
      case '.liquid':
        this.handleLiquidHotUpdate(f.split('src/shopify/')[1])
    }
  }

  private createBuildStartHook() {
    this.buildStart = () =>
      new Promise((resolve, reject) => {
        this.createConfig(resolve, reject)
      })
  }

  private configureServerMiddleware() {
    // need to inject middleware for making requests to shopify
  }

  private print(t: string, m: string, s = false): void {
    console.log(
      `${chalk.blue.bold(`vite${chalk.whiteBright('//')}shopify:${t}`)} ${m}`
    )

    !s && console.log('____________________')
    !s && console.log('')
  }

  private printError(t: string, m: string): void {
    console.error(
      `${chalk.whiteBright.bgRed.bold(
        `vite${chalk.blackBright('//')}shopify:${t}`
      )} 🛑 ${chalk.underline.red(m)} 🛑`
    )
    console.error('____________________')
    console.log('')
  }

  private printDevReady() {
    this.init = false
    console.log('____________________')
    console.log()
    this.print(
      'Shopify',
      `🚧 Ready to start developing in ${chalk.underline.blue.bold(
        './src/shopify'
      )} 🚧`
    )
  }

  private printLogo() {
    console.log(
      `${chalk.blue.bold(
        `              ${chalk.whiteBright('//')}__            _ `
      )}`
    )
    console.log(
      `${chalk.blue.bold(
        ` | /o_|_ _   ${chalk.whiteBright('//')}(_ |_  _ ._ o_|_ `
      )}`
    )
    console.log(
      `${chalk.blue.bold(
        ` |/ | | (/_ ${chalk.whiteBright('//')} __)| |(_)|_)| | |/`
      )}`
    )
    console.log(
      `${chalk.blue.bold(
        `           ${chalk.whiteBright('//')}           |      / `
      )}`
    )
    console.log('_________________________________')
    console.log()
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
            throw 'vite//shopify:Error Cannot edit a branch direcetly connected to a live theme'
          }
        } catch (ex) {
          this.printError(
            'Error',
            `Cannot edit a branch direcetly connected to a live theme'`
          )
          x(new Error(ex))
        }
      } else {
        throw 'vite//shopify:Error Cannot build on git branch (master|main)'
      }
    } catch (er) {
      this.printError('Error', 'Cannot build on git branch (master|main)')
      x(new Error(er))
    }
  }

  private handleLiquidHotUpdate(f: string) {
    const pf = this.previousFile
    if (!pf && pf !== f) {
      this.print('Shopify', `Updating ${chalk.underline.blue(f)} ...`, true)
      execSync(`theme deploy ${f} -n -d=src/shopify`)
      this.print('Shopify', `Deployed`, true)
      this.previousFile = f
      this.setFileClearTimeout()
    }
  }

  private setFileClearTimeout() {
    this.clearPreviousFile = setTimeout(() => {
      this.previousFile = undefined
      this.clearPreviousFile = undefined
    }, 500)
  }

  private createJSONFiles() {
    fs.writeFile('layout.json.liquid', `{{products | json}} `, (err) => {
      if (err) console.log(err)
    })
  }
}
