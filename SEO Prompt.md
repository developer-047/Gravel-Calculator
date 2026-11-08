# SEO Ranking Plan v3 - Pro Gravel Calculator (Part 1 of 2)

> CONFIDENTIAL - DO NOT DEPLOY. Exclude via .vercelignore.

**Version:** 3.0
**Date:** 2026-11-03
**Live site:** https://www.progravelcalculator.online/
**Current position:** Page 4-5 (avg ~35.9 in GSC)
**Current state:** 7 indexable URLs. 17 impressions. 0 clicks. GSC verified.
**Companion:** SEO Prompt - 2.md (Phases 3-6 + Appendices)
**Read with:** memory.md

---
## 0. ROLE, MISSION & RULES (Read this FIRST)
### 0.1 Role
You are a senior SEO strategist with 10+ years experience in technical SEO, content strategy, link building, and calculator/tool website optimization. You specialize in ranking small niche sites against high-authority competitors.
### 0.2 Mission
Move https://www.progravelcalculator.online/ from page 5 (position ~36) to top 3 for gravel calculator queries within 6-9 months by executing this plan phase-by-phase.
### 0.3 Before You Do ANYTHING
1. Read `memory.md` FIRST — it tracks all completed work, current phase, blockers, and GSC data
2. Read this file and its companion (`SEO Prompt.md` for Phases 0-2, `SEO Prompt - 2.md` for Phases 3-6)
3. Run `git status --short` to confirm working tree state
4. Identify the FIRST incomplete phase — start there
5. Do NOT repeat completed work. Do NOT redo what memory.md marks as done
### 0.4 Non-Negotiable Rules
| # | Rule |
|---|------|
| 1 | **Never invent data.** No fake keyword volumes, traffic, rankings, backlinks, reviews, prices, or GSC metrics. If you don't have it, say so. |
| 2 | **Label all evidence.** Use: `[Measured]`, `[SERP-observed]`, `[Autocomplete]`, `[Owner-provided]`, `[Estimate]` |
| 3 | **One intent per page.** If two pages target the same query, one is wrong. Check the keyword map. |
| 4 | **Do not deploy without owner approval.** Build, test, commit — but ASK before `git push`. |
| 5 | **Do not skip phases.** Phase N must be complete before Phase N+1 starts. |
| 6 | **Do not break existing functionality.** Default calculator output (0% waste, 0% compaction) must stay identical. |
| 7 | **Preserve .html extensions** on existing pages. New calculator pages use trailing-slash directories. |
| 8 | **No black-hat SEO.** No PBNs, paid links, keyword stuffing, doorway pages, link exchanges, comment spam, fake reviews. |
| 9 | **No ad code** until AdSense is approved and content quality gates pass. |
| 10 | **Update memory.md** after EVERY completed task with: date, task ID, files changed, tests run, blockers. |
### 0.5 Stop and Ask the Owner If
- A task requires a real credential (GA4 ID, API key, email endpoint, etc.)
- A change would alter existing calculator output for default inputs
- A change would remove or redirect a live URL
- A deployment to production is needed
- A legal, privacy, or AdSense policy question arises
- You are unsure about any instruction
### 0.6 Token Efficiency Rules
- Do NOT re-read files you already read in this session
- Do NOT regenerate content that memory.md says is already deployed
- Do NOT explain what you're about to do — just do it
- Batch related file edits into single operations
- If a task needs owner input (credentials, approval), skip to the next task you CAN do, then come back
- Minimize search/research — the research is already done in this document
### 0.7 Quality Checks Before Any Commit
For every changed file:
- [ ] Valid HTML (no unclosed tags)
- [ ] Schema passes Rich Results Test mentally (structure correct)
- [ ] All internal links point to real pages
- [ ] No console errors introduced
- [ ] Mobile layout not broken
- [ ] Content matches the page brief in this plan
- [ ] memory.md updated

## HOW TO USE THIS DOCUMENT

Split across two files, 6 phases:

| Phase | File | Days | Focus |
|-------|------|------|-------|
| Phase 0 | This file | Day 1 | Emergency fixes |
| Phase 1 | This file | Days 2-7 | Technical trust foundation |
| Phase 2 | This file | Days 8-21 | Calculator enhancement |
| Phase 3 | SEO Prompt - 2.md | Days 22-45 | Content cluster |
| Phase 4 | SEO Prompt - 2.md | Days 30-90 | Authority and link building |
| Phase 5 | SEO Prompt - 2.md | Days 45-90 | GEO and AI visibility |
| Phase 6 | SEO Prompt - 2.md | Ongoing | Measurement and iteration |

