# Media

Every image, video and the favicon belong in this folder. The pages
reference them as `assets/img/<filename>`, so a file named
`premium-bag.png` here is reachable as `assets/img/premium-bag.png`.

The media files were not part of the code that was handed over, so they
are not in this repository. Copy them in from the old site root — the
filenames have not changed — and then run:

    npm run check:links

which lists every reference that still does not resolve.

Until they arrive, product photos fall back to an inline SVG placeholder
(see `tkImgFallback` in `assets/js/pages/shop.js`); everything else
renders as a broken image.
