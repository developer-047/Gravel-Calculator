# Landing Page Strategy — Keyword-Based Page Architecture

> **Research date:** 2026-11-01
> **Scope:** Phase 7 of the brief. Seven proposed calculator pages plus optimisation of the three existing content pages.
> **Status:** proposals only. No page has been created and no URL has been changed. Implementation requires approval.
> **Rule:** each page must have a working, materially different calculator. A page that only swaps a keyword into the same tool is a doorway page and must not be built.

---

## 1. Architecture principles

1. **One intent per page.** A page owns one primary query cluster. If two pages could rank for the same query, one of them is wrong.
2. **The tool must differ.** Presets, geometry, outputs or inputs must change in a way that materially helps the user. Text alone is not a page.
3. **The homepage stays generic.** It owns `gravel calculator` and `how much gravel do I need`. Every other page targets a modifier.
4. **Every page is a complete answer.** Calculator first, then depth guidance, then an example table, then cost/bags, then FAQ, then related links.
5. **No thin pages.** Supporting content should be genuinely useful — typically 900–1,500 words excluding navigation and FAQ. Do not pad to hit a number.
6. **Internal links are deliberate.** Each page links up to the hub, sideways to two or three siblings, and down to the relevant guide.

---

## 2. URL and canonical rules

The brief proposes directory-style URLs (`/driveway-gravel-calculator/`). The existing site uses `.html` files. Mixing is acceptable if canonicalisation is explicit.

**Recommended implementation**

| Rule | Detail |
|---|---|
| New page location | `driveway-gravel-calculator/index.html` |
| Canonical | `https://www.progravelcalculator.online/driveway-gravel-calculator/` (trailing slash) |
| Redirect | `/driveway-gravel-calculator.html` → `/driveway-gravel-calculator/` (301) |
| Existing pages | Keep `.html` URLs unchanged. Do not mass-rewrite URLs; the redirect risk outweighs the cosmetic gain. |
| Internal links | Always link to the canonical form (trailing slash). |
| Sitemap | Add the canonical URL only. |
| Breadcrumbs | Visible breadcrumb + `BreadcrumbList` schema on every new page. |
| Canonical host | `https://www.` — already correct. |
| Indexability | `index, follow`; no noindex on any calculator page. |

**Do not enable a global `cleanUrls` rule** without auditing every existing URL and adding redirects, because it would change live URLs such as `/about.html`.

---

## 3. Page cluster overview

```
/  (hub: generic gravel calculator)
├── /driveway-gravel-calculator/      project intent
├── /gravel-calculator-tons/          unit intent (weight)
├── /pea-gravel-calculator/           material intent
├── /crushed-stone-calculator/        material intent (size codes)
├── /gravel-cost-calculator/          commercial intent
├── /gravel-bag-calculator/           purchase-format intent
├── /french-drain-gravel-calculator/  project + drainage intent
│
├── /best-gravel-types.html           comparison support
└── /driveway-cost-guide.html         cost research support
```

**Deferred:** `/gravel-coverage-calculator/` — only if built as a true reverse tool. Otherwise it cannibalises `/gravel-calculator-tons/`.

---

## 4. Page 1 — Driveway Gravel Calculator

| Field | Value |
|---|---|
| **URL** | `/driveway-gravel-calculator/` |
| **Primary keyword** | driveway gravel calculator |
| **Secondary** | gravel calculator for driveway, driveway stone calculator, gravel driveway calculator, how much gravel for a driveway, gravel depth for driveway |
| **Intent** | Tool / transactional |
| **Priority** | P0 — highest commercial value |
| **Existing competition** | CalculateGravel (two-layer mode), Inch driveway calculator, The Gravel Calculator (generic), Omni (generic) |

**SEO title (47 chars)**
`Driveway Gravel Calculator – Yards, Tons & Cost`

**Meta description (124 chars)**
`Calculate driveway gravel in cubic yards, tons and bags. Add base and surface layers, waste and compaction, then estimate cost.`

**H1**
`Driveway Gravel Calculator`

**Page outline**

