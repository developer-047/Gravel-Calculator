# Content Strategy — Pro Gravel Calculator

> **Research date:** 2026-11-01
> **Scope:** Phase 8 of the brief — an editorial plan built around the calculator cluster, not a volume-based blog.
> **Core rule:** content must be original, accurate, sourced and genuinely useful. No mass-generated articles. No keyword-stuffed pages. No invented prices, densities or statistics.
> **Relationship to other reports:** page specs live in `LANDING-PAGE-STRATEGY.md`; keyword evidence lives in `KEYWORD-RESEARCH.md`.

---

## 1. Content thesis

This is a **tool site**, not a publisher. Content exists to:

1. help a user complete a calculation correctly,
2. answer the question that comes immediately after the number,
3. earn trust that the number is right,
4. and give search engines a reason to treat the site as an authority on gravel quantity and cost.

That means the content mix should be roughly:

| Content type | Share of effort | Purpose |
|---|---:|---|
| Calculator pages | 45% | Rank for intent, deliver the tool |
| Reference assets (density, size, coverage) | 20% | Earn links and citations; support every calculator |
| Practical guides | 25% | Capture research intent and build topical authority |
| Trust pages (methodology, about, contact) | 10% | Convert and satisfy AdSense/quality expectations |

**Not** a 100-article blog. A focused library of 12–18 genuinely useful pages is stronger than 60 thin ones.

---

## 2. What the brief's suggested topics should become

The brief lists eight topics. Several should **not** become standalone articles because they would cannibalise a calculator page. Here is the decision for each.

| Brief topic | Decision | Where it lives | Reason |
|---|---|---|---|
| How much gravel do I need for a driveway? | **Merge** | `H2` on `/driveway-gravel-calculator/` | The calculator page owns this query. A separate article would compete with it. |
| How many tons of gravel fit in a cubic yard? | **Merge** | `H2` + table on `/gravel-calculator-tons/` | Conversion intent belongs on the conversion page. A separate article would be thin. |
| Pea gravel vs crushed stone | **Expand existing** | `/best-gravel-types.html` | The page already exists and targets the comparison. Improve it, do not clone it. |
| Best gravel depth for a driveway | **Merge** | `H2` + table on `/driveway-gravel-calculator/` | Same intent as the driveway calculator. Depth is a supporting section, not a page. |
| How to calculate gravel delivery costs | **New guide** | `/gravel-delivery-costs.html` | Distinct commercial-investigation intent; supports the cost calculator without duplicating it. |
| How much does a gravel driveway cost? | **Optimise existing** | `/driveway-cost-guide.html` | Already exists. Needs trust, currency and metadata fixes, not a rewrite. |
| Gravel density explained | **New reference asset** | `/gravel-density-chart.html` | Genuine standalone reference intent, link magnet, supports every calculator. |
| How to estimate gravel for a French drain | **Merge** | `H2` on `/french-drain-gravel-calculator/` | The calculator page owns the query. A separate article would split authority. |

**Principle:** if a topic's query is already the primary keyword of a calculator page, it becomes an H2 on that page. It does not get its own URL.

---

## 3. Content library

### 3.1 Existing pages to optimise (no new URL)

| Page | Primary keyword | Action | Priority |
|---|---|---|---|
| `/` | gravel calculator | Rewrite title/meta, one H1, remove hidden keyword H2s, consolidate FAQ schema, add visible density/methodology section, add calculator grid | P0 |
| `/best-gravel-types.html` | pea gravel vs crushed stone | Replace PKR/Pakistan table with USD, add size chart, add dates/sources, named author, image | P0 |
| `/driveway-cost-guide.html` | how much does a gravel driveway cost | Shorten title, add dates/sources/methodology, link to the new calculators | P0 |
| `/about.html` | about Pro Gravel Calculator | Fix density contradiction, remove unverifiable expert claims or name a real reviewer, add editorial policy | P0 |
| `/contact.html` | contact | Make the form work; add a real email fallback; add response-time expectation | P0 |
| `/privacy.html` | privacy policy | Rewrite to match actual tools; add consent/CMP section; remove DART wording; update date | P0 |
| `/terms.html` | terms of service | Add calculator-estimate disclaimer, limitation of liability, IP, governing law | P1 |
| `/thankyou.html` | — | Keep noindexed; add next-step links | P2 |

---

### 3.2 New reference assets (highest link value)

#### A. Gravel Density Chart

