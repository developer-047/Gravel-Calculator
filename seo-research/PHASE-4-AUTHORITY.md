# Phase 4 — Authority & Link Building (working doc)

**Phase owner:** site owner (outreach, profiles, publishing decisions)
**Code/asset work:** executed 2026-11-10
**Plan of record:** `SEO Prompt - 2.md` → PHASE 4 (Tasks 4-1 … 4-6)
**This file is excluded from production by `.vercelignore` (`seo-research/`)**

Evidence labels used below: `[Measured]` = observed in this repository or on the live host,
`[Owner-provided]` = supplied by the owner, `[Needs owner input]` = cannot be completed without a
real value (credential, URL, profile, outreach decision). No link counts, rankings or outreach
results are claimed here; none have been earned or measured yet.

---

## 1. Task 4-1 — Linkable assets: status

| Asset | File | Status 2026-11-10 |
|---|---|---|
| Gravel density chart | `gravel-density-chart.html` | Ready. Table reconciled with the calculator engine, placeholder citations removed, `Article` + `BreadcrumbList` schema added, `tailwind.css` now loaded. |
| Gravel price index 2026 | `gravel-price-index-2026.html` | Published. Relabelled 2026-11-11 as **indicative planning ranges**: the unsupported "supplier quotes / five-supplier average" claim was removed, duplicate rows were merged, and the page remains deliberately uncitable until real source data exists (see §5, §7). |
| Embeddable calculator widget | `gravel-calculator-widget.html` + `widget.js` | Built and browser-tested. Third-party framing enabled. |
| French drain stone guide | `french-drain-stone-guide.html` | Ready. Pipe-deduction table and worked example corrected, broken table/FAQ markup rebuilt, schema added, stylesheet loaded. |

### 1.1 Embeddable widget — how it works now

- Widget URL: `https://www.progravelcalculator.online/gravel-calculator-widget.html`
  (`noindex, follow`, self canonical, no nav, no analytics, no cookies) `[Measured]`
- Install page: `https://www.progravelcalculator.online/embed.html` (indexable, in the sitemap)
- Math: `widget.js` calls `calculator-engine.js`, so the widget, homepage and calculator pages
  cannot drift. Default widget state renders `0.93 yd³ / 1.31 short tons / 53 × 50 lb`,
  identical to the homepage default `[Measured in browser, 2026-11-10]`.
- Framing: `vercel.json` sends `X-Frame-Options: SAMEORIGIN` site-wide and adds
  `Content-Security-Policy: frame-ancestors *` for the widget path only. Per CSP Level 2+,
  `frame-ancestors` supersedes `X-Frame-Options`, so the widget is embeddable while every other
  page stays unframable. `.htaccess` mirrors this for the non-Vercel fallback host.
- Snippet distributed on all 7 calculator pages, `embed.html` and `llms.txt`:

```html
<iframe src="https://www.progravelcalculator.online/gravel-calculator-widget.html"
        width="100%" height="520" style="border:0;max-width:100%"
        title="Gravel calculator widget" loading="lazy"></iframe>
<p><a href="https://www.progravelcalculator.online/">Gravel Calculator</a>
   by Pro Gravel Calculator</p>
```

Attribution is a condition of the embed and is stated on `embed.html`.

### 1.2 Post-deploy verification — deployed `edb9943`, verified 2026-11-10

```bash
curl -sSI https://www.progravelcalculator.online/gravel-calculator-widget.html | grep -i "content-security-policy"
curl -sSI https://www.progravelcalculator.online/ | grep -i "x-frame-options"
curl -sSI https://www.progravelcalculator.online/gravel-calculator-widget.html | grep -i "content-type"
```
Expected: the widget returns `frame-ancestors *`, the homepage still returns
`X-Frame-Options: SAMEORIGIN`, the widget returns `200` (not a `308` to a trailing slash), and a
third-party test page can frame it without a console refusal.

**Measured 2026-11-10:** widget `200` + `Content-Security-Policy: frame-ancestors *` (with
`X-Frame-Options: SAMEORIGIN` still present, which CSP supersedes); `/embed.html` still
`SAMEORIGIN`; widget renders `0.93 yd³ / 1.31 tons / 53 × 50 lb` live with both scripts at `200`
and no console errors; `/sitemap.xml` = 18 URLs. Still open: a real third-party page framing it.
Note `/index.html` 308s to `/`, and `curl` needs `--compressed` on this host.

### 1.3 Citation surface (added 2026-11-10)

The reference tables are now citable and deep-linkable, which is what the outreach emails offer:

| Page | Stable anchor | Target |
|---|---|---|
| `/gravel-density-chart.html` | `#density-table` | the 11-row density table (lb/ft³, kg/m³, tons/yd³, tonnes/m³, range, basis) |
| `/french-drain-stone-guide.html` | `#pipe-volume-table` | pipe volume and gravel displaced at 100 lb/ft³ |
| `/french-drain-stone-guide.html` | `#gravel-savings-table` | gravel and 50 lb bags saved per pipe size |

