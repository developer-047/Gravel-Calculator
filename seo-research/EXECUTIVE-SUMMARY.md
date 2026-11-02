# Executive Summary — Pro Gravel Calculator SEO Strategy

> **Research date:** 2026-11-01
> **Site:** https://www.progravelcalculator.online/
> **Prepared for:** the site owner
> **Scope:** the full 12-phase brief — website audit, competitor research, keyword research, gap analysis, product strategy, landing-page strategy, content strategy, AdSense readiness, Search Console strategy and a 90-day roadmap.
> **Status:** research and recommendations only. **No website file has been created, modified or deployed.** Implementation requires explicit approval.
> **Evidence labels:** `[Measured]` = observed in the local code, live site, DNS or Lighthouse. `[SERP-observed]` = seen in live Google results. `[Autocomplete]` = returned by Google Autocomplete on 2026-11-01. `[Estimate]` = analyst judgment. `[Unavailable]` = not measured and not claimed.

---

## 1. Bottom line

**Pro Gravel Calculator is a good calculator inside an underdeveloped SEO product.**

The tool works, the site is fast, and the technical foundation is better than most competitors: HTTPS, self-referencing canonicals, a valid sitemap, clean `robots.txt`, no broken internal links, and a Lighthouse SEO score of **100**. `[Measured]`

But three things hold it back:

1. **One page carries every commercial query.** The homepage targets the generic "gravel calculator" intent, while driveway, tons, pea gravel, crushed stone, cost, bags, coverage and French-drain intents have no dedicated pages. Competitors have built those pages.
2. **The calculator stops at volume.** It does not handle cost, waste, compaction, bag-size choice, metric outputs or shareable calculations — the features buyers need after they know the number.
3. **The trust layer is visibly broken.** The contact form cannot submit, the privacy policy describes AdSense/Analytics that are not installed, the About page contradicts the calculator's own density, and a US-oriented guide quotes Pakistan rupees.

**The strategy:** fix trust first, turn the calculator into an order planner, then ship a small cluster of genuinely different calculators and earn links with reference assets. Do not mass-publish articles. Do not apply to AdSense until the trust and content gates pass.

**AdSense verdict:** **not ready today.** There are six visible blockers. The earliest credible application is around **weeks 5–6** of the roadmap; a stronger application is around **week 8**, once five to seven substantive calculator pages are live. Approval is never guaranteed.

---

## 2. Scorecard

| Area | Status | Summary |
|---|---|---|
| **Calculator** | 🟢 Good | Rectangle, circle, L-shape; four materials; live output in yd³, tons and 50 lb bags; SVG preview; print/PDF/quote hand-off. |
| **Technical SEO** | 🟢 Good | SEO 100; HTTPS/HSTS; canonicals; sitemap; robots; no broken internal links. Issues: duplicate FAQ schema, Tailwind CDN, missing favicon, no custom 404, cache headers. |
| **Performance** | 🟡 Fair | Lighthouse mobile Performance **87**; FCP/LCP **2.5 s**; TBT **280 ms**; CLS **0**. Tailwind CDN is the main tax. |
| **Accessibility** | 🟠 Weak | Lighthouse **75/100**: contrast, heading order, missing labels, no `aria-live`. |
| **Content** | 🟡 Fair | Three substantial pages (home + two guides) with practical writing, but mixed geography, unsourced cost claims, no named author, no visible dates. |
| **Trust / E-E-A-T** | 🔴 Poor | Broken contact form; inaccurate privacy policy; density contradiction; unverified "civil engineers" and "Verified Pros" claims. |
| **Competitive position** | 🟠 Weak | Omni, Inch, CalculatorSoup and dedicated gravel clusters own the intent pages. The site has one generic page. |
| **Keyword coverage** | 🟠 Weak | Strong head-term ambition, almost no long-tail coverage. Autocomplete shows clear demand for driveway, tons, bags, cost, depth and comparisons. |
| **Measurement** | 🔴 Missing | No Search Console verification, no analytics, no event tracking. |
| **Monetisation** | 🔴 Not ready | `ads.txt` exists, but no AdSense code, no consent management, and the trust/content gates are not met. |

---

## 3. What is working (do not break)

