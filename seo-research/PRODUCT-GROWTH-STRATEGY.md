# Product & Growth Strategy — Pro Gravel Calculator

> **Research date:** 2026-11-01
> **Scope:** Phase 5 of the brief — evaluate the candidate features, prioritize them against demand, competitive gap, effort, SEO potential and real usefulness, and define a build sequence.
> **Constraint:** no website code changes are made by this report. Every feature below requires explicit approval before implementation.
> **Data honesty:** demand evidence comes from Google Autocomplete and observed competitor pages on 2026-11-01. Scores are analyst judgments, not measured conversion or revenue data.

---

## 1. Product thesis

The site currently sells **volume**. The market buys **an order**.

A gravel buyer does not wake up wanting cubic yards. They want to know:

1. How much material do I need for *this* project?
2. How much extra should I add so I don't run short?
3. How many tons is that, and how many bags if I buy bagged?
4. What will it cost, including delivery?
5. Can I hand this to my supplier and be done?

Competitors answer #1 well. Most answer #3 partially. Very few answer #2, #4 and #5 together. That is the product opening.

**Positioning:**
> The most complete free gravel order planner — volume, weight, bags, waste, compaction, cost and a supplier-ready estimate, without an account.

---

## 2. Feature evaluation

### 2.1 Scoring method

Each feature is scored 1–5 on:

- **Demand** — evidence from Autocomplete/SERP that people want it.
- **Gap** — how poorly the reviewed competitors serve it.
- **SEO** — ability to create or support a rankable page.
- **Usefulness** — real value to a buyer, independent of SEO.
- **Ease** — inverse of development difficulty (5 = trivial, 1 = major build).

**Weighted priority** = 0.30·Demand + 0.20·Gap + 0.25·SEO + 0.15·Usefulness + 0.10·Ease. Maximum 5.00.

These weights favour demand and SEO because the goal is organic growth; usefulness and gap prevent building SEO-only features.

### 2.2 Evaluation table

| Feature | Demand | Gap | SEO | Useful | Ease | **Score** | Priority |
|---|---:|---:|---:|---:|---:|---:|---|
| Gravel cost estimator | 5 | 5 | 5 | 5 | 3 | **4.80** | **P0** |
| Waste allowance | 5 | 5 | 3 | 5 | 5 | **4.50** | **P0** |
| Compaction allowance | 5 | 5 | 3 | 5 | 5 | **4.50** | **P0** |
| Reverse / coverage mode | 4 | 4 | 5 | 5 | 5 | **4.50** | **P0** |
| Gravel bag calculator | 4 | 5 | 4 | 5 | 5 | **4.45** | **P0** |
| Driveway gravel calculator | 5 | 3 | 5 | 5 | 3 | **4.40** | **P0** |
| Bag vs bulk break-even | 4 | 5 | 4 | 5 | 4 | **4.35** | **P1** |
| Metric outputs (m³, tonnes, kg) | 4 | 5 | 3 | 5 | 5 | **4.20** | **P0** |
| Layer-by-layer driveway planner | 4 | 4 | 5 | 5 | 2 | **4.20** | **P1** |
| Project presets | 4 | 4 | 4 | 5 | 4 | **4.15** | **P1** |
| Pea gravel calculator | 4 | 4 | 4 | 4 | 5 | **4.10** | **P0** |
| Material density comparison | 4 | 4 | 4 | 4 | 5 | **4.10** | **P1** |
| Mobile-friendly interface | 5 | 2 | 4 | 5 | 4 | **4.05** | **Maintain** |
| Crushed stone calculator | 4 | 4 | 4 | 4 | 4 | **4.00** | **P1** |
| Printable project estimates | 4 | 5 | 2 | 5 | 4 | **3.85** | **P1** |
| French drain gravel calculator | 3 | 4 | 4 | 4 | 3 | **3.60** | **P1** |
| Shareable calculations | 3 | 5 | 2 | 4 | 5 | **3.50** | **P1** |
| Assumption warnings | 3 | 5 | 1 | 5 | 5 | **3.40** | **P1** |
| Custom density override | 3 | 3 | 3 | 4 | 5 | **3.35** | **P2** |
| Sticky mobile result bar | 3 | 4 | 1 | 4 | 5 | **3.05** | **P2** |
| Visual measurement diagram (enhance) | 3 | 3 | 2 | 4 | 4 | **3.00** | **P2** |
| Triangle / ring / multi-section | 2 | 3 | 3 | 4 | 3 | **2.90** | **P2** |

### 2.3 What the ranking says

