# Project Memory — Pro Gravel Calculator

**Last updated:** 2026-11-02
**Repository:** `C:\Users\Abdullah\Documents\GitHub\Gravel-Calculator`
**Live site:** https://www.progravelcalculator.online/
**Current state:** All Phase 1 work that can be completed locally is implemented and verified. Phase 2 has **not** started. The Phase 1 gate is **not fully green**, and nothing has been committed, pushed or deployed.

---

## 0. Current handoff — read this first

**Current part:** Phase 1 — Days 1–15: technical audit, existing-page optimisation and measurement.

**Short status:** The code, content and local verification work is done. Three external dependencies block the Phase 1 gate:

1. Search Console/DNS access.
2. A real GA4 measurement ID.
3. A real contact-form delivery endpoint and fallback email.

Deployment approval is also required to complete the production checks (T12) and the external Rich Results Test for T04. Phase 1 should not be called production-ready until those are done.

> **New session handoff:** Do not restart the research or rebuild the site. The implementation already exists. Read this section, then section 5 (task status), section 8 (blockers), section 9 (deployment) and `seo-research/PHASE-1-IMPLEMENTATION-REPORT.md`. Continue from the “Remaining in the current part” list below.

**At a glance:** 10 research reports, 9 HTML pages, 7 indexable sitemap URLs, Lighthouse homepage Performance 98–99 with Accessibility/Best Practices/SEO at 100, browser suite 98/98, Phase 1 gate 8/11, Phase 2 not started, and no commit, push or deployment.

### 0.1 What was completed successfully

- **Research:** all ten required research reports are in `seo-research/`, plus a detailed Phase 1 implementation report. Research date: 2026-11-01.
- **Technical SEO:** canonical-host redirects, `/index.html` → `/`, sitemap, robots, custom 404, security/cache headers, favicon set, web manifest and a 1200×630 OG image are configured locally.
- **Performance:** the Tailwind CDN was removed and replaced with a locally compiled Tailwind 3.4 build.
- **Content and trust:** homepage, About/methodology, gravel-types guide, driveway cost guide, privacy policy, terms, contact page, thankyou page and 404 page were rewritten or rebuilt.
- **Calculator and UX:** fixed the broken imperial/metric unit toggle, added ARIA states and a live results summary, fixed print/PDF, added analytics events and corrected mobile ordering.
- **Measurement code:** consent-gated GA4 code and an accessible consent banner are implemented. They are intentionally inactive while no measurement ID exists.
- **Verification:** Lighthouse mobile homepage scored 98–99 Performance and 100 Accessibility, Best Practices and SEO. All indexable content/legal pages scored 100 for Accessibility, Best Practices and SEO. The browser suite passed 98/98 checks, the PDF download worked and the static audit passed.
- **Documentation:** `memory.md` and `SEO Prompt.md` were added as the two requested SEO documentation files at the repository root. The pre-existing one-line `README.md` was left unchanged. The obsolete `SEO Prompt.md.txt` duplicate was removed.

### 0.2 Remaining in the current part (Phase 1)

| Order | Task | Status | What remains | Required input |
|---|---|---|---|---|
| 1 | **T01 — Search Console** | **BLOCKED** | Verify the domain property, submit `sitemap.xml`, add users and export the baseline | DNS or HTML verification access + Search Console access |
| 2 | **T02 — GA4 analytics** | **CODE READY — INACTIVE** | Add the real `G-` measurement ID, verify consent/Realtime/events and update the privacy wording | Real GA4 measurement ID and account access |
| 3 | **T03 — Contact delivery** | **PARTIAL — DEFERRED BY OWNER** | Add an endpoint/serverless function, server-side spam handling, fallback email and success path; test delivery; remove the “not connected” notice; update privacy | Endpoint or form service + monitored email address |
| 4 | **T12 — Production verification** | **CONFIGURED — NOT VERIFIED** | Deploy with approval, then verify apex → `www`, `/index.html` → `/`, old redirects, headers and the custom 404 | Explicit deployment approval |
| 5 | **T14 — AdSense gate** | **DOCUMENTED — NOT GREEN** | Gate 1 is blocked by contact delivery. Gate 2 is below five substantive pages. Do not apply yet | T03 plus more substantive pages |