- **The core calculator math is correct** for rectangle, circle and L-shape, with live recalculation.
- **The SVG preview is a real differentiator.** Most competitors use static images or nothing.
- **Print/PDF and quote hand-off** are more complete than many competitors — even though the quote form itself is broken.
- **The site is fast and light**: 174 KiB total page weight, 70 ms server response, CLS 0.
- **Technical hygiene is solid**: canonical host, self-referencing canonicals, sitemap, robots, noindexed thank-you page, no broken internal links.
- **The writing is practical**, not generic AI filler. The driveway cost guide is the strongest asset.
- **No intrusive ads, pop-ups or email gates** today. That is a UX advantage to preserve.

---

## 4. What is broken (ranked)

| Severity | Issue | Evidence | Consequence |
|---|---|---|---|
| **Critical** | Contact form cannot submit | `contact.html`: no `action`/`method`; `type="button"`; no handler | Primary conversion path is dead; trust and AdSense risk. |
| **Critical** | Privacy policy is inaccurate | Claims AdSense/Analytics are used; references obsolete DART cookie; neither tool is installed | Compliance and trust risk; directly relevant to AdSense. |
| **Critical** | About page contradicts the calculator | About says 2,835 lb/yd³ for crushed stone; calculator uses 100 lb/ft³ = 2,700 lb/yd³ | Undermines every number on the site. |
| **Critical** | PKR/Pakistan pricing in a US guide | `best-gravel-types.html` "2026 Pakistan Market Averages" | Wrong audience; looks low-quality to users and reviewers. |
| **High** | No Search Console or analytics | No verification tag, no GA4/GTM | Cannot measure queries, indexing, CTR or conversions. |
| **High** | Duplicate/conflicting FAQ schema | Two `FAQPage` blocks; head questions not visible | Rich-result loss; structured-data quality risk. |
| **High** | Calculator lacks purchase features | No cost, waste, compaction, bag-size choice, metric outputs, shareable state | Users must finish the calculation elsewhere; competitors already do this. |
| **High** | Long titles and two H1s | Home 80 chars, best-types 93, cost guide 86; print H1 + main H1 | Truncated SERPs; weaker heading outline. |
| **High** | Thin trust footprint | 7 indexable pages; About 269 words; only one image; no author/methodology/dates | Weak E-E-A-T and AdSense readiness. |
| **Medium** | Accessibility 75/100 | Labels, contrast, heading order, no live region | UX, quality and legal risk. |
| **Medium** | Missing favicon, custom 404, cache headers | 404 favicon; Vercel default 404; `max-age=0` assets | Unfinished feel; slower repeat visits. |
| **Medium** | Weak internal linking | Footer lists only Calculator and Driveway Cost | Poor crawl paths and topical relationships. |
| **Low** | Apex 307 redirect; `/index.html` duplicates `/` | Temporary redirect; both 200 | Split signals; cosmetic duplicate URL. |

---

## 5. Competitive landscape

The niche has two layers:

- **Calculator authorities** — Omni Calculator, Inch Calculator, CalculatorSoup, GigaCalculator, Calculator.net. They have deep libraries, strong internal linking and, in Omni/Inch's case, named authors and citation blocks.
- **Dedicated gravel clusters** — `gravelcalculation.com`, `gravel-calc.com`, `calculategravel.com`, `peagravelcalculator.com`, `gravelcalculate.com`. They have 6–20 focused pages covering driveway, pea gravel, crushed stone, cost, bags, coverage and French drains.

Two competitors named in the brief — **`aggregatecalc.com` and `materialpal.com`** — did **not resolve in DNS** on 2026-11-01 and could not be analysed. `[Measured]` **`thegravelcalculator.com` is live** and is the closest product competitor, with a photo-measurement feature and a three-material hub.

**The opening:** most competitors are weak on **order accuracy and trust**. They publish unsourced densities, omit compaction/waste, rarely support multiple bag sizes, and almost none produce a supplier-ready order sheet. That is where Pro Gravel Calculator can differentiate without copying anyone.

**What not to compete on:** photo measurement, 18+ materials on day one, 40+ calculators, city/state pages, or Omni's head-term authority. Win specific intents first.

---

## 6. Keyword opportunity

No keyword volumes were available. The evidence below is from Google Autocomplete and live result sets on 2026-11-01; competition labels are qualitative estimates.