- The **highest-value work is not another page**. It is the accuracy and purchasing layer: cost, waste, compaction, reverse mode, bags, metric output.
- The **driveway page** is still P0 because it is the strongest commercial intent and the natural home for the new controls.
- **Printable estimates and shareable calculations** score lower on SEO but are the main differentiation and retention features. Treat them as product, not content.
- **Photo measurement, accounts, AI assistants and 3D visualisers were not scored** because they fail the "actual usefulness per unit of effort" test in the first 90 days. See §6.

---

## 3. P0 specifications (build first)

> These are specifications for later approval, not instructions to change code now.

### P0-A. Waste and compaction controls

**Problem:** the site tells users to add 5–10% manually and mentions compaction in the FAQ without a control.

**Requirements**
- Two independent inputs:
  - **Waste / overage**: 0–25%, step 1%, default 5%.
  - **Compaction allowance**: 0–20%, step 1%, default by project preset (0% decorative, 10% driveway base, 0% French drain clean stone).
- Show a one-line explanation next to each: waste covers spillage, low spots and cutting; compaction covers material lost into voids when compacted.
- Outputs:
  - Net volume (yd³ or m³)
  - Ordered volume after allowances
  - Net weight and ordered weight (tons or tonnes)
  - Bag count from the **ordered** quantity
- Formula: `ordered = net × (1 + waste% + compaction%)`. Use additive, disclose it, and avoid multiplicative double-counting.
- Round bags **up** to whole bags. Round tons to one decimal.
- Persist values in the share URL.

**Acceptance criteria**
- Changing either slider updates results without a page reload.
- The printed estimate shows both percentages and the ordered quantity.
- A user can set both to 0% and reproduce the current output exactly.
- No existing calculation changes when the defaults are 5% waste / 0% compaction? **Decision needed:** if defaults are non-zero, existing users will see different numbers. Recommend defaulting both to **0% on first load**, with a visible "Recommended: 5–10%" hint, then remembering the choice. This preserves trust and avoids silently inflating every estimate.

---

### P0-B. Cost estimator

**Problem:** no cost output at all; cost is the highest-commercial-value feature in the niche.

**Requirements**
- Price basis selector: **per ton**, **per cubic yard**, **per bag**.
- Price field (numeric, local currency symbol).
- Optional **delivery fee** (flat).
- Optional **tax rate** (0–20%).
- Optional **currency selector** (USD default; GBP, EUR, CAD, AUD). Do **not** convert between currencies — the user enters a local price. State this explicitly.
- Outputs: material cost, delivery, tax, total; cost per ton and cost per yd³ for comparison.
- If price is per bag, use the selected bag size from P0-C.
- Never claim the price is current or local. Label it "your estimate" and show the entered price.

**Acceptance criteria**
- Switching price basis recalculates correctly.
- Zero/blank price hides the cost block rather than showing $0.
- Cost values appear in print/PDF and the share URL.
- No fabricated default prices. Placeholder text only, e.g. "e.g. 45".

---

### P0-C. Bag calculator and bag-size selector

**Problem:** only 50 lb bags are supported; the bag query cluster is underserved.

**Requirements**
- Bag presets:
  - 0.5 cu ft (~50 lb typical)
  - 0.75 cu ft
  - 1.0 cu ft
  - 25 kg
  - 50 lb (weight-based)
- Optional "bags per pallet" input, default 48, clearly labelled as editable because it varies by retailer.
- Outputs: bags required (rounded up), pallets required, leftover estimate.
- Bulk vs bag comparison: total bag cost vs bulk cost if a per-ton/per-yard price is present.
- A dedicated `/gravel-bag-calculator/` page will reuse this module.

**Acceptance criteria**
- Bag count changes correctly with bag size.
- Pallet count rounds up.
- The comparison states which option is cheaper **for the entered prices**, and shows the difference.
- No claim that bagged or bulk is universally cheaper.

---

### P0-D. Metric outputs

**Problem:** metric inputs produce imperial outputs.

**Requirements**
- When Metric is selected, show:
  - Volume in m³ (primary) and yd³ (secondary)
  - Weight in metric tonnes and kg
  - Bags in 25 kg (primary) and 50 lb equivalent
- Internal math can remain in feet; convert at the display layer.
- Conversion constants: 1 ft³ = 0.0283168 m³; 1 lb = 0.453592 kg; 1 short ton = 0.907185 t.
- Density display in kg/m³ when metric.

**Acceptance criteria**
- Toggling units converts inputs **and** outputs.
- Printed estimate uses the active unit system.
- No rounding drift greater than 1% versus a manual calculation.

---

### P0-E. Reverse / coverage mode

**Problem:** the tool only goes area → quantity. Many searches go quantity → area.

