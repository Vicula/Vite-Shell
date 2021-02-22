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
}

// process {
//   version: 'v15.7.0',
//   versions: {
//     node: '15.7.0',
//     v8: '8.6.395.17-node.23',
//     uv: '1.40.0',
//     zlib: '1.2.11',
//     brotli: '1.0.9',
//     ares: '1.17.1',
//     modules: '88',
//     nghttp2: '1.42.0',
//     napi: '7',
//     llhttp: '2.1.3',
//     openssl: '1.1.1i',
//     cldr: '38.1',
//     icu: '68.2',
//     tz: '2020d',
//     unicode: '13.0'
//   },
//   arch: 'x64',
//   platform: 'darwin',
//   release: {
//     name: 'node',
//     sourceUrl: 'https://nodejs.org/download/release/v15.7.0/node-v15.7.0.tar.gz',
//     headersUrl: 'https://nodejs.org/download/release/v15.7.0/node-v15.7.0-headers.tar.gz'
//   },
//   _rawDebug: [Function: _rawDebug],
//   moduleLoadList: [
//     'Internal Binding native_module',
//     'Internal Binding errors',
//     'NativeModule internal/errors',
//     'Internal Binding config',
//     'Internal Binding constants',
//     'Internal Binding util',
//     'Internal Binding types',
//     'NativeModule internal/util',
//     'NativeModule internal/util/types',
//     'NativeModule internal/assert',
//     'Internal Binding icu',
//     'NativeModule internal/util/inspect',
//     'NativeModule internal/validators',
//     'NativeModule events',
//     'Internal Binding buffer',
//     'Internal Binding string_decoder',
//     'NativeModule internal/buffer',
//     'Internal Binding symbols',
//     'Internal Binding messaging',
//     'NativeModule internal/worker/js_transferable',
//     'NativeModule internal/blob',
//     'NativeModule buffer',
//     'NativeModule internal/process/per_thread',
//     'Internal Binding process_methods',
//     'Internal Binding credentials',
//     'Internal Binding async_wrap',
//     'Internal Binding task_queue',
//     'NativeModule internal/async_hooks',
//     'NativeModule internal/process/promises',
//     'NativeModule internal/fixed_queue',
//     'NativeModule internal/process/task_queues',
//     'Internal Binding trace_events',
//     'NativeModule internal/constants',
//     'NativeModule internal/console/constructor',
//     'NativeModule internal/console/global',
//     'NativeModule internal/util/inspector',
//     'Internal Binding inspector',
//     'NativeModule internal/querystring',
//     'NativeModule path',
//     'Internal Binding url',
//     'NativeModule internal/url',
//     'NativeModule internal/encoding',
//     'NativeModule internal/util/debuglog',
//     'NativeModule util',
//     'NativeModule internal/event_target',
//     'NativeModule internal/abort_controller',
//     'Internal Binding worker',
//     'NativeModule internal/streams/destroy',
//     'NativeModule internal/streams/pipeline',
//     'NativeModule internal/streams/end-of-stream',
//     'NativeModule internal/streams/legacy',
//     'NativeModule internal/streams/add-abort-signal',
//     'NativeModule internal/streams/buffer_list',
//     'NativeModule internal/streams/state',
//     'NativeModule internal/streams/readable',
//     'NativeModule internal/streams/writable',
//     'NativeModule internal/streams/duplex',
//     'NativeModule internal/streams/transform',
//     'NativeModule internal/streams/passthrough',
//     'NativeModule stream',
//     'NativeModule internal/worker/io',
//     'Internal Binding timers',
//     'NativeModule internal/linkedlist',
//     'NativeModule internal/priority_queue',
//     'NativeModule internal/timers',
//     'NativeModule timers',
//     'NativeModule internal/process/execution',
//     'NativeModule internal/process/warning',
//     'NativeModule internal/process/signal',
//     'Internal Binding options',
//     'NativeModule internal/options',
//     'NativeModule internal/bootstrap/pre_execution',
//     'NativeModule internal/inspector_async_hook',
//     'Internal Binding report',
//     'NativeModule internal/process/report',
//     'Internal Binding fs',
//     'NativeModule internal/fs/utils',
//     'Internal Binding fs_dir',
//     'NativeModule internal/fs/dir',
//     'NativeModule fs',
//     'NativeModule internal/util/iterable_weak_map',
//     'NativeModule internal/modules/cjs/helpers',
//     'NativeModule internal/source_map/source_map_cache',
//     'Internal Binding contextify',
//     'NativeModule vm',
//     'NativeModule internal/idna',
//     'NativeModule url',
//     'NativeModule internal/modules/package_json_reader',
//     'Internal Binding module_wrap',
//     'NativeModule internal/modules/esm/module_job',
//     'NativeModule internal/modules/esm/module_map',
//     'NativeModule internal/modules/esm/resolve',
//     'NativeModule internal/modules/esm/get_format',
//     'NativeModule internal/fs/rimraf',
//     'NativeModule internal/fs/promises',
//     'NativeModule internal/modules/esm/get_source',
//     'NativeModule internal/modules/esm/transform_source',
//     'NativeModule internal/modules/esm/create_dynamic_module',
//     'NativeModule internal/modules/esm/translators',
//     'NativeModule internal/modules/esm/loader',
//     ... 19 more items
//   ],
//   binding: [Function: binding],
//   _linkedBinding: [Function: _linkedBinding],
//   _events: [Object: null prototype] {
//     newListener: [Function: startListeningIfSignal],
//     removeListener: [Function: stopListeningIfSignal],
//     warning: [Function: onWarning],
//     SIGWINCH: [Function (anonymous)]
//   },
//   _eventsCount: 4,
//   _maxListeners: undefined,
//   domain: null,
//   _exiting: false,
//   config: {
//     target_defaults: {
//       cflags: [],
//       default_configuration: 'Release',
//       defines: [],
//       include_dirs: [],
//       libraries: []
//     },
//     variables: {
//       asan: 0,
//       coverage: false,
//       dcheck_always_on: 0,
//       debug_nghttp2: false,
//       debug_node: false,
//       enable_lto: false,
//       enable_pgo_generate: false,
//       enable_pgo_use: false,
//       error_on_warn: false,
//       experimental_quic: false,
//       force_dynamic_crt: 0,
//       host_arch: 'x64',
//       icu_data_in: '../../deps/icu-tmp/icudt68l.dat',
//       icu_endianness: 'l',
//       icu_gyp_path: 'tools/icu/icu-generic.gyp',
//       icu_path: 'deps/icu-small',
//       icu_small: false,
//       icu_ver_major: '68',
//       is_debug: 0,
//       llvm_version: '11.0',
//       napi_build_version: '7',
//       node_byteorder: 'little',
//       node_debug_lib: false,
//       node_enable_d8: false,
//       node_install_npm: true,
//       node_module_version: 88,
//       node_no_browser_globals: false,
//       node_prefix: '/',
//       node_release_urlbase: 'https://nodejs.org/download/release/',
//       node_shared: false,
//       node_shared_brotli: false,
//       node_shared_cares: false,
//       node_shared_http_parser: false,
//       node_shared_libuv: false,
//       node_shared_nghttp2: false,
//       node_shared_openssl: false,
//       node_shared_zlib: false,
//       node_tag: '',
//       node_target_type: 'executable',
//       node_use_bundled_v8: true,
//       node_use_dtrace: true,
//       node_use_etw: false,
//       node_use_node_code_cache: true,
//       node_use_node_snapshot: true,
//       node_use_openssl: true,
//       node_use_v8_platform: true,
//       node_with_ltcg: false,
//       node_without_node_options: false,
//       openssl_fips: '',
//       openssl_is_fips: false,
//       ossfuzz: false,
//       shlib_suffix: '88.dylib',
//       target_arch: 'x64',
//       v8_enable_31bit_smis_on_64bit_arch: 0,
//       v8_enable_gdbjit: 0,
//       v8_enable_i18n_support: 1,
//       v8_enable_inspector: 1,
//       v8_enable_lite_mode: 0,
//       v8_enable_object_print: 1,
//       v8_enable_pointer_compression: 0,
//       v8_no_strict_aliasing: 1,
//       v8_optimized_debug: 1,
//       v8_promise_internal_field_count: 1,
//       v8_random_seed: 0,
//       v8_trace_maps: 0,
//       v8_use_siphash: 1,
//       want_separate_host_toolset: 0,
//       xcode_version: '11.0'
//     }
//   },
//   dlopen: [Function: dlopen],
//   uptime: [Function: uptime],
//   _getActiveRequests: [Function: _getActiveRequests],
//   _getActiveHandles: [Function: _getActiveHandles],
//   reallyExit: [Function: reallyExit],
//   _kill: [Function: _kill],
//   cpuUsage: [Function: cpuUsage],
//   resourceUsage: [Function: resourceUsage],
//   memoryUsage: [Function: memoryUsage] { rss: [Function: rss] },
//   kill: [Function: kill],
//   exit: [Function: exit],
//   openStdin: [Function (anonymous)],
//   getuid: [Function: getuid],
//   geteuid: [Function: geteuid],
//   getgid: [Function: getgid],
//   getegid: [Function: getegid],
//   getgroups: [Function: getgroups],
//   allowedNodeEnvironmentFlags: [Getter/Setter],
//   assert: [Function: deprecated],
//   features: {
//     inspector: true,
//     debug: false,
//     uv: true,
//     ipv6: true,
//     tls_alpn: true,
//     tls_sni: true,
//     tls_ocsp: true,
//     tls: true,
//     cached_builtins: [Getter]
//   },
//   _fatalException: [Function (anonymous)],
//   setUncaughtExceptionCaptureCallback: [Function: setUncaughtExceptionCaptureCallback],
//   hasUncaughtExceptionCaptureCallback: [Function: hasUncaughtExceptionCaptureCallback],
//   emitWarning: [Function: emitWarning],
//   nextTick: [Function: nextTick],
//   _tickCallback: [Function: runNextTicks],
//   _debugProcess: [Function: _debugProcess],
//   _debugEnd: [Function: _debugEnd],
//   _startProfilerIdleNotifier: [Function (anonymous)],
//   _stopProfilerIdleNotifier: [Function (anonymous)],
//   stdout: [Getter],
//   stdin: [Getter],
//   stderr: [Getter],
//   abort: [Function: abort],
//   umask: [Function: wrappedUmask],
//   chdir: [Function: wrappedChdir],
//   cwd: [Function: wrappedCwd],
//   initgroups: [Function: initgroups],
//   setgroups: [Function: setgroups],
//   setegid: [Function (anonymous)],
//   seteuid: [Function (anonymous)],
//   setgid: [Function (anonymous)],
//   setuid: [Function (anonymous)],
//   env: {
//     NVM_INC: '/Users/viccarpenter/.nvm/versions/node/v15.7.0/include/node',
//     TERM_PROGRAM: 'vscode',
//     rvm_bin_path: '/Users/viccarpenter/.rvm/bin',
//     NVM_CD_FLAGS: '',
//     SHELL: '/bin/bash',
//     TERM: 'xterm-256color',
//     TMPDIR: '/var/folders/13/w3p23t7d6pg33lwxdhj65t7m0000gn/T/',
//     LIBRARY_PATH: '/usr/local/lib',
//     TERM_PROGRAM_VERSION: '1.53.2',
//     ORIGINAL_XDG_CURRENT_DESKTOP: 'undefined',
//     SDKROOT: '/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk',
//     GIT_AUTHOR_DATE: '@1614016690 -0500',
//     GIT_EDITOR: ':',
//     NVM_DIR: '/Users/viccarpenter/.nvm',
//     USER: 'viccarpenter',
//     COMMAND_MODE: 'unix2003',
//     _system_type: 'Darwin',
//     rvm_path: '/Users/viccarpenter/.rvm',
//     CPATH: '/usr/local/include',
//     GIT_INDEX_FILE: '.git/index',
//     SSH_AUTH_SOCK: '/private/tmp/com.apple.launchd.tMu1fG7fL2/Listeners',
//     __CF_USER_TEXT_ENCODING: '0x1F5:0x0:0x0',
//     GIT_AUTHOR_NAME: 'Victor Carpenter',
//     GIT_PREFIX: '',
//     rvm_prefix: '/Users/viccarpenter',
//     PATH: '/Library/Developer/CommandLineTools/usr/libexec/git-core:/Users/viccarpenter/.nvm/versions/node/v15.7.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/share/dotnet:~/.dotnet/tools:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Wireshark.app/Contents/MacOS:/Applications/Xamarin Workbooks.app/Contents/SharedSupport/path-bin:/Users/viccarpenter/.nvm/versions/node/v15.7.0/bin:/Users/viccarpenter/.rvm/bin',
//     husky_skip_init: '1',
//     __CFBundleIdentifier: 'com.microsoft.VSCode',
//     PWD: '/Users/viccarpenter/Projects/Projects/vue3/Vite-Shell',
//     LANG: 'en_US.UTF-8',
//     XPC_FLAGS: '0x0',
//     _system_arch: 'x86_64',
//     _system_version: '11.2',
//     XPC_SERVICE_NAME: '0',
//     rvm_version: '1.29.3 (latest)',
//     HOME: '/Users/viccarpenter',
//     SHLVL: '4',
//     VSCODE_GIT_ASKPASS_MAIN: '/Users/viccarpenter/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass-main.js',
//     LOGNAME: 'viccarpenter',
//     VSCODE_GIT_IPC_HANDLE: '/var/folders/13/w3p23t7d6pg33lwxdhj65t7m0000gn/T/vscode-git-e8b10a6d2b.sock',
//     NVM_BIN: '/Users/viccarpenter/.nvm/versions/node/v15.7.0/bin',
//     GIT_ASKPASS: '/Users/viccarpenter/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass.sh',
//     VSCODE_GIT_ASKPASS_NODE: '/Users/viccarpenter/Applications/Visual Studio Code.app/Contents/Frameworks/Code Helper (Renderer).app/Contents/MacOS/Code Helper (Renderer)',
//     GIT_AUTHOR_EMAIL: 'victorcarpenter123@gmail.com',
//     GIT_EXEC_PATH: '/Library/Developer/CommandLineTools/usr/libexec/git-core',
//     _system_name: 'OSX',
//     COLORTERM: 'truecolor',
//     _: '/Users/viccarpenter/.nvm/versions/node/v15.7.0/bin/node'
//   },
//   title: 'node',
//   argv: [
//     '/Users/viccarpenter/.nvm/versions/node/v15.7.0/bin/node',
//     '/Users/viccarpenter/Projects/Projects/vue3/Vite-Shell/scripts/verifyCommits.js'
//   ],
//   execArgv: [],
//   pid: 45658,
//   ppid: 45656,
//   execPath: '/Users/viccarpenter/.nvm/versions/node/v15.7.0/bin/node',
//   debugPort: 9229,
//   hrtime: [Function: hrtime] { bigint: [Function: hrtimeBigInt] },
//   argv0: 'node',
//   _preload_modules: [],
//   mainModule: Module {
//     id: '.',
//     path: '/Users/viccarpenter/Projects/Projects/vue3/Vite-Shell/scripts',
//     exports: {},
//     filename: '/Users/viccarpenter/Projects/Projects/vue3/Vite-Shell/scripts/verifyCommits.js',
//     loaded: false,
//     children: [ [Module] ],
//     paths: [
//       '/Users/viccarpenter/Projects/Projects/vue3/Vite-Shell/scripts/node_modules',
//       '/Users/viccarpenter/Projects/Projects/vue3/Vite-Shell/node_modules',
//       '/Users/viccarpenter/Projects/Projects/vue3/node_modules',
//       '/Users/viccarpenter/Projects/Projects/node_modules',
//       '/Users/viccarpenter/Projects/node_modules',
//       '/Users/viccarpenter/node_modules',
//       '/Users/node_modules',
//       '/node_modules'
//     ]
//   },
//   [Symbol(kCapture)]: false
// }
// node:internal/fs/utils:634
//     throw new ERR_INVALID_ARG_TYPE(propName, ['string', 'Buffer', 'URL'], path);
//     ^

// TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string or an instance of Buffer or URL. Received undefined
//     at Object.openSync (node:fs:482:10)
//     at Object.readFileSync (node:fs:391:35)
//     at Object.<anonymous> (/Users/viccarpenter/Projects/Projects/vue3/Vite-Shell/scripts/verifyCommits.js:7:27)
//     at Module._compile (node:internal/modules/cjs/loader:1108:14)
//     at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)
//     at Module.load (node:internal/modules/cjs/loader:973:32)
//     at Function.Module._load (node:internal/modules/cjs/loader:813:14)
//     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:76:12)
//     at node:internal/main/run_main_module:17:47 {
//   code: 'ERR_INVALID_ARG_TYPE'
// }