| Cluster | Representative queries | Target page | Priority |
|---|---|---|---|
| Generic calculator | gravel calculator, how much gravel do I need, gravel calculator cubic yards | `/` | P0 — defend |
| Driveway | driveway gravel calculator, gravel calculator for driveway, gravel depth for driveway, 100 ft driveway | `/driveway-gravel-calculator/` | P0 — build |
| Weight / conversion | gravel calculator tons, tons to yards, square feet to tons, what will 4 tons cover | `/gravel-calculator-tons/` | P0 — build |
| Cost | gravel cost calculator, price per ton/yard, driveway cost calculator, delivered cost | `/gravel-cost-calculator/` | P0 — build |
| Bags | how many bags of gravel, bags per yard/ton, bag coverage, pallet quantity | `/gravel-bag-calculator/` | P0 — build |
| Materials | pea gravel calculator, crushed stone calculator, #57, crusher run | `/pea-gravel-calculator/`, `/crushed-stone-calculator/` | P0/P1 |
| Drainage | french drain gravel calculator, french drain gravel size | `/french-drain-gravel-calculator/` | P1 |
| Comparisons | pea gravel vs crushed stone, crushed stone vs gravel, best gravel for driveway | `/best-gravel-types.html` | P0/P1 — expand |
| Reference | gravel density, gravel size chart, coverage per ton | `/gravel-density-chart.html`, `/gravel-size-chart.html` | P1 |

**Important negative findings:**

- `gravel calculator l shape` returned **no Autocomplete suggestions**. L-shape should stay a feature, not a page.
- `gravel calculator triangle` had only a weak signal. Keep triangle support inside an "irregular area" feature, not a page.
- `gravel vs` is polluted by bicycles and fitness. Always qualify comparisons (`gravel vs crushed stone`).
- "Near me" cost queries should not become city pages. Serve them with local price inputs and a supplier-quote CTA.

**The seven-page cluster is deliberate.** Each page must change the tool materially — not just the H1. A page that only swaps a keyword into the same calculator is a doorway page and should not be built.

---

## 7. The strategy: three big bets

### Bet 1 — Trust and accuracy (product)

Fix the contact form, privacy policy, About claims and PKR content. Then add:

- waste and compaction as separate controls,
- metric outputs,
- shareable calculation state,
- cost estimation,
- bag-size choice,
- a supplier-ready order sheet.

**Why:** this is the difference between "another calculator" and a tool a buyer can actually use to place an order.

### Bet 2 — Intent coverage (SEO)

Ship a **small, high-quality cluster**:

1. `/driveway-gravel-calculator/`
2. `/gravel-calculator-tons/`
3. `/gravel-cost-calculator/`
4. `/pea-gravel-calculator/`
5. `/gravel-bag-calculator/`
6. `/crushed-stone-calculator/`
7. `/french-drain-gravel-calculator/`

Each page gets a genuinely different preset, geometry or output, plus depth guidance, worked examples, a visible density source, an FAQ and internal links.

**Why:** the site cannot rank for intents it has not built for. But seven thin pages would be worse than one good one.

### Bet 3 — Linkable reference assets (authority)

Publish:

- a **gravel density chart** with ranges and sources,
- a **gravel size chart** with original images,
- a **delivery-cost guide** with a quote-comparison checklist,
- a **how-to-build-a-gravel-driveway guide** with layer-by-layer quantities.

**Why:** these are the pages other sites and AI answer engines can cite. They earn links without outreach spam and support every calculator.

**Sequence matters:** trust → product → pages → assets → links. Reversing it produces thin pages and wasted effort.

---

## 8. Top 10 highest-impact recommendations