**Also pending after deployment:** run Google's Rich Results Test for T04 and, optionally, a formal screen-reader/cross-browser audit for T09.

### 0.3 Where the next model must start

1. **Read first:** this file, `seo-research/PHASE-1-IMPLEMENTATION-REPORT.md`, and the Phase 1 section of `seo-research/SEO-90-DAY-ROADMAP.md`.
2. **Check the workspace:** `git status --short`. All changes should still be uncommitted unless the owner has since approved a commit.
3. **Ask for one of the missing inputs:** deployment approval, Search Console access, a real GA4 ID, or a contact endpoint/email. Do not invent any of them.
4. **If deployment is approved:** run `npm run build:css`, run a local smoke test, deploy, then verify the production checklist in section 9.
5. **If a GA4 ID is supplied:** put it in `analytics-config.js`, update `privacy.html` so it no longer says analytics is disconnected, test consent/Realtime, then record the result here.
6. **If contact delivery is supplied:** replace the deferred branch in `contact.html` with the real POST, remove the visible “not connected” notice, test success/error states, then update `privacy.html`.
7. **If Search Console access is supplied:** verify the property, submit the sitemap, export the baseline and record “no data yet” where applicable.
8. **Only after all gate items are green:** update the checklist and start Phase 2.

### 0.4 Do not do

- Do not commit, push or deploy without explicit owner approval.
- Do not add a fake GA4 ID, contact email, review, cost, traffic figure or Search Console data.
- Do not claim Phase 1 is complete while GSC, analytics and contact delivery are unfinished.
- Do not start Phase 2 before the Phase 1 gate is green.
- Do not rebuild the site or remove existing calculator functionality.
- Do not assume `seo-research/`, `memory.md` or `SEO Prompt.md` are private in production; decide whether to add `.vercelignore` before deployment.

---

## 1. Objective

Make Pro Gravel Calculator a stronger competitor in Google Search, grow organic traffic from the United States and other English-speaking markets, and prepare the site for Google AdSense revenue.

The priority order is:

1. Trust and technical foundation.
2. Accurate purchasing features for the calculator.
3. Distinct, useful landing pages.
4. Measurement and Search Console learning.
5. AdSense readiness only after the quality gates are green.

The site is an existing static HTML/CSS/JavaScript project on Vercel. It was not rebuilt.

---

## 2. Non-negotiable rules followed

- No fabricated keyword volumes, traffic, rankings, backlinks, reviews, Search Console data, costs, case studies or analytics IDs.
- No doorway pages, keyword stuffing, spam links or copied competitor content.
- Existing `.html` URLs were kept. Future pages are planned as directory URLs with trailing slashes.
- Existing design and functionality were preserved unless a change was justified.
- No deployment, commit or push was performed. Deployment requires explicit approval.
- Contact-form delivery was deferred by the owner: “leave this for now, we deal with this later.”
- About-page claims were retained at the owner's request. The About page explains that 2,835 lb/yd³ equals 105 lb/ft³, a figure often quoted for compacted or higher-specific-gravity crushed stone. The calculator uses 100 lb/ft³ (2,700 lb/yd³) for loose crushed stone and 105 lb/ft³ (2,835 lb/yd³) for pea gravel.
- Research evidence is labelled `[Measured]`, `[SERP-observed]`, `[Autocomplete]`, `[Estimate]` or `[Unavailable]` where relevant.

---

## 3. Research completed successfully (Phases 1–12)

**Research date:** 2026-11-01

All ten required research reports exist in `seo-research/`:

- `WEBSITE-AUDIT.md`
- `COMPETITOR-RESEARCH.md`
- `KEYWORD-RESEARCH.md`
- `COMPETITOR-GAP-ANALYSIS.md`
- `PRODUCT-GROWTH-STRATEGY.md`
- `LANDING-PAGE-STRATEGY.md`
- `CONTENT-STRATEGY.md`
- `ADSENSE-READINESS.md`
- `SEO-90-DAY-ROADMAP.md`
- `EXECUTIVE-SUMMARY.md`

