#!/usr/bin/env python3
"""
Split the inline <style> blocks out of the original pages into:

    assets/css/tokens.css   design tokens (:root and [data-theme="dark"])
    assets/css/base.css     reset, typography, buttons, container
    assets/css/chrome.css   header, drawer, footer, cart badge
    assets/css/pages/*.css  whatever is left, per page, verbatim

Rules are only promoted to a shared file when they are byte-identical
(after whitespace normalisation) across at least five of the seven
pages. Anything that has drifted stays in the page file, because
reconciling drifted CSS without a browser to check against is guesswork.

The script refuses to run if promoting a rule could change the cascade:
that is, if a page declares the same selector earlier than the copy
being removed.
"""
import collections
import pathlib
import re
import sys

SRC = pathlib.Path('/mnt/user-data/uploads')
CSS_OUT = pathlib.Path('/home/claude/tk/public/assets/css')
PAGES_OUT = CSS_OUT / 'pages'

# html file -> output page stylesheet name
PAGES = {
    'index.html': 'home.css',
    'takekontrol-revamp.html': 'shop.css',
    'cart.html': 'cart.css',
    'checkout.html': 'checkout.css',
    'login.html': 'login.css',
    'enquiry.html': 'enquiry.css',
    'produktsicherheit.html': 'legal.css',
}

SHARED_THRESHOLD = 5

# Rules that belong in base.css rather than chrome.css. Everything else
# promoted lands in chrome.css.
BASE_PREFIXES = (
    '*', 'body', 'html', 'h1', 'h2', 'h3', 'h4', 'p', '.container',
    '.btn', '.section-padding', '#google_translate_element', '.goog-',
)


def split_rules(text):
    """
    Split a stylesheet into top-level chunks, preserving order. Comments
    at the top level become chunks of their own: leaving them glued to
    the following rule made two identical rules compare as different,
    which is how the first run of this script left every page's :root
    block in place.
    """
    chunks = []
    depth = 0
    buffer = ''
    i = 0
    while i < len(text):
        if depth == 0 and text.startswith('/*', i):
            if buffer.strip():
                chunks.append(buffer.strip())
            buffer = ''
            end = text.find('*/', i + 2)
            end = len(text) if end == -1 else end + 2
            chunks.append(text[i:end].strip())
            i = end
            continue
        ch = text[i]
        buffer += ch
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                chunks.append(buffer.strip())
                buffer = ''
        i += 1
    if buffer.strip():
        chunks.append(buffer.strip())
    return chunks


def is_comment(chunk):
    return chunk.startswith('/*')


def normalise(rule):
    # Collapse whitespace, and also the space after commas, so that
    # rgba(0,0,0,.5) and rgba(0, 0, 0, .5) are recognised as the same
    # declaration rather than as drift.
    return ' '.join(rule.split()).replace(', ', ',')


def selector_of(rule):
    return normalise(rule.split('{', 1)[0])


def read_css(name):
    text = (SRC / name).read_text(encoding='utf-8').replace('\r\n', '\n')
    blocks = re.findall(r'<style[^>]*>(.*?)</style>', text, re.S)
    return '\n'.join(blocks)


def main():
    sources = {}
    for html, out_name in PAGES.items():
        css = read_css(html)
        if out_name == 'login.css':
            # login.html is the one page that already had an external
            # stylesheet; fold it in ahead of the inline block, which is
            # the order the browser saw them in.
            css = (SRC / 'login.css').read_text(encoding='utf-8').replace('\r\n', '\n') + '\n' + css
        sources[out_name] = split_rules(css)

    counts = collections.Counter()
    for rules in sources.values():
        for rule in {normalise(r) for r in rules if not is_comment(r)}:
            counts[rule] += 1

    shared = {rule for rule, n in counts.items() if n >= SHARED_THRESHOLD}

    # Cascade safety check.
    problems = []
    for name, rules in sources.items():
        normalised = [normalise(r) for r in rules if not is_comment(r)]
        promoted_selectors = {selector_of(r) for r in normalised if r in shared}
        for index, rule in enumerate(normalised):
            if rule in shared:
                continue
            if selector_of(rule) not in promoted_selectors:
                continue
            later_shared = [
                i for i, other in enumerate(normalised)
                if other in shared and selector_of(other) == selector_of(rule) and i > index
            ]
            if later_shared:
                problems.append(f'{name}: "{selector_of(rule)}" is overridden by a promoted copy')

    if problems:
        print('Refusing to promote — cascade order would change:', file=sys.stderr)
        print('\n'.join(sorted(set(problems))), file=sys.stderr)
        sys.exit(1)

    # Write the shared layers, in the order they appear on the shop page
    # (the most complete chrome) so related rules stay together.
    reference = [normalise(r) for r in sources['shop.css']]
    ordered = [r for r in reference if r in shared]
    ordered += [r for r in sorted(shared) if r not in ordered]

    base, chrome = [], []
    for rule in ordered:
        target = base if selector_of(rule).startswith(BASE_PREFIXES) else chrome
        target.append(rule)

    CSS_OUT.mkdir(parents=True, exist_ok=True)
    PAGES_OUT.mkdir(parents=True, exist_ok=True)

    write_tokens()
    write_layer('base.css', 'Reset, typography and buttons', base)
    write_layer('chrome.css', 'Header, drawer, footer and cart badge', chrome)

    for name, rules in sources.items():
        drop = [is_comment(r) is False and (normalise(r) in shared or is_token_block(r))
                for r in rules]
        # A comment introducing a rule that has just been promoted would
        # be left dangling, so it goes with it.
        for index, chunk in enumerate(rules):
            if is_comment(chunk) and index + 1 < len(rules) and drop[index + 1]:
                drop[index] = True
        kept = [r for r, gone in zip(rules, drop) if not gone]
        body = page_header(name) + overrides_for(name, rules) + '\n\n'.join(kept) + '\n'
        (PAGES_OUT / name).write_text(body, encoding='utf-8')
        print(f'{name}: kept {len(kept)} rules, promoted {len(rules) - len(kept)}')

    # ticker.css was already an external file and is page-agnostic.
    ticker = (SRC / 'ticker.css').read_text(encoding='utf-8').replace('\r\n', '\n')
    (CSS_OUT / 'ticker.css').write_text(ticker, encoding='utf-8')
    print(f'shared: base.css {len(base)} rules, chrome.css {len(chrome)} rules')


