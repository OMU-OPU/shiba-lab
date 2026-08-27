#!/usr/bin/env python3
"""サイトの内容を WordPress の取り込み形式（WXR）へ書き出す。

  python export_wxr.py            件数を確認するだけ（ファイルを作らない）
  python export_wxr.py --write    shiba-lab.wxr.xml を作る

作られたファイルは WordPress の「ツール」→「インポート」→「WordPress」で
そのまま読み込める。お知らせ461件は投稿として、固定ページ27件は固定ページとして入る。

画像は公開サイトの絶対URLに書き換えてあるので、取り込み時に
「添付ファイルをダウンロードしてインポートする」を選べば WordPress 側へ複製される。
"""
import os, re, sys, html, datetime, glob, posixpath
from urllib.parse import quote

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
WRITE = '--write' in sys.argv
SITE = 'https://omu-opu.github.io/shiba-lab'
OUT = 'shiba-lab.wxr.xml'

# 手で編集する27ページ。お知らせ記事はここには含めない。
PAGES = [
    ('index.html', 'トップページ'),
    ('intro/index.html', '柴原研究室とは？'),
    ('intro/member/index.html', 'メンバー'),
    ('intro/theme/index.html', '修論・卒論テーマ'),
    ('intro/success/index.html', '学生の受賞実績・特許'),
    ('intro/paper/index.html', '論文ギャラリー'),
    ('intro/poster/index.html', 'ポスターギャラリー'),
    ('intro/folder/index.html', '学生全員の発表実績'),
    ('intro/facility/index.html', '実験設備'),
    ('intro/movie/index.html', '研究動画'),
    ('professor/index.html', '柴原教授の研究業績'),
    ('professor/patent/index.html', '論文'),
    ('professor/detail/index.html', '共同研究'),
    ('professor/fem/index.html', '理想化陽解法FEM'),
    ('shibahara/movie_new/index.html', '研究動画：溶接高温割れ'),
    ('shibahara/movie_new/index_2.html', '研究動画：機械学習関連'),
    ('shibahara/movie_new/index_3.html', '研究動画：デジタルツイン'),
    ('shibahara/movie_new/index_4.html', '研究動画：修正熱収縮'),
    ('shibahara/movie_new/index_5.html', '研究動画：線状加熱'),
    ('shibahara/movie_new/index_6.html', '研究動画：FSW・SPOT溶接'),
    ('shibahara/movie_new/index_7.html', '研究動画：残留応力低減'),
    ('shibahara/movie_new/index_8.html', '研究動画：理想化陽解法'),
    ('summary.html', 'Technology Summary'),
    ('ob_list.html', 'OB・OG一覧'),
    ('photo/index.html', '写真館'),
    ('sitemap/index.html', 'サイトマップ'),
    ('info/events/index.html', 'EVENTS'),
]

BAD_XML = re.compile(r'[\x00-\x08\x0b\x0c\x0e-\x1f]')

def cdata(s):
    """CDATA へ入れる。閉じ記号が含まれていても壊れないように分割する。"""
    return '<![CDATA[' + BAD_XML.sub('', s).replace(']]>', ']]]]><![CDATA[>') + ']]>'

def div_block(doc, cls):
    """class 名で <div> を探し、入れ子の深さを数えて中身だけ返す。"""
    m = re.search(r'<div class="' + re.escape(cls) + r'"[^>]*>', doc)
    if not m:
        return None
    i, depth = m.end(), 1
    while depth > 0 and i < len(doc):
        o, c = doc.find('<div', i), doc.find('</div>', i)
        if c < 0:
            return None
        if 0 <= o < c:
            depth += 1; i = o + 4
        else:
            depth -= 1
            if depth == 0:
                return doc[m.end():c]
            i = c + 6
    return None