Each page ends with a "Cite this" block: a suggested citation with an `Accessed [date]` placeholder
(deliberately not a hard-coded date), the deep link, and a one-line method note. Editors get
something to paste; we get a link to the table rather than a screenshot.

**Deliberately excluded:** `gravel-price-index-2026.html` has no citation block, because its supplier
provenance is unresolved (needs-owner-input #1). A test asserts it stays that way until the data is
sourced — inviting citation of unverified prices is worse than being uncitable.

Tests: `reference tables expose stable anchors and a citation block` asserts the three ids exist, that
the advertised deep links resolve to real ids, and that the price index stays uncitable.

---

## 2. Task 4-2 — Foundation submissions (owner)

Prepared in `seo-research/DIRECTORY-SUBMISSIONS.md` (2026-11-10). Verdict: almost all of this
category is closed to the site as it stands, because no business identity is published
(`privacy.html:214` "We do not publish a postal address"; `about.html:255` "Independent tool — not
a quarry or contractor"; no phone, form-only contact). Google Business Profile, Bing Places, Apple
Business Connect and Yelp all require an address and phone for verification, so they are blocked.

Open and permitted: **AlternativeTo** (free, account + verified email, moderator backlog, link
attribute disputed — two checkers report `nofollow`, assume no ranking value), **Product Hunt**
(free, personal account only, one-shot launch), **SaaSHub** (free, low value). The two calculator
directories named in the plan (`toolcalculator.com`, `freecalc.com`) did not resolve on 2026-11-11;
see `DIRECTORY-SUBMISSIONS.md` §2.1 before relying on them.

Rules: no payment for links, no reciprocal "link exchange" deals at scale, no directory spam, and
no inventing a trading name, address or phone to unlock a listing. If a directory requires a paid
tier to get a do-follow listing, mark its value `low` in the tracker and move on. Expected ranking
impact of the three open submissions: zero to negligible — they are referral and brand-consistency
plays. Do not give 4-2 a week; spend it on 4-3.

---

## 3. Task 4-3 — Outreach targets: list complete, sending blocked

`seo-research/OUTREACH-TARGETS.md` now holds **100 verified targets on 69 distinct domains**. Every row
was fetched on 2026-11-10 or 2026-11-11 and its body text read; the "Why" column paraphrases an actual claim on the
page, not a search snippet. Rows are sorted by likelihood, so the table doubles as the send order.

Discovery method, for reproducibility: six parallel research passes (landscaping blogs, aggregate
suppliers, university extension, home-improvement publishers, UK/EU technical references, resource
hubs), then a second and third wave of keyword searches once the calculators began crowding results.
The passes returned 83 candidates between them; the second and third waves added roughly 25 more, so
around 110 URLs were considered and 88 new rows survived verification (plus the 12 already logged).
The rejects are listed with reasons in §3 of that file, so the exclusions are auditable. A 2026-11-11
cleanup removed four `hellogravel.com` rows that breached the doc's own competitor rule and replaced
them with four freshly fetched non-competitor pages, so the row count stayed at 100 and the domain
count moved from 68 to 69.

Two honest limits recorded there:

- **69 domains, not 100.** The repeated domains are reference sites with several independently useful
  pages (pavingexpert sub-base pages, The Spruce how-to pages). Outreach counts emails, so the real
  workload is 69 conversations.
- **0 emails sent.** There is no owner mailbox (needs-owner-input #4), and sending from a personal
  address is the owner's call.

Tracker columns (keep the sheet private; do not commit contact data):

| # | Site | Page URL | Why relevant | Contact name | Contact route | Asset offered | Sent | Follow-up (7d) | Reply | Link live (URL) | Anchor text | rel | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

---

## 4. Task 4-4 — Digital PR: five angles, two of them honest

`seo-research/DIGITAL-PR-ANGLES.md`. Every number in it is traceable to a live page or a source line.

| Angle | Status | Why |
|---|---|---|
| Pipe deduction in French drains (4/6/8 in) | **Pitch first** | The arithmetic is checkable in seconds and most published guides omit it |
| Pea gravel vs #57 density (105 vs 100 lb/ft³) | Pitch third | Counter-intuitive, two-row table, one-sentence correction for an editor |
| Bags vs bulk (a yard is ~57 × 50 lb bags) | Pitch second, hedged | Bag arithmetic is solid; the price claim is a rule of thumb the page itself hedges |
| Extra gravel / waste factors | **Not pitchable** | We have calculator inputs, not project data. No study exists, so no study is claimed |
| Price index by state | **Blocked** | Supplier provenance unresolved (needs-owner-input #1) |

The plan's original five angles survive, but two had to be downgraded rather than dressed up. A pitch
built on data we do not have is exactly the kind of thing that gets a correction request.

---

## 5. Task 4-5 — Community: playbook and drafts, nothing posted

`seo-research/COMMUNITY-PLAYBOOK.md`. Contains the current state of Reddit's rules (the 10% guideline is
from a wiki Reddit marks as no longer updated; the Help Center spam policy sets no percentage; each
subreddit's rules govern), operating rules, a space-by-space fit table, and seven ready answers that
cite only figures from our pages.

Posting needs the owner's account, and a new account that only answers gravel questions is the pattern
moderators remove. Quora's current self-promotion policy was not verified and is flagged as such.

---

## 6. Task 4-6 — Branded entity signals: blocked on identity

`seo-research/ENTITY-SIGNALS.md`. State of play: `Organization` schema exists in the homepage graph and
on `/about.html`, and **`sameAs` is deliberately empty** because no profile exists. The doc holds the
exact JSON to paste once profiles are live, plus the decision list: trading name, address/phone decision,
which profiles to claim, and who answers messages.

Nothing was fabricated. An empty `sameAs` is correct; an invented one would be a false entity signal.

---

## 7. Needs owner input (cannot be invented)

| # | Item | Where it lands | Why blocked |
|---|---|---|---|
| 1 | **Price index provenance.** The page is now labelled "Planning Ranges" and no longer claims supplier quotes, a five-supplier average, or industry reports (corrected 2026-11-11). The ranges themselves still have no published source list. | Price index | The false provenance claim is gone, but the numbers remain indicative and uncitable until the owner supplies (a) real supplier quote URLs with access dates, or (b) confirms the planning-range framing. Prices themselves were left untouched. This still blocks the PR angle and the citation block on that page. |
| 2 | **Density chart citations.** The `[Supplier A] … [Supplier N] (2026)` placeholder citations were removed rather than filled with invented names. The column reads "Typical published range". | Density chart | Need real supplier sheets or a citable industry table per material, with access dates. |
| 3 | **`sameAs` brand signals.** No social or business profiles exist anywhere in the repository. | `about.html` + `index.html` Organization nodes | Adding `sameAs` before the profiles exist would be fabricated identity data. Send the real URLs. |
| 4 | **Mailbox for outreach, PR and community.** | Sending | 100 targets, 5 PR angles and 7 community drafts are ready; nothing can be sent without an address, a signature and a reply owner. |
| 5 | **Deploy approval.** The citation-surface changes (anchors + "Cite this" blocks on the density chart and French drain guide) are committed to the working tree but not deployed. | Vercel | Production deploy needs explicit owner approval. |
| 6 | **Widget framing allowlist policy.** Current setup allows any site to frame the widget. | `vercel.json` | Policy decision, not a technical one. |
| 7 | **Business identity / NAP.** No trading name, address or phone is published, and `privacy.html` states none is published. | Directories, GBP, Bing, Apple, Yelp | Supplying one (even a home-based service-area address) unlocks four local platforms at once. |

---

## 8. Phase 4 exit report (2026-11-10)

| Task | Deliverable | Status |
|---|---|---|
| 4-1 | Widget, reference assets, citation surface | **Done.** Deployed as `edb9943`; widget verified live at 0.93 yd³ / 1.31 t / 53 bags with `frame-ancestors *`; anchors and "Cite this" blocks built and browser-checked, awaiting deploy |
| 4-2 | Foundation directories | **Assessed, 3 submissions possible.** Local directories blocked on missing NAP. Verdict: `DIRECTORY-SUBMISSIONS.md` |
| 4-3 | 100 qualified targets | **Done.** 100 rows / 69 domains, all fetched and read. 0 emails sent |
| 4-4 | Digital PR angles | **Done as preparation.** 2 pitchable, 1 hedged, 2 not pitchable/blocked; 0 sent |
| 4-5 | Community presence | **Done as preparation.** Rules sourced, 7 answers drafted; 0 posted |
| 4-6 | Entity signals | **Blocked.** No identity to claim; JSON ready |

### What Phase 4 achieved, stated without inflation

- A widget any site can embed, with a working install page and an attribution link.
- Three reference tables that can be cited, deep-linked and quoted, plus a citation format writers can
  paste.
- A 100-row outreach list with a documented exclusion list, so the next person does not re-discover it.
- Five PR angles, two of which were downgraded because the underlying data does not exist.
- Seven community answers ready to post under the owner's account.

### What it did not achieve

- **Backlinks: 0.** The plan's target was 15-25 referring domains by day 90.
- **Emails: 0.** No mailbox.
- **Profiles: 0.** No identity.
- **Indexed rankings:** unmeasured; no Search Console access in this repository.

The gap between "prepared" and "earned" is entirely owner-side: a mailbox, an identity, and eight weeks
of sending. Every asset, target, pitch and draft needed for that is now written down.

### Definition of done for Phase 4

- [x] Widget built, tested, documented, deployed (4-1)
- [x] Reference assets citation-ready and citable (4-1, 4-1e)
- [x] 100 qualified outreach targets logged (4-3)
- [x] PR angles and community answers drafted from defensible numbers (4-4, 4-5)
- [x] Directory eligibility settled with evidence (4-2)
- [ ] 20 emails/week for 8+ weeks (owner mailbox)
- [ ] 15-25 quality referring domains by day 90 (owner, measured in Search Console)
- [ ] Brand profiles on 3+ platforms + `sameAs` (owner identity)
- [ ] 10+ helpful Reddit/Quora answers logged (owner account)
- [x] No prohibited tactics used or proposed anywhere in the Phase 4 plan documents