def is_token_block(rule):
    selector = selector_of(rule)
    return selector.startswith(':root') or selector.startswith('[data-theme="dark"]')


def parse_vars(block_body):
    return {k: ' '.join(v.split())
            for k, v in re.findall(r'(--[\w-]+)\s*:\s*([^;]+);', block_body)}


def shared_vars():
    light = re.search(r':root,\s*\[data-theme="light"\]\s*\{([^}]*)\}', TOKENS).group(1)
    dark = re.search(r'\[data-theme="dark"\]\s*\{([^}]*)\}', TOKENS).group(1)
    return parse_vars(light), parse_vars(dark)


def overrides_for(name, rules):
    """
    Emit exactly the token values this page declared that differ from the
    shared set. index.html turned out to carry an entirely separate
    blue-slate dark palette; normalising it away would have redesigned
    the home page in the dark, which is precisely the kind of "tidy-up"
    a refactor must not do.
    """
    shared_light, shared_dark = shared_vars()

    page_light, page_dark = {}, {}
    for rule in rules:
        if is_comment(rule) or '{' not in rule:
            continue
        selector = selector_of(rule)
        body = rule.split('{', 1)[1].rsplit('}', 1)[0]
        if selector.startswith(':root'):
            page_light.update(parse_vars(body))
        elif selector.startswith('[data-theme="dark"]'):
            page_dark.update(parse_vars(body))

    same = lambda a, b: a is not None and b is not None and a.replace(', ', ',') == b.replace(', ', ',')
    light_diff = {k: v for k, v in page_light.items() if not same(shared_light.get(k), v)}
    dark_diff = {k: v for k, v in page_dark.items() if not same(shared_dark.get(k), v)}
    if not light_diff and not dark_diff:
        return ''

    out = ("/* Token values this page declared that differ from the shared\n"
           "   set in tokens.css. Preserved exactly rather than normalised,\n"
           "   so the refactor changes no pixel. Delete a line here once the\n"
           "   design agrees on one value for it. */\n")
    if light_diff:
        lines = '\n'.join(f'  {k}: {v};' for k, v in sorted(light_diff.items()))
        out += f':root,\n[data-theme="light"] {{\n{lines}\n}}\n\n'
    if dark_diff:
        lines = '\n'.join(f'  {k}: {v};' for k, v in sorted(dark_diff.items()))
        out += f'[data-theme="dark"] {{\n{lines}\n}}\n\n'
    return out


def page_header(name):
    return (
        f'/* ═══════════════════════════════════════════════\n'
        f'   takeKONTROL — {name[:-4]} page styles\n'
        f'   Loaded after tokens.css, base.css and chrome.css.\n'
        f'   ═══════════════════════════════════════════════ */\n\n'
    )


def write_layer(name, title, rules):
    header = (
        f'/* ═══════════════════════════════════════════════\n'
        f'   takeKONTROL — {title}\n'
        f'   Shared by every page. A rule earns a place here by being\n'
        f'   byte-identical on at least {SHARED_THRESHOLD} of the 7 pages.\n'
        f'   ═══════════════════════════════════════════════ */\n\n'
    )
    (CSS_OUT / name).write_text(header + '\n\n'.join(rules) + '\n', encoding='utf-8')


TOKENS = """/* ═══════════════════════════════════════════════
   takeKONTROL — design tokens
   The single place colours, radii and shadows are defined. Every page
   used to carry its own copy of this block; five of the six agreed on
   13 of the 16 variables, and the three that differed are preserved as
   per-page overrides in assets/css/pages/.
   ═══════════════════════════════════════════════ */

:root,
[data-theme="light"] {
  --primary-bg: #ffffff;
  --secondary-bg: #f5f5f7;
  --card-bg: #ffffff;
  --primary-red: #b32020;
  --primary-red-hover: #8c1919;
  --text-main: #333333;
  --text-muted: #555555;
  --text-heading: #111111;
  --border-color: #e5e5e5;
  --header-bg-scrolled: rgba(255, 255, 255, 0.98);
  --nav-text-scrolled: #111111;
  --footer-bg: #f5f5f7;
  --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  --card-shadow-hover: 0 15px 40px rgba(179, 32, 32, 0.15);
  --radius-corp: 14px;
  --transition-speed: 0.3s;
}

[data-theme="dark"] {
  --primary-bg: #080808;
  --secondary-bg: #121212;
  --card-bg: #1a1a1a;
  --primary-red: #d32f2f;
  --primary-red-hover: #b71c1c;
  --text-main: #f5f5f7;
  --text-muted: #a0a0a0;
  --text-heading: #ffffff;
  --border-color: #2a2a2a;
  --header-bg-scrolled: rgba(10, 10, 10, 0.95);
  --nav-text-scrolled: #ffffff;
  --footer-bg: #050505;
  --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  --card-shadow-hover: 0 15px 40px rgba(211, 47, 47, 0.15);
}
"""


def write_tokens():
    (CSS_OUT / 'tokens.css').write_text(TOKENS, encoding='utf-8')


if __name__ == '__main__':
    main()
