#!/usr/bin/env python3
"""
Pull each page's inline translation dictionary out of the original HTML
and write it as an ES module under public/assets/js/i18n/.

The dictionary bodies are copied verbatim — this script must never
retype a translation, only relocate one.
"""
import re
import pathlib
import sys

SRC = pathlib.Path('/mnt/user-data/uploads')
OUT = pathlib.Path('/home/claude/tk/public/assets/js/i18n')
OUT.mkdir(parents=True, exist_ok=True)

# (source html, JS identifier the object was assigned to, output module)
JOBS = [
    ('index.html', 'const dictionary', 'home.js'),
    ('cart.html', 'const dictionary', 'cart.js'),
    ('enquiry.html', 'window.dictionary', 'enquiry.js'),
    ('checkout.html', 'const ckDict', 'checkout.js'),
    ('produktsicherheit.html', 'const dictionary', 'legal.js'),
    ('takekontrol-revamp.html', 'const translations', 'shop.js'),
]

HEADER = """/**
 * takeKONTROL — {page} translations
 * Lifted verbatim from the inline <script> that used to live in
 * {src}. Keys are shared with the markup through
 * data-i18n / data-localize attributes.
 */

export const dictionary = """


def extract(text, assignment):
    start = text.index(assignment)
    brace = text.index('{', start)
    depth = 0
    in_string = None
    escaped = False
    for i in range(brace, len(text)):
        ch = text[i]
        if in_string:
            if escaped:
                escaped = False
            elif ch == '\\':
                escaped = True
            elif ch == in_string:
                in_string = None
            continue
        if ch in '"\'`':
            in_string = ch
            continue
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                return text[brace:i + 1]
    raise ValueError('unbalanced object literal for ' + assignment)


def main():
    failures = []
    for src, assignment, out_name in JOBS:
        text = (SRC / src).read_text(encoding='utf-8').replace('\r\n', '\n')
        try:
            body = extract(text, assignment)
        except ValueError as exc:
            failures.append(f'{src}: {exc}')
            continue

        body = re.sub(r'^ {8}', '', body, flags=re.M)
        module = HEADER.format(page=out_name[:-3], src=src) + body + ';\n'
        (OUT / out_name).write_text(module, encoding='utf-8')
        print(f'{src} -> i18n/{out_name}  ({len(body.splitlines())} lines)')

    if failures:
        print('\n'.join(failures), file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