An eleventh document, `seo-research/PHASE-1-IMPLEMENTATION-REPORT.md`, records the implementation and verification.

### Research findings that shaped the work

- The site had a useful calculator but was effectively a single-page product with seven indexable pages.
- Search Console was not verified.
- No analytics or AdSense code was installed.
- The contact form had no working delivery path.
- The privacy policy did not match the live site.
- The About page contradicted the calculator's density assumptions and contained unevidenced expert claims.
- `best-gravel-types.html` contained PKR/Pakistan pricing in a U.S.-oriented guide.
- The homepage had duplicate/inconsistent FAQ schema, heading issues and a Tailwind CDN dependency.
- Favicon and custom 404 were missing.
- The product gap was the purchasing layer: waste allowance, compaction, metric outputs, cost, bags and shareable state — before publishing more pages.
- `aggregatecalc.com` and `materialpal.com` could not be resolved during research because of DNS failure. No traffic or ranking numbers were invented for them.

---

## 4. Implementation completed successfully (Phase 1)

### 4.1 Technical SEO and infrastructure

- Replaced the Tailwind CDN with a locally compiled Tailwind 3.4 build at `/tailwind.css`.
- Added `package.json`, `tailwind.config.js`, `src/tailwind-input.css`, `tailwind.css` and `.gitignore`.
- Added self-referencing canonical tags to every indexable page.
- Added canonical-host redirects for `progravelcalculator.online` → `www.progravelcalculator.online`.
- Added `/index.html` → `/` redirects.
- Kept existing `.html` URLs and redirected retired `-2026` article URLs.
- Rebuilt `sitemap.xml` with seven indexable URLs and updated `lastmod`.
- Updated `robots.txt` to allow crawling, reference the sitemap and disallow the noindex utility pages.
- Created a custom `404.html` with `noindex, follow`.
- Added security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS.
- Added cache rules for HTML, CSS, JavaScript and images.
- Added the favicon set, `apple-touch-icon.png`, `icon-512.png`, `site.webmanifest` and a 1200×630 `og-image.png`.

### 4.2 Homepage and calculator

- Rewrote the homepage title, meta description and H1.
- Ensured one H1 per page and added a skip link.
- Corrected navigation, footer links and breadcrumbs.
- Added accessible labels and `aria-describedby` relationships to calculator inputs.
- Added `aria-pressed` to shape and unit controls.
- Added `aria-valuetext` to the depth slider.
- Added a debounced `aria-live` results summary.
- Fixed a real bug: the imperial/metric unit buttons had no click handler. They now call `toggleUnits()`.
- Added a one-time calculator completion event and material, shape, unit, share, quote and PDF events.
- Added a PDF loading state with `aria-busy`, status text and error handling.
- Fixed desktop and mobile PDF generation with `generatePDF(this)`.
- Moved the “Request Quote” button inside the Results card and corrected mobile ordering.
- Added print rules and print labels.
- Added methodology, density table, formulas, related guides and sources.

### 4.3 Content and trust pages

- **`about.html`:** rewritten with formulas, density table, source links, limitations, corrections process and a transparent methodology.
- **`best-gravel-types.html`:** fully rebuilt with sourced October 2026 U.S. prices, density/coverage tables, a worked 600 sq ft example, FAQ/schema and sources. PKR/Pakistan content removed.
- **`driveway-cost-guide.html`:** fully rebuilt with sourced Angi 2026, HomeAdvisor 2025 and GoodGravel October 2026 ranges, cost tables, worked example, FAQ/schema and sources.
- **`privacy.html`:** rewritten to match reality. States that analytics is not connected, no analytics cookies are currently set, ads are not live, and calculator inputs stay in the browser.
- **`terms.html`:** rewritten with intellectual-property, acceptable-use, changes, governing-law and contact sections.
- **`contact.html`:** rewritten with accessible labels, inline validation, honeypot, privacy consent, status messages and an honest upfront notice that delivery is not connected.
- **`thankyou.html`:** rewritten as a noindex utility page. It is not reachable until delivery is configured.
- **`404.html`:** created with links back to the calculator and guides.

### 4.4 Measurement and consent