| # | Recommendation | Impact | Effort | Timing | Detail |
|---|---|---|---|---|---|
| **1** | **Repair the trust layer**: contact form, privacy policy, About claims, PKR content | **Critical** | Medium | Days 1–10 | `WEBSITE-AUDIT.md` §6, `ADSENSE-READINESS.md` §10 |
| **2** | **Connect Search Console + analytics**, with calculator events | **Critical** | Low | Days 1–3 | `SEO-90-DAY-ROADMAP.md` §3 |
| **3** | **Build a shared calculator engine** so every page uses the same logic | **Critical** | High | Days 16–30 | `PRODUCT-GROWTH-STRATEGY.md` §7 |
| **4** | **Add waste, compaction, metric outputs and shareable state** | **High** | Medium | Days 16–25 | `COMPETITOR-GAP-ANALYSIS.md` §6 |
| **5** | **Add cost estimation + bag-size selector** | **High** | Medium–High | Days 20–30 | `PRODUCT-GROWTH-STRATEGY.md` §3 |
| **6** | **Ship driveway, tons and cost pages first** | **High** | High | Days 31–45 | `LANDING-PAGE-STRATEGY.md` §4–§8 |
| **7** | **Complete the cluster**: pea gravel, bags, crushed stone, French drain | **High** | High | Days 45–60 | `LANDING-PAGE-STRATEGY.md` §6–§10 |
| **8** | **Publish density and size charts** as linkable assets | **High** | Medium | Days 46–70 | `CONTENT-STRATEGY.md` §3.2 |
| **9** | **Fix technical/UX debt**: schema, titles, H1s, accessibility, favicon, 404, redirects, Tailwind | **Medium–High** | Medium | Days 1–15 + ongoing | `WEBSITE-AUDIT.md` §6, §9 |
| **10** | **Earn links with useful assets and personalised outreach** | **High (long-term)** | Medium | Days 61–75 | `SEO-90-DAY-ROADMAP.md` §4.6 |

**The single highest-impact fix:** make the contact form work and make the privacy policy true. It costs a few hours and removes two of the six AdSense blockers. Nothing else on this list matters if users cannot contact the site and reviewers cannot trust it.

**The single highest-impact growth bet:** the driveway + tons + cost pages, supported by the cost and bag features. Those three intents carry the clearest commercial value in the keyword evidence. `[Estimate]`

---

## 9. 90-day plan at a glance

| Days | Focus | Key deliverables | Gate |
|---|---|---|---|
| **1–15** | Trust + technical + measurement | GSC verified; analytics live; contact form works; privacy accurate; PKR removed; FAQ schema fixed; titles shortened; accessibility ≥90; favicon/404/redirects | Trust and measurement foundation |
| **16–30** | Calculator v2 | Shared module; waste; compaction; metric outputs; share URL; cost estimator; bag selector; order sheet; QA | No regressions; all controls work |
| **31–45** | First intent pages | Driveway, tons, cost (plus pea if capacity); schema; internal links; sitemap; indexing | 3–4 pages live |
| **46–60** | Complete cluster + reference | Bags, crushed stone, French drain; density chart; internal link audit; guide refresh | 7-page cluster + density asset |
| **61–75** | Authority + outreach | Size chart; delivery guide; how-to-build guide; 50-prospect list; 20–30 personalised emails; broken-link building | 30+ outreach contacts; 2+ assets |
| **76–90** | Analyse + improve | 90-day GSC review; CTR fixes; striking-distance upgrades; CWV/accessibility; AdSense decision; Q2 plan | Data-driven next quarter |

**Capacity assumption:** 20–25 focused hours per week; 180–240 estimated hours; 10–30% buffer. `[Estimate]` At 10–12 hours per week, use the minimum path in `SEO-90-DAY-ROADMAP.md` §7.2.

**What success looks like by Day 90 (relative, not guaranteed):**

- All planned pages indexed; no coverage errors.
- Calculator v2 live with no regressions.
- At least five pages improved from actual Search Console data.
- Non-brand impressions above the Day 1–28 baseline.
- At least two relevant referring domains from genuine outreach.
- AdSense application submitted or a documented reason to wait.
- A Q2 plan with a prioritised backlog.

No absolute traffic or revenue target is promised. The first 90 days are about building the asset correctly, not hitting a number.

---

## 10. AdSense readiness

**Verdict: not ready today.** Six blockers:

1. Contact form does not submit.
2. Privacy policy describes tools that are not installed.
3. About page contradicts the calculator and makes unverified expert claims.
4. PKR/Pakistan content in a US guide.
5. Thin trust footprint — 7 indexable pages, one image, no author/methodology/dates.
6. No consent management (CMP).

**Do not apply this week.** The earliest credible window is after the trust fixes and the first three calculator pages are live (roughly weeks 5–6). A stronger application waits until the seven-page cluster is live (roughly week 8).

