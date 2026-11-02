# SEO 90-Day Roadmap — Pro Gravel Calculator

> **Research date:** 2026-11-01
> **Scope:** Phase 10 (Google Search Console strategy) + Phase 11 (90-day implementation plan) of the brief.
> **Starting assumption:** no code or content change has been approved yet. This roadmap is contingent on explicit approval before implementation.
> **Indicative calendar:** if work starts on Monday **2026-11-02**, Day 15 is **2026-11-16**, Day 30 is **2026-12-01**, Day 45 is **2026-12-16**, Day 60 is **2026-12-31**, Day 75 is **2027-01-15**, and Day 90 is **2027-01-30**.
> **Evidence labels:** `[Measured]` = observed in the local project or live site. `[Estimate]` = analyst judgment, including time and effort. `[Unavailable]` = not measured and not claimed.
> **No fabricated data:** no Search Console impressions, clicks, CTR, positions, traffic or revenue numbers are stated. The site has no Search Console verification today, so the first job is to create the baseline.

---

## 1. How to use this roadmap

### 1.1 Operating rules

1. **Trust before traffic.** A broken contact form and an inaccurate privacy policy undermine every ranking and monetisation effort.
2. **Product before pages.** Seven calculator pages built on seven copies of the current calculator will diverge and become unmaintainable. Build the shared calculator module first.
3. **One intent per page.** Enforce the cannibalisation map in `KEYWORD-RESEARCH.md` §10.
4. **Measure before optimising.** Search Console and analytics must be live before judging titles, content or rankings.
5. **No shortcuts.** No doorway pages, no purchased links, no mass-generated articles, no fake prices or densities.
6. **Phase gates are quality gates.** If a P0 task slips, carry it forward and delay dependent work. Do not declare a phase complete because the calendar moved.

### 1.2 Priority definitions

| Priority | Meaning | Consequence if skipped |
|---|---|---|
| **P0** | Must complete; the plan or a gate depends on it. | Trust, measurement or indexation breaks. |
| **P1** | High leverage; should complete this quarter. | Slower growth, weaker differentiation. |
| **P2** | Stretch or polish; can slip without breaking the plan. | Missed upside, not a failure. |

### 1.3 Difficulty and time

| Difficulty | Typical focused time | Examples |
|---|---|---|
| **Low** | Under 2 hours | Title rewrite, schema fix, favicon, redirect rule. |
| **Medium** | 2–6 hours | Accessibility pass, privacy rewrite, calculator control, page outline. |
| **High** | More than 6 hours, or external dependency | Shared calculator module, new landing page, linkable asset, outreach campaign. |

Time estimates are **focused work hours**, not elapsed days. `[Estimate]` They assume an operator who knows the codebase. Add 30–50% if working with a new developer or writer.

### 1.4 Capacity assumption

The plan assumes **20–25 focused hours per week** (roughly 260–325 hours over 90 days). Estimated delivery is **180–240 hours**, leaving a 10–30% buffer for review, delays and rework. `[Estimate]`

If capacity is **10–12 hours per week**, use the minimum path in §7.2: trust fixes, calculator core, three landing pages, one reference asset and a small outreach push. Defer the remaining pages and guides to the next quarter.

---

## 2. Starting position

### 2.1 What is confirmed

| Item | Status | Source |
|---|---|---|
| Site is live on Vercel | Yes | `WEBSITE-AUDIT.md` |
| Indexable pages | 7 (plus 1 noindex thank-you page) | Sitemap and live crawl |
| Calculator | Working, but lacks cost, waste, compaction, metric outputs and shareable state | `script.js` |
| Contact form | **Broken** — no action, no method, no handler | `contact.html` |
| Privacy policy | **Inaccurate** — claims AdSense/Analytics that are not installed | `privacy.html` |
| About page | **Contradicts** the calculator's density and makes unverified expert claims | `about.html` |
| Best-gravel-types | **PKR pricing** and Pakistan references in a US-oriented guide | `best-gravel-types.html` |
| Search Console | **Not verified** | No verification tag; no DNS record confirmed |
| Analytics | **Not installed** | No GA4/GTM/alternative found |
| AdSense | `ads.txt` present; **no ad code** | `ads.txt`, all HTML |
| Lighthouse mobile | Performance 87, Accessibility 75, SEO 100, Best Practices 96 | Local lab run, 2026-11-01 |
| Favicon | 404 | Lighthouse console |
| Custom 404 | Missing | Live request |

### 2.2 What is unknown until Search Console is connected

- Which queries already receive impressions.
- Which pages already receive impressions.
- Current CTR and average position.
- Indexing status and any coverage errors.
- Field Core Web Vitals.
- Referring domains and top linked pages.
- Whether any manual action or security issue exists.

**Do not guess these numbers.** Section 3 explains how to capture them.

### 2.3 The strategic situation in one paragraph

The site has a useful calculator and a clean technical foundation, but it is a single-page product in a niche where competitors have 6–20 intent-specific pages. The fastest path is not to publish 50 articles. It is to fix trust, add the purchasing features users expect, ship a small cluster of genuinely different calculators, and use Search Console to improve the pages that already show demand. `[Estimate]`

---

# 3. Phase 10 — Google Search Console strategy

## 3.1 Why Search Console comes first

Search Console is the only free, first-party source for:

- the queries Google actually shows the site for,
- the pages that receive impressions,
- CTR and average position,
- indexing status and crawl problems,
- field Core Web Vitals,
- links to the site,
- manual actions and security issues.

Without it, every title rewrite and content decision is a guess. The site currently has **no verification**, so this is the highest-leverage measurement task in the plan.

## 3.2 Property setup

### Recommended: Domain property

1. Open Search Console → **Add property** → **Domain**.
2. Enter `progravelcalculator.online` (no `www`, no protocol).
3. Copy the DNS TXT record.
4. Add it at the domain's DNS provider (Vercel DNS or the registrar).
5. Verify. A Domain property covers `http`, `https`, `www` and non-`www`, so it captures the current 307 apex redirect and any future subdomain.
6. Submit `https://www.progravelcalculator.online/sitemap.xml`.
7. Add a second **URL-prefix** property for `https://www.progravelcalculator.online/` if you want a clean view of the canonical host only.

