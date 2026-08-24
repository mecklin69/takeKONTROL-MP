#!/usr/bin/env python3
"""
Move the threatDataDE / threatDataEN datasets out of index.html into
public/assets/js/data/threats.js. Copied verbatim; nothing is retyped.
"""
import pathlib
import re

SRC = pathlib.Path('/mnt/user-data/uploads/index.html')
OUT = pathlib.Path('/home/claude/tk/public/assets/js/data/threats.js')
OUT.parent.mkdir(parents=True, exist_ok=True)


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
    raise ValueError('unbalanced literal for ' + assignment)


def dedent(block):
    return re.sub(r'^ {8}', '', block, flags=re.M)


text = SRC.read_text(encoding='utf-8').replace('\r\n', '\n')
de = dedent(extract(text, 'const threatDataDE'))
en = dedent(extract(text, 'const threatDataEN'))

# Image paths move with the rest of the media into assets/img/, and the
# page module prefixes them, so only the bare filename belongs here.
header = '''/**
 * takeKONTROL — European disaster scenarios
 * =================================================================
 * The 25-scenario dataset behind the threat browser on the home page,
 * lifted verbatim out of the inline <script> in index.html. Roughly
 * 130 lines of data had been sitting in the middle of the page's
 * behaviour code; editing a scenario meant editing the page.
 *
 * `image` is a bare filename; the page module prefixes assets/img/.
 * =================================================================
 */

export const THREATS = {
  de: '''

body = header + de + ',\n\n  en: ' + en + '\n};\n'
# indent the two object literals one level so they read as members
OUT.write_text(body, encoding='utf-8')
print(f'wrote {OUT} ({len(body.splitlines())} lines)')