| Field | Detail |
|---|---|
| **URL** | `/gravel-density-chart.html` |
| **Primary keyword** | gravel density |
| **Secondary** | gravel density chart, density of gravel lb/ft³, gravel weight per cubic yard, crushed stone density, pea gravel density, gravel density kg/m³ |
| **Intent** | Informational / reference |
| **Title (54)** | `Gravel Density Chart – lb/ft³, kg/m³ & Tons per Yard` |
| **H1** | `Gravel Density Chart` |
| **Priority** | P1 — build after the first calculator wave |

**Heading structure**
- H2 What is gravel density?
- H2 Bulk density vs particle density (why the number varies)
- H2 Gravel density chart (lb/ft³, kg/m³, t/yd³, typical range)
- H2 Density by material: pea gravel, crushed stone, #57, crusher run, river rock, sand, decomposed granite, lava rock
- H2 How density affects tons, bags and cost
- H2 How to use a supplier's density figure
- H2 Methodology and sources
- H2 FAQ

**Questions to answer**
- What is the density of gravel in lb/ft³?
- What is the density of gravel in kg/m³?
- Why do different sites give different numbers?
- How many tons is a cubic yard of gravel?
- Does wet gravel weigh more?
- What density should I use for pea gravel / crushed stone / #57?
- Why does bulk density matter for ordering?

**Related calculator:** `/gravel-calculator-tons/`, all material pages.

**Internal links**
- In: every calculator page ("Density assumptions"), homepage methodology block, both guides.
- Out: tons page, crushed stone page, pea gravel page, bags page.

**Unique value**
- Every value has a range and a source, not a single unexplained constant.
- Explains bulk vs particle density — a distinction most competitors omit.
- Provides an editable/printable table.

**Sources required**
- USGS or a comparable public bulk-density reference.
- Supplier/industry charts where used, cited with date.
- Clearly label values as typical ranges, not universal constants.

---

#### B. Gravel Size Chart

| Field | Detail |
|---|---|
| **URL** | `/gravel-size-chart.html` |
| **Primary keyword** | gravel size chart |
| **Secondary** | driveway gravel sizes with pictures, #57 vs #411, gravel size chart pdf, crushed stone sizes, best gravel size for driveway |
| **Intent** | Informational / visual |
| **Title (50)** | `Gravel Size Chart: #57, #411, Crusher Run & More` |
| **H1** | `Gravel Size Chart` |
| **Priority** | P1 |

**Heading structure**
- H2 Gravel size chart (inches and millimetres)
- H2 #57 crushed stone
- H2 #411 / #304
- H2 Crusher run / ABC / road base
- H2 Pea gravel
- H2 River rock
- H2 Riprap
- H2 Which size for which project?
- H2 Photos and descriptions
- H2 FAQ

**Questions to answer**
- What size is #57 gravel?
- What is the difference between #57 and #411?
- What size gravel is best for a driveway?
- What size for a French drain?
- What size for a patio base?
- How do I read a gravel size chart?

**Related calculator:** `/crushed-stone-calculator/`, `/driveway-gravel-calculator/`.

**Internal links**
- In: crushed stone page, driveway page, best-gravel-types, French drain page.
- Out: crushed stone calculator, driveway calculator, comparison guide.

**Unique value**
- Original photos with a scale reference (not copied stock).
- A single table with US sieve sizes and metric equivalents.
- Plain-language "what it's used for" column.

**Production note:** this page needs real images. Do not publish it with text only — the query explicitly asks for pictures.

---

#### C. Gravel Coverage Chart (conditional)

| Field | Detail |
|---|---|
| **URL** | `/gravel-coverage-chart.html` — **only if** Search Console shows independent demand |
| **Primary keyword** | gravel coverage chart |
| **Secondary** | how much does a ton of gravel cover, gravel coverage per yard, square feet per ton |
| **Intent** | Informational / reference |
| **Priority** | P2 — start as an H2 on `/gravel-calculator-tons/` |

**Why conditional:** the tons page already owns reverse-coverage intent. A separate chart risks cannibalisation. Build it only if the section earns impressions but not clicks, which would indicate users want a dedicated reference.

---

### 3.3 New practical guides

#### D. Gravel Delivery Costs: How to Compare Quotes

| Field | Detail |
|---|---|
| **URL** | `/gravel-delivery-costs.html` |
| **Primary keyword** | gravel delivery cost |
| **Secondary** | gravel delivery fees, how much is gravel delivery, bulk gravel delivery, gravel delivery near me |
| **Intent** | Commercial investigation |
| **Title (47)** | `Gravel Delivery Costs: How to Compare Quotes` |
| **H1** | `Gravel Delivery Costs` |
| **Priority** | P1 |

