# Not carried over

## main.js

Dropped, not moved. Nothing loaded it — no page had a `<script>` tag for
it — and it had drifted badly:

* a third price table that disagreed with the catalogue
  (`'Module 1 — Stay at Home Shelf': 149` against a real 549.99)
* an `addToCart()` writing the superseded `{name, price, quantity}`
  cart schema, which the current engine only accepts as a legacy
  migration
* `document.getElementById('remaining-num').textContent` at module top
  level, which throws on any page without that element

The parts of it that were actually live elsewhere — the pledge counter,
the scroll-reveal observer — are in `public/assets/js/pages/home.js`,
reading prices from the shared catalogue.

The original file is still in whatever you handed over; nothing here
modified it. If the kit customiser it contains (`ITEM_DB`,
`MEMBER_ITEMS`, `renderGallery`) is meant to ship, it needs a page to
live on and a price source, and it should be rebuilt against the cart
engine rather than restored as-is.
