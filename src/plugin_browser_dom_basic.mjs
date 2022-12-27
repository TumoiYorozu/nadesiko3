// @ts-nocheck
export default {
    // @DOM操作
    'DOCUMENT': { type: 'const', value: '' },
    'WINDOW': { type: 'const', value: '' },
    'NAVIGATOR': { type: 'const', value: '' },
    'DOM要素ID取得': {
        type: 'func',
        josi: [['の', 'を']],
        pure: true,
        fn: function (id) {
            return document.getElementById(id);
        }
    },
    'DOM要素取得': {
        type: 'func',
        josi: [['の', 'を']],
        pure: true,
        fn: function (q) {
            return document.querySelector(q);
        }
    },
    'DOM要素全取得': {
        type: 'func',
        josi: [['の', 'を']],
        pure: true,
        fn: function (q) {
            return Array.from(document.querySelectorAll(q));
        }
    },
    'タグ一覧取得': {
        type: 'func',
        josi: [['の', 'を']],
        pure: true,
        fn: function (tag) {
            return document.getElementsByTagName(tag);
        }
    },
    'DOM子要素取得': {
        type: 'func',
        josi: [['の'], ['を']],
        pure: true,
        fn: function (pa, q) {
            if (typeof pa === 'string') {
                pa = document.querySelector(pa);
            }
            if (!pa.querySelector) {
                throw new Error('『DOM子要素取得』で親要素がDOMではありません。');
            }
            return pa.querySelector(q);
        }
    },
    'DOM子要素全取得': {
        type: 'func',
        josi: [['の'], ['を']],
        pure: true,
        fn: function (pa, q) {
            if (typeof pa === 'string') {
                pa = document.querySelector(pa);
            }
            if (!pa.querySelectorAll) {
                throw new Error('『DOM子要素取得』で親要素がDOMではありません。');
            }
            return pa.querySelectorAll(q);
        }
    },
    'DOMイベント設定': {
        type: 'func',
        josi: [['の'], ['に', 'へ'], ['を']],
        pure: false,
        fn: function (dom, event, funcStr, sys) {
            if (typeof (dom) === 'string') {
                dom = document.querySelector(dom);
            }
            dom[event] = sys.__findVar(funcStr, null);
        },
        return_none: true
    },
    'DOMテキスト設定': {
        type: 'func',
        josi: [['に', 'の', 'へ'], ['を']],
        pure: true,
        fn: function (dom, text) {
            if (typeof (dom) === 'string') {
                dom = document.querySelector(dom);
            }
            const tag = dom.tagName.toUpperCase();
            if (tag === 'INPUT' || tag === 'TEXTAREA') {
                dom.value = text;
            }
            else if (tag === 'SELECT') {
                for (let i = 0; i < dom.options.length; i++) {
                    const v = dom.options[i].value;
                    if (String(v) === text) {
                        dom.selectedIndex = i;
                        break;
                    }
                }
            }
            else {
                dom.innerHTML = text;
            }
        },
        return_none: true
    },
    'DOMテキスト取得': {
        type: 'func',
        josi: [['の', 'から']],
        pure: true,
        fn: function (dom) {
            if (typeof (dom) === 'string') {
                dom = document.querySelector(dom);
            }
            if (!dom.tagName) {
                console.log('[DOMテキスト取得]でタグ名が取得できません。', dom);
                return '';
            }
            const tag = dom.tagName.toUpperCase();
            // input or textarea
            if (tag === 'INPUT' || tag === 'TEXTAREA') {
                return dom.value;
            }
            // select
            if (tag === 'SELECT') {
                const idx = dom.selectedIndex;
                if (idx < 0) {
                    return null;
                }
                return dom.options[idx].value;
            }
            return dom.innerHTML;
        }
    },
    'DOM_HTML設定': {
        type: 'func',
        josi: [['に', 'の', 'へ'], ['を']],
        pure: true,
        fn: function (dom, text) {
            if (typeof (dom) === 'string') {
                dom = document.querySelector(dom);
            }
            dom.innerHTML = text;
        },
        return_none: true
    },
    'DOM_HTML取得': {
        type: 'func',
        josi: [['の', 'から']],
        pure: true,
        fn: function (dom) {
            if (typeof (dom) === 'string') {
                dom = document.querySelector(dom);
            }
            return dom.innerHTML;
        }
    },
    'テキスト設定': {
        type: 'func',
        josi: [['に', 'の', 'へ'], ['を']],
        pure: false,
        fn: function (dom, v, sys) {
            return sys.__exec('DOMテキスト設定', [dom, v, sys]);
        }
    },
    'テキスト取得': {
        type: 'func',
        josi: [['の', 'から']],
        pure: false,
        fn: function (dom, sys) {
            return sys.__exec('DOMテキスト取得', [dom, sys]);
        }
    },
    'HTML設定': {
        type: 'func',
        josi: [['に', 'の', 'へ'], ['を']],
        pure: false,
        fn: function (dom, v, sys) {
            return sys.__exec('DOM_HTML設定', [dom, v, sys]);
        }
    },
    'HTML取得': {
        type: 'func',
        josi: [['の', 'から']],
        pure: false,
        fn: function (dom, sys) {
            return sys.__exec('DOM_HTML取得', [dom, sys]);
        }
    },
    'DOM属性設定': {
        type: 'func',
        josi: [['の'], ['に', 'へ'], ['を']],
        uses: ['DOM和属性'],
        pure: true,
        fn: function (dom, s, v, sys) {
            if (typeof (dom) === 'string') {
                dom = document.querySelector(dom);
            }
            const wa = sys.__v0['DOM和属性'];
            if (wa[s]) {
                s = wa[s];
            }
            if (s === 'disabled') {
                dom[s] = v;
            }
            else {
                dom.setAttribute(s, v);
            }
        },
        return_none: true
    },
    'DOM属性取得': {
        type: 'func',
        josi: [['の', 'から'], ['を']],
        uses: ['DOM和属性'],
        pure: true,
        fn: function (dom, s, sys) {
            if (typeof (dom) === 'string') {
                dom = document.querySelector(dom);
            }
            const wa = sys.__v0['DOM和属性'];
            if (wa[s]) {
                s = wa[s];
            }
            if (s === 'disabled') {
                return dom[s];
            }
            else {
                return dom.getAttribute(s);
            }
        }
    },
    'DOM和属性': {
        type: 'const',
        value: {
            '幅': 'width',
            '高さ': 'height',
            '高': 'height',
            'タイプ': 'type',
            'データ': 'data',
            '名前': 'name',
            'ID': 'id',
            '読取専用': 'readOnly',
            '読み取り専用': 'readOnly',
            '無効化': 'disabled'
        }
    },
    'DOM和スタイル': {
        type: 'const',
        value: {
            '幅': 'width',
            '高さ': 'height',
            '高': 'height',
            '背景色': 'background-color',
            '色': 'color',
            'マージン': 'margin',
            '余白': 'padding',
            '文字サイズ': 'font-size',
            '行揃え': 'text-align',
            '左': 'left',
            '右': 'right',
            '中央': 'center',
            'ボーダー': 'border',
            'ボックス表示': 'display',
            'なし': 'none',
            'ブロック': 'block',
            '表示位置': 'float',
            '重なり': 'z-index',
            '読取専用': 'readOnly',
            '読み取り専用': 'readOnly',
            'readonly': 'readOnly'
        }
    },
    'DOMスタイル設定': {
        type: 'func',
        josi: [['の'], ['に', 'へ'], ['を']],
        uses: ['DOM和スタイル'],
        pure: true,
        fn: function (dom, s, v, sys) {
            if (typeof (dom) === 'string') {
                dom = document.querySelector(dom);
            }
            const wa = sys.__v0['DOM和スタイル'];
            if (wa[s] !== undefined) {
                s = wa[s];
            }
            if (wa[v] !== undefined) {
                v = wa[v];
            }
            dom.style[s] = v;
        },
        return_none: true
    },
    'DOMスタイル一括設定': {
        type: 'func',
        josi: [['に', 'へ'], ['を']],
        uses: ['DOM和スタイル'],
        pure: true,
        fn: function (dom, values, sys) {
            if (typeof dom === 'string') {
                dom = document.querySelectorAll(dom);
            }
            if (!dom) {
                return;
            }
            if (dom instanceof window.HTMLElement) {
                dom = [dom];
            }
            const wa = sys.__v0['DOM和スタイル'];
            // 列挙したDOM一覧を全てスタイル変更する
            for (let i = 0; i < dom.length; i++) {
                const e = dom[i];
                for (const key in values) {
                    let s = key;
                    let v = values[key];
                    if (wa[s] !== undefined) {
                        s = wa[s];
                    }
                    if (wa[v] !== undefined) {
                        v = wa[v];
                    }
                    e.style[s] = v;
                }
            }
        },
        return_none: true
    },
    'DOMスタイル取得': {
        type: 'func',
        josi: [['の'], ['を']],
        uses: ['DOM和スタイル'],
        pure: true,
        fn: function (dom, style, sys) {
            if (typeof (dom) === 'string') {
                dom = document.querySelector(dom);
            }
            if (!dom) {
                return '';
            }
            const wa = sys.__v0['DOM和スタイル'];
            if (wa[style]) {
                style = wa[style];
            }
            return dom.style[style];
        }
    },
    'DOMスタイル一括取得': {
        type: 'func',
        josi: [['の'], ['を']],
        uses: ['DOM和スタイル'],
        pure: true,
        fn: function (dom, style, sys) {
            const res = {};
            if (typeof (dom) === 'string') {
                dom = document.querySelector(dom);
            }
            if (!dom) {
                return res;
            }
            if (style instanceof String) {
                style = [style];
            }
            const wa = sys.__v0['DOM和スタイル'];
            if (style instanceof Array) {
                style.forEach((key) => {
                    if (wa[key]) {
                        key = wa[key];
                    }
                    res[key] = dom.style[key];
                });
                return res;
            }
            if (style instanceof Object) {
                for (let key in style) {
                    if (wa[key]) {
                        key = wa[key];
                    }
                    res[key] = dom.style[key];
                }
                return res;
            }
            return dom.style[style];
        }
    },
    'DOM要素作成': {
        type: 'func',
        josi: [['の', 'を']],
        pure: true,
        fn: function (tag) {
            return document.createElement(tag);
        }
    },
    'DOM子要素追加': {
        type: 'func',
        josi: [['に', 'へ'], ['を']],
        pure: true,
        fn: function (pa, el) {
            if (typeof el === 'string') {
                el = document.querySelector(el);
            }
            if (typeof pa === 'string') {
                pa = document.querySelector(pa);
            }
            pa.appendChild(el);
        }
    },
    'DOM子要素削除': {
        type: 'func',
        josi: [['から'], ['を']],
        pure: true,
        fn: function (pa, el) {
            if (typeof el === 'string') {
                el = document.querySelector(el);
            }
            if (typeof pa === 'string') {
                pa = document.querySelector(pa);
            }
            pa.removeChild(el);
        }
    },
    '注目': {
        type: 'func',
        josi: [['を', 'へ', 'に']],
        pure: true,
        fn: function (el) {
            if (typeof el === 'string') {
                el = document.querySelector(el);
            }
            if (el.focus) {
                el.focus();
            }
        },
        return_none: true
    }
};