**Heading structure**
- H2 What affects gravel delivery cost?
- H2 Flat fee vs per-ton vs per-mile pricing
- H2 Minimum order quantities and small-load surcharges
- H2 What to ask a supplier before ordering
- H2 How to compare two quotes fairly
- H2 When pickup is cheaper than delivery
- H2 How delivery changes your total project cost
- H2 FAQ

**Questions to answer**
- How much does gravel delivery cost?
- Is delivery included in the price per ton?
- What is a small-load surcharge?
- How many tons fit in a dump truck?
- Can I pick up gravel myself?
- How do I compare quotes?

**Related calculator:** `/gravel-cost-calculator/`.

**Internal links**
- In: cost calculator, cost guide, driveway calculator.
- Out: cost calculator, driveway cost guide, bags page.

**Unique value**
- A quote-comparison checklist rather than invented national averages.
- Explains the fee structures that actually change the total.
- No fake "average delivery cost in [city]" claims.

**Risk:** without real data, this page can drift into generic advice. Keep it specific and practical, and cite any published range to its source.

---

#### E. How to Build a Gravel Driveway (Layer by Layer)

| Field | Detail |
|---|---|
| **URL** | `/how-to-build-a-gravel-driveway.html` |
| **Primary keyword** | how to build a gravel driveway |
| **Secondary** | gravel driveway layers, driveway base preparation, geotextile under gravel, gravel driveway edging |
| **Intent** | Informational |
| **Title (49)** | `How to Build a Gravel Driveway (Layer by Layer)` |
| **H1** | `How to Build a Gravel Driveway` |
| **Priority** | P1 — after the driveway calculator |

**Heading structure**
- H2 Plan the driveway: width, length, slope and drainage
- H2 Step 1: mark and excavate
- H2 Step 2: prepare and compact the subgrade
- H2 Step 3: geotextile (when and why)
- H2 Step 4: sub-base
- H2 Step 5: base layer
- H2 Step 6: surface layer
- H2 Step 7: edge restraint
- H2 Step 8: compaction and watering
- H2 Common failures and how to avoid them
- H2 Cost and quantity planning
- H2 FAQ

**Questions to answer**
- How deep should each layer be?
- Do I need geotextile?
- What is the best base for a gravel driveway?
- How do I stop gravel from spreading?
- Can I build it myself?
- How long does it take?

**Related calculator:** `/driveway-gravel-calculator/`.

**Internal links**
- In: driveway calculator, cost guide, crushed stone page.
- Out: driveway calculator, crushed stone calculator, cost calculator, comparison guide.

**Unique value**
- Layer-by-layer quantities linked to the calculator.
- Failure modes explained from a materials perspective.
- No contractor lead-gen bias.

**Important:** this is adjacent to construction advice. Include a clear "planning guidance, not engineering advice" disclaimer and recommend a local contractor for structural or drainage work.

---

#### F. Gravel for a Shed Base

| Field | Detail |
|---|---|
| **URL** | `/gravel-shed-base.html` |
| **Primary keyword** | gravel for shed base |
| **Secondary** | best gravel for shed base, shed base depth, how much gravel for a shed base |
| **Intent** | Commercial investigation → tool |
| **Title (48)** | `Gravel for a Shed Base: Size, Depth & Quantity` |
| **H1** | `Gravel for a Shed Base` |
| **Priority** | P2 |

**Heading structure**
- H2 What gravel is best for a shed base?
- H2 How deep should a shed base be?
- H2 Do I need a membrane or geotextile?
- H2 How much gravel does my shed need?
- H2 Shed base calculator (embedded preset)
- H2 Common mistakes
- H2 FAQ

**Related calculator:** `/crushed-stone-calculator/` (preset) or the homepage.

---

#### G. Gravel for a Patio Base

| Field | Detail |
|---|---|
| **URL** | `/gravel-patio-base.html` |
| **Primary keyword** | gravel for patio base |
| **Secondary** | patio base depth, best gravel for patio, how much gravel under patio |
| **Intent** | Commercial investigation → tool |
| **Title (48)** | `Gravel for a Patio Base: Depth, Size & Quantity` |
| **H1** | `Gravel for a Patio Base` |
| **Priority** | P2 |

**Heading structure**
- H2 Patio base depth by surface type
- H2 Best gravel for a patio base
- H2 Paver base vs gravel patio
- H2 How much gravel do I need?
- H2 Drainage and slope
- H2 FAQ