**Requirements**
- Mode toggle: **"Calculate material"** vs **"Calculate coverage"**.
- Coverage inputs: quantity (tons, yd³, or bags), depth, material.
- Coverage outputs: area in ft² and m²; optionally length at a fixed width.
- Depth output variant: given quantity and area, return achievable depth.
- Include worked examples for 1 ton, 1 yd³ and 4 tons at common depths.

**Acceptance criteria**
- Results are the mathematical inverse of the main calculator within rounding.
- The page states the density used.
- Coverage mode is linkable via URL.

---

### P0-F. Driveway gravel calculator page

**Problem:** the strongest commercial intent has no dedicated page.

**Requirements**
- Reuse the calculator with a driveway preset: 4 in base, 2 in surface, crushed stone default.
- Two-layer toggle (base + surface), each with material and depth.
- Depth guidance by driveway type (light vehicle, heavy use, sloped).
- Links to the cost guide and the bag calculator.
- The full page specification is in `LANDING-PAGE-STRATEGY.md`.

**Dependency:** layer logic should be designed before this page ships, or the page launches as a single-layer preset and is upgraded later. Recommend building the **single-layer preset first** (2 weeks) and the two-layer mode second, so SEO value ships earlier.

---

### P0-G. Pea gravel calculator page

**Requirements**
- Preset pea gravel density.
- Depth guidance for paths (2–3 in), patios (3 in), playgrounds (6–12 in, with a safety caveat).
- Bag counts and cost.
- Link to the comparison guide.
- Full spec in `LANDING-PAGE-STRATEGY.md`.

---

## 4. P1 specifications (build second)

### P1-A. Expand materials to 8–10 with sources

Add, at minimum:
- #57 crushed stone
- #411 / #304
- Crusher run / ABC / road base
- Decomposed granite
- River rock (already present)
- Lava rock
- Marble chips
- Riprap

Each entry needs: display name, lb/ft³, kg/m³, t/yd³, typical range, common uses, source note. **Do not add a material without a cited density.** Where sources disagree, show the range and the selected default.

### P1-B. "I know the square footage" input

Add an area-first mode alongside length × width. This directly serves `gravel calculator square feet` and is the most common shortcut for users who already measured.

### P1-C. Supplier-ready order sheet

Upgrade the existing print/PDF into a one-page document:

- Site/project label (optional, user-entered)
- Date and time
- Shape diagram
- Dimensions and area
- Material, density and source
- Depth, waste %, compaction %
- Net and ordered volume
- Weight (tons/tonnes)
- Bag size and count
- Cost breakdown (if entered)
- Assumptions and disclaimer
- Calculation URL / QR code

**Why:** no reviewed competitor produces this. It is the clearest product moat and a natural link/share driver.

### P1-D. Layer-by-layer driveway planner

Three layers (sub-base, base, surface), each with material, depth, compaction and area. Show a stacked diagram and per-layer totals. This goes beyond CalculateGravel's two-layer mode without copying its interface.

### P1-E. Bag vs bulk break-even

Part of P0-C but worth calling out as a content asset: a table showing, at common quantities, when bags stop making sense. Publish the assumptions and let users change prices.

### P1-F. French drain calculator

Requires different geometry:
- Trench length × width × depth
- Pipe diameter and length (subtract pipe volume)
- Gravel fill percentage
- Filter fabric area estimate
- Slope guidance
- Recommended stone: clean ¾" crushed, no fines

This is genuinely different math, not a reskin. It justifies its own page.

### P1-G. Crushed stone calculator

Presets for #57, #411, crusher run and riprap, plus base-layer guidance. Distinct from pea gravel (decorative) and driveway (project).

### P1-H. Assumption warnings

Inline flags such as:
- "2 inches is shallow for a driveway surface — 3–4 inches is typical."
- "You selected a French drain but did not deduct the pipe volume."
- "Depth above 12 inches is unusual for decorative gravel."
- "Your entered density is outside the typical range for this material."

This demonstrates expertise and reduces bad orders. It is cheap to build and hard for competitors to copy without the same domain knowledge.

### P1-I. Density comparison and methodology

A visible table across materials with lb/ft³, kg/m³, t/yd³, typical range, source and last-reviewed date. Link it from every calculator. This also fixes the About-page contradiction.

---

## 5. Deferred (P2) features

