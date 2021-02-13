export interface Script {
  commands: string[]
  sync?: boolean
}

export interface importOptions {
  buildEnd?: Script
  buildStart?: Script
  closeWatcher?: Script
  watchChange?: Script
  moduleParsed?: Script
  generateBundle?: Script
  renderError?: Script
  renderStart?: Script
  writeBundle?: Script
}

export interface exportOptions {
  name: string

  // Called on dev
  buildEnd?: () => void
  buildStart?: () => void
  closeWatcher?: () => void
  watchChange?: () => void
  moduleParsed?: () => void

  // Called on build
  renderError?: () => void
  renderStart?: () => void
  writeBundle?: () => void
  generateBundle?: () => void

  // called on both
  closeBundle?: () => void
}