**Related calculator:** `/crushed-stone-calculator/` or a future paver-base preset.

---

### 3.4 Content to explicitly **not** write

| Content type | Reason |
|---|---|
| "Gravel calculator in [city/state]" | Doorway pages; no real local data. |
| Separate article for every comparison pair | Thin and cannibalising. One comparison page with anchored sections. |
| "10 best gravel calculators" listicle | Links away from the site and adds no utility. |
| AI-generated 2,000-word generic guides | Violates the brief and Google's helpful-content guidance. |
| Fake cost averages with no source | Trust and accuracy risk. |
| "How much gravel do I need" separate article | Cannibalises the homepage. |
| News/trend pieces about gravel | No durable search demand. |
| Thin material pages for every rock type | Build only where demand and differentiation exist. |

---

## 4. Article specification template

Use this for every new page so quality is consistent.

```
URL:
Primary keyword:
Secondary keywords:
Search intent:
Title (≤60 chars):
Meta description (≤155 chars):
H1:
Word target (guidance, not padding):
Author / reviewer:
Last reviewed:

H2 outline:
  1.
  2.
  3.

Questions the page must answer:
  -
  -

Worked examples required:
  -

Original asset required (diagram/photo/table):
Related calculator:
Internal links in:
Internal links out:
Sources:
Schema:
Cannibalisation check:
```

**Word target guidance**
- Calculator pages: 900–1,500 words of supporting content.
- Reference assets: 1,200–2,000 words, mostly tables.
- Guides: 1,500–2,500 words.
- Do not pad. A 900-word page that answers the question beats a 3,000-word page that repeats it.

---

## 5. Editorial standards

### 5.1 Accuracy
- Every density value must have a source and a typical range.
- Every cost figure must be labelled as a range, dated, and sourced — or omitted.
- Do not present a single national average as fact.
- Use US short tons and cubic yards by default; show metric equivalents.
- Distinguish **bulk density** from **particle density**.
- Distinguish **compaction** from **waste/overage**.

### 5.2 Originality
- Write from the calculator's actual behaviour, not from competitor copy.
- Use original diagrams and photographs.
- Never copy competitor text, tables or images.
- If quoting a source, attribute it and link to it.

### 5.3 Trust
- Show a real author or reviewer with a credential, or do not claim expertise.
- Show "Last updated" and "Reviewed by" visibly.
- Link to a methodology page from every calculator.
- Provide a working contact method.
- Disclose that estimates are planning guidance, not a guarantee.

### 5.4 Structure
- One H1.
- H2s phrased as the questions users ask.
- Short paragraphs (2–4 sentences).
- A table or diagram within the first screen of supporting content.
- A calculator CTA above the fold and again after the first section.

### 5.5 Internal linking
- Every page links to its parent calculator and at least two siblings.
- Anchor text describes the destination, not "click here".
- No orphan pages.
- No more than one link to the same URL per 300 words.

### 5.6 Updates
- Review cost content quarterly.
- Review density/methodology annually or when a source changes.
- Update `dateModified` and the visible date when content changes materially.
- Do not change the date for cosmetic edits.

---

## 6. Internal linking matrix

| Page | Links in from | Links out to |
|---|---|---|
| `/` | every page (logo/nav), all calculators | all 7 calculators, both guides, density chart, size chart |
| `/driveway-gravel-calculator/` | homepage, cost guide, crushed stone, tons, bags, how-to-build guide | crushed stone, bags, cost, cost guide, size chart, density chart |
| `/gravel-calculator-tons/` | homepage, driveway, bags, cost, density chart | bags, cost, driveway, density chart, comparison guide |
| `/pea-gravel-calculator/` | homepage, comparison guide, bags | bags, cost, comparison guide, density chart |
| `/crushed-stone-calculator/` | homepage, driveway, French drain, size chart, how-to-build guide | driveway, tons, cost, French drain, size chart |
| `/gravel-cost-calculator/` | homepage, driveway, tons, bags, delivery guide, cost guide | cost guide, driveway, bags, delivery guide |
| `/gravel-bag-calculator/` | homepage, pea gravel, tons, cost | cost, tons, pea gravel, driveway |
| `/french-drain-gravel-calculator/` | homepage, crushed stone, size chart | crushed stone, tons, cost, bags |
| `/best-gravel-types.html` | homepage, pea gravel, crushed stone, driveway | pea gravel calculator, crushed stone calculator, size chart |
| `/driveway-cost-guide.html` | homepage, cost calculator, driveway calculator, delivery guide | cost calculator, driveway calculator, delivery guide |
| `/gravel-density-chart.html` | all calculators, methodology block | tons, crushed stone, pea gravel, bags |
| `/gravel-size-chart.html` | crushed stone, driveway, comparison guide, French drain | crushed stone, driveway, French drain |
| `/gravel-delivery-costs.html` | cost calculator, cost guide, driveway calculator | cost calculator, cost guide |
| `/how-to-build-a-gravel-driveway.html` | driveway calculator, cost guide | driveway calculator, crushed stone, cost |
| `/methodology.html` | every calculator footer, About | density chart, all calculators |

