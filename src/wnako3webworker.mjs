// nadesiko for web browser worker
// wwnako3.js
import { NakoCompiler } from '../core/src/nako3.mjs'
import PluginBrowserInWorker from './plugin_browser_in_worker.mjs'
import PluginWorker from './plugin_worker.mjs'

class WebWorkerNakoCompiler extends NakoCompiler {
  constructor () {
    super()
    this.__varslist[0]['ナデシコ種類'] = 'wwnako3'
    this.__varslist[0]['PluginWorker:ondata'] = (data, event) => {
      throw new Error('『NAKOワーカーデータ受信時』が呼ばれていません。')
    }
  }
}

// ブラウザワーカーなら navigator.nako3 になでしこを登録
// eslint-disable-next-line no-undef
if (typeof (navigator) === 'object' && self && self instanceof WorkerGlobalScope) {
  /** @type {WebWorkerNakoCompiler} */
  const nako3Compiler = navigator.nako3 = new WebWorkerNakoCompiler()
  /** @type {WebWorkerNakoCompiler | import('./nako_global')} */
  let nako3Global = nako3Compiler
  
  nako3Compiler.addPluginObject('PluginBrowserInWorker', PluginBrowserInWorker)
  nako3Compiler.addPluginObject('PluginWorker', PluginWorker)

  nako3Compiler.getLogger().addListener('error', function (obj) {
    self.postMessage({
      type: 'error',
      data: obj
    })
  }, false)

  self.onmessage = (event) => {
    const data = event.data || { type: '', data: '' }
    const type = data.type || ''
    const value = data.data || ''
    switch (type) {
      case 'reset':
        nako3Compiler.reset()
        break
      case 'close':
        self.close()
        break
      case 'run':
        nako3Global = nako3Global.runEx(value, '_webworker.nako3', { resetEnv: false, resetLog: false })
        break
      case 'trans':
        value.forEach(o => {
          if (o.type === 'func') {
            nako3Compiler.nakoFuncList[o.name] = o.content.meta
            nako3Compiler.funclist[o.name] = o.content.func
            nako3Compiler.__varslist[1][o.name] = () => {}
          } else if (o.type === 'val') {
            nako3Compiler.__varslist[2][o.name] = o.content
          }
        })
        break
      case 'data':
        if (nako3Global.__varslist[0]['PluginWorker:ondata']) {
          nako3Global.__varslist[0]['PluginWorker:ondata'].apply(nako3Global, [value, event])
        }
        break
    }
  }
}