- `analytics-config.js` exists with an intentionally empty `measurementId`.
- `analytics.js` implements consent-gated GA4:
  - no tag without a valid `G-` measurement ID;
  - no tag until the visitor accepts;
  - consent stored in `localStorage` under `pgc_consent`, versioned and capped at 12 months;
  - accessible consent banner and “Cookie settings” opener;
  - events emitted only after consent.
- Because no ID is configured, the site makes no Google Analytics request, sets no `_ga` cookie and shows no automatic consent prompt.
- The privacy policy accurately describes this inactive state.

### 4.5 Verification suite

- Lighthouse mobile homepage: **Performance 98–99, Accessibility 100, Best Practices 100, SEO 100**.
- All indexable content/legal pages: **Accessibility 100, Best Practices 100, SEO 100**.
- `404.html` and `thankyou.html`: Accessibility 100 and Best Practices 100; SEO scores 63/66 because they are intentionally `noindex`.
- Puppeteer browser suite: **98/98 checks passed**.
- PDF test downloaded `Gravel_Estimate_2026-11-02.pdf`, restored the button state and produced no console errors.
- Static audit: all pages parse, one H1 each, valid canonicals, valid internal links/anchors, parsable JSON-LD, seven sitemap URLs.
- All nine pages returned 200 from the local test server.

---

## 5. Task-by-task status

**Fully completed:** T05, T06, T07, T08, T10, T11, T13.

**Completed locally; external check still pending:** T04, T09.

**Configured; production verification still pending:** T12.

**Partial; blocked by deferred contact delivery:** T03.

**Code ready but inactive; blocked by missing GA4 ID:** T02.

**Blocked; no Search Console/DNS access:** T01.

**Documented, but AdSense gates are not green:** T14.

### Phase 1 roadmap tasks

| ID | Task | Status | What is done | What remains |
|---|---|---|---|---|
| T01 | Verify Search Console, submit sitemap, add users | **BLOCKED** | Sitemap is ready; verification instructions are documented | DNS/Search Console access, verification, sitemap submission, baseline export |
| T02 | Install consent-ready analytics | **CODE READY — INACTIVE** | Consent-gated GA4 code, events and banner are implemented | Real GA4 measurement ID, Realtime/debug verification, privacy wording update when active |
| T03 | Fix contact form | **PARTIAL — DELIVERY DEFERRED** | Validation, honeypot, consent, status states, thanks page and visible “not connected” notice | Real endpoint, fallback email, live success path, submission test, remove notice, privacy update |
| T04 | Remove duplicate FAQ schema; fix headings | **DONE LOCALLY** | One H1 per page; one `FAQPage` per page; visible FAQ matches schema; JSON-LD parses | Google Rich Results Test after deployment |
| T05 | Replace PKR/Pakistan content | **DONE** | USD tables dated October 2026 and sourced; no PKR/Pakistan references | — |
| T06 | Fix About density contradiction and methodology | **DONE** | One density per material, formulas, sources, limitations, corrections process | — |
| T07 | Rewrite privacy and terms to match reality | **DONE** | Privacy/terms match the current site; no false vendor claims; dates updated | Independent legal review still recommended |
| T08 | Shorten titles/metas; one H1 | **DONE** | Titles 29–60 characters; descriptions 112–148 characters; one H1 per page | — |
| T09 | Accessibility pass | **DONE LOCALLY** | Lighthouse Accessibility 100; labels, focus states, skip link, reduced motion, ARIA | Formal screen-reader/cross-browser audit optional |
| T10 | Favicon, 404, image dimensions, OG image | **DONE** | Favicon set, manifest, custom 404, 1200×630 OG image, image dimensions | — |
| T11 | Internal linking, footer, breadcrumbs | **DONE** | Footer/header links, breadcrumbs, internal links and “DriveAway” typo fixed | — |
| T12 | Redirect and header hygiene | **CONFIGURED — PRODUCTION VERIFY** | Redirects, security headers and cache rules added | Verify apex→www, `/index.html`→`/`, old articles, headers and 404 after deployment |
| T13 | Compile Tailwind, remove CDN, re-test | **DONE** | Local Tailwind build; no CDN references; Lighthouse re-tested | — |
| T14 | AdSense readiness checkpoint | **DOCUMENTED — NOT GREEN** | Gate review documented in the implementation report | Gate 1 blocked by contact delivery; Gate 2 below five substantive pages |