**If DNS access is unavailable:** use the URL-prefix property and verify with an HTML meta tag or the AdSense/Google Analytics connection. Do not use the HTML file method if DNS is available; DNS is more durable.

### Users and permissions

- Owner: the site owner.
- Full user: the developer/SEO operator.
- Restricted user: writers or reviewers who need read-only access.

Do not share the owner account. Use delegated users.

### Sitemap

- Submit the sitemap in **Indexing → Sitemaps**.
- Confirm status is **Success** and that the discovered URL count matches the sitemap (7 today; more as pages ship).
- Keep `lastmod` accurate. Do not change it for cosmetic edits.
- Resubmit only after adding or materially changing URLs.

## 3.3 Baseline capture (Week 1)

Export and save these reports before making changes. Name files with the date, e.g. `gsc-queries-2026-11-02.csv`.

| Report | Path | Date range | Why |
|---|---|---|---|
| Queries | Performance → Search results → Queries | Last 90 days and last 28 days | Establish query demand. |
| Pages | Performance → Search results → Pages | Last 90 days and last 28 days | Establish page demand. |
| Countries | Performance → Countries | Last 90 days | Confirm US share; identify UK/CA/AU. |
| Devices | Performance → Devices | Last 90 days | Mobile vs desktop behaviour. |
| Search appearance | Performance → Search appearance | Last 90 days | Rich-result eligibility. |
| Indexing | Pages report | Current | Coverage baseline. |
| Sitemaps | Sitemaps report | Current | Submitted vs indexed. |
| Core Web Vitals | Experience → Core Web Vitals | Current | Mobile/desktop baseline. |
| Links | Links report | Current | Referring domains and top linked pages. |
| Manual actions | Security & Manual actions | Current | Confirm none. |

**If the property is new**, most reports will be empty or sparse for the first days. That is normal. Record "no data yet" rather than inventing a baseline.

### Baseline sheet columns

```
Date | Period | Impressions | Clicks | CTR | Avg position | Indexed pages | Submitted pages
Top 10 queries | Top 10 pages | Mobile CWV | Desktop CWV | Referring domains | Notes
```

Record the date range and filters used. A number without a date range is not a baseline.

## 3.4 Weekly routine (30 minutes)

Do this every Monday. Keep a five-bullet log.

1. **Performance snapshot** — last 7 days vs previous 7 days. Ignore normal daily noise; look for step changes.
2. **Queries** — new queries, rising queries, queries with high impressions and low CTR.
3. **Pages** — new pages receiving impressions; pages losing clicks.
4. **Indexing** — any new "not indexed" reasons or sitemap errors.
5. **Core Web Vitals** — any new URLs moving to "needs improvement".
6. **Manual actions/security** — quick check; full check monthly.

**Rule:** do not rewrite a title because of one day of data. Wait for at least 14–28 days of stable impressions.

## 3.5 Monthly deep dive (90 minutes)

Use a **28-day window vs the previous 28 days**, and a **90-day view** for context.

### A. Queries receiving impressions

- Sort by impressions, not clicks.
- Separate **branded** queries (containing "progravelcalculator" or "pro gravel calculator") from non-branded.
- Identify queries where the site appears but the page is not a perfect match.
- Look for question queries ("how much…", "how many…") that belong in an FAQ or a dedicated page.

**Action:** map each meaningful query to one page. If no page owns it, add it to the content backlog. If two pages own it, fix cannibalisation.

### B. Pages receiving impressions

- Sort by impressions and by clicks.
- Identify pages with impressions but very low CTR.
- Identify pages with clicks but declining impressions (content decay).
- Identify pages with zero impressions after 28 days (relevance or indexation issue).

**Action:** prioritise pages with **impressions but weak CTR** — they already have demand and need a better promise, not a new page.

### C. Keywords with low CTR

Filter to positions **1–20** with meaningful impressions. A low CTR at position 1–5 usually means:

- the title does not match the query,
- the meta description is weak or truncated,
- a SERP feature answers the query without a click,
- the page title looks like an ad or a generic tool.

**Action:** rewrite the title and meta description, then wait 28 days. Change one variable at a time where possible.

### D. Keywords ranking around positions 10–50

This is the **striking-distance** list. Prioritise positions **11–20** first: they are closest to page one and usually need relevance and internal links, not a brand-new page.

For each query:

- Is the ranking page the right page?
- Does it answer the query in the first screen?
- Does it have a section, table or FAQ for the specific phrasing?
- Do two or three internal links point to it with descriptive anchors?
- Is the title aligned with the query?

**Action:** improve the existing page before creating a new one.

### E. Pages that need better titles

Signals:

- high impressions, low CTR,
- title longer than ~60 characters or truncated in the SERP,
- title missing the primary modifier (driveway, tons, cost, bags),
- title duplicated across pages,
- title written for the brand rather than the query.

**Action:** rewrite, document the change date, and compare 28 days later.

### F. Pages needing more relevant content

Signals:

- page ranks for adjacent queries but has no section for them,
- high impressions, position 15–40, low CTR,
- users land and bounce (analytics),
- FAQ questions in the SERP are not answered on the page,
- the page covers a topic at a shallower level than the top results.

**Action:** add the missing H2, table, worked example or FAQ. Do not pad with generic text.

### G. Indexing issues

Use **Indexing → Pages** and **URL Inspection**.

| Status | Meaning | Action |
|---|---|---|
| **Discovered – currently not indexed** | Google knows the URL but has not crawled it. | Add internal links, confirm sitemap inclusion, wait. |
| **Crawled – currently not indexed** | Google crawled but chose not to index. | Improve uniqueness, depth and trust; add internal links; check for duplication. |
| **Duplicate, Google chose different canonical** | Canonical signals conflict. | Fix canonical tags and internal links; confirm the preferred URL. |
| **Alternate page with proper canonical tag** | A duplicate is correctly canonicalised. | Usually fine; verify the canonical is intentional. |
| **Excluded by noindex** | A noindex tag is present. | Confirm it is intentional (thank-you page) or remove it. |
| **Soft 404** | Page looks empty or error-like. | Add real content or return a proper 404. |
| **Not found (404)** | Missing page. | Restore, redirect, or remove internal links. |
| **Blocked by robots.txt** | Crawl blocked. | Fix only if the page should be indexed. |
| **Redirect error** | Redirect chain or loop. | Flatten to a single 301/308. |