| Feature | Why defer |
|---|---|
| Triangle, ring/annulus, multi-section area | Useful but low demonstrated demand. Add when the core purchase layer is complete. |
| Custom density override | Valuable for contractors; low search demand. Bundle with the density panel. |
| Sticky mobile result bar | Good UX, minimal SEO. Do it during a UX pass. |
| Interactive diagram depth/layer upgrade | The existing SVG is already an advantage; enhance later. |
| Save projects to localStorage | Nice retention feature; needs a clear privacy statement. |
| Embeddable widget | Strong backlink play but requires support and versioning. Consider after 90 days. |
| Regional versions (UK/CA/AU) | Validate with Search Console geo data first. Build one real localised version, not clones. |

---

## 6. Rejected features (and why)

| Feature | Verdict | Reason |
|---|---|---|
| **Photo-based measurement** | Reject for 90 days | The Gravel Calculator already owns the message; accuracy is hard; high build cost; weak SEO moat. |
| **User accounts** | Reject | No user need demonstrated; adds privacy burden and maintenance. |
| **AI chat assistant** | Reject | Expensive, hallucination risk on numbers, and it does not match the query intent. |
| **3D visualiser** | Reject | High cost, low utility for ordering. |
| **Supplier marketplace / lead auction** | Defer beyond 90 days | Operational and legal complexity; requires traffic first. |
| **City/state calculator pages** | Reject | Doorway-page risk; no real local data. |
| **A calculator for every material** | Reject | Dilutes quality. Build pages only where demand and differentiation justify it. |
| **Currency conversion** | Reject | Requires live FX and creates liability. Let users enter local prices with a symbol selector. |

---

## 7. Architecture recommendations

The site is static HTML + Tailwind CDN + vanilla JS, with header/footer duplicated across pages. That is workable for 10–20 pages but will become error-prone as the calculator cluster grows.

### 7.1 Keep the static architecture

Do **not** migrate to React/Next/Vue in the next 90 days. The SEO value is in fast static HTML, and a migration would consume the entire roadmap.

### 7.2 Extract a calculator module

Move shared logic into a config-driven module:

```
assets/
  calculator.js        // shared engine: area → volume → weight → bags → cost
  materials.js         // material records with density + source + range
  presets.js           // driveway, pea gravel, crushed stone, bags, french drain
  url-state.js         // serialize/deserialize calculation state
  print.js             // order sheet generation
```

Each page supplies a preset object and renders the same components. This avoids seven copies of the calculator and keeps behaviour consistent.

### 7.3 Data model for materials

```js
{
  id: "crushed_stone_57",
  label: "#57 Crushed Stone",
  lbPerFt3: 100,
  typicalRangeLbPerFt3: [95, 105],
  source: "…",
  reviewed: "2026-11-01",
  uses: ["driveway surface", "drainage", "base"],
  notes: "Clean, angular, ¾–1 in."
}
```

Density must be editable per material without touching calculation code.

### 7.4 URL state

Use a single `calc` parameter or explicit params with a version:

```
?shape=rectangle&l=20&w=10&d=4&material=crushed_stone_57&waste=5&comp=10&unit=imperial&price=45&basis=ton&v=2
```

Keep the existing `volume`, `weight`, `bags`, `material`, `shape` params working for `contact.html` backward compatibility.

### 7.5 Tailwind

Compile Tailwind at build time and drop the CDN. Current Lighthouse mobile: Performance 87, FCP 2.5 s, with the CDN as the largest resource (126,865 bytes) and 2.16 s of main-thread work attributed to the document/Tailwind runtime. This is an engineering change requiring approval.

### 7.6 Accessibility

Fix the measured defects before adding features:
- programmatic labels for the depth slider and material select
- `for`/`id` on all dimension inputs
- `aria-live="polite"` on results
- contrast fixes (metric toggle 4.34:1, footer 2.56:1)
- heading order in the footer
- one H1 per page

Accessibility is also an AdSense/UX quality signal.

### 7.7 Analytics

No analytics or Search Console verification is currently installed. Add:
- GA4 or a privacy-friendly alternative with consent
- Search Console DNS verification
- Events: `calculate`, `depth_change`, `material_change`, `waste_change`, `compaction_change`, `cost_toggle`, `print`, `pdf`, `share`, `quote_click`, `bag_vs_bulk_view`
- UTM tagging on internal campaign links if any

Do not add behavioural advertising before a consent mechanism exists.

---

## 8. Growth loops

Product features should create compounding distribution, not just one-off sessions.

| Loop | Mechanism | Feature dependency |
|---|---|---|
| **Share loop** | User sends a calculation link to a partner/supplier; recipient lands on a pre-filled calculator. | P0-E share URL |
| **Print loop** | Printed order sheet carries the domain and a QR/short link to the calculation. | P1-C order sheet |
| **Link loop** | Methodology/density page becomes a citable reference for forums, blogs and contractors. | P1-I density page |
| **Return loop** | Users bookmark the calculator for the next project; no account needed. | Fast load + memorable brand |
| **Search loop** | Each intent page ranks, internally links to the hub, and passes authority. | Landing-page cluster |