### Phase 1 gate checklist

| Gate item | Status |
|---|---|
| Search Console verified and sitemap submitted | **No — blocked** |
| Analytics events firing | **No — code ready, no GA4 ID** |
| Contact form submits successfully | **No — delivery deferred** |
| Privacy policy matches reality | Yes |
| PKR content gone | Yes |
| FAQ schema single and valid | Yes locally; external Rich Results Test pending |
| Titles within SERP limits | Yes |
| Accessibility ≥90 | Yes (100) |
| All indexable pages 200 and self-canonical | Yes locally; production check pending |
| Lighthouse shows no console errors | Yes locally |
| AdSense gate review documented | Yes |

**Result:** 8 of 11 gate items are satisfied locally. The three remaining items are external blockers, not content or code that can be invented.

---

## 6. Files

### Research and documentation

- `seo-research/` — ten research reports plus the implementation report.
- `seo-research/PHASE-1-IMPLEMENTATION-REPORT.md` — detailed Phase 1 report.
- `SEO Prompt.md` — complete original SEO prompt, preserved as the single source copy.
- `memory.md` — this file.

### Added site files

`404.html`, `analytics-config.js`, `analytics.js`, `apple-touch-icon.png`, `favicon-192x192.png`, `favicon-32x32.png`, `favicon.ico`, `favicon.svg`, `icon-512.png`, `og-image.png`, `site.webmanifest`, `package.json`, `package-lock.json`, `tailwind.config.js`, `tailwind.css`, `src/tailwind-input.css`, `.gitignore`.

### Modified site files

`.htaccess`, `_redirects`, `about.html`, `best-gravel-types.html`, `contact.html`, `driveway-cost-guide.html`, `index.html`, `privacy.html`, `robots.txt`, `script.js`, `sitemap.xml`, `style.css`, `terms.html`, `thankyou.html`, `vercel.json`.

### Unchanged

`ads.txt` remains present, but no ad code is installed. `image_8.png`, `image_8.webp` and `README.md` were not changed.

### Temporary test files

The browser, PDF, screenshot and inspection scripts used during verification were deleted. No test PDF or `.cjs` test file remains in the repository.

---

## 7. Key data and decisions

### Calculator densities

| Material | lb/ft³ | lb/yd³ |
|---|---:|---:|
| Pea gravel | 105 | 2,835 |
| Crushed stone | 100 | 2,700 |
| Sand | 110 | 2,970 |
| River rock | 108 | 2,916 |

These are typical loose bulk densities used by the calculator. Wet material and compacted stone can weigh more. Supplier test data takes precedence.

### Waste guidance

- Order about **10% extra**.
- Up to **15%** for loose rounded stone, sloped ground or a soft subgrade.

### Cost sources used

- **GoodGravel, October 2026:** 10,101 listings from 522 U.S. sites across 47 states.
  - Pea gravel median $47/ton ($34–$66).
  - Crushed stone median $31/ton ($20–$48).
  - River rock median $106/ton ($65–$177).
  - Masonry sand median $48/ton ($34–$60).
- **Angi 2026:** national average ≈ $1,800; most projects $500–$3,500; 400–600 sq ft installed $800–$2,200.
- **HomeAdvisor 2025:** installed $1.25–$4.00/sq ft; labour $20–$70/hour; grading $1–$2/sq ft; delivery ≈ $5/mile; excavation $40–$150/hour.

No invented averages, customer bills or case studies were used.

### Other decisions

- Analytics uses GA4 plus a consent banner, but remains inactive until a real `G-` ID is supplied.
- Contact delivery remains deferred. The page now says so before submission.
- Tailwind is compiled locally; the CDN is gone.
- AdSense is not live and no application should be made yet.

---

## 8. Blockers and pending work

### 8.1 Search Console

Needs DNS or HTML verification access, owner/full-user access, sitemap submission and baseline exports. Until then, no impressions, clicks, CTR, positions, indexing or traffic claims can be made.

### 8.2 GA4