**URL Inspection workflow for a new page:**

1. Enter the canonical URL.
2. Check **URL is on Google** / **URL is not on Google**.
3. Test the live URL.
4. Inspect the crawled page: canonical, robots meta, page fetch.
5. Confirm the sitemap includes the URL.
6. Confirm at least two internal links point to it.
7. Request indexing **once**.
8. Recheck after 7 and 28 days.

Do not request indexing repeatedly. It does not speed up crawling beyond the first request and can waste time.

### H. Core Web Vitals

- Check mobile and desktop separately.
- Fix URLs in "Poor" first, then "Needs improvement".
- Correlate with deployments and ad changes.
- Use lab Lighthouse for diagnosis; use field data for prioritisation.

### I. Links

- Review new and lost referring domains monthly.
- Identify unlinked brand mentions and reclaim them.
- Do not disavow links unless there is a clear manual action or a toxic pattern; Google ignores most low-quality links.
- Remember that Search Console's link data is sampled and incomplete.

## 3.6 Decision rules

Use these rules to turn data into action. They prevent random rewrites.

| Pattern in Search Console | Likely diagnosis | Action | Success measure |
|---|---|---|---|
| High impressions, position 11–20, CTR below 2% | Title/snippet does not match intent, or the page is not specific enough | Rewrite title/meta; add the exact query as an H2; add a table or example | Position and CTR after 28 days |
| High impressions, position 1–5, low CTR | SERP feature, weak title, or brand mismatch | Test a clearer title; add schema; inspect the SERP manually | CTR after 28 days |
| Same query ranks on two or more pages | Cannibalisation | Choose one owner; merge content; internally link with one anchor; canonical if appropriate | One page ranking; other page's impressions fall |
| Page indexed, zero impressions after 28 days | No demand or poor relevance | Check query data; improve or merge; do not create more pages on the same topic | Impressions after 28 days |
| Page impressions rising, clicks flat | Title/snippet or intent mismatch | Rewrite title/meta; strengthen the intro | CTR |
| Page clicks falling, impressions stable | Content decay or stronger competitors | Refresh facts, dates, examples and internal links | Clicks after 28 days |
| "Crawled – currently not indexed" | Thin, duplicate or low-trust page | Add unique value, sources, images, internal links | Indexed status |
| "Discovered – currently not indexed" | Weak crawl signals | Add internal links and sitemap entry; wait | Indexed status |
| "Duplicate, Google chose different canonical" | Conflicting canonical signals | Fix canonical, internal links and sitemap | Selected canonical |
| CWV "needs improvement" | LCP, CLS or INP problem | Fix the specific element; re-test | CWV status |
| Sudden impressions drop across many pages | Algorithm update, seasonality or technical issue | Check manual actions, coverage, robots, deployments; compare to seasonal patterns | Recovery plan |
| Query intent mismatch (irrelevant query) | Page targets the wrong intent | Clarify the page or build a better-matched page | Query relevance |

## 3.7 CSV exports to provide for analysis

If you want the actual data analysed rather than a generic strategy, export:

1. **Performance → Search results → Queries** — last 90 days, all rows, with columns: Query, Clicks, Impressions, CTR, Position.
2. **Performance → Search results → Pages** — last 90 days, all rows.
3. **Performance → Search results → Queries** — filtered to United States, last 28 days.
4. **Performance → Search results → Queries** — filtered to Mobile, last 28 days.
5. **Indexing → Pages** — export or screenshot of the status table.
6. **Sitemaps** — status and discovered URLs.
7. **Experience → Core Web Vitals** — mobile and desktop.
8. **Links** — top linking sites and top linked pages.

Name files `gsc-<report>-<yyyy-mm-dd>.csv`. Include the date range and filters in the filename or a README.

**Privacy:** do not share your Google account. CSV exports are sufficient. If the data contains any personal information (it normally does not), redact it before sharing.

## 3.8 Search Console limitations

- Query data is **sampled and aggregated**; small sites may see "anonymised queries".
- **Position is an average**, not a fixed rank.
- Data has a **2–3 day lag**; final numbers can change.
- Search Console retains 16 months of performance data.
- Clicks are not sessions; analytics will show different numbers.
- Not every query is shown.
- Branded queries inflate CTR; separate them.
- Seasonality matters. US landscaping demand often softens in winter, so November–January traffic may be quieter than spring. `[Estimate]` Judge the period by impressions, indexation and content coverage, not absolute traffic.
- Search Console does not provide keyword volume or competitor data.

## 3.9 Connecting Search Console to analytics

Search Console tells you what Google showed and what users clicked. Analytics tells you what happened next.

Define these events before launch:

| Event | Trigger | Why |
|---|---|---|
| `calculator_complete` | A valid result is rendered | Core task completion. |
| `calculator_input_change` | Shape, dimension, material or depth changes | Engagement quality. |
| `waste_change` | Waste slider changes | Feature adoption. |
| `compaction_change` | Compaction slider changes | Feature adoption. |
| `cost_toggle` | Cost panel opened or price entered | Commercial intent. |
| `print` | Print action | Order-sheet usage. |
| `pdf_download` | PDF generated | Order-sheet usage. |
| `share` | Share action | Distribution loop. |
| `quote_click` | Quote CTA clicked | Lead intent. |
| `bag_vs_bulk_view` | Comparison viewed | Purchase-format intent. |

Join by landing page:

```
GSC query → landing page → sessions → calculator_complete → quote_click
```

Do not expect a perfect join. Use it to compare pages, not to reconcile totals.

## 3.10 Weekly log template