1. H1 + one-sentence promise ("Get the base and surface quantities, with compaction and cost, in one estimate.")
2. **Calculator** — driveway preset, base + surface layers.
3. `H2 How deep should driveway gravel be?` — table: light vehicle 4 in total, regular use 6 in, heavy/sloped 8–12 in with geotextile; base vs surface split.
4. `H2 Base layer vs surface layer` — why two materials, typical #57/ABC base, 2–3 in surface.
5. `H2 Driveway gravel examples` — 20×20, 50×10, 100 ft, 200 ft, with exact outputs at 4 in and 6 in.
6. `H2 Compaction and waste for driveways` — why 10–15% is typical and how the calculator applies it.
7. `H2 What does driveway gravel cost?` — short cost block + link to the cost calculator and cost guide.
8. `H2 Common driveway gravel mistakes` — no base, too thin, rounded stone under vehicles, no edging, no geotextile on soft ground.
9. `H2 FAQ` — 6 visible questions matching `FAQPage` schema.
10. `H2 Related calculators` — tons, crushed stone, bags, cost.

**Required functionality**
- Two-layer mode: each layer has material, depth and compaction; totals combined.
- Presets: "light vehicle", "regular use", "heavy use".
- Waste and compaction controls from the shared module.
- Cost panel.
- Print/PDF order sheet.
- Shareable URL state.

**Supporting content**
- Depth table by driveway type.
- Layer explanation with a stacked diagram.
- Worked examples table.
- Cost hand-off.
- Comparison of rounded vs angular stone (link to guide).

**Internal links**
- In: homepage hero/nav, footer, crushed stone page, tons page, cost page, both guides.
- Out: `/`, `/gravel-calculator-tons/`, `/crushed-stone-calculator/`, `/gravel-cost-calculator/`, `/gravel-bag-calculator/`, `/best-gravel-types.html`, `/driveway-cost-guide.html`.

**Unique value vs competitors**
- Three-layer capability (sub-base, base, surface) rather than two.
- Per-layer compaction instead of one global buffer.
- Worked 100 ft / 200 ft / 20×20 examples.
- Supplier-ready printed order sheet.
- Visible density assumptions.

**Schema**
`WebApplication` (or `SoftwareApplication`) + `FAQPage` + `BreadcrumbList`.

**Cannibalisation guard**
- The homepage must not use "driveway" in its title or H1.
- The cost guide owns "how much does a gravel driveway cost"; this page owns "calculator".

---

## 5. Page 2 — Gravel Calculator Tons

| Field | Value |
|---|---|
| **URL** | `/gravel-calculator-tons/` |
| **Primary keyword** | gravel calculator tons |
| **Secondary** | gravel tonnage calculator, tons to cubic yards, cubic yards to tons, square feet to tons, how many tons of gravel, how much will 4 tons cover, gravel weight |
| **Intent** | Tool / conversion |
| **Priority** | P0 |
| **Existing competition** | Omni, Inch, CalculatorSoup, GravelCalculation, CalculateGravel |

**SEO title (55 chars)**
`Gravel Calculator Tons – Convert Yards, Tons & Coverage`

**Meta description (122 chars)**
`Convert gravel between cubic yards, tons and square feet. See how much 1 ton covers and how many tons your project needs.`

**H1**
`Gravel Calculator in Tons`

**Page outline**

1. H1 + promise.
2. **Calculator** — weight-first mode with material density.
3. `H2 How to convert gravel volume to tons` — formula, worked example.
4. `H2 How many tons are in a cubic yard of gravel?` — table by material with source.
5. `H2 How many cubic yards are in a ton of gravel?` — inverse table.
6. `H2 Square feet to tons` — formula + mini calculator.
7. `H2 How much area does one ton cover?` — reverse mode + table at 1/2/3/4/6 in.
8. `H2 How much will 4 tons of gravel cover?` — worked example (directly targets an Autocomplete query).
9. `H2 Short tons vs metric tonnes` — definition and conversion.
10. `H2 FAQ` — 6 questions.
11. `H2 Related calculators`.

**Required functionality**
- Toggle between **volume → weight** and **weight → coverage**.
- Material density selector with visible value and source.
- Output in short tons, metric tonnes, lb and kg.
- Coverage output in ft² and m².
- Shareable state.

**Supporting content**
- Tons-per-yard and yards-per-ton tables.
- Coverage table at common depths.
- Worked examples.
- Explanation of why suppliers use weight.

**Internal links**
- In: homepage, driveway page, cost page, bags page, crushed stone page.
- Out: `/`, `/driveway-gravel-calculator/`, `/gravel-bag-calculator/`, `/gravel-cost-calculator/`, `/best-gravel-types.html`.

