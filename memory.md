# Project Memory — Pro Gravel Calculator

Last refresh: 2026-11-10 (Phase 4 start, local working session)
Active site root: `C:\Users\Abdullah\Documents\GitHub\Gravel-Calculator`

## Session 2026-11-10 — Phase 4 start: authority assets

Phase 4 = authority/link building. Code work covered Task 4-1 (linkable assets) and the
verifiable half of Task 4-6; outreach tasks 4-2 to 4-5 are owner work and are staged in
`seo-research/PHASE-4-AUTHORITY.md` (excluded from production).

### What was broken before this pass
- `vercel.json` sent `X-Frame-Options: SAMEORIGIN` on every route, so the "embeddable"
  calculator could not be framed by any third party (confirmed live with `curl -I`).
- All 7 calculator pages rendered a live 500 px iframe of `/embed.html` — the instructions page
  inside itself — instead of shipping embed code. 6 of the 7 also had a nested duplicate
  `<footer>` and two stray `</section>` tags.
- `/embed.html` was a stub with a broken snippet (it pointed at itself) and no schema.
- The three Phase 4 reference assets had **no JSON-LD**, no `tailwind.css` (so every utility
  class was inert and the tables rendered unstyled), and no inbound links except a footer line
  on the French drain guide.
- `gravel-density-chart.html`: the `Tonnes per Cubic Meter` column was computed as
  short tons/yd³ × 0.907 (wrong by ~30%, e.g. 1.29 instead of 1.68 for 105 lb/ft³), one kg/m³
  value was 1,928 instead of 1,922, one tons/yd³ value was truncated, and the `Source` column
  was placeholder text (`[Supplier A] (2026)` … `[Supplier N] (2026)`).
- `french-drain-stone-guide.html`: the 6″ and 8″ pipe rows (10.42 / 18.85 ft³) did not match the
  cylinder formula (9.82 / 17.45 ft³), the worked example used a 0.5 ft radius for a 6″ pipe and
  concluded 39.27 ft³, the bag counts were wrong, the first table had `<thead>` never closed and
  rows outside `<tbody>`, and the FAQ used `<dl>`/`<dt>` closed with `</li>` inside a `</ul>`.

### What was built / fixed
- **New `gravel-calculator-widget.html`** (noindex, self canonical, no nav, no analytics, no
  cookies) plus **`widget.js`**. Both use `calculator-engine.js`, so widget numbers cannot drift.
  Browser-verified: default `0.93 yd³ / 1.31 tons / 53 × 50 lb`, metric toggle converts the
  project (10 ft → 3.05 m, 3 in → 7.62 cm) and returns `0.71 m³ / 1.19 t / 48 × 25 kg`,
  L-shape and material switches work, no console errors, 3 network requests only.
  Height at 360 px: 411 px (rect/circle), 478 px (L-shape) — fits the 520 px iframe.
- **`vercel.json`**: added `Content-Security-Policy: frame-ancestors *` for
  `/gravel-calculator-widget.html` only; the site-wide `X-Frame-Options: SAMEORIGIN` stays.
  `.htaccess` mirrors it (`Header unset X-Frame-Options` + CSP inside `<Files>`). CSP Level 2+
  makes `frame-ancestors` supersede `X-Frame-Options`, so no other page becomes framable.
- **`embed.html`** rebuilt: live widget preview, copy-paste snippet, attribution rules,
  what the widget calculates, privacy note, related reference links, `WebPage` +
  `BreadcrumbList` schema. Loads `tailwind.css` now. URL unchanged (still in the sitemap).
- **All 7 calculator pages**: the self-referential iframe block replaced with an
  "Embed this calculator" section (h2, snippet, install-notes link, 2 page-relevant reference
  links). Duplicate `<footer>` and stray `</section></section>` removed — every page now has
  one footer and balanced sections, zero iframes.
- **`gravel-density-chart.html`**: `Source` → `Basis` with "Typical published range" (no invented
  suppliers), `tonnes/m³` recomputed as kg/m³ ÷ 1000, `#12` kg/m³ fixed to 1,922, `#411` and
  river rock tons/yd³ corrected to 1.49 / 1.46, note corrected (1 tonne = 1,000 kg = 2,205 lb),
  table wrapped in `overflow-x-auto`, `Article` + `BreadcrumbList` schema, `tailwind.css` loaded.