```
Week: ____  Dates: ____ to ____
GSC (28-day window):
  Impressions: ____  Clicks: ____  CTR: ____  Avg position: ____
  Indexed pages: ____ / submitted: ____
Top 3 queries:
  1. ____
  2. ____
  3. ____
Top 3 pages:
  1. ____
  2. ____
  3. ____
Actions taken this week:
  - ____
  - ____
Observed effects (with dates):
  - ____
Blockers:
  - ____
Next week's one priority:
  - ____
```

Keep this in a single sheet. After 90 days it becomes the evidence base for the next quarter.

---

# 4. Phase 11 — 90-day implementation plan

## 4.1 Phase overview

| Phase | Days | Focus | Gate |
|---|---|---|---|
| **1** | 1–15 | Technical audit + existing page optimisation + measurement | Trust and measurement foundation is live. |
| **2** | 16–30 | Product differentiation + calculator improvements | Calculator v2 ships without regressions. |
| **3** | 31–45 | High-priority landing pages | 3–4 intent pages live and submitted. |
| **4** | 46–60 | Remaining calculator pages + educational content + internal linking | 7-page cluster and density asset are live. |
| **5** | 61–75 | Backlinks, outreach and authority building | 30+ quality outreach contacts and 2+ assets. |
| **6** | 76–90 | Performance analysis + SEO improvements + AdSense decision | 90-day review and next-quarter plan. |

**Why pages start in Phase 3, not Phase 4:** new pages need 4–8 weeks to be crawled, indexed and evaluated. Shipping them late in the 90 days gives no time to learn. `[Estimate]`

## 4.2 Days 1–15 — Technical audit and existing page optimisation

**Objective:** remove trust blockers, fix technical defects, install measurement, and make the existing pages worth ranking.

| ID | Task | Priority | Expected benefit | Difficulty | Est. time | Dependencies | How to measure success |
|---|---|---|---|---|---|---|---|
| T01 | Verify Search Console (Domain property), submit sitemap, add users | P0 | Measurement; enables every later decision | Low | 1–2h | DNS access | Property verified; sitemap "Success"; baseline exported |
| T02 | Install analytics with consent-ready configuration and the event list in §3.9 | P0 | Measures calculator completion, print, share, quote | Medium | 3–4h | Analytics account | Realtime hit; events visible in debug view |
| T03 | Fix contact form: endpoint, validation, spam protection, success/error states, `thankyou.html`, fallback email | P0 | Restores the primary conversion path; removes a trust blocker | Medium | 2–4h | Form endpoint or serverless function | Test submission received; error state preserves input; fallback email visible |
| T04 | Remove duplicate FAQ schema; align one `FAQPage` block with visible questions; fix H1 count, hidden `sr-only` H2s, footer heading order | P0 | Removes structured-data conflict; improves accessibility and heading clarity | Low | 1–2h | None | Rich Results Test passes; one H1 per page; no hidden keyword H2s |
| T05 | Replace PKR/Pakistan content in `best-gravel-types.html` with a USD table labelled "US average, 2026" and a source/date | P0 | Removes the most visible content-quality defect | Medium | 2–3h | Source research | No PKR/Pakistan references; every cost figure dated/sourced |
| T06 | Fix About density contradiction; remove or evidence "built with civil engineers"; add a methodology summary and sources | P0 | Trust and E-E-A-T; removes a direct contradiction | Medium | 2–3h | Density source decision | One density value used consistently; claims evidenced or removed |
| T07 | Rewrite privacy policy to match current reality; add ads/consent sections; update terms with IP, changes, governing law, contact | P0 | AdSense eligibility and legal accuracy | Medium | 2–4h | Legal review recommended | No false vendor claims; policy links from every page; date updated |
| T08 | Shorten the three long titles/metas; tighten homepage H1; ensure one H1 | P0 | Better SERP CTR; clearer relevance | Low | 1–2h | None | Titles ≤60 chars; metas ≤155; one H1 |
| T09 | Accessibility pass: labels, `for`/`id`, contrast, `aria-live`, SVG title/desc, keyboard order | P1 | UX, accessibility score, AdSense quality signal | Medium | 3–5h | None | Lighthouse Accessibility ≥90 (target ≥95); manual keyboard test |
| T10 | Add favicon set, custom `404.html`, correct image dimensions, 1200×630 OG image | P1 | Removes console error; fixes CLS risk; better shares | Medium | 2–3h | Brand asset | No favicon 404; 404 page returns 404 and links home; image dimensions match |
| T11 | Internal linking: add all pages to footer; fix "DriveAway" typo; add visible breadcrumbs matching schema | P1 | Crawl paths, orientation, internal equity | Medium | 2–3h | None | Every page reachable within one click of home; breadcrumbs visible |
| T12 | Redirect and header hygiene: apex 307→308, `/index.html`→`/`, cache headers for static assets, security headers | P1 | Consolidates signals; repeat-visit performance; trust | Low | 1–2h | Vercel config approval | Permanent redirect; one canonical path; assets cached; headers present |
| T13 | Compile Tailwind to static CSS, remove CDN, re-test Lighthouse | P1 | Faster FCP/TBT; removes console warning; better mobile UX | High | 3–5h | Build tooling approval | Performance ≥95; FCP <1.8s; no Tailwind CDN warning |
| T14 | AdSense readiness checkpoint: verify Gates 1–2 in `ADSENSE-READINESS.md` | P0 | Prevents a premature application | Low | 1h | T03–T07 | Gate 1 green; Gate 2 gaps documented |

### Phase 1 gate

Do not start Phase 2 until:

- [ ] Search Console is verified and the sitemap is submitted.
- [ ] Analytics events are firing.
- [ ] The contact form submits successfully.
- [ ] The privacy policy matches reality.
- [ ] The PKR content is gone.
- [ ] The FAQ schema is single and valid.
- [ ] Titles are within SERP limits.
- [ ] Accessibility is ≥90.
- [ ] All indexable pages return 200 and have self-referencing canonicals.
- [ ] Lighthouse shows no console errors.
- [ ] The AdSense gate review is documented.

**If a task slips:** carry it forward. Do not start the calculator refactor on top of a broken trust layer.

