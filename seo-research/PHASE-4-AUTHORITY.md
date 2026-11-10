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
| Gravel price index 2026 | `gravel-price-index-2026.html` | Published, but **provenance needs owner input** (see §5). Schema + stylesheet added. |
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

### 1.2 Post-deploy verification (needs owner approval to deploy)

```bash
curl -sSI https://www.progravelcalculator.online/gravel-calculator-widget.html | grep -i "content-security-policy"
curl -sSI https://www.progravelcalculator.online/ | grep -i "x-frame-options"
curl -sSI https://www.progravelcalculator.online/gravel-calculator-widget.html | grep -i "content-type"
```
Expected: the widget returns `frame-ancestors *`, the homepage still returns
`X-Frame-Options: SAMEORIGIN`, the widget returns `200` (not a `308` to a trailing slash), and a
third-party test page can frame it without a console refusal.

---

## 2. Task 4-2 — Foundation submissions (owner)

Nothing here can be done from the repository: each item is an account, a form or an outreach
decision. Working list, no targets pre-filled because none have been contacted yet:

| Source type | Action | Result to record |
|---|---|---|
| Calculator / tool directories | Submit the site with a short, honest description | Submission URL, date, accepted/rejected |
| Construction estimating resource pages | Find pages that already list calculators | Page URL, contact, response |
| Home-improvement resource lists | Same | Same |

Rules: no payment for links, no reciprocal "link exchange" deals at scale, no directory spam.
If a directory requires a paid tier to get a do-follow listing, mark `rel="nofollow"` value as
`low` in the tracker and move on.

---

## 3. Task 4-3 — Outreach operating system (owner)

Search operators from the plan (run manually, log real results — do not invent prospects):

```
"landscaping" "gravel" "how much" blog
"home improvement" "gravel driveway" "resources"
"construction" "estimating" "calculator" "resources"
"gravel" "quarry" "calculator" "order" site:.com
site:.edu "aggregate" "density" "calculator"
site:.gov "french drain" "gravel"
```

Tracker columns (create the sheet privately; do not commit contact data):

| # | Site | Page URL | Why relevant | Contact name | Contact route | Asset offered | Sent | Follow-up (7d) | Reply | Link live (URL) | Anchor text | rel | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

Cadence from the plan: 20 personalised emails/week, one follow-up after 7 days, expect a 5–10%
link rate. Target by day 90: 15–25 quality referring domains. **Zero links have been earned so
far — do not report a number until a live URL can be shown.**

Assets to offer, in priority order:

1. Gravel density chart (`/gravel-density-chart.html`) — reference data for writers and suppliers.
2. French drain stone guide (`/french-drain-stone-guide.html`) — the pipe-deduction angle.
3. Widget embed (`/embed.html`) — for suppliers and landscaping blogs that want a working tool.
4. Price index (`/gravel-price-index-2026.html`) — only after §5 is resolved.

---

## 4. Task 4-4 / 4-5 — Digital PR and community (owner)

Angles already written in the plan (waste factor, pipe deduction, price index, bulk vs bags,
density counter-examples) are unchanged. Every angle must ship with the numbers the site can
actually defend; the pipe-deduction and waste-factor angles are now backed by corrected tables.

Community rules: answer first, link only when the tool answers the question, never post the same
link twice in a thread, disclose affiliation. Log every answer (subreddit/thread URL, date, link
included yes/no) so Phase 6 can attribute referral traffic.

---

## 5. Needs owner input (cannot be invented)

| # | Item | Where it lands | Why blocked |
|---|---|---|---|
| 1 | **Price index provenance.** `gravel-price-index-2026.html` says prices come from "2026 supplier quotes (average of 5 regional suppliers)" and "supplier quotes and industry reports, accessed November 2026", but no source list exists on the page or in the repository. | Price index | Publishing an unverifiable source claim is the one thing the plan forbids. Need either (a) 5+ real supplier quote URLs with access dates, or (b) permission to relabel the table as a planning range with a stated method. Prices themselves were left untouched. |
| 2 | **Density chart citations.** The `[Supplier A] … [Supplier N] (2026)` placeholder citations were removed rather than filled with invented names. The column now reads "Typical published range". | Density chart | Need real supplier sheets or a citable industry table per material, with access dates, if the column is to become real citations again. |
| 3 | **`sameAs` brand signals.** `Organization` schema exists on `/about.html` and in the homepage graph, but there are no social or business profiles anywhere in the repository (no Twitter/X, LinkedIn, Facebook, Instagram, YouTube, Google Business Profile). | `about.html` + `index.html` Organization nodes | Adding `sameAs` URLs before the profiles exist would be fabricated identity data. Send the real profile URLs and they can be wired into both nodes. |
| 4 | **Outreach tracker + send dates.** | `seo-research/` (private) | Requires a mailbox and real prospects. |
| 5 | **Deploy + Vercel header check.** | Vercel | Production deploy needs explicit owner approval; the `frame-ancestors` behaviour can only be confirmed on the live host. |
| 6 | **Widget framing allowlist policy.** Current setup allows any site to frame the widget. If the owner prefers an allowlist of approved partner domains, `frame-ancestors *` becomes an explicit origin list. | `vercel.json` | Policy decision, not a technical one. |

---

## 6. Task 4-6 — Branded entity signals: status

Done: one consistent brand name (`Pro Gravel Calculator`), `Organization` node with `name`, `url`,
`logo`, `description` on `/about.html` and the homepage `@graph`. Not done: `sameAs`, Google
Business Profile, social profiles — all blocked by item 3 above.

---

## 7. Definition of done for Phase 4

- [x] Widget built, tested and documented (Task 4-1)
- [x] Reference assets technically citation-ready (schema, internal links, correct tables)
- [ ] 100 qualified outreach targets logged (owner)
- [ ] 20 emails/week for 8+ weeks (owner)
- [ ] 15–25 quality referring domains by day 90 (owner, measured in Search Console)
- [ ] Brand profiles on 3+ platforms + `sameAs` (owner)
- [ ] 10+ helpful Reddit/Quora answers logged (owner)
- [ ] No prohibited tactics used (stays true: none used)
