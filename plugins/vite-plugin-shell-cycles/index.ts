import { spawn, spawnSync } from 'child_process'
import { exportOptions, importOptions, Script } from './types'

export default function execute(input: importOptions): exportOptions {
  console.log(new createShellPlugin(input))
  return new createShellPlugin(input)
}

class createShellPlugin {
  name: 'shell-cycles'
  constructor(i: importOptions) {
    for (const k in i) {
      this.validateKey(i, k) && this.addProperty(i[k], k)
    }
  }
  private addProperty(i: Script, k: string): void {
    this[k] = () => {
      this.runScripts(i)
    }
  }
  private validateKey(i: importOptions, k: string): i is importOptions {
    let z = false
    i[k].commands.forEach((b: string) => {
      if (typeof b !== 'string') {
        z = true
      }
    })
    return i && i[k] && z
  }
  private runScripts(cb: Script) {
    const z: string[] = cb.commands.slice(0)
    const next = function () {
      let c: string
      if (!(c = z.shift())) {
        return
      }

      if (cb.sync !== undefined && cb.sync === true) {
        const r = spawnSync(c, {
          shell: true,
          stdio: 'inherit',
          env: process.env,
        })
        if (r.status === 0) {
          next()
        }
      } else {
        spawn(c, {
          shell: true,
          stdio: 'inherit',
          env: process.env,
        }).on('close', (b) => {
          if (b === 0) {
            next()
          }
        })
      }
    }
    next()
  }
}
