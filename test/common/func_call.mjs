import assert from 'assert'
import { NakoCompiler } from '../../src/nako3.mjs'
import { NakoSyntaxError } from '../../src/nako_errors.mjs'

describe('関数呼び出しテスト', () => {
  const nako = new NakoCompiler()
  // nako.logger.addListener('trace', ({ browserConsole }) => { console.log(...browserConsole) })
  const cmp = (code, res) => {
    nako.logger.debug('code=' + code)
    assert.strictEqual(nako.run(code).log, res)
  }
  const cmd = (code) => {
    nako.logger.debug('code=' + code)
    nako.run(code)
  }
  // --- test ---
  it('関数式の呼び出し - 足す(2,3)を表示。', () => {
    cmp('足す(2,3)を表示。', '5')
  })
  it('四則演算を連文で', () => {
    cmp('1に2を足して3を掛けて3で割って2を引いて表示', '1')
  })
  it('「そう」のテスト', () => {
    cmp('３が１以上。もしそうならば「真」と表示。', '真')
  })
  it('後方で定義した関数を前方で使う1', () => {
    cmp('HOGE(3,4)を表示;●(A,B)HOGEとは;それはA+B;ここまで;', '7')
    cmp('「姫」と「殿」が出会って表示;●(AとBが)出会うとは;それはA&B;ここまで;', '姫殿')
  })
  it('後方で定義した関数を前方で使う2', () => {
    cmp('Nとは変数=30;HOGE(3,4)を表示;●(A,B)HOGEとは;それはA+B+N;ここまで;', '37')
  })
  it('代入と表示', () => {
    cmp('A=今日;もし(今日=A)ならば「1」と表示', '1')
  })
  it('代入1', () => {
    cmp('A=今日の曜日番号取得;B=(今日)の曜日番号取得;もしA=Bならば「等しい」を表示。', '等しい')
  })
  it('代入2', () => {
    cmp('Aは、今日の曜日番号取得;Bは、(今日)の曜日番号取得;もしA=Bならば「等しい」を表示。', '等しい')
  })
  it('代入3', () => {
    cmp('A=(今日の曜日番号取得)+1;B=((今日)の曜日番号取得)+1;もしA=Bならば「等しい」を表示。', '等しい')
  })
  it('配列への代入', () => {
    cmp('値段は空配列。値段[0]に3000を代入。値段[0]を表示。', '3000')
  })
  it('**には**構文 - 基本', () => {
    cmp('実行には;「あ」と表示;ここまで', 'あ')
  })
  it('**には**構文 - 配列カスタムソート', () => {
    cmp('A=[5,1,3];Aを配列カスタムソートするには(a,b);それはb-a;ここまで;Aを「:」で配列結合して表示', '5:3:1')
  })
  it('階乗計算 - 再帰', () => {
    cmp('●(VをAのBで)階乗計算とは;' +
      'もし、Bが0以下ならば、Vを戻す。;(V*A)をAの(B-1)で階乗計算して戻す。' +
      'ここまで。;1を2の3で階乗計算して表示。', '8')
  })
  it('連続文後の代入', () => {
    cmp('「2017/09/01T00:00:99」の「T」を「 」に置換して「 」まで切り取り、対象日に代入。対象日を表示。', '2017/09/01')
  })
  it('連続文後の=代入', () => {
    cmp('対象日=「2017/09/01T00:00:99」の「T」を「 」に置換して「 」まで切り取る。対象日を表示。', '2017/09/01')
  })
  it('関数の引数に関数呼び出しがある場合', () => {
    cmp('A=「ab」;「abcd」の1から(Aの文字数)だけ文字削除。それを表示。', 'cd')
  })
  it('配列カスタムソートの基本的な使い方例', ()=> {
    cmp('●MYSORT(a,b)とは\n' +
        '(INT(a) - INT(b))で戻る。\n' +
        'ここまで。\n' +
        'ARY=[8,3,4];' +
        '「MYSORT」でARYを配列カスタムソートしてJSONエンコードして表示', '[3,4,8]')
  })
  it('引数の順番を入れ替えて呼び出す(#342)その1', () => {
    cmp('『abc』の『a』を「*」に置換。表示', '*bc')
    cmp('『a』を「*」に『abc』の置換。表示', '*bc')
    cmp('「*」へ『a』から『abc』の置換。表示', '*bc')
    cmp('「abcdefg」の1から3だけ文字削除して表示。', 'defg')
    cmp('「abcdefg」の1から3を文字削除して表示。', 'defg')
    cmp('1から3を「abcdefg」の文字削除して表示。', 'defg')
    cmp('3を「abcdefg」の1から文字削除して表示。', 'defg')
    cmp('3だけ「abcdefg」の1から文字削除して表示。', 'defg')
  })
  it('引数の順番を入れ替えて呼び出す(#342)その2', () => {
    cmp('[8,3,4]の配列カスタムソートには(a,b)\nそれは(a - b)\nここまで。それをJSONエンコードして表示', '[3,4,8]')
    cmp('[8,3,4]を配列カスタムソートには(a,b)\nそれは(a - b)\nここまで。それをJSONエンコードして表示', '[3,4,8]')
    cmp('[8,3,4]の配列カスタムソートには(a,b)\nそれは(INT(a) - INT(b))\nここまで。それをJSONエンコードして表示', '[3,4,8]')
  })
  it('引数の順番を入れ替えて呼び出す(#342)その3', () => {
    cmp('ARY=[8,3,4];' +
        'ARYの配列カスタムソートには(a,b)\n' +
        'aと255のXORをAに代入。bと255のXORをBに代入。' +
        'それは(INT(a) - INT(b))\n' +
        'ここまで。\n' +
        'ARYをJSONエンコードして表示', '[3,4,8]')
  })
  it('可変長引数 #729', () => { // 経緯 #501 → #729 
    cmp('連続加算(1,2,3)を表示。', '6')
    cmp('1と2と3を連続加算して表示。', '6')
    cmp('1に2と3を連続加算して表示。', '6')
  })
  // ---
  it('関数呼び出し演算子に変更(1) #891', () => {
    cmp('表示←3', '3')
    cmp('表示←3を', '3')
    cmp('表示←INT←3.14', '3')
    cmp('足す←2に3を;それを表示;', '5')
    cmp('割る←10を2で;それを表示;', '5')
    cmp('割る<--2で10を;それを表示', '5')
  })
  it('関数呼び出し演算子に変更(2) #891', () => {
    cmp('A=(割る<--10を2で)+2;Aを表示;', '7')
    cmp('(割る←10を2で)を表示;', '5')
    cmp('割る<--2で(割る←100を10で)を;それを表示', '5')
    cmp('(割る←100を10で)を2で割って表示', '5')
  })
  it('関数呼び出し演算子に変更(ユーザー関数) #891', () => {
    cmp('●(Aを)AAA;それはA*2;ここまで;AAA←30;それを表示', '60')
    cmp('●(AをBで)AAA;それはA/B;ここまで;AAA←30を3で;それを表示', '10')
  })
  it('エラー/関数の呼び出し演算子 #891/引数がない関数', () => {
    const funcName = 'AAA'
    assert.throws(
      () => cmd(`●${funcName};それは5;ここまで;${funcName}←`),
      NakoSyntaxError, `引数がない関数『${funcName}』を関数呼び出し演算子で呼び出すことはできません。`
    )
  })
  it('エラー/関数の呼び出し演算子 #891/引数が異なる', () => {
    const funcName = 'テスト'
    assert.throws(
      () => cmd(`●${funcName}(aとbを);それはa*b;ここまで;${funcName}<--8と`),
      NakoSyntaxError, `関数『${funcName}』呼び出しで引数の数(1)が定義(2)と違います。`
    )
  })
  it('ローカル変数が解決できない #1210', () => {
    cmp('S＝「あいうえお」;A＝「かきくけこ」;AをFテスト;●(Sを)Fテストとは;Sを表示;ここまで', 'かきくけこ')
  })
})
