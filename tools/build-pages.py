#!/usr/bin/env python3
"""
Rewrite the seven original pages into public/.

What changes in the markup:
  * every inline <style> block becomes <link> tags (tokens, base, chrome,
    the page's own sheet, and ticker.css where the page uses it)
  * every inline <script> that has been ported to a module is removed,
    and one <script type="module"> entry point is added
  * media paths gain the assets/img/ prefix
  * a tiny inline theme snippet lands in <head> so a dark-mode visitor
    never sees a white flash before the module loads
  * the five pages that had Google Translate get <body data-google-translate>

What does NOT change: the body markup, class names, ids, data-localize
keys and inline onclick attributes are left exactly as they were. Every
handler the markup calls is republished on window by its page module.

The script asserts on anything it does not recognise instead of quietly
producing a broken page.
"""
import pathlib
import re
import sys

SRC = pathlib.Path('/mnt/user-data/uploads')
OUT = pathlib.Path('/home/claude/tk/public')

PAGES = {
    # html file:        (page css,      entry module, google translate, ticker)
    'index.html':                 ('home.css',     'home.js',     True,  True),
    'takekontrol-revamp.html':    ('shop.css',     'shop.js',     False, True),
    'cart.html':                  ('cart.css',     'cart.js',     True,  False),
    'checkout.html':              ('checkout.css', 'checkout.js', False, False),
    'login.html':                 ('login.css',    'login.js',    True,  False),
    'enquiry.html':               ('enquiry.css',  'enquiry.js',  True,  False),
    'produktsicherheit.html':     ('legal.css',    'legal.js',    True,  False),
}

# Scripts whose content moved into a module and must be removed.
DROP_SRC_SUBSTRINGS = (
    'translate.google.com',
    'cart.js', 'checkout.js', 'ticker.js', 'tk-protect.js',
    'login.js', 'enquiry.js', 'main.js',
    'sdk.amazonaws.com',
)

# Inline scripts to keep, matched on a substring of their body.
KEEP_INLINE = ('TK_API_BASE',)

MEDIA_SUFFIXES = ('.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.mp4', '.ico')

THEME_BOOT = """    <script>
      /* Applied before first paint so a dark-mode visitor never sees a
         white flash. The toggle itself lives in assets/js/core/theme.js. */
      try {
        var tkTheme = localStorage.getItem('tk_theme');
        if (tkTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
      } catch (e) { /* storage blocked; light theme it is */ }
    </script>
"""


def stylesheet_links(page_css, ticker):
    sheets = ['assets/css/tokens.css', 'assets/css/base.css', 'assets/css/chrome.css']
    if ticker:
        sheets.append('assets/css/ticker.css')
    sheets.append(f'assets/css/pages/{page_css}')
    return '\n'.join(f'    <link rel="stylesheet" href="{href}">' for href in sheets) + '\n'


# Old stylesheet links whose content now lives in the shared/page files.
STALE_LINKS = ('login.css', 'ticker.css')


def strip_stale_links(html):
    """
    login.html linked login.css and two pages linked ticker.css. Both
    files have moved under assets/css/, and the builder adds the new
    links itself, so the originals would 404.
    """
    for href in STALE_LINKS:
        pattern = re.compile(rf'[ \t]*<link[^>]+href="{re.escape(href)}"[^>]*>\s*', re.I)
        html = pattern.sub('', html)
    return html


def strip_blocks(html, tag):
    pattern = re.compile(rf'[ \t]*<{tag}\b[^>]*>.*?</{tag}>\s*', re.S | re.I)
    return pattern.sub('', html), len(pattern.findall(html))


def strip_scripts(html):
    """Remove ported scripts, keep the handful that must stay inline."""
    pattern = re.compile(r'[ \t]*<script\b([^>]*)>(.*?)</script>\s*', re.S | re.I)
    removed = []

    def replace(match):
        attrs, body = match.group(1), match.group(2)
        src = re.search(r'src\s*=\s*"([^"]*)"', attrs)
        if src:
            if any(token in src.group(1) for token in DROP_SRC_SUBSTRINGS):
                removed.append(src.group(1))
                return ''
            return match.group(0)          # a CDN we still want (font-awesome etc.)
        if any(token in body for token in KEEP_INLINE):
            return match.group(0)
        removed.append('(inline)')
        return ''

    return pattern.sub(replace, html), removed


def rewrite_media(html):
    """Prefix bare media filenames with assets/img/."""
    def replace(match):
        attr, quote, value = match.group(1), match.group(2), match.group(3)
        if not value.lower().endswith(MEDIA_SUFFIXES):
            return match.group(0)
        if value.startswith(('http://', 'https://', 'data:', '//', 'assets/', '/')):
            return match.group(0)
        return f'{attr}={quote}assets/img/{value}{quote}'

    return re.sub(r'\b(src|href|poster)=(["\'])([^"\']+)\2', replace, html)


def process(name, page_css, entry, translate, ticker):
    html = (SRC / name).read_text(encoding='utf-8').replace('\r\n', '\n')

    html = strip_stale_links(html)
    html, style_count = strip_blocks(html, 'style')
    assert style_count >= 1, f'{name}: expected an inline <style> block'

    html, removed = strip_scripts(html)
    assert removed, f'{name}: expected to remove at least one script'

    # Stylesheets go in just before </head>, after any CDN <link>s.
    assert '</head>' in html, f'{name}: no </head>'
    html = html.replace('</head>', THEME_BOOT + stylesheet_links(page_css, ticker) + '</head>', 1)

    if translate:
        match = re.search(r'<body\b([^>]*)>', html)
        assert match, f'{name}: no <body>'
        if 'data-google-translate' not in match.group(1):
            html = html.replace(match.group(0),
                                f'<body{match.group(1)} data-google-translate>', 1)

    assert '</body>' in html, f'{name}: no </body>'
    html = html.replace(
        '</body>',
        f'    <script type="module" src="assets/js/pages/{entry}"></script>\n</body>', 1)

    html = rewrite_media(html)

    # Collapse the runs of blank lines the removals left behind.
    html = re.sub(r'\n{3,}', '\n\n', html)

    (OUT / name).write_text(html, encoding='utf-8')
    return len(removed)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (page_css, entry, translate, ticker) in PAGES.items():
        try:
            count = process(name, page_css, entry, translate, ticker)
        except AssertionError as exc:
            print(f'FAILED {exc}', file=sys.stderr)
            sys.exit(1)
        print(f'{name}: {count} script blocks removed → assets/js/pages/{entry}')


if __name__ == '__main__':
    main()