## 4.3 Days 16–30 — Product differentiation and calculator improvements

**Objective:** turn the calculator from a volume estimator into an order planner, using a shared module so every future page behaves consistently.

| ID | Task | Priority | Expected benefit | Difficulty | Est. time | Dependencies | How to measure success |
|---|---|---|---|---|---|---|---|
| T15 | Extract shared calculator module: engine, materials, presets, URL state, print, cost, bags | P0 | Prevents seven divergent calculators; enables fast page launches | High | 8–12h | Phase 1 gate | Homepage output unchanged for default inputs; regression tests pass |
| T16 | Add waste allowance (0–25%, default 0%, visible recommendation) | P0 | Correct ordering; matches competitor table stakes | Low | 3–4h | T15 | Slider updates results; 0% reproduces current output; print shows value |
| T17 | Add separate compaction allowance (0–20%, preset by project) | P0 | Distinguishes compaction from waste; improves accuracy | Low | 3–4h | T15 | Independent control; preset defaults; print shows value |
| T18 | Add metric outputs (m³, metric tonnes, kg, 25 kg bags) | P0 | Correct experience for metric users; international relevance | Medium | 4–6h | T15 | Toggling units converts inputs and outputs; <1% rounding drift |
| T19 | Serialize calculation state into the share URL and restore on load | P0 | Fixes a broken promise; creates a sharing loop | Medium | 3–4h | T15 | Recipient sees the same inputs/results; URL round-trips |
| T20 | Add cost estimator: price per ton/yd³/bag, delivery, tax, currency symbol, cost per unit | P0 | Captures commercial intent; supports cost page | High | 6–8h | T15 | Basis switch recalculates; blank price hides block; print/share include cost |
| T21 | Add bag-size selector, pallet count, bulk-vs-bag comparison | P0 | Serves the underserved bag cluster; supports bag page | Medium | 4–6h | T15 | Bag count changes with size; pallets round up; comparison states assumptions |
| T22 | Add assumption warnings (shallow driveway, unusual depth, no pipe deduction, density outside range) | P1 | Demonstrates expertise; reduces bad orders | Low | 2–3h | T16–T18 | Warnings trigger only for the intended conditions |
| T23 | Upgrade print/PDF to a supplier-ready order sheet (dimensions, density, waste, compaction, bags, cost, assumptions, date, URL) | P1 | Strong differentiation; link/share loop | Medium | 4–6h | T16–T21 | One-page PDF contains all fields; no clipped content; mobile print works |
| T24 | Regression and cross-browser QA: math, print, PDF, share, quote hand-off, mobile | P0 | Prevents shipping a regression to a working tool | Medium | 2–4h | T15–T23 | Test matrix passes; no console errors; quote prefill still works |
| T25 | Update homepage methodology/density section and link it from the calculator | P1 | Trust; supports density/size content | Low | 2–3h | T06 | Visible density table with source/range; link resolves |
| T26 | Prepare one page template and content briefs for the 7 calculator pages | P1 | Speeds Phase 3–4 and keeps structure consistent | Medium | 4–6h | T15 | Template checklists complete; each page has a distinct tool spec |

### Phase 2 gate

- [ ] Calculator v2 is live with waste, compaction, metric outputs, share, cost and bags.
- [ ] Default inputs reproduce the old output when allowances are 0%.
- [ ] Print/PDF/share/quote hand-off all work.
- [ ] Mobile layout remains usable; no new CLS.
- [ ] Analytics events fire for the new controls.
- [ ] Page template and briefs are ready.

**Scope discipline:** do not add triangle/ring/multi-section shapes, custom density, accounts or AI features in this phase. They are P2 or rejected in `PRODUCT-GROWTH-STRATEGY.md`.

## 4.4 Days 31–45 — High-priority landing pages

**Objective:** capture the highest-value intents with pages that are materially different from the homepage.

| ID | Task | Priority | Expected benefit | Difficulty | Est. time | Dependencies | How to measure success |
|---|---|---|---|---|---|---|---|
| T27 | Publish `/driveway-gravel-calculator/` — driveway preset, base/surface layers if ready, depth table, worked 100 ft/200 ft/20×20 examples, FAQ, schema | P0 | Highest commercial intent; supports cost and bags cluster | High | 8–12h | T15–T26 | Page indexed; calculator works; Rich Results pass; internal links live |
| T28 | Publish `/gravel-calculator-tons/` — volume↔weight, reverse coverage mode, tons/yard tables, 4-ton example, FAQ | P0 | Captures the tons/conversion cluster | High | 8–10h | T15–T21 | Page indexed; inverse math matches main calculator; tables visible |
| T29 | Publish `/gravel-cost-calculator/` — cost inputs, delivery, tax, bulk vs bag, quote checklist, FAQ | P0 | Commercial intent; supports AdSense value | High | 8–10h | T20, T21 | Page indexed; cost math correct; no fabricated default prices |
| T30 | Publish `/pea-gravel-calculator/` — pea preset, depth by project, playground safety caveat, bags/cost, FAQ | P1 | Material-specific intent; lower competition | High | 6–8h | T15–T21 | Page indexed; preset active; caveat visible |
| T31 | Add internal links, breadcrumbs, sitemap entries and schema for every new page | P0 | Crawlability and topical relationships | Low | 2–3h | T27–T30 | 1 up/2 sideways/1 down per page; sitemap updated; schema valid |
| T32 | Request indexing once per new page; check coverage after 7 days | P0 | Faster discovery | Low | 1h | T31 | URL inspected; indexing requested; status logged |
| T33 | 30-day GSC checkpoint: identify pages with impressions, low CTR and striking-distance queries | P1 | Early learning; informs Phase 4 | Low | 2–3h | T01, T27–T30 | Report saved; top 5 opportunities listed |
| T34 | Cannibalisation check: one query → one page; fix overlaps | P0 | Protects the cluster from self-competition | Medium | 2–3h | T33 | No query has two intended owners; fixes documented |

### Phase 3 gate