def absolutize(body, base_dir):
    """本文中の相対パスを公開サイトの絶対URLへ直す（WordPress が画像を取り込めるように）。"""
    def fix(m):
        attr, url = m.group(1), m.group(2)
        if re.match(r'^(?:https?:|//|#|data:|mailto:|tel:)', url) or not url:
            return m.group(0)
        if url.startswith('/'):
            target = url.lstrip('/')
        else:
            target = posixpath.normpath(posixpath.join(base_dir, url)) if base_dir else url
            if target.startswith('..'):
                return m.group(0)
        return f'{attr}="{SITE}/' + quote(target, safe='/%~') + '"'
    return re.sub(r'\b(href|src)="([^"]*)"', fix, body)

def text_of(h):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', h)).strip()

def article(path):
    d = open(path, encoding='utf-8', errors='replace').read()
    info = div_block(d, 'news-detail__info') or ''
    main = re.search(r'<main\b.*?</main>', d, re.S)
    if main is None:
        return None
    # 記事の作られた時期によって入れ物が違うので、外側へ順に下がる。
    # 最後の手段では editor__main から日付・分類の帯を取り除いて本文とする。
    body = div_block(d, 'news-detail__cont')
    if body is None:
        body = div_block(d, 'news-detail')
    if body is None:
        body = div_block(d, 'editor__main')
        if body is not None and info:
            body = body.replace(info, '', 1)
    if body is None:
        return None
    dm = re.search(r'(\d{4})年(\d{1,2})月(\d{1,2})日', info or main.group(0))
    h2 = re.search(r'<h2[^>]*>(.*?)</h2>', main.group(0), re.S)
    if not (dm and h2):
        return None
    return {
        'id': os.path.basename(path)[len('entry-'):-len('.html')],
        'title': text_of(h2.group(1)),
        'date': datetime.datetime(int(dm.group(1)), int(dm.group(2)), int(dm.group(3)), 9, 0, 0),
        'cats': re.findall(r'<li class="ptag__item">([^<]*)</li>', main.group(0)),
        'body': absolutize(body, 'info/news'),
        'type': 'post',
        'slug': 'entry-' + os.path.basename(path)[len('entry-'):-len('.html')],
    }

def page(path, title):
    d = open(path, encoding='utf-8', errors='replace').read()
    m = re.search(r'<main\b[^>]*>(.*)</main>', d, re.S)
    if not m:
        return None
    body = m.group(1)
    # ぱんくずリストと横スクロール用の枠は本文ではないので落とす
    for cls in ('pblock-kuzu', 'sidescroll'):
        b = div_block(body, cls)
        if b is not None:
            body = body.replace(b, '', 1)
    return {
        'id': path,
        'title': title,
        'date': datetime.datetime(2026, 8, 26, 9, 0, 0),
        'cats': [],
        'body': absolutize(body, posixpath.dirname(path)),
        'type': 'page',
        'slug': re.sub(r'[^a-z0-9]+', '-', path.replace('.html', '').replace('/', '-').lower()).strip('-'),
    }

# ---------- 収集 ----------
items = []
for p in sorted(glob.glob('info/news/entry-*.html')):
    a = article(p)
    if a:
        items.append(a)
n_posts = len(items)
for p, t in PAGES:
    if os.path.exists(p):
        g = page(p, t)
        if g:
            items.append(g)
n_pages = len(items) - n_posts
items.sort(key=lambda x: x['date'])

cats = sorted({c for it in items for c in it['cats']})
print(f'お知らせ（投稿）: {n_posts} 件')
print(f'固定ページ      : {n_pages} 件')
print(f'分類            : {len(cats)} 種  {cats}')
print(f'本文の総量      : {sum(len(i["body"]) for i in items)/1024:.0f} KB')
if not WRITE:
    print('\n確認のみ（--write を付けると ' + OUT + ' を作ります）')
    raise SystemExit

def cat_slug(name):
    return 'cat-' + str(abs(hash(name)) % 100000)

out = []
out.append('<?xml version="1.0" encoding="UTF-8" ?>')
out.append('<rss version="2.0"'
           ' xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"'
           ' xmlns:content="http://purl.org/rss/1.0/modules/content/"'
           ' xmlns:wfw="http://wellformedweb.org/CommentAPI/"'
           ' xmlns:dc="http://purl.org/dc/elements/1.1/"'
           ' xmlns:wp="http://wordpress.org/export/1.2/">')
