#!/usr/bin/env python3
"""検索エンジン向けの sitemap.xml と robots.txt を作る。

  python build_sitemap.py            件数を確認するだけ（書き込まない）
  python build_sitemap.py --apply    実際に書き込む

ドメインを変えたときは SITE_URL の1行だけを書き換える。
GitHub に push すれば自動生成の中で実行される。
"""
import os, re, sys, collections
from urllib.parse import quote, urlsplit

SITE_URL = 'https://omu-opu.github.io/shiba-lab/'   # 末尾の / まで書く

ROOT = os.path.dirname(os.path.abspath(__file__))
SKIP_TOP = {'.git', 'hts-cache', '_pgbackup', '_pginfo', '_frame'}
APPLY = '--apply' in sys.argv
# HTTrack が同じページを別名で保存したもの（index-2.html、一覧の絞り込み結果など）
DUP = re.compile(r'(^|/)index-\d+\.html$|(^|/)index[0-9a-f]{4}(-\d+)?\.html$|list-news-tp')

def pages():
    for dp, dn, fn in os.walk(ROOT):
        dn[:] = [d for d in dn if not (dp == ROOT and d in SKIP_TOP) and d != '.git']
        rel = os.path.relpath(dp, ROOT).replace(os.sep, '/')
        rel = '' if rel == '.' else rel
        for f in fn:
            if f.lower().endswith(('.html', '.htm')):
                yield f'{rel}/{f}' if rel else f

def kind(rel):
    if DUP.search(rel): return '除外: 重複して保存されたページ'
    s = open(os.path.join(ROOT, rel.replace('/', os.sep)), 'rb').read().decode('utf-8', 'replace')
    if 'themes/small_site' not in s or '<main' not in s: return '除外: 研究室のページではない'
    if re.search(r'<meta name="robots" content="[^"]*noindex', s): return '除外: noindex 指定'
    return '掲載'

st = collections.Counter(); urls = []
for rel in sorted(pages(), key=lambda r: (r != 'index.html', r)):
    k = kind(rel); st[k] += 1
    if k == '掲載':
        urls.append(SITE_URL if rel == 'index.html' else SITE_URL + quote(rel))

sitemap = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
           + ''.join(f'  <url><loc>{u}</loc></url>\n' for u in urls)
           + '</urlset>\n')

# 検索エンジンはドメイン直下の robots.txt しか読まないので、github.io の
# プロジェクトサイトのうちは効かない。独自ドメインにすると有効になる。
base = urlsplit(SITE_URL).path
robots = ('User-agent: *\n'
          f'Disallow: {base}hts-cache/\n'
          f'Disallow: {base}hts-log.txt\n'
          f'Disallow: {base}_frame/\n'
          f'Disallow: {base}www.facebook.com/\n'
          '\n'
          f'Sitemap: {SITE_URL}sitemap.xml\n')

print('APPLIED' if APPLY else 'CHECK (書き込みなし)')
for k, v in st.most_common(): print(f'   {v:5}  {k}')
for name, text in [('sitemap.xml', sitemap), ('robots.txt', robots)]:
    fp = os.path.join(ROOT, name)
    old = open(fp, encoding='utf-8').read() if os.path.exists(fp) else None
    print(f'   {name}: {"変更なし" if old == text else "更新"}')
    if APPLY and old != text:
        open(fp, 'w', encoding='utf-8', newline='\n').write(text)