**Unique value vs competitors**
- Reverse coverage mode combined with forward calculation on one page.
- Visible density source and range.
- Worked "4 tons" example.
- Short ton vs metric tonne explanation (most US competitors ignore it).

**Schema**
`WebApplication` + `FAQPage` + `BreadcrumbList`.

**Cannibalisation guard**
- Homepage must not put "tons" in its title.
- Do not create a separate "gravel coverage calculator" unless it is a genuinely different reverse tool.

---

## 6. Page 3 — Pea Gravel Calculator

| Field | Value |
|---|---|
| **URL** | `/pea-gravel-calculator/` |
| **Primary keyword** | pea gravel calculator |
| **Secondary** | pea gravel calculator tons, pea gravel calculator bags, pea gravel calculator cubic yards, pea gravel for playground, how much pea gravel do I need |
| **Intent** | Tool / material |
| **Priority** | P0 |
| **Existing competition** | PeaGravelCalculator.com, PeaGravelCalculator.org, GravelCalculate, Omni, Inch |

**SEO title (49 chars)**
`Pea Gravel Calculator – Tons, Yards, Bags & Cost`

**Meta description (118 chars)**
`Estimate pea gravel for paths, patios, playgrounds and borders. Get cubic yards, tons, bags and cost with depth guidance.`

**H1**
`Pea Gravel Calculator`

**Page outline**

1. H1 + promise.
2. **Calculator** — pea gravel preset (105 lb/ft³).
3. `H2 How much pea gravel do I need?` — formula and example.
4. `H2 Pea gravel depth by project` — path 2–3 in, patio 3 in, border 2 in, playground 6–12 in (with safety caveat).
5. `H2 Pea gravel bags and coverage` — bags per yard and per ton; coverage per ton.
6. `H2 What does pea gravel cost?` — short block, link to cost calculator.
7. `H2 Pea gravel vs crushed stone` — short comparison, link to the full guide.
8. `H2 Playground pea gravel: safety notes` — impact attenuation limits, certified surfacing alternatives, no guarantee.
9. `H2 FAQ` — 6 questions.
10. `H2 Related calculators`.

**Required functionality**
- Pea gravel density preset and visible value.
- Depth presets by application.
- Bag-size selector.
- Cost panel.
- Print/share.

**Supporting content**
- Depth table.
- Coverage table.
- Playground safety caveat (important for trust and YMYL-adjacent content).
- Comparison hand-off.

**Internal links**
- In: homepage, driveway page, bags page, comparison guide.
- Out: `/`, `/gravel-bag-calculator/`, `/gravel-cost-calculator/`, `/best-gravel-types.html`, `/driveway-gravel-calculator/`.

**Unique value vs competitors**
- Explicit playground safety caveat (most competitors imply pea gravel is a certified play surface).
- Bag-size choice and bulk comparison.
- Visible density assumption.
- Supplier-ready print.

**Schema**
`WebApplication` + `FAQPage` + `BreadcrumbList`.

**Cannibalisation guard**
- Pea gravel page must not target "crushed stone" or "driveway" in its title.
- Do not create a separate "pea gravel coverage" page; keep coverage as an H2.

---

## 7. Page 4 — Crushed Stone Calculator

| Field | Value |
|---|---|
| **URL** | `/crushed-stone-calculator/` |
| **Primary keyword** | crushed stone calculator |
| **Secondary** | 57 gravel calculator, #57 crushed stone calculator, #411 calculator, crusher run calculator, gravel base calculator, aggregate calculator |
| **Intent** | Tool / material + construction |
| **Priority** | P1 |
| **Existing competition** | Inch stone calculator, CalculatorSoup, GravelCalculation, CalculateGravel |

**SEO title (50 chars)**
`Crushed Stone Calculator – #57, #411 & Crusher Run`

**Meta description (127 chars)**
`Calculate crushed stone for driveways, bases and drainage. Presets for #57, #411 and crusher run, with tons, yards and bags.`

**H1**
`Crushed Stone Calculator`

**Page outline**

1. H1 + promise.
2. **Calculator** — size-code presets.
3. `H2 Crushed stone sizes explained` — #57, #411, #304, crusher run/ABC, riprap; size range and use.
4. `H2 Which crushed stone do I need?` — decision table by project.
5. `H2 Base vs surface stone` — compaction, fines, drainage.
6. `H2 Tons per cubic yard for crushed stone` — density table with source.
7. `H2 Crushed stone cost` — short block + link.
8. `H2 FAQ` — 6 questions.
9. `H2 Related calculators`.