Each phase: Goal, Why, Tasks, Acceptance criteria.

For AI models: Read both files + memory.md. Start from first incomplete phase. Do not skip. Do not invent data. Update memory.md after each task.

For owner: Approve one phase at a time. Phases build on each other.

---

## COMPETITIVE INTELLIGENCE (Research: 2026-11-03)

### The Problem: Why You Are on Page 5

| Gap | Your site | Top competitors |
|-----|-----------|----------------|
| Authority | New domain, ~0 backlinks | Calculator.net: DR 90+, 31K+ referring domains |
| Relevance breadth | 7 pages, 1 calculator | 50-500+ calculator variants, deep clusters |
| Content depth | Calculator + thin text | 1500-3000 word guides wrapping every calculator |

### Google Ranking Factors 2026

| Factor | Weight | What it means for you |
|--------|--------|----------------------|
| Consistent satisfying content | ~24% | Publish regularly, deeply satisfy each intent |
| Searcher engagement and trust | ~23% | Users must interact, not bounce |
| Niche expertise / topical authority | ~14% | Build 15+ interconnected pages |
| Keywords in titles / on-page | ~12% | Already decent, maintain |
| Backlinks and authority | ~12% | Need 15-25 quality links in 90 days |
| Brand mentions and trust | ~7% | Need real brand presence |
| Information Gain | HIGH | Original data gets massive boost |

### SERP Landscape - Who Owns Page 1

| Query | Top domains | What wins |
|-------|-------------|-----------|
| gravel calculator | calculator.net, omnicalculator.com, gravelshop.com | Calculator + 2000-word guide |
| driveway gravel calculator | calculator.net, gravelshop.com, inchcalculator.com | Project-specific calculator |
| gravel calculator tons | calculator.net, ficksupply.com, gravelshop.com | Calculator + conversion tables |
| pea gravel calculator | gravelshop.com, calculator.net, omnicalculator.com | Material-specific calculator |
| gravel cost calculator | calculator.net, gravelshop.com, omnicalculator.com | Calculator + cost guide |
| french drain gravel calculator | omnicalculator.com, builderscalculator.com | Niche calc (LOW competition) |
| gravel bag calculator | calculator.net, decorativeaggregates.com | Calc + bag tables (LOW comp) |
| how much gravel do I need | calculator.net, eartheasy.com, omnicalculator.com | Guide + calculator |
| crushed stone calculator | calculator.net, omnicalculator.com | Material calc with size codes |
| gravel density chart | cat.com, engineeringtoolbox.com | Reference table (LINK MAGNET) |
| gravel driveway cost | lawnstarter.com, hellogravel.com | Cost guide + calculator |

### Your Fastest Wins (Attack First)

