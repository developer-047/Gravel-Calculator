# Phase 5 — GEO & AI Visibility (Days 45–90)

> Internal working document. Not a production asset: `seo-research/` is excluded via `.vercelignore`
> and disallowed in `robots.txt`.
> Implemented 2026-11-11. Verified locally; **not committed and not deployed**.

## Goal

Make each page quotable by an AI answer engine: a passage that answers the query, carries the
formula and a specific figure, and still makes sense when read out of context.

## What was audited

Tasks 5-1 to 5-5 from `SEO Prompt - 2.md`, applied to the 13 indexable content pages: homepage,
the 7 calculator pages, the density chart, the 2026 price index, the French drain stone guide, the
gravel types guide and the driveway cost guide.

Method: extract every H1/H2/H3 with the paragraph that follows it, count the first 200 words of
visible text, and list every `<table>` with its caption/thead/tbody state. Tables were already
semantic; the gaps were in the passages.

## Gaps found before this pass

1. **No answer-first passage.** In the first 200 words of every page, the content was navigation,
   form labels and a one-line subtitle. Formulas and worked examples sat hundreds of words below
   the calculator, so a top-of-page extraction answered nothing.
2. **Driveway fan-out incomplete.** The page that owns "how much gravel for a driveway" did not
   answer cubic yards, yards-to-tons or delivery cost. Delivery existed only on
   `driveway-cost-guide.html`.
3. **Two vague reference summaries.** The density chart called itself a "comprehensive table" and
   the French drain guide promised "unique angles" — exactly the sentences an AI would quote.

## Changes, task by task

| Task | What was done |
|---|---|
| 5-1 Passage extractability | `.answer-first` passage under the H1 of all 13 pages; both vague reference summaries rewritten as facts |
| 5-2 Front-load key facts | Each passage carries the direct answer, the formula and at least one figure within the first 150 words (asserted by test) |
| 5-3 Structured tables | Every data table on the 13 pages checked: `<table>`/`<thead>`/`<tbody>`/`<th>`, no ARIA-role or CSS-grid tables. `#density-table` and the price index table gained `<caption>` |
| 5-4 Fan-out queries | Driveway page gained "How many cubic yards of gravel does a driveway need?", "How do you convert cubic yards of driveway gravel to tons?" and "How much does driveway gravel delivery cost?" |
| 5-5 Fact density | Reference subtitles, the density chart's Twitter description and the gravel-types lead now carry numbers; hedged claims stay hedged where the data is planning-grade |

## Figures used (all pre-existing; no new sources)

- Homepage and pea gravel: 10 × 10 ft at 3″ = 0.93 yd³, 1.31 short tons, 53 × 50 lb bags at 105 lb/ft³.
- Crushed stone: 10 × 10 ft at 4″ = 1.23 yd³, 1.67 short tons, 67 × 50 lb bags (#57 at 100 lb/ft³).
- Tons: 1 yd³ of #57 = 1.35 short tons ≈ 1.22 t, so 4 yd³ = 5.40 short tons.
- Bags: 1 yd³ = 54 × 50 lb bags (#57), about 57 pea gravel, 59 river rock and 60 masonry sand.
- Cost: $30–$50/yd³ for pea gravel and $45–$65/yd³ for #57 stone, the site's 2026 planning ranges.
- French drain: the existing 50 ft × 12″ × 18″ worked example with a 4″ pipe = 3.05 yd³, 4.11 t, 165 bags.
- Driveway: 20′ × 10′ with a 4″ base and 2″ surface = 3.70 yd³, 5.17 short tons; delivery ≈ $5/mile (HomeAdvisor).
- Density chart span: 95 lb/ft³ / 1,522 kg/m³ (#8 stone) to 120 lb/ft³ / 1,922 kg/m³ (#12 stone).

## Verification

- `npm run build:css` → exit 0.
- `npm test` → **64 PASS, 0 FAIL** (35 engine + 29 static), including four new Phase 5 tests.
- `python tests/site-audit.py` → PASS on 21 pages, no errors.
- Not run: browser/visual pass, commit, deploy, or any AI-citation measurement. AI Overview,
  ChatGPT and Perplexity citations cannot be claimed without data.

## What remains

- **Owner approval** to commit and deploy. The production files are the 13 content pages,
  `tailwind.css` and the test suite.
- After deploy: request re-crawl, then monitor in Phase 6. GEO has no direct GSC metric; use
  impressions, queries and referral traffic as proxies and never claim a citation win without evidence.
- The Phase 4 caveats still limit what the pages may claim: price-index provenance and density-chart
  citations remain owner input, so both pages stay labelled as planning ranges.
