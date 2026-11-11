# Phase 4 — Task 4-4: digital PR angles

**Status 2026-11-10:** five angles drafted from our own published pages. **Nothing sent** — sending needs
an owner mailbox, and a pitch that goes out from a personal address is a decision the owner has to make
(needs-owner-input #4). Evidence labels: `[Measured]` = read off our live page, `[Needs owner input]` =
the number does not exist yet and must not be invented.

**Hard rule for this task:** every number in a pitch must already be on a live page, at the URL given.
If a journalist checks the claim, they must land on the figure. No "we analysed 500 projects", no
"industry study", no survey we did not run.

---

## Angle 1 — "How much extra gravel should you actually order?" (WAIT)

**What we can support:** the calculator exposes a waste allowance (0-25%) and a compaction allowance
(0-20%) as separate inputs, and they stack: `calculator-engine.js:256-271` applies
`baseVolume × (1 + waste%) × (1 + compaction%)` `[Measured]`.

**What we cannot support:** any statement about how much extra contractors *actually* order. There is
no dataset behind that, only the inputs. A pitch built on "we looked at X projects" would be fabricated.

**Verdict:** not pitchable as a data story today. It becomes pitchable if the owner ever collects
anonymised calculator inputs (needs owner decision on analytics and privacy). Keep it out of the send
queue until then.

---

## Angle 2 — "The French drain calculation most contractors get wrong" (PITCH FIRST)

**The claim, all of it on `/french-drain-stone-guide.html#pipe-volume-table`** `[Measured]`:

| Pipe | Volume in a 50 ft trench | Gravel displaced |
|---|---|---|
| 4 in | 4.36 ft³ | 0.16 yd³ |
| 6 in | 9.82 ft³ | 0.36 yd³ |
| 8 in | 17.45 ft³ | 0.65 yd³ |

Computed as π × (d/2)² × length at 100 lb/ft³, 50 lb bags. Going from a 4 in to an 8 in pipe changes
the order by 0.49 yd³, roughly 27 bags.

**Why an editor would take it:** the arithmetic is checkable in seconds and most French drain guides
give a trench section (stone, pipe, fabric) without ever subtracting the pipe. That is a real omission
in published content, not a matter of taste.

**Who to send it to:** rows 1-2 of `OUTREACH-TARGETS.md` (Kirk Allen, Drainage First) already do this
calculation, so they are *not* the pitch target — they are the citation target. The pitch goes to the
guides that skip it: The Spruce French drain install, Hunker, This Old House, Bob Vila French drains
(rows 78, 81, 88, 89), and the extension pages that describe the stone-filled trench (rows 55-58, 77).

**Subject lines that are not clickbait:**
- "A 6-inch pipe displaces 20 bags of stone in a 50 ft French drain"
- "Your French drain guide has the trench section but not the pipe volume"

---

## Angle 3 — "Gravel driveway cost by state" (BLOCKED)

`/gravel-price-index-2026.html` exists but its supplier provenance is unresolved: since 2026-11-11 the
page is honestly labelled as indicative planning ranges rather than supplier quotes, but the ranges
themselves still have no published sources (needs-owner-input #1). Pitching a price story we cannot
source is the fastest way to get a correction request from an editor, and the page is deliberately
excluded from the citation blocks for exactly this reason.

**Verdict:** blocked until the owner supplies the supplier quotes or invoices behind the ranges. Do not
pitch. Do not link to it in an outreach email.

---

## Angle 4 — "Bags vs bulk: the break-even" (PITCH SECOND, CAREFULLY)

**What is on the page** `[Measured]` — `/gravel-bag-calculator/`:

- One cubic yard of pea gravel at 105 lb/ft³ is 2,835 lb, so a cubic yard is about **57 × 50 lb bags**
  (the default calculator output is 0.93 yd³ / 1.31 short tons / 53 bags; the unrounded default is
  25 ft³ = 2,625 lb).
- `gravel-bag-calculator/index.html:532`: "Bulk is usually cheaper per ton once the project is above
  roughly 0.5 yd³, but delivery fees and minimum order sizes vary."

**The honest angle:** the bag count, not the price. "A cubic yard is about 57 bags" is arithmetic and
memorable; "bulk wins above half a yard" is a rule of thumb the page itself hedges.

**Do not claim:** specific bag or bulk prices per state, or that bulk is always cheaper. We have no
price survey (see angle 3).

---

## Angle 5 — "A yard of pea gravel is heavier than a yard of crushed stone" (PITCH THIRD)

**On `/gravel-density-chart.html#density-table`** `[Measured]`:

| Material | lb/ft³ | Short tons per yd³ |
|---|---|---|
| Pea gravel | 105 | 1.42 |
| Crushed stone #57 | 100 | 1.35 |

So a cubic yard of pea gravel is about 0.07 tons — roughly 140 lb — heavier than the same yard of #57.
Ordering "a yard" of the wrong one moves the load by a measurable amount, and the supplier's scale is
what decides the invoice.

**Why it works:** it is counter-intuitive (smaller stone, heavier yard), it is a two-row table, and it
gives an editor a correction they can make in one sentence.

---

## Recipient map

Row numbers below are from the sorted table in `OUTREACH-TARGETS.md` and were checked against it, not written from memory.

| Angle | Primary recipients (row numbers) |
|---|---|
| 2 (pipe deduction) | **78** This Old House, **81** Hunker, **88** Bob Vila, **89** The Spruce, **95** Bob Vila (French drain cost). Context for the same claim: the extension pages **55-58** and **77**. Rows **1-2** already do the subtraction, so they are citation targets rather than pitch targets |
| 4 (bags vs bulk) | **26** (topsoil.com, fullest per-ton and per-yard grid), **3-12** and **27-30** (suppliers already publishing per-ton coverage), **54** (Sagamore, volume vs tonnage), **62** (Gravelshop, bulk supplier driveway guide) |
| 5 (density) | **6, 8, 11, 12** (explicit lb/yd3 or tons/yd3 claims worth correcting), **18-26** (metric density tables where the tons step is stated) |

## Email shape (use for every angle)

1. One sentence naming their page and the specific gap, with the quote from their page.
2. One sentence with the number from ours.
3. One link to the exact anchor (`#pipe-volume-table`, `#density-table`).
4. Offer the citation text, which is already published on the page.
5. No attachment, no "let me know if you'd like a guest post", no follow-up beyond one.

## Definition of done for 4-4

- [x] Five angles derived from live pages, with the source line or anchor for every number
- [x] Two angles marked blocked/not pitchable with the reason
- [ ] Journalist/editor contact list per outlet (needs owner mailbox and, ideally, a press page)
- [ ] Pitches sent with dates and replies logged
- [ ] Coverage URLs recorded; any resulting links checked for `rel` and placement

Pitches sent so far: **0**. Coverage earned: **0**.
