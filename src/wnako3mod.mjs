// wnako3mod - nadesiko for web browser
// - wnako3 から wnako3mod を取り込む。
// - このファイルはモジュールとして別のファイルから取り込み可能。
import { NakoCompiler } from '../core/src/nako3.mjs';
import { NakoImportError } from '../core/src/nako_errors.mjs';
import { setupEditor } from './wnako3_editor.mjs';
import nakoVersion from './nako_version.mjs';
import PluginBrowser from './plugin_browser.mjs';
const NAKO_SCRIPT_RE = /^(なでしこ|nako|nadesiko)3?$/;
export class WebNakoCompiler extends NakoCompiler {
    constructor() {
        super({ useBasicPlugin: true });
        this.wnakoVersion = nakoVersion;
        this.localFiles = {};
        // プラグインを追加
        this.addPluginObject('PluginBrowser', PluginBrowser);
        // 必要な定数を設定
        this.addListener('beforeRun', (g) => {
            // バージョン情報を設定
            g.__varslist[0]['ナデシコ種類'] = 'wnako3';
            g.__varslist[0]['ナデシコバージョン'] = nakoVersion.version;
            g.__varslist[0]['WNAKOバージョン'] = nakoVersion.version;
        });
    }
    /**
     * ブラウザでtype="なでしこ"というスクリプトを得て実行する
     */
    async runNakoScript() {
        // スクリプトタグの中身を得る
        let nakoScriptCount = 0;
        const scripts = document.querySelectorAll('script');
        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            if (script.type.match(NAKO_SCRIPT_RE)) {
                nakoScriptCount++;
                // URLからスクリプト名を見つける
                const url = (typeof (window.location) === 'object') ? window.location.href : 'url_unknown';
                const fname = `${url}#script${nakoScriptCount}.nako3`;
                const code = script.text;
                // 依存するライブラリをロード
                await this.loadDependencies(code, fname);
                // プログラムを実行
                await this.runAsync(script.text, fname);
            }
        }
        if (nakoScriptCount > 1) {
            console.log('実行したなでしこの個数=', nakoScriptCount);
        }
    }
    /** 取り込む文を実行する */
    async loadDependencies(code, filename, preCode = '', localFiles = {}) {
        this.localFiles = localFiles || {};
        return this._loadDependencies(code, filename, preCode, this.getLoaderTool());
    }
    /**
     * type=なでしこ のスクリプトを自動実行するべきかどうかを返す
     * @returns type=なでしこ のスクリプトを自動実行するべきかどうか
     */
    checkScriptTagParam() {
        const scripts = document.querySelectorAll('script');
        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            const src = script.src || '';
            if (src.indexOf('wnako3.js?run') >= 0 ||
                src.indexOf('wnako3.js&run') >= 0) {
                return true;
            }
        }
        return false;
    }
    /**
     * 指定したidのHTML要素をなでしこ言語のエディタにする。
     * @param {string | Element} idOrElement HTML要素
     * @see {setupEditor}
     */
    setupEditor(idOrElement) {
        return setupEditor(idOrElement, this, window.ace);
    }
    /** なでしこ3の『取り込む』命令のための読み込みツール */
    getLoaderTool() {
        const tool = { readJs: this.readJs, readNako3: this.readNako3, resolvePath: this.resolvePath };
        return tool;
    }
    /** JSプラグインの読み込み */
    readJs(filePath, token) {
        if (this.localFiles && this.localFiles[filePath]) {
            return {
                task: (async () => () => {
                    // eslint-disable-next-line no-new-func
                    Function(this.localFiles[filePath])();
                    return {};
                })()
            };
        }
        return {
            task: (async () => {
                // もし動的インポートに対応していれば動的インポートを試す
                const basename = ('/' + filePath).split('/').pop() || '?';
                /*
                try {
                  const obj = await import(filePath)
                  this.addPluginObject(basename, obj)
                  return {}
                } catch (e) { }
                */
                // WebPackの関係で動的インポートが失敗するので、テキストとしてJSソースを取り出して処理する
                // JavaScriptをテキストとして取得
                const res = await fetch(filePath);
                if (!res.ok) {
                    throw new NakoImportError(`ファイル『${filePath}』のダウンロードに失敗しました: ${res.status} ${res.statusText}`, token.file, token.line);
                }
                let jstext = await res.text();
                // ESModuleっぽければ `default export`を置き換える
                const r = Math.floor(Math.random() * 1000000);
                const exportName = `exportObject${r}`;
                if (jstext.includes('default export')) {
                    jstext = jstext.replace('default export', `;let ${exportName} = `);
                    jstext += `\n;navigator.nako3.addPluginObject('${basename}', ${exportName});\n`;
                }
                // addPluginObjectが存在する
                if (!jstext.includes('navigator.nako3.addPluginObject')) {
                    throw new NakoImportError(`ファイル ${filePath} の中に文字列 "navigator.nako3.addPluginObject" が存在しません。現在、ブラウザ版のなでしこ言語v3は自動登録するプラグインのみをサポートしています。`, token.file, token.line);
                }
                const gNavigator = navigator;
                const gSelf = gNavigator.nako3;
                // textの例: `navigator.nako3.addPluginObject('PluginRequireTest', { requiretest: { type: 'var', value: 100 } })`
                return () => {
                    // プラグインの自動登録は navigator.nako3 を参照するため、 navigator.nako3 を一時的に現在のインスタンスにする。
                    const globalNavigator = gNavigator;
                    const globalNako3 = globalNavigator.nako3;
                    globalNavigator.nako3 = gSelf;
                    try {
                        // eslint-disable-next-line no-new-func
                        const f = Function(jstext);
                        f.apply(gSelf.__globalObj);
                    }
                    catch (err) {
                        throw new NakoImportError(`プラグイン ${filePath} の取り込みに失敗: ${err instanceof Error ? err.message : err + ''}`, token.file, token.line);
                    }
                    finally {
                        globalNavigator.nako3 = globalNako3;
                    }
                    return {};
                };
            })()
        };
    }
    /** NAKO3プラグインの読み込み */
    readNako3(filePath, token) {
        if (this.localFiles && this.localFiles[filePath]) { // ローカルファイルを使う場合
            return {
                task: (() => {
                    return (new Promise((resolve, reject) => {
                        const s = this.localFiles[filePath];
                        resolve(s);
                    }));
                })()
            };
        }
        return {
            task: (async () => {
                const res = await fetch(filePath);
                if (!res.ok) {
                    throw new NakoImportError(`ファイル ${filePath} のダウンロードに失敗しました: ${res.status} ${res.statusText}`, token.file, token.line);
                }
                return await res.text();
            })()
        };
    }
    /** 読み込みでパスを解決する */
    resolvePath(name, token, fromFile) {
        let pathname = name;
        // http から始まっていれば解決は不要
        if (pathname.match(/^https?:\/\//)) { // フルパスなら解決不要
        }
        else if (this.localFiles && this.localFiles[name]) {
            pathname = this.localFiles[name];
        }
        else {
            try {
                pathname = new URL(name).pathname;
            }
            catch (e) {
                // 単純にパスに変換できなければ、location.hrefを参考にパスを組み立てる
                try {
                    let baseDir = dirname(fromFile);
                    if (baseDir === '') {
                        // https://2/3/4.html
                        const a = window.location.href.split('/');
                        baseDir = '/' + a.slice(3, a.length - 1).join('/');
                    }
                    pathname = resolveURL(baseDir, name);
                }
                catch (e) {
                    throw new NakoImportError(`取り込み文の引数でパスが解決できません。https:// か http:// で始まるアドレスを指定してください。\n${e}`, token.file, token.line);
                }
            }
        }
        // 拡張子によってプラグインタイプを分岐する
        const checkExt = (name, extlist) => {
            for (const ext of extlist) {
                if (name.endsWith(ext)) {
                    return true;
                }
                if (name.endsWith(ext + '.txt')) {
                    return true;
                } // '.mjs.txt' にもマッチ
            }
            return false;
        };
        // URLパラメータを考慮する
        const aname = (pathname + '?').split('?')[0];
        // JSプラグイン    → (.js|.mjs)
        // NAKO3プラグイン → (.nako3|.nako)
        if (checkExt(aname, ['.js', '.mjs'])) {
            return { filePath: pathname, type: 'js' };
        }
        if (checkExt(aname, ['.nako3', '.nako'])) {
            return { filePath: pathname, type: 'nako3' };
        }
        if (checkExt(pathname, ['.js', '.mjs'])) {
            return { filePath: pathname, type: 'js' };
        }
        if (checkExt(pathname, ['.nako3', '.nako'])) {
            return { filePath: pathname, type: 'nako3' };
        }
        // ファイル拡張子が未指定の場合
        throw new NakoImportError(`ファイル『${name}』は拡張子が(.nako3|.js|.js.txt|.mjs|.mjs.txt)以外なので取り込めません。`, token.file, token.line);
    }
}
function dirname(s) {
    const a = s.split('/');
    if (a && a.length > 1) {
        return a.slice(0, a.length - 1).join('/');
    }
    return '';
}
function resolveURL(base, s) {
    const baseA = base.split('/');
    const sA = s.split('/');
    for (const p of sA) {
        if (p === '') {
            continue;
        }
        if (p === '.') {
            continue;
        }
        if (p === '..') {
            baseA.pop();
            continue;
        }
        baseA.push(p);
    }
    return baseA.join('/');
}