- [ ] At least 3 new calculator pages are live (driveway, tons, cost).
- [ ] Pea gravel is live or explicitly scheduled for Phase 4.
- [ ] Every new page has a distinct tool/preset, not just a new H1.
- [ ] Schema validates; sitemap includes canonical URLs.
- [ ] Internal links are live in both directions.
- [ ] Indexing has been requested; status logged.
- [ ] No page targets another page's primary keyword.
- [ ] AdSense Gates 1–2 re-checked. If green, the application can be prepared; do not submit until at least five substantive pages are live.

**If capacity is tight:** ship driveway, tons and cost first. Move pea gravel to Phase 4. Do not ship a thin fourth page just to hit a number.

## 4.5 Days 46–60 — Remaining calculators, educational content and internal linking

**Objective:** complete the calculator cluster, add the reference asset that supports every calculator, and make the internal link graph deliberate.

**If T30 (pea gravel) slipped from Phase 3, finish it first.** It is part of the seven-page cluster and should not be left as an orphan task.

**Educational content in this phase:** the density chart and the refreshed guides are the learning assets. The delivery-cost and how-to-build guides are scheduled in Phase 5 because they double as outreach assets; publishing them earlier would leave them with no distribution plan.

| ID | Task | Priority | Expected benefit | Difficulty | Est. time | Dependencies | How to measure success |
|---|---|---|---|---|---|---|---|
| T35 | Publish `/gravel-bag-calculator/` — bag sizes, pallets, bags per yard/ton, coverage per bag, bulk comparison | P0 | Underserved bag cluster; supports cost | High | 6–8h | T21 | Page indexed; bag math correct; comparison visible |
| T36 | Publish `/crushed-stone-calculator/` — #57/#411/#304/crusher run presets, size table, base guidance | P1 | Material + construction intent | High | 8–10h | T15, T20 | Page indexed; presets change density/depth; schema valid |
| T37 | Publish `/french-drain-gravel-calculator/` — trench geometry, pipe deduction, fabric estimate, stone spec, slope caveat | P1 | Distinct geometry; lower competition | High | 8–10h | T15 | Page indexed; pipe deduction works; disclaimer visible |
| T38 | Publish `/gravel-density-chart.html` — lb/ft³, kg/m³, t/yd³, ranges, sources, bulk vs particle density | P1 | Linkable reference; supports every calculator | Medium | 6–8h | T06, T25 | Page indexed; every value sourced; linked from calculators |
| T39 | Internal link audit: 1 up / 2 sideways / 1 down; fix orphans; update footer and contextual links | P0 | Crawl equity and topical authority | Medium | 3–4h | T27–T38 | No orphans; each page meets the link rule; anchors descriptive |
| T40 | Refresh existing guides: visible dates, sources, named reviewer, methodology note, currency consistency | P0 | Trust and E-E-A-T; supports AdSense gate | Medium | 2–3h | T05, T07 | Dates/sources visible; no mixed currency; reviewer named or claims removed |
| T41 | Validate all schema; add FAQ schema only where visible FAQs exist; add `Article` image/author/dateModified | P1 | Rich-result eligibility; trust | Medium | 2–3h | T27–T38 | Rich Results Test passes on every page |
| T42 | 60-day GSC review: indexed pages, impressions by cluster, striking distance, CTR outliers | P0 | Data-driven Phase 5–6 priorities | Medium | 3–4h | T01 | Report saved; top 10 actions ranked |
| T43 | Update sitemap, request indexing for new pages, check coverage | P0 | Discovery | Low | 1h | T35–T38 | Sitemap success; all new URLs inspected |

### Phase 4 gate

- [ ] All 7 calculator pages are live, or a documented slip plan exists.
- [ ] The density chart is live and linked from every calculator.
- [ ] Internal link audit is complete; no orphans.
- [ ] Existing guides have visible dates, sources and a named reviewer or no expert claim.
- [ ] Schema validates on every indexable page.
- [ ] 60-day GSC review is complete.
- [ ] No cannibalisation among the cluster.
- [ ] AdSense application submitted if Gates 1–4 pass; otherwise a dated reason to wait is recorded.

**Reality check:** if only 5 of 7 pages are live by Day 60, that is acceptable **if** the missing pages are scheduled and the live pages are genuinely good. Do not publish thin pages to hit seven.

## 4.6 Days 61–75 — Backlinks, outreach and authority building

**Objective:** earn links by being useful, not by buying them.

| ID | Task | Priority | Expected benefit | Difficulty | Est. time | Dependencies | How to measure success |
|---|---|---|---|---|---|---|---|
| T44 | Publish `/gravel-size-chart.html` with original photos/illustrations and a US/metric size table | P1 | Linkable visual asset; supports crushed stone/driveway | High | 8–10h | Original images | Page live; images original; table complete; linked from cluster |
| T45 | Publish `/gravel-delivery-costs.html` — fee structures, quote checklist, no invented local averages | P1 | Commercial investigation; supports cost page | Medium | 6–8h | T29 | Page live; checklist useful; sources dated |
| T46 | Publish `/how-to-build-a-gravel-driveway.html` — layer-by-layer guide with calculator hand-offs | P1 | Topical authority; supports driveway page | High | 8–10h | T27, T36 | Page live; disclaimer; internal links |
| T47 | Build a 50-prospect outreach list: landscaping blogs, DIY/construction resources, supplier resource pages, trade associations, extension services | P1 | Qualified outreach pipeline | Medium | 3–4h | Assets live | 50 rows with URL, contact, reason, status |
| T48 | Send 20–30 personalised outreach emails offering the density chart, size chart or calculator embed | P1 | Earned links and referrals | Medium | 4–6h | T47 | 20+ sent; responses logged; no spam |
| T49 | Broken-link building: find 20 dead gravel/aggregate calculator links and offer the relevant page | P1 | Relevant links from established pages | Medium | 3–4h | T47 | 20 prospects; 20 emails; responses logged |
| T50 | Reclaim unlinked mentions and improve supplier/resource-page listings | P2 | Low-effort links | Low | 2–3h | T47 | Mentions identified; requests sent |
| T51 | Track links and referrals in GSC and analytics; log outcomes | P1 | Learn what works | Low | 1h | T48–T50 | Weekly link log; referring domains recorded |

