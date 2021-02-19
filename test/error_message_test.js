const assert = require('assert')
const NakoCompiler = require('../src/nako3')
const { NakoSyntaxError, NakoRuntimeError, NakoIndentError } = require('../src/nako_errors')

describe('error_message', () => {
  const nako = new NakoCompiler()
  // nako.debug = true;

  /**
   * エラーメッセージがresArrの全ての要素を含むことを確認する。
   */
  const cmp = (code, resArr, ErrorClass) => {
    if (nako.debug) {
      console.log('code=' + code)
    }
    assert.throws(
      () => nako.runReset(code),
      err => {
        assert(err instanceof ErrorClass)
        for (const res of resArr) {
          if (err.message.indexOf(res) === -1) {
            throw new Error(`${JSON.stringify(err.message)} が ${JSON.stringify(res)} を含みません。`)
          }
        }
        return true
      }
    )
  }

  describe('構文エラー', () => {
    it('比較', () => {
      cmp('「こんにち」はを表示', [
        '不完全な文です。',
        '演算子『＝』が解決していません。',
        '演算子『＝』は『文字列『こんにち』と単語『を表示』が等しいかどうかの比較』として使われています。',
      ], NakoSyntaxError)
    })
    it('単項演算子', () => {
      cmp('!(はい + 1)', [
        '不完全な文です。',
        '演算子『not』が解決していません。',
        '演算子『not』は『演算子『+』に演算子『not』を適用した式』として使われています。',
      ], NakoSyntaxError)
    })
    it('2項演算子', () => {
      cmp('1 + 2', [
        '不完全な文です。',
        '演算子『+』が解決していません。',
        '演算子『+』は『数値1と数値2に演算子『+』を適用した式』として使われています。',
      ], NakoSyntaxError)
    })
    it('変数のみの式', () => {
      cmp('A', [
        '不完全な文です。',
        '単語『A』が解決していません。',
      ], NakoSyntaxError)
    })
    it('複数のノードが使われていない場合', () => {
      cmp('あ「こんにちは」はは表示', [
        '不完全な文です。',
        '単語『あ』、演算子『＝』が解決していません。',
        '演算子『＝』は『文字列『こんにちは』と単語『は表示』が等しいかどうかの比較』として使われています。',
      ], NakoSyntaxError)
    })
    it('関数の宣言でエラー', () => {
      cmp('●30とは', [
        '関数30の宣言でエラー。',
      ], NakoSyntaxError)
    })
    it('依存ファイルにエラーがある場合', () => {
      nako.dependencies = { 'dependent.nako3': { content: '\na', alias: new Set(['dependent.nako3']) } }
      cmp('!「dependent.nako3」を取り込む\n1を表示', [
        'dependent.nako3',
        '2行目',
      ], NakoSyntaxError)
    })
  })
  describe('実行時エラー', () => {
    it('「エラー発生」の場合', () => {
      cmp(
        '「エラーメッセージ」のエラー発生', [
        '関数『エラー発生』でエラー『エラーメッセージ』が発生しました。',
      ], NakoRuntimeError)
    })
  })
  describe('インデント構文のエラー', () => {
    it('『ここまで』を使用', () => {
      cmp(
        '！インデント構文\n' +
        'もしはいならば\n' +
        'ここまで\n', [
        '3行目',
        'インデント構文が有効化されているときに『ここまで』を使うことはできません。'
      ], NakoIndentError)
    })
    it('『ここまで』を使用 - "_"を使った場合', () => {
      cmp(
        '！インデント構文\n' +
        'A=[ _\n' +
        ']\n' +
        'ここまで\n', ['4行目'], NakoIndentError)
    })
  })
  it('字句解析エラー', () => {
    cmp('「{」を表示\n', ['展開あり文字列で値の埋め込み{...}が対応していません。'])
  })
})
