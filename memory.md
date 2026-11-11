# Project Memory — Pro Gravel Calculator

Last refresh: 2026-11-11 (Phase 5 pass: answer-first passages on all 13 content pages, driveway
fan-out sections, semantic-table audit, reference captions, GEO QA tests; 64 PASS)
Active site root: `C:\Users\Abdullah\Documents\GitHub\Gravel-Calculator`

## Session 2026-11-11 — Phase 5: GEO and AI visibility

Phase 5 (tasks 5-1 to 5-5) is implemented on-site and passes the local gates; **nothing is committed
or deployed**. The audit and report are in `seo-research/PHASE-5-GEO.md`.

### What was wrong before this pass
- **No page was answer-first.** The first 200 words were navigation, form labels and a one-line
  subtitle. The formula and worked examples sat hundreds of words below the calculator, so a
  top-of-page passage extracted for an AI answer contained no answer, formula or figure.
- **The driveway page did not answer its own fan-out.** "How much gravel for a driveway" splits into
  depth, cubic yards, yards-to-tons, material and delivery. The page covered depth, material and bag
  counts, but not the cubic-yard formula, the conversion formula or delivery cost (delivery existed
  only on `driveway-cost-guide.html`).
- **Two reference summaries were vague** — the density chart described itself as a "comprehensive
  table" and the French drain guide promised "unique angles". Those are exactly the sentences an AI
  answer would quote.

### What was built / fixed
- **`.answer-first` passage under the H1 on all 13 indexable content pages** (homepage, 7
  calculators, density chart, price index, French drain stone guide, gravel types, driveway cost),
  each with the direct answer, the formula and at least one specific figure:
  homepage/pea gravel `0.93 yd³ / 1.31 short tons / 53 × 50 lb bags` at 3″; crushed stone
  `1.23 yd³ / 1.67 tons / 67 bags` at 4″; tons `1.35 short tons per yd³`, 4 yd³ = 5.40 tons; bags
  `54 × 50 lb bags per yd³`; cost `$30–$50/yd³` pea gravel and `$45–$65/yd³` #57; French drain
  `3.05 yd³ / 4.11 tons / 165 bags` (existing 50 ft worked example); driveway `3.70 yd³ / 5.17 tons`.
- **Driveway page fan-out completed** with three answer-first sections: "How many cubic yards of
  gravel does a driveway need?" (2.47 + 1.23 = 3.70 yd³), "How do you convert cubic yards of
  driveway gravel to tons?" (2.47 × 27 × 105 ÷ 2,000 = 3.50 and 1.23 × 27 × 100 ÷ 2,000 = 1.67, for
  5.17 total) and "How much does driveway gravel delivery cost?" (HomeAdvisor ≈ $5/mile, 10 miles
  ≈ $50, minimum loads, quoted by load, linked to the cost guide). Depth and material sections stay.
