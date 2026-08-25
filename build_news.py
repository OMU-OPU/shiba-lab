#!/usr/bin/env python3
"""お知らせ一覧を記事ファイルから生成する。

  python build_news.py            変更内容を確認するだけ（書き込まない）
  python build_news.py --apply    実際に書き込む

info/news/entry-*.html を読み、日付の新しい順に
  - info/news/index.html
  - index.html（トップページ）
の一覧を作り直す。記事を1つ置けば一覧に載るので、一覧を手で編集する必要はない。

記事側が持つべき情報:
  <meta name="thumbnail" content="../../assets/thumbnails/....jpg">   一覧のサムネイル
  <main> 内の  YYYY年M月D日                                          日付
  <main> 内の  <li class="ptag__item">受賞</li>                       分類
  <main> 内の  <h2>...</h2>                                           一覧に出る文言
"""
import os, re, sys, glob, html as _html

ROOT = os.path.dirname(os.path.abspath(__file__))
APPLY = '--apply' in sys.argv
os.chdir(ROOT)

def article_meta(path):
    d = open(path, encoding='utf-8', errors='replace').read()
    mn = re.search(r'<main\b.*?</main>', d, re.S)
    if not mn:
        return None
    m = mn.group(0)
    thumb = re.search(r'<meta name="thumbnail" content="([^"]*)"', d)
    date  = re.search(r'(\d{4})年(\d{1,2})月(\d{1,2})日', m)
    h2    = re.search(r'<h2[^>]*>(.*?)</h2>', m, re.S)
    if not (thumb and date and h2):
        return None
    return {
        'id':    os.path.basename(path)[len('entry-'):-len('.html')],
        'thumb': thumb.group(1),
        'date':  date.group(0),
        'sort':  (int(date.group(1)), int(date.group(2)), int(date.group(3))),
        'tags':  re.findall(r'<li class="ptag__item">([^<]*)</li>', m),
        'text':  re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', h2.group(1))).strip(),
    }

def item_html(a, href_prefix, thumb_prefix, indent):
    tags = '\n'.join(f'{indent}      <li class="ptag__item">{t}</li>' for t in a['tags'])
    thumb = thumb_prefix + a['thumb'][len('../../'):]
    return (
f'''{indent}<div class="col">
{indent}  <a class="home-events__link" href="{href_prefix}entry-{a['id']}.html">
{indent}    <figure class="home-events__fig">
{indent}      <img class="home-events__img ofi" src="{thumb}" alt="" width="280" height="210">
{indent}    </figure>
{indent}    <p class="home-events__date">{a['date']}</p>
{indent}    <ul class="home-events__tags ptag">
{tags}
{indent}    </ul>
{indent}    <p class="home-events__txt">{a['text']}</p>
{indent}  </a>
{indent}</div>''')

ROW = re.compile(r'<div class="row row-cols-1 row-cols-md-3 gutters-30 gutters-md-60 gutters-x20 mb-0 mb-md-n30">')
DO, DC = re.compile(r'<div\b'), re.compile(r'</div>')

def replace_row(doc, items_html):
    m = ROW.search(doc)
    if not m:
        return None
    i, depth = m.end(), 1
    while depth > 0:
        o, c = DO.search(doc, i), DC.search(doc, i)
        if not c:
            return None
        if o and o.start() < c.start():
            depth += 1; i = o.end()
        else:
            depth -= 1; i = c.start() if depth == 0 else c.end()
    return doc[:m.end()] + '\n' + items_html + '\n            ' + doc[i:]

arts = [a for a in (article_meta(p) for p in glob.glob('info/news/entry-*.html')) if a]
arts.sort(key=lambda a: (a['sort'], int(a['id'])), reverse=True)
print(f'記事 {len(arts)} 件を読み込み（{arts[0]["date"]} 〜 {arts[-1]["date"]}）')

# (ファイル, 記事へのリンク接頭辞, 画像への接頭辞, インデント)
# 画像は記事側では ../../assets/... で保持しているので、それを
# ルート相対 (assets/...) に直したうえで各ファイルの深さを足す。
targets = [
    ('info/news/index.html', '',            '../../', ' ' * 14),
    ('index.html',           'info/news/',  '',       ' ' * 14),
]
# 年度別ページ（4月始まり）。リンク先のファイル名は info/news/index.html の
# 年度タブから読み取るので、タブのリンクを書き換える必要はない。
_idx = open('info/news/index.html', encoding='utf-8').read()
for _f, _y in re.findall(r'href="(index[0-9a-f]*\.html)\?search_nendo=(\d{4})"', _idx):
    if os.path.exists('info/news/' + _f):
        targets.append(('info/news/' + _f, '', '../../', ' ' * 14, int(_y)))

def in_nendo(a, y):
    yy, mm, _ = a['sort']
    return (yy == y and mm >= 4) or (yy == y + 1 and mm <= 3)

for _t in targets:
    path, href_p, thumb_p, ind = _t[0], _t[1], _t[2], _t[3]
    nendo = _t[4] if len(_t) > 4 else None
    cur = open(path, encoding='utf-8').read()
    sel = [a for a in arts if nendo is None or in_nendo(a, nendo)]
    body = '\n'.join(item_html(a, href_p, thumb_p, ind) for a in sel)
    out = replace_row(cur, body)
    if out is None:
        print(f'  !! {path}: 一覧コンテナが見つからない'); continue
    before = len(set(re.findall(r'entry-(\d+)\.html', cur)))
    after  = len(set(re.findall(r'entry-(\d+)\.html', out)))
    tag = f'  [{nendo}年度]' if nendo is not None else ''
    print(f'  {path}: 掲載 {before} → {after} 件{tag}')
    if APPLY:
        open(path, 'w', encoding='utf-8', newline='').write(out)
print('APPLIED' if APPLY else 'DRY-RUN（書き込みなし）')