### Phase 5 gate

- [ ] At least two linkable assets are live (density chart + size chart).
- [ ] 30+ personalised outreach contacts have been sent.
- [ ] No paid links, PBNs, link exchanges at scale or comment spam.
- [ ] Every outreach message is specific and relevant.
- [ ] Link/referral outcomes are logged.
- [ ] Content published in this phase has dates, sources and internal links.

**Outreach reality:** response rates are low. Measure **activity and relevance**, not just links. Two or three genuine links from relevant sites are worth more than 100 directory listings. `[Estimate]`

## 4.7 Days 76–90 — Performance analysis and SEO improvements

**Objective:** use the first 90 days of data to improve what is working and stop what is not.

| ID | Task | Priority | Expected benefit | Difficulty | Est. time | Dependencies | How to measure success |
|---|---|---|---|---|---|---|---|
| T52 | 90-day GSC analysis: 28-day vs previous 28-day; 90-day trend; branded vs non-branded; mobile vs desktop; country split | P0 | Evidence for the next quarter | Medium | 3–4h | T01 | Report saved; top 10 insights written |
| T53 | CTR optimisation: rewrite titles/metas for pages with impressions and low CTR; change one variable at a time | P0 | More clicks from existing impressions | Medium | 3–4h | T52 | Changes logged; 28-day follow-up scheduled |
| T54 | Striking-distance upgrades: add sections/tables/FAQs/internal links for positions 11–20 | P0 | Moves pages toward page one | High | 6–8h | T52 | Targeted pages improved; positions tracked |
| T55 | Cannibalisation/merge/prune: consolidate overlapping pages; noindex or redirect thin pages | P1 | Stronger primary pages | Medium | 3–4h | T52 | One owner per query; no orphaned content |
| T56 | Re-test CWV, Lighthouse, mobile usability and accessibility | P1 | Protects rankings and UX | Medium | 2–3h | T13, ads if live | Performance ≥95; Accessibility ≥95; CLS <0.1 |
| T57 | Analytics funnel review: calculator completion, print, PDF, share, quote clicks; mobile vs desktop | P1 | Product and conversion insight | Medium | 2–3h | T02 | Funnel report; top 3 fixes identified |
| T58 | AdSense follow-up: complete Gates 3–4 if not already submitted, respond to policy messages, adjust placements, or record why to wait | P0 | Revenue readiness without risking quality | Medium | 2–4h | `ADSENSE-READINESS.md` | Application submitted; policy messages clear; placements reviewed |
| T59 | Backlink review: new/lost links, referrals, brand queries; refresh outreach list | P1 | Authority tracking | Low | 2h | T51 | Link report; next 20 prospects |
| T60 | Update sitemap, internal links, schema and `lastmod` after all changes | P0 | Clean indexation | Low | 1–2h | T53–T55 | Sitemap success; no coverage errors |
| T61 | Write the Q2 plan: content backlog, product backlog, link targets, measurement cadence | P1 | Continuity | Medium | 3–4h | T52–T60 | Prioritised Q2 backlog with owners and dates |

### Phase 6 gate

- [ ] 90-day GSC report exists with comparisons, not just raw numbers.
- [ ] At least five pages have been improved based on data.
- [ ] No unresolved coverage errors or manual actions.
- [ ] CWV/accessibility targets met or a dated remediation plan exists.
- [ ] AdSense application submitted or a documented reason to wait.
- [ ] Q2 plan is written.

---

## 5. Weekly operating cadence

| Day | Activity | Time |
|---|---|---|
| Monday | GSC review; pick one page to improve this week | 30 min |
| Monday | Check analytics events and calculator completion | 15 min |
| Tuesday–Thursday | Build, write, design, test | 2–3h/day |
| Friday | Publish; update sitemap; request indexing; internal links; log changes | 1–2h |
| Friday | Write 5-bullet weekly log | 15 min |
| Last Friday of month | 90-minute GSC deep dive; CWV; links; AdSense policy check | 90 min |

**One-page rule:** each week, choose **one** page or **one** product improvement as the primary outcome. Everything else is secondary. This prevents the plan from becoming a list of unfinished tasks.

---

## 6. Milestones and KPI framework

### 6.1 Milestones

| Milestone | Date (if start 2026-11-02) | Evidence |
|---|---|---|
| **M1 — Trust and measurement foundation** | 2026-11-16 | GSC verified; analytics live; contact form works; privacy accurate; PKR removed; schema fixed; accessibility ≥90 |
| **M2 — Calculator v2** | 2026-12-01 | Waste, compaction, metric outputs, share, cost, bags live; no regressions |
| **M3 — First intent pages** | 2026-12-16 | Driveway, tons, cost live and submitted; internal links |
| **M4 — Full cluster** | 2026-12-31 | 7 calculator pages + density chart live; internal link audit complete |
| **M5 — Authority assets** | 2027-01-15 | Size chart + 2 guides live; 30+ outreach contacts |
| **M6 — Data review** | 2027-01-30 | 90-day GSC report; 5+ improvements; AdSense decision; Q2 plan |

### 6.2 KPI framework

No absolute traffic targets are set because there is no baseline. Set **relative** goals after the first 28 days of Search Console data.

