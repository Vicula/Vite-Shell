import { spawn, spawnSync } from 'child_process'
import { exportOptions, importOptions, Script } from './types'

export default function execute(input: importOptions): exportOptions {
  return new createShellPlugin(input)
}

class createShellPlugin {
  name: 'shell-cycles'
  constructor(i: importOptions) {}
  private validate(i: importOptions) {}
  private runScripts(cb: Script) {
    const z: string[] = cb.commands.slice(0)
    const next = function () {
      let c
      if (!(c = z.shift())) {
        return
      }

      if (cb.sync !== undefined && cb.sync == true) {
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