Needs a real GA4 measurement ID in `analytics-config.js`. After adding it:

- verify consent behaviour;
- verify Realtime and events;
- update `privacy.html` because its “analytics is not connected” wording would become false;
- re-test the banner.

Do not use a placeholder or invented ID.

### 8.3 Contact delivery

Needs a real endpoint or serverless function, server-side spam handling, a monitored fallback email, a success path to `thankyou.html`, a test submission and a privacy-policy update. Until then, the form intentionally does not send.

### 8.4 Deployment verification

The following are configured but cannot be verified locally:

- apex → `www` permanent redirect;
- `/index.html` → `/`;
- retired article redirects;
- security headers;
- cache headers;
- production custom-404 status;
- canonical-host consistency;
- no analytics request while the measurement ID is empty.

### 8.5 AdSense

- **Gate 1:** not green — contact delivery and fallback email are missing.
- **Gate 2:** not green — fewer than five substantive calculator/guide pages.
- **Gate 3:** mostly green locally; production verification pending.
- **Gate 4:** not applicable — no ads are installed.

Do not apply for AdSense yet.

---

## 9. Deployment status

- All changes are **uncommitted**.
- No commit, push or deployment has occurred.
- Deployment requires explicit approval.
- The live apex currently redirects with a 307; the new configuration aims for a permanent canonical redirect after deployment.
- `ads.txt` exists, but no AdSense script or ad unit is installed.
- `memory.md`, `SEO Prompt.md` and `seo-research/` are internal working documents. They are not linked from the site, but a static Vercel deployment would serve them unless they are excluded. Decide whether to add a `.vercelignore` before deployment.

### Recommended deployment sequence

1. Review the diff and this memory file.
2. Approve a preview or production deployment.
3. Deploy.
4. Verify redirects, headers, canonical URLs, sitemap, robots and the custom 404.
5. Verify the calculator, consent banner, PDF, print, share and contact notice.
6. Connect Search Console, GA4 and contact delivery.
7. Re-run the Phase 1 gate before starting Phase 2.

---

## 10. How to resume

```powershell
# Install the local build dependencies (only needed once)
npm install

# Rebuild Tailwind after class changes
npm run build:css

# Run a local static server
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`.

Useful references:

- `seo-research/PHASE-1-IMPLEMENTATION-REPORT.md` — detailed status and verification.
- `seo-research/SEO-90-DAY-ROADMAP.md` — Phase 1 tasks and gate criteria.
- `SEO Prompt.md` — complete original brief.
- `memory.md` — this project memory.

### Important resume rules

- Do not deploy without explicit approval.
- Do not add a fake GA4 ID or contact email.
- Do not claim Phase 1 is complete until GSC, analytics and contact delivery are live.
- Do not start Phase 2 until the Phase 1 gate is green.
- Rebuild Tailwind after adding or changing utility classes.
- Keep the existing `.html` URLs.

### Fresh-session resume sequence

If a new model or session starts after a token limit:

1. Read `memory.md` sections 0, 5, 8, 9 and 10.
2. Read `seo-research/PHASE-1-IMPLEMENTATION-REPORT.md`.
3. Run `git status --short` and confirm the working tree still matches this memory.
4. Do not repeat completed research or rebuild finished pages.
5. Ask the owner for the missing input: deployment approval, Search Console access, a real GA4 ID, or a contact endpoint/fallback email.
6. Continue with the ordered “Remaining in the current part” list in section 0.2.
7. After each completed item, update this memory file and the Phase 1 gate checklist.
8. Start Phase 2 only when every Phase 1 gate item is green and the owner approves.

---

## 11. Documentation map

| File | Purpose |
|---|---|
| `SEO Prompt.md` | Complete original SEO prompt |
| `memory.md` | Durable project memory: what was done, what is pending, and how to resume |
| `seo-research/PHASE-1-IMPLEMENTATION-REPORT.md` | Detailed Phase 1 implementation and verification report |
| `seo-research/SEO-90-DAY-ROADMAP.md` | 90-day plan, task IDs and phase gates |
| `seo-research/*.md` | Research reports for audit, competitors, keywords, product, content, AdSense and Search Console |
