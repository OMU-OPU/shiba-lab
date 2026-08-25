#!/usr/bin/env python3
"""共通の枠 (_frame/frame.html) を全ページへ適用する。

  python build.py            変更内容を確認するだけ（書き込まない）
  python build.py --apply    実際に書き込む

各ページの <main>...</main> の中身とメタ情報はそのまま保持され、
枠の部分だけが _frame/frame.html から再生成される。
枠を直したいときは _frame/frame.html を編集して --apply で実行する。
"""
import os, re, sys, posixpath, collections

ROOT = os.path.dirname(os.path.abspath(__file__))
SKIP_TOP = {'.git', 'hts-cache', '_pgbackup', '_pginfo', '_frame'}
APPLY = '--apply' in sys.argv
TPL = open(os.path.join(ROOT, '_frame', 'frame.html'), encoding='utf-8').read()

def pages():
    for dp, dn, fn in os.walk(ROOT):
        dn[:] = [d for d in dn if not (dp == ROOT and d in SKIP_TOP) and d != '.git']
        rel = os.path.relpath(dp, ROOT).replace(os.sep, '/')
        rel = '' if rel == '.' else rel
        for f in fn:
            if f.lower().endswith(('.html', '.htm')):
                yield f'{rel}/{f}' if rel else f

def grab(rx, s, d=''):
    m = re.search(rx, s, re.S)
    return m.group(1) if m else d

def render(rel, cur):
    # 対象は研究室テーマ(small_site)のページのみ。大学テーマ(univ)で保存された
    # 「ページが見つかりません」や外部サイトの断片には枠を適用しない。
    if 'themes/small_site' not in cur:
        return None, None
    ms, me = re.search(r'<main\b', cur), re.search(r'</main>', cur)
    if not ms or not me:
        return None, None
    main = cur[ms.start():me.end()]
    depth = len(posixpath.dirname(rel).split('/')) if posixpath.dirname(rel) else 0
    robots = re.search(r'<meta name="robots"[^>]*>\s*', cur)
    thumb = re.search(r'<meta name="thumbnail"[^>]*>\s*', cur)
    body_tag = 'h1' if re.search(r'<h1 class="g-nav__medium_site">', cur) else 'div'
    out = TPL
    out = out.replace('{{MAIN}}', main)
    out = out.replace('{{ROBOTS}}', robots.group(0) if robots else '')
    out = out.replace('{{THUMBNAIL}}', thumb.group(0) if thumb else '')
    out = out.replace('{{SITE_TAG}}', body_tag)
    out = out.replace('{{TITLE}}',     grab(r'<title>(.*?)</title>', cur))
    out = out.replace('{{OG_URL}}',    grab(r'<meta property="og:url" content="([^"]*)">', cur))
    out = out.replace('{{OG_TITLE}}',  grab(r'<meta property="og:title" content="([^"]*)">', cur))
    out = out.replace('{{OG_IMAGE}}',  grab(r'<meta property="og:image" content="([^"]*)">', cur))
    out = out.replace('{{OG_DESC}}',   grab(r'<meta property="og:description" content="([^"]*)">', cur))
    out = out.replace('{{DESC}}',      grab(r'<meta name="description" content="([^"]*)">', cur))
    out = out.replace('{{BODY_ATTR}}', grab(r'<body([^>]*)>', cur))
    out = out.replace('{{ROOT}}', '../' * depth)
    return out, main

st = collections.Counter(); lost = []; delta = collections.Counter()
for rel in sorted(pages()):
    fp = os.path.join(ROOT, rel.replace('/', os.sep))
    cur = open(fp, 'rb').read().decode('utf-8', 'surrogateescape')
    out, main = render(rel, cur)
    if out is None:
        st['対象外(スキップ)'] += 1; continue
    # 不変条件: <main> の中身とメタ情報が保持されていること
    om = re.search(r'<main\b.*?</main>', out, re.S)
    ok = om and om.group(0) == main
    for rx in [r'<title>(.*?)</title>', r'<meta property="og:url" content="([^"]*)">',
               r'<meta property="og:image" content="([^"]*)">', r'<body([^>]*)>']:
        if grab(rx, cur) != grab(rx, out): ok = False
    if not ok:
        lost.append(rel); st['!! 内容が保持されない'] += 1; continue
    if out == cur: st['変更なし'] += 1
    else:
        st['枠を更新'] += 1; delta[len(out) - len(cur)] += 1
        if APPLY: open(fp, 'wb').write(out.encode('utf-8', 'surrogateescape'))

print('APPLIED' if APPLY else 'CHECK (書き込みなし)')
for k, v in st.most_common(): print(f'   {v:5}  {k}')
if delta:
    print('--- サイズ変化の内訳 ---')
    for d, c in sorted(delta.items())[:8]: print(f'   {c:5}ページ  {d:+,}バイト')
if lost:
    print(f'!! 内容保持に失敗: {len(lost)}件'); [print('   ', r) for r in lost[:5]]
