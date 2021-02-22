// Invoked on the commit-msg git hook by husky.
/* eslint-disable */

const chalk = require('chalk')
const msgPath = process.argv.find((a) => a.includes('.git/'))
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim()

const commitRE = /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg)) {
  console.log()
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
      `invalid commit message format.`
    )}\n\n` +
      chalk.red(
        `  Proper commit message format is required for automated changelog generation. Examples:\n\n`
      ) +
      `    ${chalk.green(`feat(compiler): add 'comments' option`)}\n` +
      `      ${chalk.green(`style(plp): added comments section`)}\n` +
      `      ${chalk.green(`wip(pdp): started on comments section`)}\n` +
      `    ${chalk.green(
        `fix(v-model): handle events on blur (close #28)`
      )}\n\n` +
      chalk.red(`  See .workflow/commit-convention.md for more details.\n`)
  )
  process.exit(1)
} else {
  console.log('✨ Passed commit lint')
}