out.append('<channel>')
out.append('<title>工学部 柴原研究室</title>')
out.append(f'<link>{SITE}/</link>')
out.append('<description>大阪公立大学 工学部 柴原研究室</description>')
out.append(f'<pubDate>{datetime.datetime.now().strftime("%a, %d %b %Y %H:%M:%S +0900")}</pubDate>')
out.append('<language>ja</language>')
out.append('<wp:wxr_version>1.2</wp:wxr_version>')
out.append(f'<wp:base_site_url>{SITE}</wp:base_site_url>')
out.append(f'<wp:base_blog_url>{SITE}</wp:base_blog_url>')
out.append('<wp:author><wp:author_id>1</wp:author_id>'
           '<wp:author_login>' + cdata('shibahara') + '</wp:author_login>'
           '<wp:author_email>' + cdata('') + '</wp:author_email>'
           '<wp:author_display_name>' + cdata('柴原研究室') + '</wp:author_display_name>'
           '<wp:author_first_name>' + cdata('') + '</wp:author_first_name>'
           '<wp:author_last_name>' + cdata('') + '</wp:author_last_name></wp:author>')
for c in cats:
    out.append('<wp:category><wp:term_id>0</wp:term_id>'
               '<wp:category_nicename>' + cdata(cat_slug(c)) + '</wp:category_nicename>'
               '<wp:category_parent>' + cdata('') + '</wp:category_parent>'
               '<wp:cat_name>' + cdata(c) + '</wp:cat_name></wp:category>')

for n, it in enumerate(items, start=1):
    d = it['date']
    out.append('<item>')
    out.append('<title>' + html.escape(it['title']) + '</title>')
    out.append(f'<link>{SITE}/</link>')
    out.append('<pubDate>' + d.strftime('%a, %d %b %Y %H:%M:%S +0900') + '</pubDate>')
    out.append('<dc:creator>' + cdata('shibahara') + '</dc:creator>')
    out.append(f'<guid isPermaLink="false">{SITE}/?p={n}</guid>')
    out.append('<description></description>')
    out.append('<content:encoded>' + cdata(it['body']) + '</content:encoded>')
    out.append('<excerpt:encoded>' + cdata('') + '</excerpt:encoded>')
    out.append(f'<wp:post_id>{n}</wp:post_id>')
    out.append('<wp:post_date>' + cdata(d.strftime('%Y-%m-%d %H:%M:%S')) + '</wp:post_date>')
    out.append('<wp:post_date_gmt>' + cdata((d - datetime.timedelta(hours=9)).strftime('%Y-%m-%d %H:%M:%S')) + '</wp:post_date_gmt>')
    out.append('<wp:comment_status>' + cdata('closed') + '</wp:comment_status>')
    out.append('<wp:ping_status>' + cdata('closed') + '</wp:ping_status>')
    out.append('<wp:post_name>' + cdata(it['slug']) + '</wp:post_name>')
    out.append('<wp:status>' + cdata('publish') + '</wp:status>')
    out.append('<wp:post_parent>0</wp:post_parent>')
    out.append('<wp:menu_order>0</wp:menu_order>')
    out.append('<wp:post_type>' + cdata(it['type']) + '</wp:post_type>')
    out.append('<wp:post_password>' + cdata('') + '</wp:post_password>')
    out.append('<wp:is_sticky>0</wp:is_sticky>')
    for c in it['cats']:
        out.append(f'<category domain="category" nicename="{cat_slug(c)}">' + cdata(c) + '</category>')
    out.append('</item>')

out.append('</channel>')
out.append('</rss>')

open(OUT, 'w', encoding='utf-8', newline='\n').write('\n'.join(out))
print(f'\n書き出し: {OUT}  ({os.path.getsize(OUT)/1024/1024:.1f} MB / {len(items)} 件)')