---

## 7. 90-day editorial calendar

| Week | Content work | Type |
|---|---|---|
| 1 | Rewrite homepage title/meta/H1, consolidate FAQ schema, remove hidden H2s | Optimise |
| 1 | Fix About density contradiction; add methodology section | Trust |
| 2 | Rewrite privacy to match reality; fix contact form copy | Trust |
| 2 | Rewrite `best-gravel-types` currency and title; add dates/sources | Optimise |
| 3 | Publish `/driveway-gravel-calculator/` (single-layer) | Calculator |
| 4 | Publish `/gravel-calculator-tons/` with reverse mode | Calculator |
| 5 | Publish `/pea-gravel-calculator/` | Calculator |
| 6 | Publish `/gravel-cost-calculator/` | Calculator |
| 7 | Publish `/gravel-bag-calculator/` | Calculator |
| 8 | Publish `/crushed-stone-calculator/` | Calculator |
| 9 | Publish `/french-drain-gravel-calculator/` | Calculator |
| 10 | Publish `/gravel-density-chart.html` | Reference |
| 11 | Publish `/gravel-size-chart.html` (with original images) | Reference |
| 11 | Publish `/gravel-delivery-costs.html` | Guide |
| 12 | Publish `/how-to-build-a-gravel-driveway.html` | Guide |
| 12 | Internal-link audit; update sitemap; request indexing | Technical |

**Result after 90 days:** 7 calculator pages, 2 reference assets, 2 new guides, 3 optimised existing guides, 1 methodology page. That is a credible topical cluster — not a content farm.

---

## 8. Measurement

Content success should be judged by cluster-level performance, not individual rankings.

| Metric | Source | Cadence |
|---|---|---|
| Indexed pages | Search Console → Pages | Weekly |
| Impressions by page cluster | Search Console → Performance | Weekly |
| Queries in positions 10–50 | Search Console → Performance (position filter) | Weekly |
| CTR by page | Search Console | Monthly |
| Calculator completion rate | Analytics events | Monthly |
| Print/share/quote clicks | Analytics events | Monthly |
| Internal link clicks | Analytics (if configured) | Monthly |
| Referring domains to reference assets | Search Console → Links | Monthly |
| Core Web Vitals field status | Search Console → CWV | Monthly |

**Do not** set traffic targets for individual articles before the cluster is indexed and has 4–6 weeks of impressions data.

---

## 9. Content production workflow

1. **Keyword and intent check** — confirm the query is not already owned by another page.
2. **Research** — collect sources; verify densities and costs; note the date.
3. **Outline** — H2s as user questions.
4. **Draft** — calculator first, then supporting content.
5. **Fact check** — every number traced to a source or to the calculator's own formula.
6. **Original asset** — diagram, photo or table created for this page.
7. **Internal links** — 1 up, 2 sideways, 1 down minimum.
8. **Schema** — validate with the Rich Results Test.
9. **Accessibility** — labels, headings, contrast, keyboard.
10. **Metadata** — title ≤60, description ≤155, canonical, OG image.
11. **Publish + request indexing.**
12. **Review after 28 days** — impressions, queries, CTR; adjust title or content.

---

## 10. Sources

- Google helpful content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google spam policies (scaled content abuse, doorway pages): https://developers.google.com/search/docs/essentials/spam-policies
- Google FAQ structured data: https://developers.google.com/search/docs/appearance/structured-data/faqpage
- Google article structured data: https://developers.google.com/search/docs/appearance/structured-data/article
- Google title/description guidance: https://developers.google.com/search/docs/appearance/title-link
- Keyword evidence: `KEYWORD-RESEARCH.md` §2 (Autocomplete, 2026-11-01)
- Competitor content structures: `COMPETITOR-RESEARCH.md` §4

---

*End of CONTENT-STRATEGY.md*