- **Fact density:** density chart subtitle now states the real span (95 lb/ft³ / 1,522 kg/m³ for #8
  to 120 lb/ft³ / 1,922 kg/m³ for #12) and its Twitter description was rewritten; price index states
  $20–$50/ton and $30–$80/yd³ for 11 materials; French drain guide states 0.16 yd³ ≈ 9 × 50 lb bags
  for 4″ × 50 ft; gravel-types lead now says which stone for which use plus 1.35 short tons/yd³.
- **Semantic tables:** every data table on the 13 pages uses `<table>`/`<thead>`/`<tbody>`/`<th>`
  with no ARIA-role or CSS-grid substitutes. `#density-table` and the price index table gained
  `<caption class="sr-only">` labels so an extracted table still says what it measures.
- **No new sources or figures were introduced.** Every number comes from `calculator-engine.js`,
  the page's own tables or its existing worked example; the price index and density chart stay
  labelled as planning ranges.
- **Phase 5 QA added to `tests/static-qa.test.js` (+4 tests):** answer-first passage present, before
  the first H2 and inside the first 150 words on all 13 pages; driveway fan-out headings, both
  formulas and the attributed delivery figure; semantic tables and reference captions; vague
  reference copy must not return.

### Tests
- `npm run build:css` exit 0; `npm test` **64 PASS, 0 FAIL** (35 engine + 29 static);
  `python tests/site-audit.py` PASS on 21 pages.
- Not run or not measurable: browser/visual pass (no visual check was requested), deploy, and AI
  citation counts. AI Overview / ChatGPT / Perplexity citations need the Phase 6 measurement window
  and must not be claimed.

## Session 2026-11-10 — Phase 4 start: authority assets

Phase 4 = authority/link building. Task 4-1 (linkable assets) is complete **and live on the host**.
The whole phase is now prepared end to end: `seo-research/PHASE-4-AUTHORITY.md` is the index, with
`OUTREACH-TARGETS.md` (100 targets), `DIRECTORY-SUBMISSIONS.md`, `DIGITAL-PR-ANGLES.md`,
`COMMUNITY-PLAYBOOK.md` and `ENTITY-SIGNALS.md` alongside it (all excluded from production).
Execution — emails, pitch sends, posts, profiles — is owner-gated; backlinks remain **0**.

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
- `tests/static-qa.test.js` +4 tests (35 engine + 24 static = 59 PASS, 0 FAIL at that point): widget is
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

### Task 4-1 follow-up — citation surface (2026-11-10)
- Reference tables are now deep-linkable and citable, which is the asset the 4-3 outreach actually
  offers: `#density-table` on `gravel-density-chart.html`, `#pipe-volume-table` and
  `#gravel-savings-table` on `french-drain-stone-guide.html`.
- Each of those two pages gained a "Cite this" block with a suggested citation using an
  `Accessed [date]` placeholder (no hard-coded date invented), the deep link, and a one-line method
  note (density formula / cylinder formula and 100 lb/ft³).
- **`gravel-price-index-2026.html` deliberately has no citation block** while its supplier
  provenance is unresolved; `reference tables expose stable anchors and a citation block` asserts it
  stays uncitable until that item is fixed.
- New test added; `npm test` now **60 PASS, 0 FAIL** (35 engine + 25 static); `python
  tests/site-audit.py` PASS on 21 pages. Browser-checked at 1280 px and 360 px: both anchors scroll
  the table to the top of the viewport, blocks render styled, citation paragraph wraps
  (125 px tall at 360 px), `scrollWidth` never exceeds the viewport, zero console errors.

### Deploy + live verification (2026-11-10)
Committed as `edb9943 phase4-1` (23 files) and deployed to Vercel; checked against the live host,
not just locally:
- `https://www.progravelcalculator.online/gravel-calculator-widget.html` → **200** with
  `Content-Security-Policy: frame-ancestors *`. `X-Frame-Options: SAMEORIGIN` is still sent, but
  CSP `frame-ancestors` supersedes it per spec, so the widget is framable and no other route changed.
- Live widget renders the engine default in a real browser: `0.93 yd³ / 1.31 tons / 53 × 50 lb`,
  `window.GravelEngine` present, `/widget.js` and `/calculator-engine.js` both 200, zero console
  errors, `robots: noindex, follow`, self canonical.
- `/sitemap.xml` live = **18 URLs**. `/french-drain-gravel-calculator/` ships the embed section with
  **0 iframes**. `/` contains `#reference-data` and the embed link (note `/index.html` 308-redirects
  to `/`, so grep the redirect target, not the `.html` URL).
- Still unproven: an actual third-party page embedding the widget (needs an accepted placement from
  4-3/4-4), and the `.htaccess` framing path on any host that is not Vercel.

### Phase 4 Task 4-3 — outreach list, first tranche
- `seo-research/OUTREACH-TARGETS.md` added: 12 targets fetched and confirmed by hand on
  2026-11-10 (Kirk Allen Landscape Supply French drain calculation article, Drainage First
  pipe-subtraction guide, Earth Stone Rock drainage blog, Lyngso Garden community-resources guide,
  The Stone Store estimating hub, River Sand gravel page, Picayune Supply blog, NDS resources
  article, Eastern Landscape driveway calculator, Fine Gardening gravel-path article, BobVila and
  The Spruce French drain guides). Each row records type, why relevant, asset to offer, editorial
  link likelihood and status `not contacted`.
- 17 competitor sites found during discovery are logged as excluded (they own the same query -
  OmniCalculator, InchCalculator, Calculator.net, Hello Gravel, GravelCalculate, SiteworkMath and
  similar clones), so a future session does not re-pitch them.
- Quotas to reach the 100-target requirement are written into the doc; 88 rows still to find.
  Contact names/emails were deliberately not scraped or guessed.

### Phase 4 Task 4-2 — foundation directories: verdict is "mostly closed"
- `seo-research/DIRECTORY-SUBMISSIONS.md` added. Checked 2026-11-10 and found the site has no
  business identity to submit: `privacy.html:214` says "We do not publish a postal address",
  `about.html:255` says "Independent tool — not a quarry or contractor", there is no phone and no
  published email. Google Business Profile, Bing Places ("all businesses must provide a valid
  address for verification"), Apple Business Connect and Yelp are therefore **blocked**, not pending.
- Only three openings are real: AlternativeTo (free, account + verified email, months-long moderator
  backlog, link attribute disputed — two checkers report `nofollow`, so no ranking value assumed),
  Product Hunt (free, personal account only, one-shot launch) and SaaSHub (free, low value). The two
  calculator directories named in the plan (`toolcalculator.com`, `freecalc.com`) did not resolve on
  2026-11-11, so neither was assessed or submitted.
- Doc includes a paste-ready name/tagline/description block (facts taken from the live site only),
  the exact AlternativeTo route (user icon → "Suggest new application"), the honest framing
  ("alternative to Omni Calculator / Calculator.net"), and a do-not list (paid link packages, mass
  directory submits, invented NAP).
- Recommendation recorded: send AlternativeTo, defer Product Hunt until there is something to
  announce, and move the rest of the 4-2 budget to 4-3. Expected ranking impact of all three: zero
  to negligible.

### Phase 4 completion pass — 2026-11-10 (tasks 4-3 to 4-6)
- **4-3: 100 verified targets on 69 distinct domains** in `seo-research/OUTREACH-TARGETS.md`. Six
  parallel research passes (landscaping blogs, aggregate suppliers, university extension,
  home-improvement publishers, UK/EU references, resource hubs) returned 83 candidates; two more
  search waves added ~25, so ~110 URLs were considered and 88 new rows survived (plus the 12 already
  logged). Every logged row was fetched with the fetch tool and its body text read (`curl` returns 000
  here).
  Two more search waves were needed because calculator sites dominate the results — those were pushed
  into the exclusion list, which now also covers the .gov/EPA/FHWA PDFs (no editorial contact, never
  link out) and the calculator clones found in waves 2-3.
- **69 domains is the real workload**, not 100: outreach counts emails, and the repeated domains are
  reference sites with several useful pages (pavingexpert, The Spruce). The doc says so explicitly.
- **4-4** `DIGITAL-PR-ANGLES.md`: five angles with sources. Pipe deduction (4/6/8 in = 0.16/0.36/0.65 yd³
  per 50 ft) and the pea-gravel-vs-#57 density pair are pitchable; bags-vs-bulk (a yard ≈ 57 × 50 lb
  bags) is hedged; **waste-factor data is not pitchable** (we have calculator inputs, no project data)
  and **price-by-state is blocked** on provenance. No study or survey is claimed anywhere.
- **4-5** `COMMUNITY-PLAYBOOK.md`: sourced the actual Reddit position — the 10% rule comes from a wiki
  Reddit marks "no longer updated", the current spam policy sets no percentage, and subreddit rules
  govern. Seven answers drafted against figures that exist on our pages; 0 posted.
- **4-6** `ENTITY-SIGNALS.md`: `Organization` exists at `index.html:54` with **no `sameAs`** (grep for
  `sameAs` returns nothing sitewide) — correct while no profiles exist. Contains the exact JSON to
  paste plus the decision list (trading name, address/phone, which profiles, who replies).
- `PHASE-4-AUTHORITY.md` rewritten from §3 down, ending in a Phase 4 exit report: what was achieved,
  what was not (0 backlinks, 0 emails, 0 profiles), and why each gap is owner-side.
- No site code changed in this pass, so the last test run stands: `npm test` **60 PASS** (35 engine +
  25 static), site audit PASS on 21 pages.

### Phase 4 verification pass — 2026-11-11
- **Bag arithmetic corrected.** One cubic yard of pea gravel at 105 lb/ft³ is 2,835 lb = ~57 × 50 lb
  bags, not 53. The 53 figure belongs to the default 0.93 yd³ output (2,625 lb). Fixed in
  `DIGITAL-PR-ANGLES.md`, `PHASE-4-AUTHORITY.md`, `memory.md` and `SEO Prompt - 2.md`; the community
  playbook already had 57. #57 stone is ~54 bags/yd³. Default calculator output is unchanged.
- **Density chart provenance softened and duplicates merged.** `gravel-density-chart.html` no longer
  says values come from "supplier test data" or advertises "source citations"; the Basis column is now
  "Typical planning range" and the method note says these are planning values, not a supplier test
  programme. The three duplicate `#57/#411/#304 Stone` rows were removed, leaving 11 materials. No
  density numbers changed.
- **Price index relabelled.** `gravel-price-index-2026.html` now reads "Gravel Price Index 2026:
  Planning Ranges", states that the ranges are not a supplier survey or an average of named suppliers,
  and no longer claims "supplier quotes and industry reports". The three duplicate rows (`#57 Stone`,
  `#411 Stone`, `#304 Stone`) were removed, the #12 note corrected, and `dateModified`, the visible
  date and the sitemap lastmod set to 2026-11-11. Numbers untouched; the page still has no "Cite this"
  block.
- **Outreach contradiction fixed.** Four `hellogravel.com` guide rows breached the doc's own rule 3
  (direct competitor intent). They were replaced with four fetched-and-read non-competitor pages:
  Sagamore Companies, two Gravelshop guides and This Old House. Still 100 rows; domains 68 → 69;
  `PHASE-4-AUTHORITY.md` and this file updated.
- **Verification:** `npm run build:css` re-run, `npm test` **60 PASS** (35 engine + 25 static),
  `python tests/site-audit.py` PASS on 21 pages. Nothing committed or deployed.
- **Phase 4 outcome side is still zero:** 0 emails, 0 backlinks, 0 brand profiles, 0 community posts.
  Those remain owner-gated and are not claimed as complete.

### Needs owner input (do not invent)
1. **Price index provenance** — the false "2026 supplier quotes / average of 5 regional suppliers"
   claim was removed on 2026-11-11, so the page is now honestly labelled as planning ranges. The
   numbers themselves still have no source list: supply real quote URLs + access dates if they are to
   be cited, or confirm the planning-range framing. Numbers left as published.
2. **Density chart citations** — placeholders were removed; real supplier sheets are needed
   before the column can cite sources again.
3. **`sameAs` / brand profiles** — no Twitter/X, LinkedIn, Facebook, Instagram, YouTube or Google
   Business Profile exists anywhere in the repo. `Organization` schema is otherwise correct.
4. **Outreach tracker, send dates, 15–25 links** — owner mailbox and prospects.
5. **Third-party embed proof** — the widget is live and framable (verified on the host), but no real
   publisher embeds it yet; that needs an accepted outreach placement. `.htaccess` framing behaviour
   is also untested off Vercel.
6. **Widget framing policy** — `frame-ancestors *` is open by design; switch to an origin
   allowlist if that was not the intent.
7. **Business identity / NAP** — no registered trading name, postal address or phone exists in the
   repo, and `privacy.html` states none is published. Supplying one (even home-based service-area)
   would unlock Google Business Profile, Bing Places, Apple Business Connect and Yelp in one step.

## Session 2026-11-10 — technical SEO pass
- Fixed 7 calculator-page embeds from the missing `/embed/` path to `/embed.html`.
- Homepage mobile order now Shape → Dimensions → Material → Preview → Results/Print/Save/Share → rest.
- Print/Save/Share and the conversion note were falling into the default `order: 0` bucket because they sit outside `#results-card`; they now have explicit orders.
- Privacy advertising copy updated to current Google wording; 404.html gained a self canonical.
- Stone logo mark applied to the 8 content pages that still used the building icon.
- `tests/site-audit.py` now checks iframe/image/script targets and absolute OG/Twitter metadata; `npm test` 35 engine + 20 static pass, site audit passes.

## Current phase
Phase 5 — GEO and AI visibility. **Implemented and verified locally on 2026-11-11; deploy is
unapproved, so none of it is live.**
Tasks 5-1 to 5-5 are complete in code: answer-first passages on all 13 content pages, the driveway
fan-out (cubic yards, yards-to-tons, delivery), semantic-table audit and reference captions, and
vague reference copy replaced with figures. Four Phase 5 tests guard the work.
Phase 4 remains complete as preparation but its execution side is still owner-gated: 0 emails,
0 backlinks, 0 brand profiles, 0 community posts. Calculator math is unchanged and the homepage
default is still `0.93 yd³ / 1.31 short tons / 53 bags`.

## Result logged 2026-11-09 (Phase 3 subpage cluster)
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
- `sitemap.xml` went 7 → 14 URLs at Phase 3 and stands at **18 URLs** after the Phase 4 assets. All 7 calculator pages are included with their directory canonicals.
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
1. Reread `memory.md`, the two `seo-research/` docs and whatever file you are about to touch.
2. Phase 4 assets: `gravel-calculator-widget.html`, `widget.js`, `embed.html`, `vercel.json`
   (widget-only CSP rule), `.htaccess`, and the embed section in all 7 `<page>/index.html`.
   Invariants: never re-add an iframe of `/embed.html` to a calculator page, never put the widget in
   `sitemap.xml` (it is `noindex`), and keep the widget driven by `calculator-engine.js` so its
   numbers cannot drift from the main calculator.
3. Research assets: `gravel-density-chart.html`, `french-drain-stone-guide.html`,
   `gravel-price-index-2026.html`. Tables must stay consistent with the engine constants; no invented
   suppliers, citations, prices or reviews.
4. Keep the citation surface intact: the three table anchors and the "Cite this" blocks are the
   deep links outreach offers, so do not rename them without updating `seo-research/` and the tests.
5. After any HTML/CSS/JS change: `npm run build:css && npm test` (expect 35 engine + 29 static) and
   `python tests/site-audit.py` (expect 21 pages, no errors).
7. Keep the `.answer-first` passage on every content page: the passage must precede the first H2 and
   carry an answer, a formula and a figure. `tests/static-qa.test.js` asserts all three, and the
   driveway page must keep answering cubic yards, yards-to-tons, depth, material and delivery.
6. Visual check before any deploy decision, and re-verify on the host after an approved deploy.

## Phase 5 checklist
- [x] 5-1 Passage extractability: `.answer-first` passage under the H1 of all 13 content pages
- [x] 5-2 Front-load key facts: answer + formula + figure inside the first 150 words (asserted)
- [x] 5-3 Semantic tables: all data tables `<table>/<thead>/<tbody>/<th>`; `#density-table` and the
      price index carry `<caption>`
- [x] 5-4 Fan-out: the driveway page answers cubic yards, yards→tons, depth, material and delivery cost
- [x] 5-5 Fact density: vague reference/lead copy replaced with figures, no new sources
- [ ] Deploy + re-crawl: uncommitted and not live (owner approval)
- [ ] AI citation measurement: needs the Phase 6 GSC/analytics window; no AI citation is claimed

## Phase 4 checklist
- [x] 4-1a Embeddable widget live in code (`gravel-calculator-widget.html` + `widget.js`, framable,
      noindex) and distributed on all 7 calculator pages + `embed.html` + `llms.txt`
- [x] 4-1b Reference assets citation-ready: schema, internal links, correct tables, styled
- [x] 4-1c Asset discoverability: homepage `#reference-data` block + footer links
- [x] 4-1e Tables citable: `#density-table`, `#pipe-volume-table`, `#gravel-savings-table` +
      "Cite this" blocks (price index excluded until its provenance is sourced)
- [x] 4-1d Deployed in `edb9943`; live widget 200 + `frame-ancestors *` + renders `0.93/1.31/53`
      (an actual third-party embed still needs a publisher from 4-3/4-4)
- [~] 4-2 Only AlternativeTo / Product Hunt / SaaSHub are eligible; local directories blocked on
      missing business identity (see `seo-research/DIRECTORY-SUBMISSIONS.md`)
- [x] 4-3 100 targets on 69 domains verified in `seo-research/OUTREACH-TARGETS.md`; emails still 0 (owner)
- [x] 4-4 Angles written in `seo-research/DIGITAL-PR-ANGLES.md`: 2 pitchable, 1 hedged, 2 not pitchable/blocked
- [x] 4-5 `seo-research/COMMUNITY-PLAYBOOK.md`: rules sourced + 7 drafted answers; 0 posted (owner)
- [~] 4-6 `seo-research/ENTITY-SIGNALS.md`: JSON + decision list ready; blocked on trading name/
      address/profiles (owner)

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
  `https://www.progravelcalculator.online/sitemap.xml` (now 18 URLs).

## Hard constraints
- Default calculator output must stay `0.93 yd³ / 1.31 short tons / 53 bags` on the homepage default.
- `.html` URLs and existing functionality stay intact.
- Do not invent GA4 IDs, GSC data, prices, reviews, or contact details.
- Do not paste raw Google tags into HTML; analytics must stay consent-gated through `analytics.js`.
- Do not commit, push, or deploy without explicit owner approval.
- The widget stays `noindex` and out of `sitemap.xml`; `frame-ancestors *` applies to the widget path only.
- Reference tables must match `calculator-engine.js`; no invented sources, supplier names or prices.
- Update `memory.md` after every completed task.

## Verified earlier
- Phase 2 Tasks 2-1 through 2-10 treated as verified, including browser check of cost estimator, bag sizes/pallets, share URL, PDF order sheet.
- `npm test` **64 PASS, 0 FAIL** (35 engine + 29 static); `python tests/site-audit.py` PASS on 21 pages.

## Pending
- Phase 4 execution, all owner-side: send AlternativeTo (4-2); work the 69-domain list (4-3); send the
  pitchable angles (4-4); post under the owner's account (4-5); claim profiles then wire
  `sameAs` (4-6). Nothing else can move without a mailbox and a business identity.
- Phase 4 / 4-1e deploy: the citation-surface changes are uncommitted and not live.
- Owner input: price-index provenance, density-chart citations, widget framing allowlist decision.
- Search Console: confirm `sitemap.xml` (18 URLs), request indexing for the 7 cluster URLs, log
  coverage after 7 days.
- Contact-form delivery endpoint/email.
- Phase 2 Task 2-11 cross-browser/responsive-width matrix still open in the plan if it gets picked up again.
- Phase 5 deploy: the 13 content pages, `tailwind.css`, `tests/static-qa.test.js`, `memory.md`,
  `SEO Prompt - 2.md` and `seo-research/PHASE-5-GEO.md` are uncommitted and not live. A browser
  pass was not run because no visual check was requested.

## Local run notes
- Local dev command used earlier: `npm run dev` (python static server on `127.0.0.1:4173`).
- This session's preview server: `python -m http.server 4199 --bind 127.0.0.1` (port 4173 belonged to
  another thread).
