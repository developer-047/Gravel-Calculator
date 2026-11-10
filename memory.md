# Project Memory — Pro Gravel Calculator

Last refresh: 2026-11-09 (local working session)
Active site root: `C:\Users\Abdullah\Documents\GitHub\Gravel-Calculator`

## Session 2026-11-10 — technical SEO pass
- Fixed 7 calculator-page embeds from the missing `/embed/` path to `/embed.html`.
- Homepage mobile order now Shape → Dimensions → Material → Preview → Results/Print/Save/Share → rest.
- Print/Save/Share and the conversion note were falling into the default `order: 0` bucket because they sit outside `#results-card`; they now have explicit orders.
- Privacy advertising copy updated to current Google wording; 404.html gained a self canonical.
- Stone logo mark applied to the 8 content pages that still used the building icon.
- `tests/site-audit.py` now checks iframe/image/script targets and absolute OG/Twitter metadata; `npm test` 35 engine + 20 static pass, site audit passes.

## Current phase
Phase 3 — content cluster, homepage polish and analytics wiring.
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
