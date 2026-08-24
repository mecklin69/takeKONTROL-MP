#!/usr/bin/env node
/**
 * Walks every page in public/ and reports references that do not
 * resolve on disk: images, stylesheets, scripts and internal links.
 *
 * Run it after moving the media into public/assets/img/ — the media
 * files were not part of the codebase, so on a fresh checkout this will
 * list all of them, and that list is your migration checklist.
 *
 *   npm run check:links
 *
 * Exits non-zero when a stylesheet or script is missing, because that
 * breaks the page. Missing images and unwritten pages are reported but
 * tolerated.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');

const REFERENCE = /\b(?:src|href)=["']([^"']+)["']/g;
const CODE_SUFFIXES = ['.js', '.css'];

const pages = fs.readdirSync(PUBLIC).filter((f) => f.endsWith('.html'));

const missing = { code: new Map(), media: new Map(), pages: new Map() };

function record(bucket, target, page) {
  if (!bucket.has(target)) bucket.set(target, new Set());
  bucket.get(target).add(page);
}

for (const page of pages) {
  const html = fs.readFileSync(path.join(PUBLIC, page), 'utf8');
  for (const [, raw] of html.matchAll(REFERENCE)) {
    const target = raw.split(/[?#]/)[0];
    if (!target || target.startsWith('${') || target.startsWith('http') || target.startsWith('//')
      || target.startsWith('data:') || target.startsWith('mailto:')
      || target.startsWith('tel:') || target.startsWith('#')
      || target.startsWith('javascript:')) continue;

    const onDisk = path.join(PUBLIC, decodeURIComponent(target.replace(/^\//, '')));
    if (fs.existsSync(onDisk)) continue;

    const suffix = path.extname(target).toLowerCase();
    if (CODE_SUFFIXES.includes(suffix)) record(missing.code, target, page);
    else if (suffix === '.html') record(missing.pages, target, page);
    else record(missing.media, target, page);
  }
}

function report(title, bucket) {
  if (bucket.size === 0) return;
  console.log(`\n${title} (${bucket.size})`);
  for (const [target, users] of [...bucket].sort()) {
    console.log(`  ${target}\n      referenced by ${[...users].sort().join(', ')}`);
  }
}

console.log(`Checked ${pages.length} pages in ${path.relative(ROOT, PUBLIC)}/`);
report('MISSING scripts or stylesheets — these break the page', missing.code);
report('MISSING media — drop these into public/assets/img/', missing.media);
report('MISSING pages — linked but not written yet', missing.pages);

if (missing.code.size === 0 && missing.media.size === 0 && missing.pages.size === 0) {
  console.log('\nEvery reference resolves.');
}

process.exit(missing.code.size > 0 ? 1 : 0);