- `curl` from this machine returns `000` against most third-party hosts, so verify outreach URLs with
  the fetch tool. Against our own host use `curl --compressed`, and remember `/index.html` 308s to `/`.
- Tailwind config: `tailwind.config.js` with content `['./*.html','./*.js']` and `@tailwindcss/typography` plugin.
- Custom CSS layer: `style.css`; utility layer: `tailwind.css` (do not edit by hand).

## Publish gate
- Phase 4 build is committed as `edb9943 phase4-1` and deployed; the live widget, the 18-URL
  sitemap and the calculator embed sections were verified on the host.
- Uncommitted right now: `gravel-density-chart.html`, `gravel-price-index-2026.html`,
  `french-drain-stone-guide.html`, `sitemap.xml`, `tailwind.css`, `tests/static-qa.test.js`,
  `memory.md`, `SEO Prompt - 2.md`, `seo-research/PHASE-4-AUTHORITY.md` (modified), plus new
  `seo-research/OUTREACH-TARGETS.md`, `DIRECTORY-SUBMISSIONS.md`, `DIGITAL-PR-ANGLES.md`,
  `COMMUNITY-PLAYBOOK.md`, `ENTITY-SIGNALS.md`. The three page files, `sitemap.xml` and
  `tailwind.css` are **production** changes and are not live yet; the `seo-research/` files and
  `SEO Prompt - 2.md` are not production assets.
  Temporary build scripts (`_tmp_rows*.py`, `_tmp_build.py`, `_tmp_phase.py`, `_tmp_rows.csv`) were
  deleted after use — do not reintroduce them.
- Public client IDs (`GTM-…`, `G-…`, Formspree/Web3Forms endpoints/access keys) are visible to every visitor and are safe to commit.
- Private API secrets do **not** belong in client-side config; use a serverless function and environment variables instead.
- Phase 5 (2026-11-11) is uncommitted and not live: the 13 content pages, `tests/static-qa.test.js`,
  `tailwind.css`, `memory.md`, `SEO Prompt - 2.md` and new `seo-research/PHASE-5-GEO.md`.
  `git status` also shows pre-existing uncommitted edits from earlier sessions (`about.html`,
  `contact.html`, `subpage-calculator.js`); those were not part of this pass and were left untouched.
  No commit, push or deploy was performed.
- Future commit/push/deploy actions still require explicit owner approval.