- **`french-drain-stone-guide.html`**: both pipe tables rebuilt from `π r² L` (4″ 4.36 ft³ /
  0.16 yd³ / 9 bags, 6″ 9.82 ft³ / 0.36 yd³ / 20 bags, 8″ 17.45 ft³ / 0.65 yd³ / 35 bags at
  100 lb/ft³), worked example corrected to a 0.25 ft radius, FAQ rebuilt as semantic
  h3/p blocks inside a grid, `Article` + `BreadcrumbList` schema, `tailwind.css` loaded.
- **`gravel-price-index-2026.html`**: `Article` + `BreadcrumbList` schema, `tailwind.css` loaded,
  table wrapped in `overflow-x-auto`. **Prices and the supplier-quote claim were not touched** —
  see needs-owner-input below.
- **Homepage**: new `#reference-data` section (density chart, price index, French drain guide +
  embed link) and four new footer links, so the assets are no longer near-orphans. Calculator
  default output unchanged (`0.93` at `#result-volume`).
- **`llms.txt`**: now lists all 8 calculators, the 5 guides/reference pages, the embed page and
  the company pages. Previously it listed 7 of 20 live pages.
- **`sitemap.xml`**: `lastmod` refreshed to 2026-11-10 for the 7 calculators, `embed.html` and the
  French drain guide.
- **`SEO Prompt - 2.md`**: Phase 4 Task 4-1 snippet updated to the real widget URL so a future
  session does not reintroduce `/embed/`.

### Tests
- `tests/static-qa.test.js` +4 tests (35 engine + 24 static = 59 PASS, 0 FAIL): widget is
  noindex/engine-driven/framable and the site-wide XFO survives; embed page + all 7 calculators
  point at the widget and contain no iframe; density-chart conversions match the engine
  constants and no `[Supplier` placeholder ships; homepage links every reference asset.
- `python tests/site-audit.py` → PASS, no errors, 21 HTML pages.
- `npm run build:css` re-run; `tailwind.css` changed (widget.html/widget.js are inside the
  Tailwind content globs).
- Browser checks: widget defaults + metric + L-shape + material, `embed.html` (iframe renders the
  widget, 0.93 yd³), French drain calculator page (0 iframes, 1 footer, no overflow at 375 px and
  1280 px), density chart and price index (no page overflow at 375 px after the table wrap),
  homepage (`#reference-data`, 4 asset links in footer, no console errors).

### Needs owner input (do not invent)
1. **Price index provenance** — the page claims "2026 supplier quotes (average of 5 regional
   suppliers)" with no source list. Need real quote URLs + access dates, or approval to relabel
   the table as a planning range. Numbers left as published.
2. **Density chart citations** — placeholders were removed; real supplier sheets are needed
   before the column can cite sources again.
3. **`sameAs` / brand profiles** — no Twitter/X, LinkedIn, Facebook, Instagram, YouTube or Google
   Business Profile exists anywhere in the repo. `Organization` schema is otherwise correct.
4. **Outreach tracker, send dates, 15–25 links** — owner mailbox and prospects.
5. **Deploy + live header verification** — the `frame-ancestors` behaviour and the widget's 200
   status can only be confirmed on the live host after an approved deploy.
6. **Widget framing policy** — `frame-ancestors *` is open by design; switch to an origin
   allowlist if that was not the intent.

## Session 2026-11-10 — technical SEO pass
- Fixed 7 calculator-page embeds from the missing `/embed/` path to `/embed.html`.
- Homepage mobile order now Shape → Dimensions → Material → Preview → Results/Print/Save/Share → rest.
- Print/Save/Share and the conversion note were falling into the default `order: 0` bucket because they sit outside `#results-card`; they now have explicit orders.
- Privacy advertising copy updated to current Google wording; 404.html gained a self canonical.
- Stone logo mark applied to the 8 content pages that still used the building icon.
- `tests/site-audit.py` now checks iframe/image/script targets and absolute OG/Twitter metadata; `npm test` 35 engine + 20 static pass, site audit passes.