**Ad placements when approved:** after the calculator results, inside substantive guide content, and optionally in a desktop sidebar. Never above the H1, inside the calculator card, between inputs and results, or next to the quote/print/share buttons. No ads on contact, privacy, terms, thank-you or 404. Start with one or two units and measure.

**No approval guarantee is made.** Approval is discretionary. `ADSENSE-READINESS.md` contains the full gate checklist.

---

## 11. What not to do

| Do not | Why |
|---|---|
| Rebuild the site or migrate to React/Next | The static architecture is an SEO advantage; a migration would consume the quarter. |
| Publish 20–50 articles before fixing the calculator | Creates thin content and cannibalisation. |
| Build seven pages on the current calculator | Doorway-page risk; inconsistent behavior. |
| Copy competitor copy, tables or images | Copyright and quality risk; no differentiation. |
| Buy links, use PBNs or directory blasts | Policy violation; no durable value. |
| Create city/state calculator pages | Doorway pages with no real local data. |
| Add accounts, AI chat, photo measurement or 3D visualisers in 90 days | High cost, low near-term value; distracts from the order-planning gap. |
| Fabricate prices, densities, review counts or traffic | One contradiction undermines the whole site. |
| Apply to AdSense with a broken contact form and inaccurate privacy policy | The most avoidable rejection reason. |
| Rewrite titles every week | Destroys your ability to measure what worked. |
| Judge success by one head-term ranking in 90 days | The cluster and the product layer matter more. |

---

## 12. Decisions needed from you

### Before Phase 1 starts

| # | Decision | Recommendation |
|---|---|---|
| 1 | **Approve implementation?** Phase 1 only, Phase 1–2, or the full roadmap? | Start with Phase 1 (trust + technical + measurement). Review before Phase 2. |
| 2 | **Contact form endpoint** — Formspree, Netlify Forms, a Vercel serverless function, or a simple email link? | Use a form endpoint with spam protection and a real fallback email. |
| 3 | **Named reviewer/identity** — who is the real person or organisation behind the site? | Name a real reviewer with a credential, or remove the expert claims. |
| 4 | **Analytics** — GA4 with consent, or a privacy-friendly alternative? | Choose based on your consent/legal comfort; both can work. |
| 5 | **Legal review** — will you have the privacy/terms rewrite reviewed? | Recommended before AdSense. |
| 6 | **Primary market** — confirm the US, with metric as a secondary toggle? | Yes; this drives currency, terminology and content. |

### Before Phase 2 starts

| # | Decision | Recommendation |
|---|---|---|
| 7 | **Default allowances** — waste 0% (preserve current numbers) or 5% (recommended practice)? | Default to **0%** with a visible "recommended 5–10%" hint; remember the user's choice. |
| 8 | **Currency** — USD only, or a symbol selector without FX conversion? | USD default + symbol selector; no live currency conversion. |
| 9 | **Materials** — approve the 8–10 material list and density sources | Approve only materials with a cited density and typical range. |
| 10 | **Build approach** — shared vanilla JS module, or a framework? | Shared JS module; no framework migration. |
| 11 | **Order sheet branding** — what name/contact appears on the printed estimate? | Use a real business identity; do not invent one. |

### Before Phase 3 starts

| # | Decision | Recommendation |
|---|---|---|
| 12 | **URL structure** — directory URLs with trailing slash for new pages, existing `.html` unchanged? | Yes; add 301s from any `.html` variants and canonicalise consistently. |
| 13 | **AdSense timing** — apply after 3 pages or wait for 7? | Wait for at least 5 substantive pages; 7 is stronger. |

---

## 13. Report index

All files are in `seo-research/`. Every report uses the research date **2026-11-01** and the same evidence labels.