---

## 9. Success measurement

No traffic or revenue targets are promised. These are the metrics to watch and the thresholds that indicate the product work is succeeding.

### Product metrics (after analytics is installed)
- Calculator completion rate (a result is generated / page view)
- Interaction rate (any input change / page view)
- Print + PDF rate
- Share rate
- Quote-click rate
- Bag-vs-bulk panel open rate
- Mobile vs desktop completion gap

### Technical thresholds
- Lighthouse mobile Performance ≥ 95 after Tailwind compilation
- Accessibility ≥ 95
- CLS < 0.1
- LCP < 2.5 s
- No console errors
- All calculator pages pass Rich Results Test for their schema

### SEO metrics (Search Console, after verification)
- Indexed pages vs submitted pages
- Impressions and clicks by page cluster
- Queries in positions 10–50 ("striking distance")
- CTR by page
- Core Web Vitals field status
- Manual actions / security issues (should remain zero)

**Do not** judge success by a single head-term ranking in the first 90 days. Judge by indexed intent pages, impressions growth across the cluster, and completion of the product layer.

---

## 10. Build sequence and dependencies

```
Week 1–2   Accuracy layer: waste, compaction, metric outputs, share URL
Week 3–4   Cost estimator + bag selector (shared module)
Week 5     Driveway page (single-layer preset) + homepage optimization
Week 6     Tons page (reverse mode) + pea gravel page
Week 7     Cost page + bag page
Week 8     Crushed stone page + French drain page
Week 9–10  Order sheet + layer planner + density/methodology page
Week 11–12 Content, internal links, accessibility, performance, GSC review
```

**Critical path:** shared calculator module → accuracy controls → cost/bags → pages. Building pages before the module exists guarantees seven inconsistent calculators and a maintenance problem.

---

## 11. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Feature work delays page launches | High | High | Ship single-layer pages first; upgrade later. Timebox each feature. |
| Cost data becomes stale or misleading | Medium | Medium | Never ship default prices; label all costs as user-entered; date the methodology. |
| Calculator regressions break print/PDF/quote | Medium | High | Add regression tests for the core formulas and the contact hand-off before refactoring. |
| AdSense rejection due to thin content | Medium | High | Fix trust pages and publish substantive calculators before applying. See `ADSENSE-READINESS.md`. |
| Accessibility regressions | Medium | Medium | Add Lighthouse CI or a manual checklist per release. |
| Scope creep into rejected features | High | Medium | Keep §6 as a written "not now" list. |
| Duplicate calculators cannibalise each other | Medium | High | Enforce the cannibalisation map in `KEYWORD-RESEARCH.md` §10. |
| Tailwind CDN keeps performance at ~87 | High | Medium | Compile Tailwind as a discrete, approved task. |

---

## 12. Decision points requiring approval

Before any code changes, confirm:

1. **Default allowances.** Should waste default to 0% (preserve current numbers) or 5% (recommended practice)? Recommendation: 0% with a visible recommendation hint.
2. **Market.** Confirm the US is the primary market, with metric as a secondary toggle. This affects currency, terminology (#57, short tons) and the Pakistan/PKR content removal.
3. **Currency.** USD only, or a symbol selector without FX conversion? Recommendation: symbol selector, no conversion.
4. **Materials.** Approve the 8–10 material list and the density sources before implementation.
5. **Order sheet branding.** What name/contact should appear on the printed estimate? A real business name is needed for trust.
6. **Analytics.** GA4 (with consent) or a privacy-friendly alternative?
7. **Build approach.** Keep static HTML with a shared JS module, or introduce a small build step for partials? Recommendation: shared JS module only; no framework migration.

---

## 13. Sources

- Google Autocomplete, en-US, 2026-11-01 (queries listed in `KEYWORD-RESEARCH.md` §2).
- Competitor pages listed in `COMPETITOR-RESEARCH.md` §8.
- Local project files: `index.html`, `script.js`, `style.css`, `contact.html`, `about.html`, `best-gravel-types.html`, `driveway-cost-guide.html`.
- Lighthouse mobile lab run, 2026-11-01 (`lh-home-mobile.json`).
- Google helpful content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google spam policies (doorway pages): https://developers.google.com/search/docs/essentials/spam-policies
- Web.dev Core Web Vitals: https://web.dev/articles/vitals

---

*End of PRODUCT-GROWTH-STRATEGY.md*