## Current phase
Phase 4 — authority and link building. Task 4-1 (linkable assets, incl. the embeddable widget) is
complete in code; Tasks 4-2 to 4-5 are owner outreach work tracked in
`seo-research/PHASE-4-AUTHORITY.md`; Task 4-6 is blocked on real brand profiles (`sameAs`).
Calculator math unchanged.

## Today's result (2026-11-09)
- Subpage calculator cluster wired with `/calculator-engine.js` and `/subpage-calculator.js`:
  - Added shared scripts and all expected IDs/sections to French drain, Bag, Tons, Crushed stone, Driveway, and Cost pages.
  - Added all expected input and output fields:
    - French drain: `fd-calc-status`, `fd-results-note`, `fd-currency`, `fd-bags`, `fd-cost-card`, `fd-cost-total`, `fd-cost-alt`.
    - Bag: `bag-calc-status`.
    - Tons: `tons-calc-status`, `tons-converted-label`, `tons-coverage-caption`, `tons-coverage-body`, `tons-custom-density-wrap`.
    - Crushed stone: `stone-waste`, `stone-compaction`, `stone-calc-status`, `stone-results-note`, `stone-coverage-caption`, `stone-coverage-body`.
    - Driveway: `driveway-shape`, `driveway-waste`, `driveway-compaction`, `driveway-calc-status`, `driveway-results-note`, `driveway-coverage-caption`, `driveway-coverage-body`, `driveway-custom-density-wrap`.
    - Cost: `cost-shape`, `cost-rect-*`, `cost-circle-*`, `cost-lshape-*`, `cost-depth`, `cost-custom-density`, `cost-waste-percent`, `cost-compaction-percent`, `cost-currency`, `cost-price-per-ton`, `cost-price-per-yard`, `cost-bag-price-*`, `cost-delivery`, `cost-tax`, `cost-calc-status`, `cost-quantity`.
  - Corrected static math and tables across all subpages:
    - Tons formula: `short tons = cubic yards × 27 × density (lb/ft³) ÷ 2,000` (fixed 2 yd³ example to 2.70 short tons), short tons and metric tonnes per yd³, yd³ and m³ per ton/tonne, coverage per ton table and 50 lb bag counts (40 bags/short ton), and short ton vs metric tonne distinction (205 lb / ~10%).
    - Crushed stone: density by size code conversion to tons/yd³, coverage per ton (120 ft² at 2″, 80 ft² at 3″, 60 ft² at 4″ for #57 stone), bag counts (40 bags/ton), and yd³ per short ton (0.74 yd³).
    - Bag counts: updated 50 lb, 40 lb, 60 lb counts for 27 ft³ per yard and bag quantities for 0.5 yd³ and 1.0 yd³.
    - Driveway examples: 20′ × 10′ driveway (200 ft²) with 4″ base + 2″ surface correctly calculated as ~3.70 yd³ total (3.50 tons base + 1.67 tons surface), coverage table (114 ft² at 2″, 57 ft² at 4″, 40 bags/ton), and 4 yd³ #57 stone example (5.40 tons, 216 bags, 6 pallets).
    - French drain: pipe volume deduction (0.16 yd³ / 5% for 4″ × 50′) and fabric area calculation (300 ft² / 100 linear ft at 3 ft width).
    - Cost page: full dimensions and depth quantity inputs feeding directly into the cost engine.
  - Shortened all subpage meta descriptions to ≤165 characters (and ≥80 characters).
  - Extended static QA in `tests/static-qa.test.js`:
    - All markup structure, canonicals, no duplicate IDs, accessible control names, JSON-LD, internal links, and asset checks now cover all 7 subpages.
    - Added dedicated test asserting every calculator subpage loads `/calculator-engine.js` before `/subpage-calculator.js` (both deferred), has a form, and has a results container.
  - Rebuilt `tailwind.css` via `npm run build:css`.
  - `npm test` passes **35 engine + 20 static = 55 PASS, 0 FAIL**.
- Google Analytics 4 measurement ID `G-5P009C37K2` wired directly through `analytics-config.js` and the existing consent-gated `analytics.js`.
  - Browser-verified: first visit shows the consent banner and makes no request to Google; **Accept analytics** loads `gtag/js?id=G-5P009C37K2` (HTTP 200) and sends `page_view` plus `consent_update` to `google-analytics.com/g/collect`; **Decline analytics** stores `denied` and loads nothing.
  - GTM container `GTM-NS2K4P78` remains available but is disabled (`containerId: ""`) so the same page view is not counted twice. The GA4 stream ID `16301390077` is admin metadata and is not needed in site code.
  - `privacy.html` updated to describe direct Google Analytics 4 accurately (last updated 2026-11-09).
- `sitemap.xml` expanded from 7 to 14 URLs. All 7 Phase 3 calculator pages are included with their directory canonicals.
- Homepage has a new "Calculators for specific projects" section linking all 7 calculator pages, so the cluster is no longer orphaned.
- Static QA now checks the full sitemap set (including directory pages) and enforces homepage links to the cluster.
- `npm run build:css` rebuilt `tailwind.css`; `npm test` passes **35 engine + 19 static = 54 PASS, 0 FAIL**.
- Default calculator output still `0.93 yd³ / 1.31 short tons / 53 bags`.
- Committed as `d0b96ac` and deployed on 2026-11-09. Live checks passed: sitemap serves 14 URLs, homepage shows the project-calculator links, and `analytics-config.js` serves `G-5P009C37K2`.
- The live `contact-config.js` still has an empty endpoint; contact delivery remains the only functional Phase 3 gap.

## Previous pass (2026-11-08)
- `style.css` recolored for the homepage toward a grounded evergreen system:
  - primary `#2f5d3a` / `#1f4029`
  - accent `#a96a3a` / `#f7efe7`
  - neutral ink `#1f2421` / `#4b5550`
  - border/panel `#d8ded6` / `#f6f7f3`
- Applied to shape buttons, slider thumbs, sliders, FAQ, consent, forms, methodology strip, guide cards, result values, order button and fallback chip.
- No new component markup added in that pass; only existing ids/classes restyled.

## How to continue after today
1. Reread `index.html`, `analytics.js`, `analytics-config.js`, `privacy.html`, `sitemap.xml` and `tests/static-qa.test.js` before another round.
2. Re-run `npm run build:css && npm test` after any CSS, Tailwind utility, analytics, sitemap or homepage change.
3. Visual check before any deploy decision.

## Phase 4 checklist
- [x] 4-1a Embeddable widget live in code (`gravel-calculator-widget.html` + `widget.js`, framable,
      noindex) and distributed on all 7 calculator pages + `embed.html` + `llms.txt`
- [x] 4-1b Reference assets citation-ready: schema, internal links, correct tables, styled
- [x] 4-1c Asset discoverability: homepage `#reference-data` block + footer links
- [ ] 4-1d Deploy and verify the live `frame-ancestors` header and a real third-party embed
- [ ] 4-2 Foundation directory submissions (owner)
- [ ] 4-3 100 qualified targets + 20 emails/week (owner)
- [ ] 4-4 Digital PR pitches (owner)
- [ ] 4-5 Community answers logged (owner)
- [ ] 4-6 Brand profiles + `sameAs` in Organization schema (needs owner input)

## Phase 3 checklist
### Calculator pages — done
- [x] 1 — `/french-drain-gravel-calculator/index.html`
- [x] 2 — `/gravel-bag-calculator/index.html`
- [x] 3 — `/pea-gravel-calculator/index.html`
- [x] 4 — `/gravel-calculator-tons/index.html`
- [x] 5 — `/crushed-stone-calculator/index.html`
- [x] 6 — `/driveway-gravel-calculator/index.html`
- [x] 7 — `/gravel-cost-calculator/index.html`
- [x] Homepage visual polish (style.css recolor, no math change)
- [x] Homepage links to all 7 calculator pages
- [x] All 7 calculator pages added to `sitemap.xml`
### Reference assets
- [x] 1 — Open Graph / social image asset (`og-image.png` is a real 1200×630, referenced on all 16 pages)
- [x] 2 — Favicon / app icon set (`favicon-192x192.png` regenerated at a true 192×192; 32, 512, 180, ico, svg and manifest verified)
- [x] 3 — Analytics wiring: GA4 `G-5P009C37K2` is consent-gated, browser-verified and active. Search Console property still needs owner verification.
- [ ] 4 — Contact form delivery: transport is implemented and browser-tested; needs a real endpoint in `contact-config.js`
- [ ] 5 — Deployment approval + publish decision

## Operational wiring (2026-11-09)

### Google Analytics / GTM
- `analytics-config.js` currently has:
  - `measurementId: "G-5P009C37K2"` (active, direct GA4)
  - `containerId: ""` (GTM intentionally disabled)
- GTM container `GTM-NS2K4P78` is retained as an unused alternative. To switch back: empty `measurementId`, set `containerId: "GTM-NS2K4P78"`, and add the GA4 tag inside the GTM container.
- Enable only one mode at a time; `tests/static-qa.test.js` enforces this to prevent double-counted page views.
- The GA4 stream ID `16301390077` is used inside Google Analytics admin only; it does not belong in site code.
- `analytics.js` loads the Google tag only after consent, pushes consent defaults before requesting the script, and sends events only after consent.
- Do not paste raw Google tags into the HTML pages; analytics must stay consent-gated through `analytics.js`.

### Contact form
- `contact.html` posts JSON to `window.PGC_CONTACT.endpoint` from `contact-config.js`:
  disabled/"Sending…" button state, 15 s abort, non-2xx handling, honeypot short-circuit, success/reset,
  failure message, and a consent-gated `contact_submit` analytics event.
- While `endpoint` is empty the page keeps the "delivery is not connected" notice and sends nothing.
  The notice hides itself automatically as soon as an endpoint is configured.
- Verified end to end against a local mock endpoint: payload received, success status shown, form reset.
- To enable delivery: set `endpoint` (Formspree / Web3Forms / Basin / Formspark style) and, if the provider
  needs one, `accessKey`. Never put a private API secret in `contact-config.js`.

### Search Console
- Verify `www.progravelcalculator.online` (DNS TXT or the HTML file Vercel serves), then submit
  `https://www.progravelcalculator.online/sitemap.xml` (now 14 URLs).

## Hard constraints
- Default calculator output must stay `0.93 yd³ / 1.31 short tons / 53 bags` on the homepage default.
- `.html` URLs and existing functionality stay intact.
- Do not invent GA4 IDs, GSC data, prices, reviews, or contact details.
- Do not paste raw Google tags into HTML; analytics must stay consent-gated through `analytics.js`.
- Do not commit, push, or deploy without explicit owner approval.
- Update `memory.md` after every completed task.

## Verified earlier
- Phase 2 Tasks 2-1 through 2-10 treated as verified, including browser check of cost estimator, bag sizes/pallets, share URL, PDF order sheet.
- `npm test` 55 PASS, 0 FAIL in this session.

## Pending
- Phase 2 Task 2-11 cross-browser/responsive-width matrix still open in the plan if it gets picked up again.
- Search Console: submit/confirm `sitemap.xml`, request indexing for the 7 cluster URLs (T32), then log coverage after 7 days.
- Contact-form delivery endpoint/email.

## Local run notes
- Local dev command used earlier: `npm run dev` (python static server on `127.0.0.1:4173`).
- Tailwind config: `tailwind.config.js` with content `['./*.html','./*.js']` and `@tailwindcss/typography` plugin.
- Custom CSS layer: `style.css`; utility layer: `tailwind.css` (do not edit by hand).

## Publish gate
- Phase 3 build is deployed at commit `d0b96ac`; only the `memory.md` status update is uncommitted.
- Public client IDs (`GTM-…`, `G-…`, Formspree/Web3Forms endpoints/access keys) are visible to every visitor and are safe to commit.
- Private API secrets do **not** belong in client-side config; use a serverless function and environment variables instead.
- Future commit/push/deploy actions still require explicit owner approval.