| Report | What it answers |
|---|---|
| [`WEBSITE-AUDIT.md`](WEBSITE-AUDIT.md) | What the site does, how it is built, and every technical/content/accessibility issue ranked by severity. |
| [`COMPETITOR-RESEARCH.md`](COMPETITOR-RESEARCH.md) | Who competes, what they offer, which domains are live or dead, and where the openings are. |
| [`KEYWORD-RESEARCH.md`](KEYWORD-RESEARCH.md) | Raw Autocomplete evidence, keyword tables, intent mapping, cannibalisation map and page allocation. |
| [`COMPETITOR-GAP-ANALYSIS.md`](COMPETITOR-GAP-ANALYSIS.md) | Scored feature matrix, genuine differentiation opportunities, and what not to copy. |
| [`PRODUCT-GROWTH-STRATEGY.md`](PRODUCT-GROWTH-STRATEGY.md) | Weighted feature prioritisation, P0/P1 specs, rejected features, architecture and measurement. |
| [`LANDING-PAGE-STRATEGY.md`](LANDING-PAGE-STRATEGY.md) | Page-by-page titles, metas, outlines, functionality, internal links and cannibalisation guards for 7 URLs. |
| [`CONTENT-STRATEGY.md`](CONTENT-STRATEGY.md) | Editorial plan, reference assets, standards, internal-link matrix and 90-day calendar. |
| [`ADSENSE-READINESS.md`](ADSENSE-READINESS.md) | Page-by-page AdSense review, blockers, placement recommendations, consent and pre-application checklist. |
| [`SEO-90-DAY-ROADMAP.md`](SEO-90-DAY-ROADMAP.md) | Search Console workflow, 60+ prioritised tasks, phase gates, capacity, risks and KPIs. |
| [`EXECUTIVE-SUMMARY.md`](EXECUTIVE-SUMMARY.md) | This document. |

---

## 14. Method, sources and limitations

### What was measured directly

- Every local HTML, CSS and JS file in the project.
- Live HTTP status codes, redirects, headers and asset responses for all pages, `sitemap.xml`, `robots.txt` and `ads.txt`.
- DNS resolution for `aggregatecalc.com`, `materialpal.com`, `thegravelcalculator.com` and the audited domain.
- Lighthouse mobile lab audit of the live homepage on 2026-11-01.
- Google Autocomplete responses for 61 seed phrases (en-US).
- Presence of competitor pages in live Google result sets.

### What was not measured

- Google rankings, impressions, clicks or average position.
- Organic traffic, domain authority, backlink counts or keyword volumes.
- Field Core Web Vitals (CrUX). The PageSpeed Insights API returned a quota error on 2026-11-01; only lab Lighthouse data is used.
- AdSense approval probability or revenue.
- Competitor traffic, conversions or revenue.

**No such numbers are invented anywhere in these reports.** Where a metric could not be obtained, the report says `[Unavailable]`.

### Key sources

- Live site: https://www.progravelcalculator.online/
- Google Search Console help: https://support.google.com/webmasters/
- Google helpful content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- Google structured data guidelines: https://developers.google.com/search/docs/appearance/structured-data
- Google AdSense Program Policies: https://support.google.com/adsense/answer/48182
- Web.dev Core Web Vitals: https://web.dev/articles/vitals
- Competitor URLs and research dates are listed in `COMPETITOR-RESEARCH.md` §8.
- Autocomplete query log and dates are in `KEYWORD-RESEARCH.md` §2 and §13.

### Limitations

- Competitor features were assessed from publicly rendered pages on 2026-11-01. Features behind JavaScript, login or A/B tests may have been missed.
- `aggregatecalc.com` and `materialpal.com` did not resolve in DNS; no data is reported for them.
- Time and impact estimates are planning judgments, not guarantees.
- Search Console and analytics data will supersede the assumptions in this summary. When CSV exports are available, the roadmap should be re-ranked against actual impressions and positions.

---

## 15. Next step

No website files have been changed. Only the ten reports in `seo-research/` have been written.

**If you approve Phase 1**, the first actions are:

1. Verify Search Console and submit the sitemap.
2. Install analytics with the event list.
3. Fix the contact form and add a fallback email.
4. Rewrite the privacy policy and About page.
5. Remove the PKR/Pakistan content.
6. Fix the duplicate FAQ schema, titles and accessibility defects.

**If you want to review before approving**, start with `WEBSITE-AUDIT.md` §12 (top 10 fixes) and `SEO-90-DAY-ROADMAP.md` §4.2 (Days 1–15). The rest of the reports provide the evidence behind them.

**Awaiting your approval before changing any website code.**

---

*End of EXECUTIVE-SUMMARY.md*