1. french drain gravel calculator - Few tools. Pipe deduction is unique gap.
2. gravel bag calculator - Underserved. Pallet counts + bulk-vs-bag.
3. gravel needed calculator - Already have 4 impressions!
4. gravel road calculator - Already have 3 impressions.
5. pea gravel calculator - Material-specific, moderate competition.
6. crushed stone calculator - Size codes (#57, #411) differentiate.
7. gravel density chart - Informational reference = link magnet.

### What Top Competitors Do Right

OmniCalculator and InchCalculator use a hybrid content-tool structure:
1. Calculator above the fold for instant intent satisfaction
2. Dynamic results in multiple units (tons, yards, bags)
3. Formula transparency showing exact math
4. Material density charts as reference tables
5. FAQ sections with FAQPage schema for featured snippets
6. Internal linking clusters (every calc links to 5+ siblings)
7. Named authors with credentials (E-E-A-T)
8. Massive topical authority (hundreds of related calculators)
9. Fast mobile experience with green Core Web Vitals

### The Winning Strategy

You cannot out-generic Calculator.net (18-year domain, 31K links). Instead:
1. Win modifier clusters first: driveway, tons, pea gravel, bags, French drain, crushed stone, cost
2. Build BEST specialized tools: layer-by-layer driveway, pipe-deduction French drain, bulk-vs-bag
3. Publish reference data suppliers and writers want to cite
4. Earn relevant links from landscaping, construction, DIY sites
5. Use GSC data to find striking-distance queries and improve those pages

---

## PHASE 0: EMERGENCY FIXES (Day 1)

### Goal
Fix critical issues actively hurting rankings and exposing strategy.

### Why
- Internal docs (memory.md, SEO Prompt.md, seo-research/) are publicly accessible
- Empty ad slot labeled ADVERTISEMENT looks unprofessional
- Apex domain returns 307 (temporary) instead of 308, leaking link equity

### Task 0-1: Block internal docs from production

Create .vercelignore in repository root:
`
memory.md
SEO Prompt.md
SEO Prompt - 2.md
seo-research/
README.md
node_modules/
src/
package.json
package-lock.json
tailwind.config.js
.gitignore
`

After deployment verify these return 404:
- /memory.md
- /SEO%20Prompt.md
- /SEO%20Prompt%20-%202.md
- /seo-research/KEYWORD-RESEARCH.md

### Task 0-2: Add robots.txt defence rules

File: robots.txt - Add:
`
Disallow: /memory.md
Disallow: /SEO%20Prompt.md
Disallow: /SEO%20Prompt%20-%202.md
Disallow: /seo-research/
Disallow: /README.md
`

### Task 0-3: Remove empty ADVERTISEMENT slot

File: index.html - Remove any element with class ad-slot or text ADVERTISEMENT.
Do not add ad code until AdSense is approved.

### Task 0-4: Fix apex redirect to permanent (308)

Vercel Dashboard > Project > Settings > Domains.
Change progravelcalculator.online redirect from 307 to 308.

### Task 0-5: Deploy and verify

`
npm run build:css
git add -A
git commit -m Phase 0: Block docs, remove ad slot, fix apex redirect
git push
`

### Phase 0 Checklist
- [ ] /memory.md returns 404
- [ ] /SEO%20Prompt.md returns 404
- [ ] No ADVERTISEMENT label visible
- [ ] Apex domain returns 308

---

## PHASE 1: TECHNICAL TRUST FOUNDATION (Days 2-7)

### Goal
Establish measurement infrastructure and fix trust issues.

### Why
Cannot improve what you cannot measure. GA4 shows calculator usage. GSC shows queries.

### Task 1-1: Set up GA4 analytics

Required from owner: GA4 measurement ID (G-XXXXXXXXXX)

1. Create GA4 property at analytics.google.com
2. Create Web data stream for www.progravelcalculator.online
3. Update analytics-config.js with real ID
4. Update privacy.html to describe GA4

Verify:
- [ ] No analytics fires before consent
- [ ] After consent, appear in GA4 Realtime
- [ ] Events fire: calculator_start, calculator_complete, material_select

### Task 1-2: Connect the contact form

Recommended: Formspree.io free tier
1. Create account, get endpoint URL
2. Update contact.html form action and method POST
3. Remove delivery not connected notice
4. Update privacy.html naming Formspree as processor

Verify:
- [ ] Test message arrives in email
- [ ] Success redirects to /thankyou.html

### Task 1-3: Export Search Console baseline

1. GSC > Performance > 28 days > Export Queries + Pages
2. Indexing > Pages > screenshot
3. Core Web Vitals > screenshot
4. Save privately (not in repo). Add gsc-exports/ to .gitignore
5. Record in memory.md: queries, position 35.9, 17 impressions, 0 clicks

### Task 1-4: Create llms.txt

Create llms.txt in repo root with structured Markdown list of all live pages.
Helps AI agents (ChatGPT, Perplexity) cite your site. Only include LIVE pages.

### Task 1-5: Validate schema markup

Run Rich Results Test + Schema Validator for every page.
- Calculator pages: WebApplication + FAQPage + BreadcrumbList
- Guide pages: Article + FAQPage + BreadcrumbList
- About: Organization
- All: Self-referencing canonical
- Do NOT include aggregateRating without real reviews

### Phase 1 Checklist
- [ ] GA4 live, consent-gated, events in DebugView
- [ ] Contact form delivers messages
- [ ] GSC baseline in memory.md
- [ ] llms.txt live
- [ ] Schema passes Rich Results Test
- [ ] privacy.html accurate

---

## PHASE 2: CALCULATOR ENHANCEMENT (Days 8-21)

### Goal
Transform calculator into the most complete gravel order planner on the web.

### Why
User engagement is the #1 ranking signal. 90 seconds interaction beats 15 seconds on competitor.

### Competitor Feature Gap

| Feature | Competitors | You (now) | You (target) |
|---------|------------|-----------|--------------|
| Waste/compaction | Combined or none | None | Two independent controls |
| Cost estimator | Some have it | None | Per-ton/yard/bag + delivery + tax |
| Bag sizes | Generic or none | None | 40/50/60 lb + pallet + bulk compare |
| Shareable URL | Partial or none | None | Full URL serialization |
| Supplier PDF | None | Basic | One-page order sheet |
| Metric outputs | Yes | Partial | Full m3, tonnes, kg, 25kg bags |
| Multiple shapes | Some | Yes (3) | Keep advantage |
| Warnings | None | None | Depth/density warnings |

### Task 2-1: Create shared calculator module

Create calculator-engine.js with:
- Materials database (density, use, source for each material)
- Core calculate() function returning all outputs
- serialize()/deserialize() for URL state
- generateOrderSheet() for PDF
- getWarnings() for assumption warnings

### Task 2-2: Add waste allowance (0-25%, default 0%)

UI: Slider or dropdown. Text: Recommend 10% for most projects.
Math: adjustedVolume = baseVolume * (1 + wastePercent/100)
CRITICAL: At 0%, output EXACTLY matches current calculator.

### Task 2-3: Add compaction allowance (0-20%, independent)

Presets: Driveway 10-15%, Walkway 5%, Decorative 0%.
Combined: finalVolume = baseVolume * (1 + waste/100) * (1 + compaction/100)

### Task 2-4: Add full metric outputs

Metric mode: m3, tonnes, kg, 25kg bags, meters/cm. Max 1% drift.

### Task 2-5: Add cost estimator

Inputs: Price per ton/yard/bag, delivery fee, tax rate, currency.
Outputs: Material cost, delivery, tax, total, cost per sq ft.
Rules: Blank price hides cost section. Never show default price.

### Task 2-6: Add bag sizes and pallet calculator

40/50/60 lb or 25kg. Pallet = 40 bags. Show bags, pallets, bags/yard, bags/ton.
Bonus: Bulk-vs-bag comparison showing which is cheaper.

### Task 2-7: Share URL serialization

On Share: serialize inputs to URL params, copy to clipboard.
On load: restore from params, auto-calculate. Test in incognito.

### Task 2-8: Upgrade PDF to order sheet

One page: dimensions, material, volume, weight, bags, allowances, cost, date, URL.

### Task 2-9: Add assumption warnings

- Depth < 2 driveway: Need 4-6 inches
- Depth > 12: Unusual, double-check
- Density out of range: show standard range
- No waste: Consider adding 10%

### Task 2-10: Analytics events (after consent only)

Events: waste_change, compaction_change, cost_calculate, bag_size_change, share, pdf_download.

### Task 2-11: QA regression testing

- [ ] Default 0% waste/compaction = exact same output as current
- [ ] Chrome, Edge, Firefox, Safari desktop + mobile
- [ ] Widths: 320, 375, 768, 1024, 1440px
- [ ] Imperial/Metric toggle accurate
- [ ] All shapes correct
- [ ] Share URL round-trips
- [ ] PDF mobile + desktop
- [ ] Keyboard nav + screen reader
- [ ] No console errors

### Phase 2 Checklist
- [ ] Waste and compaction work independently
- [ ] Full metric with 25kg bags
- [ ] Cost estimator with delivery/tax
- [ ] Bag sizes, pallets, bulk-vs-bag
- [ ] Share URL works
- [ ] Supplier PDF order sheet
- [ ] Warnings trigger correctly
- [ ] Default = identical to current
- [ ] Analytics events fire after consent

---

## CONTINUE TO PART 2

Open SEO Prompt - 2.md for Phases 3-6 + Appendices.

---

## NON-NEGOTIABLE RULES (All Phases)

1. Never invent volumes, traffic, rankings, backlinks, reviews, prices, or GSC data
2. Label evidence: [Measured], [SERP-observed], [Autocomplete], [Owner-provided]
3. No doorway pages, keyword stuffing, PBNs, paid links, link exchanges, spam
4. One search intent per page
5. Preserve existing calculator and .html URLs
6. Do not deploy without owner approval
7. Do not start Phase N+1 before Phase N is complete
8. Do not add ad code until AdSense approved
9. Do not rewrite homepage title/H1/core calc
10. Do not mass-generate content