**Required functionality**
- Presets for #57, #411, #304, crusher run, riprap.
- Different default depths and compaction by use.
- Cost and bags.
- Print/share.

**Supporting content**
- Size chart with descriptions.
- Decision table.
- Density table.
- Drainage vs compaction trade-off.

**Internal links**
- In: homepage, driveway page, tons page, cost page.
- Out: `/driveway-gravel-calculator/`, `/gravel-calculator-tons/`, `/gravel-cost-calculator/`, `/best-gravel-types.html`, `/french-drain-gravel-calculator/`.

**Unique value vs competitors**
- Size-code presets rather than generic "crushed stone".
- Compaction defaults by use.
- Clear explanation of fines and drainage.
- Printed order sheet.

**Schema**
`WebApplication` + `FAQPage` + `BreadcrumbList`.

**Cannibalisation guard**
- Pea gravel page owns decorative rounded stone; this page owns angular/crushed.
- Do not create separate pages for #57 and #411 until Search Console shows independent demand.

---

## 8. Page 5 — Gravel Cost Calculator

| Field | Value |
|---|---|
| **URL** | `/gravel-cost-calculator/` |
| **Primary keyword** | gravel cost calculator |
| **Secondary** | gravel driveway cost calculator, gravel price calculator, price per ton, price per yard, gravel delivery cost, how much is a yard of gravel, how much is a ton of gravel |
| **Intent** | Commercial / tool |
| **Priority** | P0 |
| **Existing competition** | GravelCalculation cost page, Gravel-Calc cost page, CalculateGravel cost page, HelloGravel guides |

**SEO title (57 chars)**
`Gravel Cost Calculator – Price per Ton, Yard & Delivery`

**Meta description (129 chars)**
`Estimate gravel material, delivery and tax from your quantity and local price per ton, yard or bag. Compare bulk vs bagged costs.`

**H1**
`Gravel Cost Calculator`

**Page outline**

1. H1 + promise.
2. **Calculator** — quantity + price basis + delivery + tax.
3. `H2 How to estimate gravel cost` — formula with a worked example.
4. `H2 Price per ton vs price per cubic yard` — how to compare quotes.
5. `H2 Gravel delivery costs` — what drives them, what to ask, no invented local prices.
6. `H2 Bulk vs bagged gravel` — break-even logic and labour.
7. `H2 Cost by project` — driveway, patio, path, French drain; link to each calculator.
8. `H2 How to reduce gravel costs` — accurate measurement, local quarry, shared delivery, recycled aggregate.
9. `H2 FAQ` — 6 questions.
10. `H2 Related calculators`.

**Required functionality**
- Price basis: per ton / per yd³ / per bag.
- Delivery flat fee, tax rate, currency symbol.
- Material cost, delivery, tax, total.
- Cost per ton and per yd³.
- Bulk vs bag comparison.
- Print/share.

**Supporting content**
- Worked examples.
- Quote comparison checklist.
- Warning that prices vary by region and season; no fabricated averages presented as fact.

**Internal links**
- In: homepage, driveway page, tons page, bags page, cost guide, both material pages.
- Out: `/driveway-cost-guide.html`, `/driveway-gravel-calculator/`, `/gravel-bag-calculator/`, `/gravel-calculator-tons/`.

**Unique value vs competitors**
- Honest "your price" model with no fake national averages.
- Delivery and tax included.
- Bulk vs bag break-even.
- Printed estimate with assumptions.

**Schema**
`WebApplication` + `FAQPage` + `BreadcrumbList`.

**Cannibalisation guard**
- `/driveway-cost-guide.html` owns "how much does a gravel driveway cost" (research intent).
- This page owns "gravel cost calculator" (tool intent).
- Titles must not overlap.

---

## 9. Page 6 — Gravel Bag Calculator

| Field | Value |
|---|---|
| **URL** | `/gravel-bag-calculator/` |
| **Primary keyword** | gravel bag calculator |
| **Secondary** | how many bags of gravel do I need, how many bags of gravel in a cubic yard, how many bags of gravel in a ton, how much area does a bag cover, gravel bags calculator |
| **Intent** | Tool / purchase format |
| **Priority** | P0 |
| **Existing competition** | Weak across the set; most calculators only output a single bag count |

**SEO title (51 chars)**
`Gravel Bag Calculator – How Many Bags Do I Need?`

