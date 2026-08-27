#!/usr/bin/env python3
"""入力画面（CMS）で書かれたお知らせを、サイトの記事ページに変換する。

  python build_post.py            変換内容を確認するだけ（書き込まない）
  python build_post.py --apply    実際に書き込む

content/news/ に置かれたファイルを読み、info/news/entry-*.html を作る。
そのあと build_news.py が一覧へ反映するので、Push すれば公開される。

入力ファイルの形（CMS が自動で作る）:

    ---
    title: お知らせのタイトル
    date: 2026-08-27
    tags: 受賞
    thumbnail: assets/uploads/photo.jpg
    ---
    <p>本文</p>

thumbnail はリポジトリのルートからの位置で書く。記事は info/news/ にできるので、
生成時に ../../ を補って参照させる。
"""
import os, re, sys, glob, html

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
APPLY = '--apply' in sys.argv
SRC_DIR = 'content/news'
OUT_DIR = 'info/news'
UP = '../../'          # info/news/ からリポジトリのルートへ戻る分

FRAME = open('_frame/frame.html', encoding='utf-8').read()
POST = open('_frame/post.html', encoding='utf-8').read()
SITE_SUFFIX = '｜工学部 柴原研究室｜大阪公立大学'


def front_matter(text):
    """先頭の --- で挟まれた部分を項目として読む。本文はその後ろ全部。

    値は「文字列」としてだけ扱う。入れ子や複雑な書き方は使わないので、
    外部の解析器を持ち込まずに済ませている。
    """
    m = re.match(r'^\s*---\s*\n(.*?)\n---\s*\n?(.*)$', text, re.S)
    if not m:
        return None, None
    meta = {}
    for line in m.group(1).split('\n'):
        if not line.strip() or line.lstrip().startswith('#'):
            continue
        if ':' not in line:
            continue
        k, v = line.split(':', 1)
        v = v.strip()
        if len(v) >= 2 and v[0] == v[-1] and v[0] in '"\'':
            v = v[1:-1]
        meta[k.strip()] = v
    return meta, m.group(2)


def jp_date(iso):
    """2026-08-27 → 2026年8月27日。一覧の並び替えもこの表記から読んでいる。"""
    m = re.match(r'^(\d{4})-(\d{1,2})-(\d{1,2})', iso.strip())
    if not m:
        return None
    return f'{int(m.group(1))}年{int(m.group(2))}月{int(m.group(3))}日'


def build(path):
    meta, body = front_matter(open(path, encoding='utf-8').read())
    if meta is None:
        return None, f'{path}: 先頭の --- が見つからない'
    title = meta.get('title', '').strip()
    date = jp_date(meta.get('date', ''))
    if not title:
        return None, f'{path}: title が空'
    if not date:
        return None, f'{path}: date が YYYY-MM-DD ではない'
    if not body.strip():
        return None, f'{path}: 本文が空'

    slug = os.path.splitext(os.path.basename(path))[0]
    tags = [t.strip() for t in re.split(r'[,、]', meta.get('tags', '')) if t.strip()]
    thumb = meta.get('thumbnail', '').strip().lstrip('/')
    thumb_rel = UP + thumb if thumb else UP + 'assets/img_news-def@2x.jpg'

    main = POST
    main = main.replace('{{DATE}}', html.escape(date))
    main = main.replace('{{TAGS}}', '\n'.join(
        f'<li class="ptag__item">{html.escape(t)}</li>' for t in tags))
    main = main.replace('{{TITLE}}', html.escape(title))
    main = main.replace('{{BODY}}', body.strip())

    page = FRAME
    page = page.replace('{{MAIN}}', main)
    page = page.replace('{{ROBOTS}}', '')
    page = page.replace('{{THUMBNAIL}}',
                        f'<meta name="thumbnail" content="{html.escape(thumb_rel)}">\n')
    page = page.replace('{{SITE_TAG}}', 'div')
    page = page.replace('{{TITLE}}', html.escape(title + SITE_SUFFIX))
    page = page.replace('{{OG_URL}}', f'entry-{slug}.html')
    page = page.replace('{{OG_TITLE}}', html.escape(title + SITE_SUFFIX))
    page = page.replace('{{OG_IMAGE}}', html.escape(thumb_rel))
    page = page.replace('{{OG_DESC}}', html.escape(title))
    page = page.replace('{{DESC}}', '柴原研究室の紹介')
    page = page.replace('{{BODY_ATTR}}', ' class="color__site nav-top news"')
    page = page.replace('{{ROOT}}', UP)
    return (f'{OUT_DIR}/entry-{slug}.html', page), None


srcs = sorted(glob.glob(f'{SRC_DIR}/*.md')) + sorted(glob.glob(f'{SRC_DIR}/*.markdown'))
if not srcs:
    print(f'{SRC_DIR}/ に記事はありません。')
    raise SystemExit

made = same = 0
errors = []
for s in srcs:
    result, err = build(s)
    if err:
        errors.append(err)
        continue
    dest, page = result
    cur = open(dest, encoding='utf-8').read() if os.path.exists(dest) else None
    if cur == page:
        same += 1
        print(f'  変更なし  {dest}')
        continue
    made += 1
    print(f'  {"作成" if cur is None else "更新"}  {dest}  ({len(page):,}バイト)')
    if APPLY:
        open(dest, 'w', encoding='utf-8', newline='').write(page)

print(f'\n{"APPLIED" if APPLY else "DRY-RUN（書き込みなし）"}  '
      f'対象{len(srcs)}件 / 生成{made} / 変更なし{same} / エラー{len(errors)}')
for e in errors:
    print('  !!', e)
if errors:
    raise SystemExit(1)