**Leading indicators (within the team's control):**

- Pages published and indexed.
- Calculator features shipped.
- Internal links added.
- Content refreshed with sources/dates.
- Outreach contacts sent.
- Lighthouse/CWV/accessibility scores.
- Schema validation pass rate.

**Lagging indicators (market response):**

- Non-brand impressions.
- Clicks and CTR.
- Average position on targeted queries.
- Indexed pages vs submitted pages.
- Referring domains.
- Calculator completion rate.
- Print/PDF/share/quote events.
- AdSense approval and revenue (if applicable).

**Suggested relative goals (example, not a guarantee):**

- By Day 60: all planned pages indexed; no coverage errors; calculator completion at or above baseline.
- By Day 90: non-brand impressions higher than the Day 1–28 baseline; CTR improved on at least three targeted pages; at least two relevant referring domains.
- By Day 90: every P0 task complete; every P1 task complete or explicitly deferred with a reason.

**Do not** judge success by one head-term ranking in 90 days. Judge by indexed intent pages, impressions across the cluster, and completion of the product layer.

---

## 7. Dependencies, capacity and contingency

### 7.1 Critical path

```
GSC + analytics (T01–T02)
        ↓
Trust fixes (T03–T08)
        ↓
Shared calculator module (T15)
        ↓
Waste/compaction/metric/share (T16–T19)
        ↓
Cost + bags (T20–T21)
        ↓
Landing pages (T27–T30, T35–T37)
        ↓
Internal links + density chart (T38–T41)
        ↓
Outreach (T47–T51)
        ↓
90-day analysis (T52–T61)
```

**If the shared module slips, every page slips.** Do not start seven pages on the old calculator.

### 7.2 Minimum path (10–12 hours/week)

If capacity is half the assumption, do only:

1. T01–T08 (trust and measurement).
2. T15–T21 (calculator core: module, waste, compaction, metric, share, cost, bags).
3. T27–T29 (driveway, tons, cost).
4. T38 (density chart) and T39 (internal links).
5. T47–T49 (outreach list and 20 emails).
6. T52–T54 and T58 (90-day review, CTR fixes, AdSense decision).

**Defer:** pea gravel, bag page, crushed stone, French drain, size chart, delivery guide, how-to-build guide. Add them in Q2. A smaller, excellent cluster beats a larger, thin one.

### 7.3 Contingency triggers

| Trigger | Response |
|---|---|
| A P0 task slips by more than 3 days | Carry it forward; delay dependent pages; do not compress QA. |
| Calculator regression | Freeze page launches; fix and add a regression test. |
| GSC shows no impressions after 28 days | Check indexing and relevance; do not assume the page is "bad" — it may be too early. |
| A page cannibalises another | Merge or re-target immediately; do not wait for the quarter to end. |
| AdSense rejected | Fix the stated reason; wait; reapply. Do not buy traffic or add more ads. |
| Outreach response is low | Improve the asset and the personalisation; do not mass-send. |
| Performance drops after ads | Remove or reposition the unit; re-test CWV. |
| Seasonal slowdown | Use the period for product/content; compare year-over-year when possible. |

---

## 8. What not to do

| Temptation | Why to avoid it |
|---|---|
| Publish 20 articles before the calculator is fixed | Creates thin content and cannibalisation; wastes the 90 days. |
| Build seven pages on the current calculator | Doorway-page risk; inconsistent behavior; maintenance debt. |
| Buy links or use a link package | Policy violation and reputational risk; no durable value. |
| Create city/state pages | Doorway pages with no real local data. |
| Add ads before trust fixes | Higher rejection risk and worse UX. |
| Rewrite titles every week | Destroys your ability to measure what worked. |
| Chase the head term "gravel calculator" only | Omni/Inch/CalculatorSoup will out-authority a small site; win specific intents first. |
| Copy competitor copy or tables | Copyright and quality risk; no differentiation. |
| Fabricate prices, densities or review counts | Trust and policy risk; one contradiction undermines the site. |
| Add accounts, AI chat or 3D visualisers | Distracts from the order-planning gap; high cost, low near-term value. |
| Apply to AdSense with a broken contact form and inaccurate privacy policy | The most avoidable rejection reason. |
| Ignore accessibility | UX, quality and legal risk; also hurts mobile conversion. |

---

## 9. Reporting and decision log

Keep a single **decision log** so future work does not reopen settled questions:

| Date | Decision | Reason | Owner | Revisit |
|---|---|---|---|---|
| 2026-11-01 | US is the primary market; metric is a secondary toggle | Keyword evidence and competitor positioning | Owner | Q2 |
| 2026-11-01 | New pages use directory URLs with trailing slash; existing `.html` URLs stay | Avoid mass redirects | Owner | After 90 days |
| 2026-11-01 | Build 7 calculator pages, not 20 | Quality and cannibalisation control | Owner | After 90 days |
| 2026-11-01 | No photo measurement, accounts or AI chat in 90 days | Cost/benefit | Owner | Q2 |
| 2026-11-01 | No default cost prices; user enters local price | Accuracy and liability | Owner | Q2 |

Add a row for every material change: default allowances, materials list, currency handling, AdSense timing, page launches.

---

## 10. Sources

- Google Search Console help: https://support.google.com/webmasters/
- Search Console performance report: https://support.google.com/webmasters/answer/7576553
- Search Console pages report: https://support.google.com/webmasters/answer/7440203
- Search Console URL Inspection: https://support.google.com/webmasters/answer/9012289
- Search Console Core Web Vitals: https://support.google.com/webmasters/answer/9205520
- Google helpful content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google spam policies (doorway pages, scaled content): https://developers.google.com/search/docs/essentials/spam-policies
- Google structured data guidelines: https://developers.google.com/search/docs/appearance/structured-data
- Google title/description guidance: https://developers.google.com/search/docs/appearance/title-link
- Web.dev Core Web Vitals: https://web.dev/articles/vitals
- Lighthouse: https://developer.chrome.com/docs/lighthouse/overview
- Rich Results Test: https://search.google.com/test/rich-results
- Local project files: `index.html`, `script.js`, `contact.html`, `privacy.html`, `about.html`, `best-gravel-types.html`, `driveway-cost-guide.html`, `sitemap.xml`, `robots.txt`, `vercel.json`, `ads.txt`.
- Companion reports: `WEBSITE-AUDIT.md`, `KEYWORD-RESEARCH.md`, `LANDING-PAGE-STRATEGY.md`, `CONTENT-STRATEGY.md`, `ADSENSE-READINESS.md`.

**Limitations:** no Search Console, analytics, ranking, traffic, backlink or revenue data was available on 2026-11-01. All time estimates are planning estimates. Phase durations assume the capacity stated in §1.4. Search Console data will supersede the assumptions in this roadmap; when CSV exports are available, re-rank the tasks against actual impressions and positions.

---

*End of SEO-90-DAY-ROADMAP.md*