**Meta description (123 chars)**
`Find out how many bags of gravel you need for any area. Choose 0.5, 0.75 or 1 cu ft bags and compare bagged vs bulk cost.`

**H1**
`Gravel Bag Calculator`

**Page outline**

1. H1 + promise.
2. **Calculator** — bag-size selector and pallet count.
3. `H2 How many bags of gravel do I need?` — formula + example.
4. `H2 How many bags of gravel are in a cubic yard?` — table by bag size.
5. `H2 How many bags of gravel are in a ton?` — table by material and bag size.
6. `H2 Bag size chart` — 0.5, 0.75, 1.0 cu ft; 25 kg; 50 lb.
7. `H2 How much area does a bag cover?` — table at common depths.
8. `H2 Bagged vs bulk: which is cheaper?` — break-even with user-entered prices.
9. `H2 Pallet quantities` — editable bags-per-pallet.
10. `H2 FAQ` — 6 questions.
11. `H2 Related calculators`.

**Required functionality**
- Bag size selector.
- Bags required (round up), pallets, leftover.
- Coverage per bag.
- Bulk comparison.
- Cost.
- Print/share.

**Supporting content**
- Bag conversion tables.
- Coverage tables.
- Practical note: bagged stone is heavier and more expensive per unit; bulk is usually cheaper above ~0.5 yd³ (state as a general rule, not a universal claim).

**Internal links**
- In: homepage, pea gravel page, cost page, tons page.
- Out: `/`, `/gravel-cost-calculator/`, `/gravel-calculator-tons/`, `/pea-gravel-calculator/`, `/driveway-gravel-calculator/`.

**Unique value vs competitors**
- Multiple bag sizes, not just 50 lb.
- Pallet count.
- True bulk-vs-bag break-even.
- Coverage per bag.

**Schema**
`WebApplication` + `FAQPage` + `BreadcrumbList`.

**Cannibalisation guard**
- Other pages may show a bag count as an output, but only this page targets bag queries in its title/H1.

---

## 10. Page 7 — French Drain Gravel Calculator

| Field | Value |
|---|---|
| **URL** | `/french-drain-gravel-calculator/` |
| **Primary keyword** | french drain gravel calculator |
| **Secondary** | french drain gravel size, how much gravel for french drain, french drain stone calculator, french drain calculator |
| **Intent** | Tool / project + drainage |
| **Priority** | P1 |
| **Existing competition** | Omni French Drain Calculator, RemodelCalculators, a few thin pages |

**SEO title (46 chars)**
`French Drain Gravel Calculator – Trench & Pipe`

**Meta description (132 chars)**
`Calculate gravel for a French drain trench, minus the pipe volume. Get cubic yards, tons and bags plus stone size and fabric guidance.`

**H1**
`French Drain Gravel Calculator`

**Page outline**

1. H1 + promise.
2. **Calculator** — trench length, width, depth, pipe diameter/length, fill %.
3. `H2 How much gravel does a French drain need?` — formula + example.
4. `H2 French drain gravel size` — clean ¾" crushed stone, no fines; why.
5. `H2 Trench dimensions and pipe deduction` — why subtracting pipe volume matters.
6. `H2 Filter fabric and geotextile` — purpose, overlap, area estimate.
7. `H2 French drain slope` — typical 1% guideline, outlet considerations.
8. `H2 French drain cost` — short block + link.
9. `H2 FAQ` — 6 questions.
10. `H2 Related calculators`.

**Required functionality**
- Trench geometry.
- Pipe volume deduction.
- Fill percentage.
- Filter fabric area estimate (trench length × width with overlap allowance).
- Tons, yards, bags.
- Cost.
- Print/share.

**Supporting content**
- Diagram of trench cross-section.
- Stone specification.
- Slope and outlet guidance.
- Clear disclaimer: not engineering advice for complex drainage.

**Internal links**
- In: homepage, crushed stone page, cost page.
- Out: `/crushed-stone-calculator/`, `/gravel-calculator-tons/`, `/gravel-cost-calculator/`, `/gravel-bag-calculator/`.

**Unique value vs competitors**
- Pipe displacement handled explicitly.
- Filter fabric estimate.
- Clear stone specification.
- Printed order sheet.

**Schema**
`WebApplication` + `FAQPage` + `BreadcrumbList`.

**Cannibalisation guard**
- Generic gravel pages may answer "how much gravel for a French drain" briefly but must link here rather than compete.
- Do not create a separate "drainage gravel calculator" until demand is proven.

---

## 11. Existing page optimisation

### 11.1 Homepage `/`

| Field | Current | Recommended |
|---|---|---|
| Title (80 chars) | `Gravel Calculator – Free Driveway, Road & Yard Estimator (Metric/Imperial)` | `Gravel Calculator – Free Yards, Tons & Bags` (43) |
| Meta (153) | Free gravel calculator for driveways, roads & yards. Instant cubic yards, tons & bags in metric or imperial. L-shape & circle modes included. | `Free gravel calculator for driveways, paths and yards. Get cubic yards, tons, bags and cost with waste and compaction built in.` (125) |
| H1 | Two H1s (print header + main) | One H1: `Free Gravel Calculator` or `Gravel Calculator` |
| H2 structure | Mixed, includes hidden `sr-only` keyword H2s | Visible, intent-led: How much gravel do I need / How to measure / Depth guide / Material density / Cost / FAQ |
| Schema | SoftwareApplication + HowTo + **two FAQPage blocks** | SoftwareApplication + **one** FAQPage matching visible questions + BreadcrumbList |
| Internal links | Footer lists only Calculator and Cost Guide | Add all 7 calculators + guides + About/Contact |

**Homepage role:** generic hub. It must not target driveway, tons, pea gravel, crushed stone, cost or bags in its title. Those are separate pages.

### 11.2 `/best-gravel-types.html`

| Field | Current | Recommended |
|---|---|---|
| Title (93) | `Pea Gravel vs Crushed Stone vs River Rock – Which to Choose in 2026` | `Pea Gravel vs Crushed Stone vs River Rock (2026)` (50) |
| Meta (139) | Compare pea gravel, crushed stone, and river rock for driveways, patios, and paths. Real 2026 costs, pros/cons, best uses explained. | `Compare pea gravel, crushed stone and river rock for driveways, patios and paths. Costs, pros, cons and which to choose.` (116) |
| Currency | **PKR / "Pakistan Market Averages"** | USD, labelled "US average, 2026", with source/date |
| H1 | Long question | Keep descriptive but shorten |
| Missing | Size chart with pictures | Add `H2 Driveway gravel size chart` with a real table and original images |
| Missing | Visible dates/sources | Add "Last updated" and a sources block |
| Schema | Article + BreadcrumbList | Add `image`, named author, `dateModified`, `publisher.logo` |

**Role:** comparison support page. It should link to the pea gravel and crushed stone calculators, not try to be one.

### 11.3 `/driveway-cost-guide.html`

| Field | Current | Recommended |
|---|---|---|
| Title (86) | `How Much Does a Gravel Driveway Cost in 2026? (Full Breakdown + Real Examples)` | `Gravel Driveway Cost in 2026: Full Price Breakdown` (51) |
| Meta (135) | Real 2026 gravel driveway costs: material, delivery & labor breakdown, cost per sq ft/m², hidden extras, and free calculator tips. | `What a gravel driveway costs in 2026: material, delivery and labor, price per square foot, hidden extras and ways to save.` (123) |
| Trust | No visible dates or sources | Add "Last updated", methodology, sources, named reviewer |
| CTA | Generic calculator links | Link to `/driveway-gravel-calculator/` and `/gravel-cost-calculator/` contextually |
| Schema | Article + BreadcrumbList | Add `image`, named author, `dateModified`, `publisher.logo` |

**Role:** research intent. It should answer "how much does it cost" and hand off to the calculator for "what will mine cost".

---

## 12. Internal linking plan

### 12.1 Sitewide navigation

Recommended header/footer links (keep the existing design):

- Calculator (home)
- Driveway
- Cost
- Guides
- About
- Contact

A "Calculators" dropdown or footer column can hold all seven without cluttering the header.

### 12.2 Contextual links per page

| From | Link to | Anchor text |
|---|---|---|
| Homepage | Driveway | "driveway gravel calculator" |
| Homepage | Tons | "gravel calculator in tons" |
| Homepage | Pea gravel | "pea gravel calculator" |
| Homepage | Crushed stone | "crushed stone calculator" |
| Homepage | Cost | "gravel cost calculator" |
| Homepage | Bags | "gravel bag calculator" |
| Homepage | French drain | "French drain gravel calculator" |
| Driveway | Crushed stone | "crushed stone for driveways" |
| Driveway | Bags | "how many bags you need" |
| Driveway | Cost guide | "full driveway cost breakdown" |
| Tons | Bags | "convert tons to bags" |
| Pea gravel | Comparison guide | "pea gravel vs crushed stone" |
| Pea gravel | Bags | "pea gravel bag calculator" |
| Crushed stone | French drain | "French drain stone" |
| Cost | Cost guide | "gravel driveway cost guide" |
| Bags | Cost | "compare bagged and bulk prices" |
| French drain | Crushed stone | "#57 crushed stone for drainage" |
| Both guides | Relevant calculator | contextual, not "click here" |

### 12.3 Rules
- Every new page must be reachable from the homepage within one click.
- Every new page must link to at least two siblings and one guide.
- No orphan pages.
- No sitewide footer link to every page from every page beyond a reasonable calculator menu.
- Breadcrumbs must be visible and match schema.

---

## 13. Page quality checklist

Before publishing any calculator page:

- [ ] The calculator is genuinely different from the homepage (preset, geometry, output or input).
- [ ] The primary keyword appears in the title, H1 and first 100 words — once each, naturally.
- [ ] Title ≤ 60 characters; meta description ≤ 155 characters.
- [ ] One H1; logical H2/H3 order.
- [ ] At least one original diagram, table or image (not a competitor asset).
- [ ] Depth guidance is specific to the page's project/material.
- [ ] At least 3 worked examples with numbers.
- [ ] Density value and source are visible.
- [ ] Waste and compaction are explained.
- [ ] Cost is either present or clearly handed off.
- [ ] FAQ questions are visible and match `FAQPage` schema exactly.
- [ ] `WebApplication` + `BreadcrumbList` schema validates.
- [ ] Canonical is self-referencing and uses the trailing-slash form.
- [ ] Page is in the sitemap.
- [ ] Internal links: 1 up, 2+ sideways, 1 down.
- [ ] No duplicate FAQ blocks.
- [ ] Mobile: results stay visible while inputs change.
- [ ] Accessibility: labels, contrast, `aria-live`, keyboard navigation.
- [ ] Lighthouse SEO 100, Accessibility ≥ 95, no console errors.
- [ ] Page does not target another page's primary keyword.

---

## 14. Launch order and dependencies

| Wave | Pages | Dependency |
|---|---|---|
| **Wave 1** | Driveway, Tons, Pea gravel | Shared calculator module + waste/compaction/metric outputs + share URL |
| **Wave 2** | Cost, Bags | Cost engine + bag-size module |
| **Wave 3** | Crushed stone, French drain | Material presets + pipe-deduction geometry |
| **Wave 4** | Existing page optimisation | Content/trust fixes, currency rewrite |
| **Later** | Coverage, river rock, paver base, sand | Proven demand via Search Console |

**Hard dependency:** do not publish seven pages on seven copies of the current calculator. Build the shared module first, or the pages will diverge and the maintenance cost will kill the project.

---

## 15. What would make these pages doorway pages (and how to avoid it)

| Doorway pattern | How to avoid it |
|---|---|
| Same calculator, only the H1 changes | Each page must change inputs, defaults, geometry or outputs. |
| Thin text padded with keywords | Require specific depth guidance, worked examples and a unique diagram. |
| Pages targeting near-identical queries | Enforce the cannibalisation map. Merge or delete if overlap appears. |
| No internal links except the homepage | Require 1 up / 2 sideways / 1 down. |
| No unique data or tool | Each page must have at least one thing a competitor does not: layer planner, bag sizes, pipe deduction, reverse mode, order sheet. |
| Automatically generated city pages | Not recommended under any circumstance. |

---

## 16. Sources

- Keyword evidence: `KEYWORD-RESEARCH.md` §2 (Google Autocomplete, 2026-11-01).
- Competitor page structures: `COMPETITOR-RESEARCH.md` §4 and §5.
- Current page metadata and structure: local files `index.html`, `best-gravel-types.html`, `driveway-cost-guide.html`, `sitemap.xml`.
- Google structured data guidelines: https://developers.google.com/search/docs/appearance/structured-data
- Google spam policies (doorway pages, scaled content): https://developers.google.com/search/docs/essentials/spam-policies
- Google title/description guidance: https://developers.google.com/search/docs/appearance/title-link

---

*End of LANDING-PAGE-STRATEGY.md*
