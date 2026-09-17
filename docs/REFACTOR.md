# What the refactor changed

Read this before wondering why something looks different.

## Bugs that were fixed

These were defects in the original code, not consequences of the move.

**The cart badge on enquiry.html rendered `NaN`.** Its private
`updateCartBadge()` summed `item.quantity`, but the cart engine had
already moved to `item.qty`. Every page now uses the engine's own badge.

**`POST /api/orders` hung on a cart it could not price.** The handler
rethrew from inside an `async` function, and Express 4 does not catch a
rejected promise — the request sat open until the client timed out.
Every async route is wrapped in `asyncHandler` now and answers 400.
`tests/api.test.js` covers it.

**Bank-transfer customers were told they had paid.** `submitManual()`
set the "transfer details are on their way" message and then called
`finish()`, which overwrote it with "Payment received." `finish()` now
takes the outcome and picks the right message.

**Any failure during order creation was reported as a PayPal outage.**
The `catch` wrapped the whole handler, so a bug in our own persistence
came back as `PAYPAL_UNAVAILABLE`. Only the PayPal call is wrapped now.

**The rate limiter leaked.** Its `Map` was never pruned, so it grew for
the process lifetime. It sweeps expired buckets on an unref'd interval.

**The ticker's error check never worked.** It tested `response.isOk`,
which does not exist; `undefined` is falsy, so the check passed only
because of the `status !== 200` clause beside it. It reads `response.ok`
now, and has a timeout.

**The ticker injected remote text into `innerHTML` unescaped.**
Headlines arrive from a third-party API over the network. They are
escaped now.

**The ticker mounted itself after `document.querySelector('.hero, #top,
section')`** — whatever the first section on the page happened to be. It
looks for `#ticker-mount`, falling back to `.hero`.

**`login.html` threw on load.** `login.js` imported
`./firebase-config.js`, which was not in the codebase, so the module
never evaluated and the page showed its loading spinner forever. The
file now exists as a template.

**The enquiry form was dead.** `enquiry.html` loaded an `enquiry.js`
that was never handed over, so `submitForm()` and `selectType()` were
undefined and clicking Send threw. Both are reconstructed from the
markup. Sending is not: see below.

**`main.js` was a third, contradictory cart.** Nothing loaded it. It
wrote the old `{name, price, quantity}` schema, and its price table
disagreed with the catalogue — a "Module 1 — Stay at Home Shelf" at 149
against a real price of 549.99. It also called
`document.getElementById('remaining-num').textContent` at module top
level, which throws on any page without that element. It is not in the
new tree; its live behaviour (the counter, the reveal animation) is in
`pages/home.js`, sourced from the catalogue.

## Deliberate behaviour changes

Each of these is a change a visitor could notice. Reverse any of them if
you disagree.

**The theme is remembered on every page.** Only checkout and login used
to persist it, so choosing dark mode on the shop and clicking through to
the cart put you back in light mode. An inline snippet in each `<head>`
applies it before first paint, so there is no white flash either.

**The shop no longer starts in English.** `takekontrol-revamp.html`
defaulted to English while the other six defaulted to German. There is
one default now, in `core/i18n.js`:

```js
export const DEFAULT_LANG = 'de';
```

**One scroll threshold.** The header turned solid at 10 px on checkout,
50 px on five pages and 60 px in the dead `main.js`. It is 50 px
everywhere, in `core/header.js`.

**Google Translate is opt-in.** It is enabled through
`<body data-google-translate>` on the five pages that had it, and off on
shop and checkout, which never had it. It is also loaded from JavaScript
rather than a markup `<script>` tag, because the callback name has to
exist before Google's script runs and page scripts are deferred modules
now.

**The AWS SDK is gone from `enquiry.html`.** It was loaded in the browser,
which means either credentials in client-side code or an unauthenticated
endpoint. Send the mail from your own server instead.

**Cart lines no longer store a price.** The stored schema is
`{ sku, qty }`. Prices are read from the catalogue on every render, so a
cart left open across a price change cannot display a figure the server
will refuse. Old carts are migrated on read, including the pre-SKU ones
that only had a name; `tests/pages.test.js` covers that path.

**The mobile drawer manages focus.** It moves focus into the drawer on
open and back to the button on close, and sets `aria-hidden` and
`aria-expanded`. None of the seven copies did.

## What was deliberately NOT changed

**The markup.** Class names, ids, `data-localize` keys and inline
`onclick` attributes are exactly as they were. Every function the markup
calls is republished on `window` by its page module, under a comment
saying so. Migrating those to listeners is a good next commit; doing it
in the same pass as everything else would have made the diff
unreviewable.

**Drifted CSS.** `tools/split-css.py` promotes a rule to a shared file
only when it is byte-identical across at least five of the seven pages,
and it aborts if promotion would change the cascade. That produced a
7-rule `base.css` and a 35-rule `chrome.css`. Everything else stayed
with its page, verbatim. Reconciling drifted CSS without a browser to
compare against is guesswork, and this refactor had no browser.

**index.html's dark palette.** Its fourteen dark-mode variables are a
blue-slate scheme (`--primary-bg: #0a0f1d`) against everyone else's
near-black. Every page's token block is diffed against
`assets/css/tokens.css` and the differences are written back into that
page's own stylesheet with a comment. Whether the site wants one palette
or two is a design decision.

**`tk-protect.js`'s settings.** They are unchanged, including
`BLOCK_DEVTOOLS_KEYS: true` sitting under a comment claiming it is "left
off deliberately." Two notes, since the file is now `vendor/protect.js`:
blocking F12 and Ctrl+U inconveniences screen-reader users and
developers and stops nobody, and `BLOCK_SELECTION: true` with
`ALLOW_ON_SELECTION: false` means visitors cannot select text at all —
including an address or an order number. Both are one-line changes.

## Still open

- **Media.** Everything resolves under `public/assets/img/` and the
  files are not there. `npm run check:links` lists all 42.
- **Enquiry transport.** `sendEnquiry()` in `pages/enquiry.js` throws
  and shows the visitor a mail address. Replace it with a POST to your
  own endpoint.
- **Firebase config.** Template values in `auth/firebase-config.js`.
- **Missing pages.** `agb.html`, `datenschutz.html`, `widerruf.html` and
  `kontrol-quick-check (2).html` are linked and do not exist. The first
  three are linked from the checkout consent line.
- **Webhook dedupe is in memory.** A restart can reprocess one already
  seen event. Every handler is idempotent, which is why that is
  tolerable rather than urgent; move `seenEvents` into the order log when
  you outgrow it.
- **The order store is a JSON log.** Deliberately. Keep the interface and
  the fsync-before-responding rule when you swap in Postgres.
- **`login.html` is untested by jsdom** because its module graph fetches
  the Firebase SDK from gstatic. The other six pages are covered.

## The tools
## PRICING CHANGE
One place only — public/assets/js/shared/catalog.js:




