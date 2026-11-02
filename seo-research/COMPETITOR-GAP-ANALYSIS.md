# Competitor Gap Analysis — Pro Gravel Calculator

> **Research date:** 2026-11-01
> **Purpose:** Phase 4 of the brief — compare Pro Gravel Calculator with the strongest competitors, identify genuine product differentiation opportunities, and avoid copying.
> **Method:** manual feature review of publicly rendered pages plus the local codebase. Scores are **analyst judgments (1–5)**, not benchmark results. Where a feature may exist behind JavaScript that was not executed, this is flagged.
> **Not measured:** traffic, rankings, conversions, revenue, backlinks, real-user performance.

---

## 1. Scoring rubric

| Score | Meaning |
|---|---|
| **5** | Best-in-class among the reviewed set; a clear reason to choose the site. |
| **4** | Strong; covers the need with minor gaps. |
| **3** | Adequate; present but basic. |
| **2** | Weak; partial or awkward. |
| **1** | Missing or effectively unusable. |
| **n/m** | Not measured (performance only). |

A high score does **not** mean the competitor is better overall. It means that dimension is solved.

---

## 2. Comparison matrix

| Dimension | Pro Gravel | TheGravelCalc | Omni | Inch | CalcSoup | CalculateGravel | PeaGravelCalc |
|---|---:|---:|---:|---:|---:|---:|---:|
| **Calculator functionality** (shapes, live update, logic) | **4** | 4 | 4 | 4 | 4 | **5** | 3 |
| **Material selection** | 2 | **4** | 3 | 4 | **5** | **5** | 3 |
| **Measurement options** | 3 | **4** | 3 | 4 | **4** | 4 | 3 |
| **Unit conversion (input *and* output)** | 2 | 3 | **5** | **5** | **5** | **5** | 4 |
| **Cost estimation** | 1 | 4 | 4 | 4 | **5** | **5** | 4 |
| **Density transparency** | 3 | 2 | 3 | 3 | **4** | 3 | **4** |
| **Waste allowance** | 1 | 2 | 1 | 3 | **5** | **4** | 4 |
| **Compaction allowance** | 1 | 2 | 1 | 3 | **5** | 4 | 3 |
| **Mobile experience** | **4** | 4 | 4 | 3 | 2 | **4** | 3 |
| **Interactive diagrams** | **4** | 2 | 2 | 1 | 1 | 2 | 2 |
| **Downloadable / printable report** | **4** | 1 | 1 | 1 | 1 | 2 | 1 |
| **Shareable calculation** | 2 | 1 | **4** | 3 | 3 | 3 | 2 |
| **Educational content** | 3 | 2 | **5** | **5** | 3 | 4 | 4 |
| **Page structure / intent cluster** | 2 | 2 | **5** | **4** | 2 | **5** | **4** |
| **Trust / E-E-A-T signals** | 1 | 2 | **5** | **5** | 2 | 2 | 4 |
| **Accessibility (measured, homepage)** | 2 | n/m | n/m | n/m | n/m | n/m | n/m |
| **Performance (measured, homepage)** | **4** | n/m | n/m | n/m | n/m | n/m | n/m |

**Reading the matrix**
- Pro Gravel is already **competitive on the calculator itself** (4) and **best on interactive diagrams and printable reports** (4 each).
- It is **weak exactly where purchase decisions are made**: cost (1), waste (1), compaction (1), materials (2), unit output (2).
- The strongest competitors win on **breadth + trust**, not on a better rectangle calculator.

---

## 3. Dimension-by-dimension analysis

### 3.1 Calculator functionality

**Best in set:** CalculateGravel (project presets, buffer slider, copy result), then Omni/Inch/CalcSoup for solid multi-shape logic.

**Pro Gravel today**
- Rectangle, circle (diameter), and L-shape (two rectangles).
- Live recalculation, depth slider 0–24 in in 0.5 in steps, SVG preview.
- Correct core math: area × depth → ft³ → yd³ → short tons → 50 lb bags.
- No triangle, no ring/annulus, no multi-area summation, no reverse mode.

**Gap:** shape coverage is adequate but the **workflow** stops at "here is a number". Competitors increasingly answer "what do I order and what will it cost?"

**Opportunity (not a copy):** make the calculator produce a **complete order decision**, not just a quantity. That is a workflow advantage, not a feature-count contest.

---

### 3.2 Material selection

**Best in set:** CalculatorSoup (14 named materials + custom density), CalculateGravel (12+).

**Pro Gravel today:** four materials — pea gravel 105 lb/ft³, crushed stone 100, sand 110, river rock 108.

**Gap:** four is the minimum viable set. Missing the materials US buyers actually search for:
- #57 crushed stone
- #411 / #304 / crusher run / ABC / road base
- decomposed granite
- lava rock
- marble chips
- riprap
- topsoil (adjacent)
- custom density

**Opportunity:** don't chase 18 materials for the sake of it. Add the **8–10 materials that match US purchase language**, each with a source, and expose a **custom density override**. Quality and traceability beat raw count.

**Risk if unchanged:** the crushed-stone page cannot honestly target `#57 gravel calculator` or `crusher run calculator` without those presets.

---

### 3.3 Measurement options

**Best in set:** The Gravel Calculator (auto-detect / manual / photo), CalculatorSoup (rectangle, circle, triangle, total area).

**Pro Gravel today:** manual entry, three shapes, ft+in or m+cm.

**Gap:** no "I already know the area" mode, no triangle, no multi-section total, no ring (annulus) for tree wells/fire pits.

**Opportunity:** add **"I know the square footage"** as a first-class input. It is the single most common shortcut and it directly serves `gravel calculator square feet`, which is in Autocomplete. Then add multi-section summation for irregular yards (more useful than an L-shape-only mode).

---

### 3.4 Unit conversion

**Best in set:** Omni, Inch, CalculatorSoup, CalculateGravel (full input and output conversion).

**Pro Gravel today:** inputs convert between imperial and metric, but **outputs remain cubic yards, short tons and 50 lb bags**. A metric user enters metres and receives imperial results.

**Gap:** this is a correctness/UX issue, not a nice-to-have. It limits UK/CA/AU relevance and looks unfinished to metric users.

**Opportunity:** output m³, metric tonnes and kg when Metric is selected; show both systems in a secondary line. This is table stakes, not differentiation.

---

### 3.5 Cost estimation

**Best in set:** CalculatorSoup (currency + price per unit type), CalculateGravel (price per ton/yard + buffer + delivery context).

**Pro Gravel today:** none. The site tells users to "budget" but provides no cost input.

**Gap:** cost is the **second question every buyer asks** and the highest-commercial-value feature in the niche. It is also the natural bridge to AdSense revenue and supplier leads.

**Opportunity:** a cost panel with price per ton **or** per cubic yard, optional delivery fee, optional tax, and a **bag-vs-bulk comparison**. The differentiator is not "we have a price field" — it is "we tell you which purchase method is cheaper for your quantity".

---

### 3.6 Density transparency

**Best in set:** PeaGravelCalculator.com (methodology page, review date, sources) and CalculatorSoup (explicit per-material density table).

**Pro Gravel today:** densities are visible in the material dropdown (105/100/110/108 lb/ft³), which is better than most. But:
- The About page states **2,835 lb/yd³** for crushed stone, while the calculator uses 100 lb/ft³ = **2,700 lb/yd³**. That is a direct contradiction.
- No source, no methodology, no custom override.
- No explanation that bulk density ≠ particle density and varies with moisture and grading.

**Gap:** trust. A user who notices the contradiction has no reason to trust any number on the site.

**Opportunity:** a **density panel** showing lb/ft³, kg/m³, t/yd³, typical range and source, plus an editable value. This is a genuine trust differentiator in a niche where most sites publish unsourced constants.

---

### 3.7 Waste allowance

**Best in set:** CalculatorSoup (separate 5–15%), CalculateGravel (buffer slider 5–15%), PeaGravelCalculator (waste %).

**Pro Gravel today:** none. The FAQ tells users to add 5–10% manually.

**Gap:** the user must do the most important purchasing adjustment by hand, outside the tool. Every serious competitor automates it.

**Opportunity:** a **waste slider with a recommended default by project type** and a plain-language explanation of *why* (spillage, low spots, cutting, settling). Add a visible "ordered quantity" line so the user sees base vs buffered totals.

---

### 3.8 Compaction allowance

**Best in set:** CalculatorSoup (separate 5–30%), GroundCalc (+12% default), RemodelCalculators (compaction multiplier).

**Pro Gravel today:** none. Worse, the site's FAQ says gravel "shrinks after compaction" without quantifying it and without a control.

**Gap:** compaction and waste are **different phenomena** and should not be one slider. Compaction affects base layers; waste affects cutting/spillage. Conflating them produces either over-ordering or shortfalls.

**Opportunity:** two separate controls, with presets: decorative 0–5%, path 5%, driveway base 10–15%, French drain 0% (clean stone, no compaction). Explain the difference in one sentence. Very few competitors do this well — CalculatorSoup is the exception and its UI is dated.

---

### 3.9 Mobile experience

**Best in set:** Pro Gravel, The Gravel Calculator, CalculateGravel (clean stacking, large tap targets).

**Pro Gravel today:** responsive Tailwind layout, calculator stacks well, large buttons, sticky header. Lighthouse mobile CLS 0.

**Gap:** not layout — **length**. The homepage combines calculator, guide, diagram, FAQ, quote CTA and ad slots into a very long mobile page. Results can scroll out of view while the user adjusts inputs.

**Opportunity:** a **sticky mobile result bar** (volume / tons / cost) that stays visible while inputs change. This is a usability improvement that also increases quote and share conversions.

---

### 3.10 Interactive diagrams

**Best in set:** Pro Gravel (live SVG for rectangle, circle, L-shape). Most competitors have static images or none.

**Pro Gravel today:** a real strength. The SVG updates with dimensions and shows labelled sides.

**Gap:** the diagram is visually useful but not **instructional** — it does not show depth, layers, or what to measure when the area is irregular.

**Opportunity:** extend the existing SVG (do not replace it) with a depth indicator and a layer toggle for driveway mode. Add a "what to measure" annotation for L-shape. This builds on an existing advantage instead of copying a photo tool.

---

### 3.11 Downloadable reports

**Best in set:** Pro Gravel (print view + PDF via html2pdf). No competitor observed offers a comparable supplier-ready document.

**Pro Gravel today:** `preparePrintView()` + `generatePDF()` produce a "Project Summary" with material, shape, dimensions, volume, weight. Good foundation.

**Gap:** the report omits cost, waste, compaction, bag size, delivery, assumptions and a date/time stamp in a shareable format. It is a receipt, not an order sheet. The print header duplicates an H1 and the live page appears to show duplicated print/share blocks (observed in the rendered fetch).

**Opportunity:** turn it into a **one-page supplier order sheet**: project name (optional), date, shape diagram, dimensions, material + density, depth, waste %, compaction %, net and ordered volume, weight in tons, bag count by bag size, cost breakdown, assumptions, and a QR/short link to the calculation. This is the clearest product moat available.

---

### 3.12 Shareable calculations

**Best in set:** Omni (share result), Inch (link to results), CalculatorSoup (share this calculation).

**Pro Gravel today:** `shareTool()` shares `window.location.href`, **not the current inputs**. The recipient gets a blank/default calculator.

**Gap:** a broken promise. The UI says "Share This Tool" but does not share the user's work.

**Opportunity:** serialize shape, material, depth, dimensions, units, waste and compaction into the URL, and restore them on load. `loadQueryParams()` already exists, so this is a small, high-value fix. It also creates a natural backlink/sharing loop.

---

### 3.13 Educational content

**Best in set:** Omni and Inch (deep, authored, cited), then CalculateGravel and PeaGravelCalculator (practical guides).

**Pro Gravel today:** a solid homepage guide (~1,380 words including nav), a comparison guide (~1,320 words), and a cost guide (~1,440 words). The writing is practical and original.

**Gap:** the content has **trust defects**, not just depth defects:
- Pakistan/PKR pricing inside a US-oriented comparison table.
- Unsourced "2026 global averages".
- "Built with civil engineers" with no named person.
- Density contradiction with the calculator.
- No visible dates or sources.
- Only one image across the entire site.

**Opportunity:** fewer, better, **sourced** pages with a named reviewer and visible dates. Depth is not the moat; credibility is.

---

### 3.14 Page structure / intent cluster

**Best in set:** Omni, CalculateGravel, PeaGravelCalculator (6–20 focused pages).

**Pro Gravel today:** one calculator page plus two articles. Every commercial modifier (driveway, tons, pea gravel, crushed stone, cost, bags, French drain) lands on the same generic page.

**Gap:** the site cannot rank for intents it has not built for. This is the largest SEO gap in the audit.

**Opportunity:** seven focused calculators (see `LANDING-PAGE-STRATEGY.md`), each with a real pre-configured tool — not doorway text.

---

### 3.15 Trust / E-E-A-T

**Best in set:** Omni (named authors, credentials, editorial policy) and Inch (author bio, citation block).

**Pro Gravel today:** Organization schema, an About page, Privacy, Terms. No named author, no methodology, no sources, no visible dates, no real contact submission.

**Gap:** this is the weakest dimension and the one that most limits AdSense approval and long-term rankings.

**Opportunity:** a **methodology page** with the density table, formulas, assumptions and sources; a **named reviewer** (real person, real credential, or remove the claim); visible "last updated" and "reviewed by" lines; a working contact method.

---

## 4. Genuine differentiation opportunities

These are framed as product advantages, not copies of competitor features.

### D1. The supplier-ready order sheet (highest differentiation)

**What:** a printable/shareable one-page estimate that a user can hand to a quarry or landscaper.

**Why it wins:** no reviewed competitor produces a complete document. Most output a number on screen. The existing print/PDF code is already 70% of the work.

**Contents:** project label, date, diagram, dimensions, material + density + source, net volume, waste %, compaction %, ordered volume, short tons, bag count for the chosen bag size, cost breakdown, delivery, assumptions, calculation URL/QR.

**Effort:** medium. **SEO value:** indirect but strong (shares, links, return visits, brand queries). **User value:** very high.

---

### D2. Layer-by-layer driveway planner

**What:** model sub-base, base and surface as separate layers with different materials, depths and compaction, then total them.

**Why it wins:** driveway buyers routinely need two or three materials. CalculateGravel has a two-layer mode; a three-layer planner with a diagram and per-layer compaction goes further.

**Effort:** medium–high. **SEO value:** high (`driveway gravel calculator`, `gravel base calculator`). **User value:** high.

---

### D3. Bag vs bulk break-even

**What:** given quantity and local prices, show total cost for bulk delivery vs bagged, including the number of bags, pallets and the implied labour.

**Why it wins:** the bag cluster is underserved and the decision is genuinely confusing. Most sites show a bag count but not whether bags are the rational choice.

**Effort:** low–medium. **SEO value:** high (`gravel bag calculator`, `how many bags of gravel`). **User value:** high.

---

### D4. Transparent density panel with override

**What:** show each material's bulk density in lb/ft³, kg/m³ and t/yd³, a typical range, the source, and an editable field.

**Why it wins:** the niche is full of unsourced constants that differ by 10–20%. Transparency is a credible differentiator and a link magnet for "gravel density" queries.

**Effort:** low. **SEO value:** medium–high. **User value:** high for contractors.

---

### D5. Reverse mode ("I have X, how far will it go?")

**What:** enter tons/yards/bags and get coverage area at a chosen depth, or depth at a chosen area.

**Why it wins:** directly serves `how much will 4 tons of gravel cover`, `how much area does a ton cover`, and `how many bags do I need`. Omni has reverse mode for its generic calculator; few dedicated gravel tools do it well.

**Effort:** low. **SEO value:** high. **User value:** high.

---

### D6. Shareable calculation state

**What:** encode the full calculation in the URL and restore it on load.

**Why it wins:** the share button already exists and currently misleads. Fixing it turns a defect into a differentiator and creates a distribution loop.

**Effort:** low. **SEO value:** low directly, medium indirectly. **User value:** medium–high.

---

### D7. Assumption warnings

**What:** flag unusual inputs — e.g. depth below 1 in, above 12 in for decorative stone, driveway depth below 4 in, French drain without pipe deduction.

**Why it wins:** nobody in the reviewed set does this. It converts the calculator from a dumb formula into something that demonstrates expertise, and it reduces bad orders.

**Effort:** low. **SEO value:** indirect. **User value:** high. **Trust:** high.

---

### D8. Privacy-first, no-signup positioning

**What:** state plainly that calculations run in the browser, no account is needed, and no measurement data is stored.

**Why it wins:** true of the current architecture, and increasingly valued. The UK aggregate site uses a similar message.

**Effort:** very low. **SEO value:** low. **User value:** medium. **Trust:** medium.

---

## 5. What **not** to compete on

| Temptation | Why to avoid it |
|---|---|
| **Photo-based measurement** | The Gravel Calculator already owns this message. It is technically hard, accuracy-sensitive, and does not create durable SEO value. |
| **18+ materials on day one** | Breadth without sourcing creates error risk and thin pages. Add materials only with a cited density. |
| **40+ calculators** | Dilutes quality and internal-link equity. Seven excellent calculators beat forty thin ones. |
| **Supplier marketplace / lead auction** | Operationally heavy, requires supply relationships, and creates trust/legal obligations. Revisit only after traffic exists. |
| **AI chat assistant** | Expensive, hard to keep accurate, and not what the query needs. |
| **Beating Omni on generic "calculator" terms** | Domain authority and content depth are not winnable head-on in 90 days. Win specific intents first. |
| **City/state doorway pages** | Spam-policy risk with no real local data. |

---

## 6. Prioritized gap list

Priority uses **user impact × SEO impact ÷ effort**. Effort is engineering time, not calendar time.

| # | Gap | User impact | SEO impact | Effort | Priority |
|---|---|---|---|---|---|
| 1 | Metric outputs (m³, tonnes, kg) | High | Medium | Low | **P0** |
| 2 | Waste allowance slider | High | Medium | Low | **P0** |
| 3 | Compaction allowance (separate) | High | Medium | Low | **P0** |
| 4 | Cost estimator (per ton/yard + delivery) | Very high | High | Medium | **P0** |
| 5 | Shareable calculation URL | Medium | Low | Low | **P0** |
| 6 | Bag-size selector + bag cluster | High | High | Low | **P0** |
| 7 | Fix density contradiction + methodology | High (trust) | Medium | Low | **P0** |
| 8 | Expand to 8–10 US materials + custom density | High | High | Medium | **P1** |
| 9 | "I know the square footage" input | High | High | Low | **P1** |
| 10 | Reverse mode (quantity → coverage) | High | High | Low–medium | **P1** |
| 11 | Supplier-ready order sheet (print/share) | Very high | Medium | Medium | **P1** |
| 12 | Layer-by-layer driveway planner | High | High | Medium–high | **P1** |
| 13 | Bag vs bulk break-even | High | High | Low–medium | **P1** |
| 14 | Assumption warnings | High (trust) | Low | Low | **P1** |
| 15 | Sticky mobile result bar | Medium | Low | Low | **P2** |
| 16 | Triangle / ring / multi-section area | Medium | Medium | Medium | **P2** |
| 17 | Density source table + methodology page | High (trust) | Medium | Low | **P1** |
| 18 | Accessible labels, contrast, aria-live | Medium | Low | Low | **P1** |

---

## 7. The strategic conclusion

Pro Gravel Calculator does not have a calculator problem. It has a **decision-support problem**.

The current tool answers: *"What is the volume?"*
The user needs: *"What exactly do I order, how much will it cost, and can I show this to my supplier?"*

Every high-value gap in this analysis sits inside that second question. Closing it:
- creates a real reason to choose the site over Omni or Inch,
- unlocks the commercial keywords (cost, bags, driveway, tons),
- produces shareable artifacts that earn links,
- and gives AdSense a page set with genuine utility rather than thin affiliate-style content.

**Do this in order:** accuracy controls (waste, compaction, metric) → cost → bags and materials → shareable/printable order sheet → the seven intent pages. Building pages before the tool is complete would create seven thin doorway pages and waste the effort.

---

## 8. Limitations

- Scores are based on publicly rendered pages on 2026-11-01. A competitor may have features behind JavaScript, login, or A/B tests that were not executed.
- No competitor performance, traffic, conversion or revenue data was available. The only measured performance and accessibility scores in this document are for Pro Gravel Calculator's homepage (Lighthouse mobile: Performance 87, Accessibility 75, SEO 100, Best Practices 96).
- Feature presence is not the same as feature quality. A competitor may "have" cost estimation that is poorly implemented.
- This analysis does not recommend copying any competitor's design, copy, code or content.

---

*End of COMPETITOR-GAP-ANALYSIS.md*
