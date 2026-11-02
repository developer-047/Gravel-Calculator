# AdSense Readiness — Pro Gravel Calculator

> **Research date:** 2026-11-01
> **Site reviewed:** https://www.progravelcalculator.online/
> **Scope:** Phase 9 of the brief — content quality, navigation, trust pages, legal pages, user experience, mobile layout and ad placement suitability.
> **Important:** this is an audit and a set of recommendations. It is **not** an approval prediction, and it does **not** guarantee that Google will approve the site. AdSense approval is discretionary and governed by Google's current policies, which can change.
> **Evidence labels:** `[Measured]` = observed in the local code or live site. `[Estimate]` = analyst judgment. `[Unavailable]` = not measurable with the tools used.

---

## 1. Verdict

**Not ready to apply today.**

The calculator is genuinely useful and the site is technically clean, but the application would be premature. There are **six blocking issues** that a reviewer can see within minutes:

| # | Blocker | Why it blocks |
|---|---|---|
| 1 | **Contact form does not submit** | The primary trust/conversion path is broken. Users cannot contact the site. |
| 2 | **Privacy policy describes software that is not installed** | It claims AdSense and Analytics are in use and references the retired DART cookie. This is inaccurate and undermines the exact disclosure AdSense requires. |
| 3 | **About page contradicts the calculator** | It states 2,835 lb/yd³ for crushed stone; the calculator uses 2,700 lb/yd³. It also claims civil-engineer input and "industry-standard" status without evidence. |
| 4 | **PKR / "Pakistan Market Averages" inside a US-targeted guide** | Mixed geography and currency signal an unfocused, low-quality page to a US reviewer and user. |
| 5 | **Thin trust footprint** | Seven indexable pages, only three with substantial content; only one image (served as WebP/PNG) across the site; no named author, reviewer, methodology or visible dates. |
| 6 | **No consent mechanism** | No CMP or cookie banner. Required for serving ads to EEA/UK/Swiss users and expected as a privacy baseline before any ad code is added. |

Two further issues are not strict policy blockers but would reduce approval odds and revenue quality:

- **Existing ad slots are in the wrong places.** The `ad-top` slot sits above the H1 and above the calculator. Activating it would push the tool below the fold and invite accidental clicks.
- **The contact page implies a contractor network** ("Verified Pros", "Competitive Rates") without evidence of one. That is a trust and potential misrepresentation risk.

**Recommended application window:** after the trust fixes and the first three calculator pages are live and indexed — roughly **weeks 5–6 of the roadmap**, with a stronger application at **week 8**. Do not apply this week.

---

## 2. What AdSense actually evaluates (and what is not knowable)

Google does **not** publish a checklist with scores or a minimum page count. The publicly documented expectations are broad:

- The site must be **live, accessible and navigable**.
- Content must be **original, useful and substantial**; not scraped, auto-generated or thin.
- The site must comply with **Google Publisher Policies** and **AdSense Program Policies**.
- A **privacy policy** must disclose cookie use, third-party vendors and how users can opt out of personalised advertising.
- Ads must not be **misleading**, must not **interfere with navigation**, and must not be placed on screens with **little or no content**.
- Publishers must be **18+** and own or be authorised to monetise the site.
- For EEA/UK/Swiss traffic, a **Google-certified CMP** must be used.

What is **not** knowable from outside:
- Whether a particular reviewer would approve this site.
- The weight given to page count, domain age, traffic or design.
- Current internal review thresholds.

**No approval probability is stated in this report.** Any site promising "guaranteed approval" is wrong.

---

## 3. Readiness scorecard

Scores are internal planning judgments, not Google scores. `[Estimate]`

| Dimension | Score | Status | Reason |
|---|---:|---|---|
| Original, useful content | 3/5 | ⚠️ | The calculator is original and useful; the article library is small and has sourcing defects. |
| Clear navigation | 4/5 | ⚠️ | Header is clear; footer is thin; one typo; no custom 404. |
| About page | 1/5 | ❌ | 269 words, unverifiable claims, density contradiction. |
| Contact page | 1/5 | ❌ | Form does not submit; no email fallback; unverified "Verified Pros" claim. |
| Privacy policy | 1/5 | ❌ | Describes AdSense/Analytics that are not installed; DART wording is obsolete. |
| Terms of service | 3/5 | ⚠️ | Estimation disclaimer is good; missing IP, changes, governing law and contact details. |
| User experience | 4/5 | ✅ | Calculator flow is clear; mobile stacking is good; page is long. |
| Mobile layout | 4/5 | ✅ | Responsive and usable; accessibility score is 75/100. |
| Ad placement suitability | 2/5 | ❌ | Existing slots are too high on the page; no consent; no AdSense code. |
| Content quality / E-E-A-T | 2/5 | ❌ | No named author, no methodology, no sources, no visible dates. |
| Technical health | 4/5 | ✅ | SEO 100, HTTPS, canonicals, sitemap; performance 87 and a favicon 404. |
| Policy and consent | 1/5 | ❌ | No CMP; privacy mismatch; unsubstantiated commercial claims. |

**Overall:** 3 of 12 dimensions are acceptable. The site is a good product with a weak trust layer. Fix the trust layer before adding ads.

---

## 4. Page-by-page review

### 4.1 Homepage `/`

| Item | Finding |
|---|---|
| Purpose | Generic gravel calculator + how-to guide + FAQ. Clear and useful. |
| Content | ~1,381 words including navigation; the unique guide portion is solid. `[Measured]` |
| Strengths | Immediate tool, live results, SVG preview, print/PDF, mobile layout, no intrusive ads. |
| Weaknesses | Two H1s (one print-only), hidden `sr-only` keyword H2s, duplicate FAQ schema, one image, no visible methodology or sources. |
| Ad suitability | **Good after the calculator**, poor above it. The existing top slot should not be activated. |
| Verdict | Keep as the hub. Fix headings, schema and trust content. |

### 4.2 `/best-gravel-types.html`

| Item | Finding |
|---|---|
| Purpose | Pea gravel vs crushed stone vs river rock comparison. |
| Content | ~1,323 words; real comparison table and cost examples. |
| Strengths | Genuine comparison intent; supports the calculator cluster. |
| Weaknesses | **PKR pricing and "Pakistan Market Averages" in a US-targeted table**; "2026 Global Averages" with no source; no visible date or author. |
| Ad suitability | Good for two in-article units once the currency and sourcing are fixed. |
| Verdict | Fix before applying. This is the most visible content-quality defect on the site. |

### 4.3 `/driveway-cost-guide.html`

| Item | Finding |
|---|---|
| Purpose | Gravel driveway cost breakdown for 2026. |
| Content | ~1,439 words; US/UK examples, hidden costs, checklist. The strongest article on the site. |
| Strengths | Commercially valuable, practical, well structured. |
| Weaknesses | No visible dates or sources; title is 86 characters; no named author; cost figures are presented without a methodology. |
| Ad suitability | Good for two or three in-article units; do not place ads inside the cost tables. |
| Verdict | Keep and improve. It is the best candidate for links and for AdSense-quality content. |

### 4.4 `/about.html`

| Item | Finding |
|---|---|
| Purpose | Brand/trust page. |
| Content | ~269 words. `[Measured]` |
| Strengths | Exists; links to the calculator. |
| Weaknesses | **Density contradiction** (2,835 lb/yd³ vs the calculator's 2,700); "built with civil engineers" and "industry-standard" with no names or credentials; "trusted resource" is self-awarded; no team, location, or editorial policy. |
| Ad suitability | No ads. Trust pages should stay clean. |
| Verdict | **Blocking.** Rewrite with a real operator/reviewer identity or remove the expert claims entirely. |

### 4.5 `/contact.html`

| Item | Finding |
|---|---|
| Purpose | Quote request form, pre-filled from the calculator. |
| Content | ~84 words. `[Measured]` |
| Strengths | The query-parameter prefill is a genuinely good hand-off. |
| Weaknesses | **The form has no `action`, no `method`, and a `type="button"` button with no handler.** It cannot submit. No email address, no response time, no privacy note. "Verified Pros" and "Competitive Rates" imply a vetted supplier network that the site does not demonstrate. |
| Ad suitability | No ads. |
| Verdict | **Blocking.** Either connect the form to a real endpoint and remove the unverified claims, or replace it with a transparent contact method (email/contact form) and say what happens next. |

### 4.6 `/privacy.html`

| Item | Finding |
|---|---|
| Purpose | Privacy policy. |
| Content | ~288 words. `[Measured]` |
| Weaknesses | Says "We use Google AdSense" and "We may use tools like Google Analytics" — neither is installed. References the **DART cookie**, which is obsolete. Says personal information is not collected unless the quote form is used, but the form does not work. No cookie list, no consent section, no retention, no user-rights section, no vendor list. |
| Ad suitability | No ads. |
| Verdict | **Blocking.** Rewrite to match the site's actual and planned data flows before applying. |

### 4.7 `/terms.html`

| Item | Finding |
|---|---|
| Purpose | Terms of service. |
| Content | ~270 words. `[Measured]` |
| Strengths | The estimation disclaimer is clear and appropriately cautious. |
| Weaknesses | No intellectual-property section, no changes clause, no governing law, no contact details, no third-party-link/ad disclaimer. |
| Ad suitability | No ads. |
| Verdict | Improve, but not a hard blocker. |

### 4.8 `/thankyou.html`

| Item | Finding |
|---|---|
| Purpose | Post-submit confirmation. |
| Status | `noindex, follow`, excluded from sitemap. Correct. |
| Ad suitability | **No ads.** Confirmation pages should not be monetised. |
| Verdict | Keep. Add next-step links (calculator, guides) and a clear "what happens next" message. |

### 4.9 Missing pages

| Page | Status | Impact |
|---|---|---|
| `404.html` | Missing — Vercel default | Dead end for mistyped URLs; weak UX and trust signal. |
| `methodology.html` | Missing | No place to explain densities, formulas, sources and assumptions. |
| Author/reviewer page | Missing | No E-E-A-T anchor. |
| Cookie policy | Missing | Needed once ads/consent are live; can be a section of the privacy policy. |

---

## 5. Content quality and originality

### 5.1 What is genuinely good

- The calculator is **original software**, not a scraped template.
- The homepage guide explains measurement, depth, shape handling and ordering in practical language.
- The two articles are readable and specific, not generic AI filler.
- The print/PDF and quote hand-off are real features that most competitors lack.
- The site does not currently show ads, pop-ups or intrusive interstitials.

### 5.2 What a reviewer is likely to question

| Concern | Evidence | Severity |
|---|---|---|
| Mixed geography | PKR pricing and "Pakistan Market Averages" on a US-oriented page | **High** |
| Unsourced cost claims | "2026 Global Averages", no source, no date, no methodology | **High** |
| Unverifiable expertise | "built with civil engineers", "industry-standard", "trusted resource" | **High** |
| Contradictory density | About 2,835 lb/yd³ vs calculator 2,700 lb/yd³ | **High** |
| Thin trust pages | About 269 words, Contact 84 words | **Medium–High** |
| No named human | Article schema author is an Organization; no byline | **Medium–High** |
| No visible dates | Schema dates exist, page copy does not show them | **Medium** |
| Few original assets | One image across the site | **Medium** |
| Small library | 7 indexable pages, 3 substantial | **Medium** |
| Accessibility | Lighthouse 75/100; missing labels, contrast, heading order | **Medium** |

### 5.3 The content test to apply before AdSense

For every page that will show ads, answer these questions honestly:

1. Does this page solve a specific problem better than the top three results?
2. Is there at least one thing here that is **original** — a tool, a diagram, a table, a calculation, a photo?
3. Is every number either calculated by the tool or cited to a source with a date?
4. Is there a named human or a transparent organisation behind it?
5. Would a user be satisfied if this were the only page they visited?
6. Does the page have a reason to exist **other than** ranking for a keyword?

If any answer is "no", fix the page before adding ads. A calculator page with a real tool passes this test more easily than an article; that is why the calculator cluster should lead the application.

---

## 6. Navigation and user experience

### 6.1 What works

- Header navigation is visible and consistent across pages: Calculator, Gravel Types, Driveway Cost, About, Contact.
- The calculator is above the fold on desktop and reachable quickly on mobile.
- Shape selection, dimensions, preview and results follow a logical order.
- Tap targets are large; the mobile layout stacks cleanly.
- CLS is 0 in lab; the page is light (174 KiB).
- No login, no email gate, no pop-up.

### 6.2 What needs fixing

| Issue | Impact | Recommendation |
|---|---|---|
| Footer only links to Calculator and Driveway Cost | Weak crawl paths; important pages under-linked | Add all calculators, both guides, About, Contact, Privacy, Terms. |
| "DriveAway Cost" typo | Visible trust defect | Change to "Driveway Cost". |
| No visible breadcrumbs on most pages | Users lose orientation | Add visible breadcrumbs matching `BreadcrumbList`. |
| No custom 404 | Dead end | Build `404.html` with navigation back to the calculator. |
| Long mobile homepage | Results can scroll out of view | Add a sticky result summary or a "back to results" anchor. |
| Duplicate `order-5` classes | Mobile ordering can become unpredictable | Clean up the mobile order model during the calculator refactor. |
| Missing favicon | 404 console error; unfinished tab | Add a favicon set. |
| Accessibility 75/100 | Labels, contrast, heading order, no `aria-live` | Fix before applying; accessibility is a quality signal. |

### 6.3 The contact path

The calculator's "Request Quote" hand-off is a strong idea, but it currently ends at a form that cannot submit. For AdSense and for user trust, this must be fixed first. The minimum acceptable version:

- A working form endpoint with server-side validation and spam protection.
- `required`, `name`, `autocomplete` and proper `<label for>` associations.
- A success state that redirects to `thankyou.html`.
- An error state that preserves the user's input.
- A real fallback email address visible on the page.
- A short privacy note explaining what happens to the data.
- No "Verified Pros" claim unless there is an actual vetted network behind it.

---

## 7. Ad placement recommendations

These are recommendations, not code. No ad code should be added until the blockers in §1 are fixed and the user approves the change.

### 7.1 Principles

1. **The calculator comes first.** No ad may sit between the H1 and the calculator, between an input and its result, or beside a primary action button.
2. **Ads follow content.** Place units after a completed task or after a substantive section, not before it.
3. **Reserve space.** Every slot needs a fixed `min-height` so ads do not cause layout shift.
4. **Label clearly.** Keep the visible "ADVERTISEMENT" label; never style an ad to look like navigation or a button.
5. **Conservative density.** At most **two** units on a calculator page and **three** on a long guide. This is an internal quality rule, not a quoted Google limit; check current AdSense policies before implementation.
6. **No ads on utility pages.** Contact, privacy, terms, thank-you and 404 stay clean.
7. **Consent before ads.** Load ad code only after the consent state allows it.
8. **Measure before adding more.** Start with one or two units; add more only if UX and revenue data support it.

### 7.2 Recommended slots

| Slot | Page type | Position | Recommended formats | Max | Rationale |
|---|---|---|---|---|---|
| **A** | Homepage | After the results card and the quote/print/share block, before the long guide | Responsive in-article: 336×280, 300×250, 728×90 | 1 | The user has an answer; the ad does not interrupt input. |
| **B** | Homepage | Inside the guide, after the second H2 and at least two paragraphs | Responsive in-article | 1 | A natural reading break in substantive content. |
| **C** | Homepage | Immediately before the FAQ, or after the FAQ | Responsive | 1 (optional) | Only if the page remains readable; do not stack B and C back-to-back. |
| **D** | Calculator pages | After the result summary, before depth guidance | Responsive in-article | 1 | Post-task placement; consistent across the cluster. |
| **E** | Calculator pages | After the depth table / worked examples | Responsive in-article | 1 | Second unit only on pages with 900+ words of supporting content. |
| **F** | Guides | After the intro, mid-article, and near the end | In-article | 3 | Standard editorial placement; keep at least two paragraphs between units. |
| **G** | Desktop sidebar | Right rail below the calculator actions | 300×250 or 300×600 | 1 | Optional; never on mobile; do not make it sticky until tested. |

### 7.3 Slots that should **not** be used

| Slot | Why not |
|---|---|
| Existing `ad-top` above the H1 | Pushes the calculator below the fold; high accidental-click risk; poor UX. Repurpose it below the first content section or remove it. |
| Inside the calculator card | Breaks the input→result flow and invites mis-clicks. |
| Between the depth slider and the results | The user is actively calculating; an ad here is obstructive. |
| Next to "Request Quote", "Print", "Save PDF" or "Share" | Confuses ads with actions; policy and UX risk. |
| Sticky bottom anchor ad (initially) | Can cover the calculator on mobile. Reconsider only after 30 days of UX data. |
| Vignette/interstitial | Intrusive; not appropriate for a utility tool. |
| Contact, privacy, terms, thank-you, 404 | No content value; policy and trust risk. |
| Pages with fewer than ~300 words of unique content | Thin-content risk. Fix the page or do not monetise it. |

### 7.4 Existing slots in the code

`[Measured]` The homepage currently contains three empty containers:

- `#ad-top` — directly below the header, above the H1 and calculator.
- `#ad-native` — after the long guide section, before the right column closes.
- `#ad-sidebar` — in the right column, but its mobile `order-5` conflicts with other `order-5` elements.

**Recommendation:** do not activate `#ad-top` in its current position. Move the first unit to after the results/actions block (Slot A). Keep `#ad-native` as Slot B or C. Use `#ad-sidebar` only on desktop (Slot G) and fix the mobile ordering before enabling it.

### 7.5 Implementation notes (for later approval)

- Use responsive ad units with `data-full-width-responsive="true"`.
- Reserve height in CSS:
  - 336×280 → `min-height: 280px`
  - 300×250 → `min-height: 250px`
  - 728×90 → `min-height: 90px`
  - 320×100 → `min-height: 100px`
- Lazy-load below-the-fold units; do not lazy-load a unit that is visible on first load.
- Keep at least ~150 px of separation between an ad and any primary button.
- Do not place ads inside `<details>`/FAQ accordions where they can expand and shift layout.
- Test with an ad blocker enabled and disabled; the page must remain usable either way.
- Add `aria-hidden` or a clear label so screen readers can distinguish ads from content.

---

## 8. Mobile ad layout

Mobile is the majority-use case for a calculator, so ad placement there deserves separate rules.

| Rule | Detail |
|---|---|
| Calculator first | The user must be able to reach the calculator without scrolling past an ad. |
| One unit per viewport | Do not stack two ads in the same mobile screen. |
| No overlap | No sticky/fixed ad may cover inputs, results or buttons. |
| Reserved height | Every mobile slot reserves space; test CLS after enabling. |
| 320×100 or 300×250 | Prefer these over large rectangles in the calculator flow. |
| No anchor ad initially | Revisit after 30 days of mobile engagement data. |
| No ad between shape buttons | The shape selector is a primary control; keep it clean. |
| Test on a small screen | 360×640 and 390×844 are the minimum test sizes. |

**Mobile sequence for the homepage:**

1. Header
2. H1 + one-line promise
3. Calculator (shape → dimensions → material → results)
4. Quote/print/share actions
5. **Ad A** (first ad)
6. Guide
7. **Ad B** (optional)
8. FAQ
9. Footer

This keeps the core task uninterrupted and gives the ad a natural post-task position.

---

## 9. Consent, privacy and regulatory readiness

### 9.1 Why this matters before AdSense

AdSense serves personalised ads using cookies and local storage. Depending on the user's location, the site must obtain consent and disclose the vendors involved. Google requires a **Google-certified CMP** for publishers serving ads to users in the EEA, the UK and Switzerland. US state privacy laws may also apply depending on traffic and business status.

### 9.2 Minimum consent setup

| Requirement | Recommendation |
|---|---|
| CMP | Use a Google-certified CMP (Google Funding Choices or a certified third-party CMP). |
| Consent mode | Implement Consent Mode v2 if Google tags are used. |
| Banner behaviour | Clear accept/reject choices; no pre-ticked boxes; no dark patterns; reject as easy as accept. |
| Consent record | Store consent state and timestamp; allow withdrawal. |
| Privacy policy | Disclose Google AdSense, third-party vendors, cookies, personalised advertising, opt-out links, retention and contact. |
| Cookie policy | List essential, analytics and advertising cookies, with purposes and durations. |
| US privacy | Add a "Do Not Sell or Share My Personal Information" link if the applicable thresholds are met; confirm with counsel. |
| Children | Do not target children; do not use interest-based advertising to children. |
| ads.txt | Keep it live and ensure the publisher ID matches the AdSense account that applies. |

### 9.3 Privacy policy rewrite checklist

The current policy must be replaced, not patched. It should cover:

- What data is collected (calculator inputs are client-side; contact form data; server logs; cookies).
- Why it is collected and the legal basis (where applicable).
- Which third parties receive data (Google AdSense, analytics provider, form endpoint, hosting).
- Cookies and similar technologies, including advertising cookies.
- How users can opt out of personalised advertising (Google Ads Settings, aboutads.info, CMP).
- Data retention.
- User rights (access, deletion, correction, objection, portability) and how to exercise them.
- International transfers, if applicable.
- Contact details for privacy requests.
- "Last updated" date.
- A note that the calculator runs in the browser and does not store measurements server-side, if that remains true.

**Do not claim AdSense or Analytics are active until they are.** A privacy policy that describes non-existent tools is worse than one that describes the current reality.

---

## 10. Pre-application checklist

### Gate 1 — Trust and compliance (must pass)

- [ ] Contact form submits successfully to a real endpoint.
- [ ] Success and error states work; `thankyou.html` is reached.
- [ ] A real fallback email address is visible on the contact page.
- [ ] "Verified Pros" / "Competitive Rates" claims are removed or substantiated.
- [ ] About page density matches the calculator (choose one value and cite it).
- [ ] "Built with civil engineers" is either evidenced with a named person or removed.
- [ ] Privacy policy matches reality and covers ads, cookies, consent, retention and rights.
- [ ] Terms include IP, changes, governing law and contact details.
- [ ] A visible "Last updated" date appears on legal and cost pages.
- [ ] No unsubstantiated income, approval or performance claims anywhere.

### Gate 2 — Content (must pass)

- [ ] At least **five** substantive, original pages (calculator or guide) with real utility.
- [ ] PKR/Pakistan content removed or replaced with a properly labelled USD table.
- [ ] Every cost figure is dated and sourced, or clearly labelled as an estimate.
- [ ] Every density value has a source and a typical range.
- [ ] At least one original diagram, photo or table per calculator page.
- [ ] No page exists solely to repeat a keyword.
- [ ] No duplicate or conflicting FAQ schema.
- [ ] A named author/reviewer or a transparent organisation identity is visible.
- [ ] Internal links connect the calculator cluster.

### Gate 3 — Technical and UX (must pass)

- [ ] All indexable pages return 200 and are in the sitemap.
- [ ] Canonicals are self-referencing and consistent.
- [ ] `robots.txt` allows crawling and references the sitemap.
- [ ] Custom 404 page exists.
- [ ] Favicon exists and no longer 404s.
- [ ] Mobile layout is usable at 360 px width.
- [ ] Lighthouse mobile Accessibility ≥ 90 (target ≥ 95).
- [ ] No console errors.
- [ ] CLS < 0.1 with ads reserved.
- [ ] No broken internal links.
- [ ] No misleading navigation or fake buttons.

### Gate 4 — Ad operations (must pass)

- [ ] AdSense account exists and the site is added.
- [ ] `ads.txt` publisher ID matches the account.
- [ ] AdSense code is installed and verified.
- [ ] CMP is live and blocks ads until consent.
- [ ] Ad placements follow §7 and do not interrupt the calculator.
- [ ] Ads are labelled and visually distinct.
- [ ] No ads on contact, privacy, terms, thank-you or 404.
- [ ] Ad density is conservative.
- [ ] Ads.txt and privacy policy are reachable from every page.

**Do not apply until Gate 1 and Gate 2 are fully green.** Gate 3 and Gate 4 can be completed in parallel, but they must be green before ads go live.

---

## 11. Application process

1. **Fix the blockers.** Complete Gates 1–2. Publish at least three new calculator pages so the site has a real cluster, not one tool and two articles.
2. **Verify the site.** Add the site in AdSense, verify ownership (AdSense code or DNS/ads.txt method), and ensure the publisher ID is the one you control.
3. **Install the code.** Add the AdSense script sitewide, but keep ad units disabled or minimal until approval.
4. **Complete account details.** Payment, tax and address verification. Use accurate information; mismatches cause delays.
5. **Submit for review.** Do not repeatedly resubmit while fixes are in progress.
6. **Wait.** Review time varies. Use the time to publish and improve content, not to add more ad slots.
7. **If rejected:** read the stated reason, fix the specific issue, wait, and reapply. Common reasons include low-value content, navigation problems, policy violations, insufficient content, copyright issues and site-under-construction signals.
8. **If approved:** start with one or two units, monitor UX and policy health, then expand carefully.

**Do not** buy traffic, click your own ads, ask others to click, use pop-ups, or place ads on thin pages to "test" approval. Those are policy violations, not growth tactics.

---

## 12. Post-approval plan

### First 30 days

- Enable Slot A (homepage, post-calculator) and Slot D (calculator pages, post-result) only.
- Keep Slot B/C/E/F off until the first data review.
- Monitor:
  - Page RPM and impression RPM (AdSense).
  - CTR by page and device.
  - Bounce rate and calculator completion (analytics).
  - CLS and Core Web Vitals (Search Console / Lighthouse).
  - Policy Center messages.
- Block low-quality ad categories (e.g., misleading downloads, weight-loss, cryptocurrency) if they harm trust.
- Do not add anchor/vignette ads in the first month.

### Days 31–60

- Add one in-article unit to the strongest guides (Slot F) if UX is stable.
- Test one additional unit on the highest-traffic calculator page only.
- Compare revenue per session against the risk of reducing calculator completion.
- Review mobile vs desktop RPM; do not assume mobile is worse without data.

### Ongoing

- Re-check policy compliance monthly.
- Keep the privacy policy and CMP current.
- Remove or reposition any unit that causes accidental clicks or layout shift.
- Refresh cost content quarterly so ad-supported pages stay accurate.
- Do not let ad revenue dictate page quality. A rejected or limited account costs more than a missing ad unit.

---

## 13. Revenue expectations (no fabricated numbers)

No traffic, RPM, CTR or revenue figure is stated here because none was measured. Once Search Console and AdSense are live, model revenue from **your own** data:

```
Monthly revenue ≈ (monthly pageviews × ad impressions per pageview × viewable impression rate
                  × ad CTR × cost per click) / 1000 ... or simply:
Monthly revenue ≈ (monthly pageviews / 1000) × page RPM
```

Use actual AdSense reports, not industry averages. Early revenue on a small calculator site is usually modest; the strategic priority is approval, trust and organic growth, not short-term RPM.

**Do not** make income claims on the site (e.g., "earn $X"), and do not promise users that quotes or calculations will save a specific amount.

---

## 14. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Application rejected for low-value content | Medium–High | High | Publish the calculator cluster first; fix sourcing and trust pages. |
| Rejection for privacy/consent issues | High if unchanged | High | Rewrite privacy; add a certified CMP before serving ads. |
| Ads reduce calculator completion | Medium | High | Post-task placement; one unit per viewport; measure completion. |
| CLS from unreserved ad slots | Medium | Medium | Reserve height; test mobile after enabling. |
| Policy violation from ad proximity | Medium | High | Keep 150 px separation from buttons; label ads; no ads inside the tool. |
| Misrepresentation claim from "Verified Pros" | Medium | High | Remove or substantiate the claim. |
| Account limited for invalid traffic | Low if honest | High | Never click own ads; no purchased traffic; monitor reports. |
| Ad code slows the site | Medium | Medium | Load after consent; lazy-load below-fold units; keep the base page fast. |
| Revenue disappointment | High initially | Medium | Treat ads as a secondary monetisation layer; focus on organic growth and product value. |

---

## 15. Recommended sequence

| When | Action | Gate |
|---|---|---|
| Days 1–7 | Fix contact form, privacy policy, About claims, PKR content, duplicate FAQ schema. | Gate 1 |
| Days 8–14 | Add methodology/density section, visible dates, named reviewer, sources; publish one new calculator page. | Gate 2 |
| Days 15–30 | Ship calculator improvements (waste, compaction, metric, share, cost, bags); publish two more calculator pages. | Gate 2 |
| Days 31–45 | Add CMP, analytics, Search Console; finalise ad placements; run Lighthouse/CLS tests. | Gate 3/4 |
| Days 45–60 | Apply to AdSense with 5+ substantive pages and a clean trust layer. | All |
| After approval | Enable Slot A + D; monitor for 30 days; expand slowly. | Post-approval |

**If you want the fastest credible application:** do Days 1–14, publish the driveway and tons calculators, then apply. **If you want the strongest application:** wait until the seven-page cluster is live (around day 60) and the trust layer has been stable for several weeks.

---

## 16. Sources

All accessed **2026-11-01**.

- Google AdSense Program Policies: https://support.google.com/adsense/answer/48182
- Google Publisher Policies: https://support.google.com/publisherpolicies/answer/10502938
- AdSense content and user experience guidance: https://support.google.com/adsense/answer/9724
- AdSense eligibility requirements: https://support.google.com/adsense/answer/9724
- Google consent management requirements for EEA/UK/Swiss traffic: https://support.google.com/adsense/answer/13554116
- Google-certified CMP partners: https://support.google.com/adsense/answer/13554116
- ads.txt guide: https://support.google.com/adsense/answer/12171612
- Google Advertising Policies: https://support.google.com/adspolicy/answer/6008942
- Google Search help — privacy policy requirement: https://support.google.com/adsense/answer/1348695
- Web.dev — Cumulative Layout Shift: https://web.dev/articles/cls
- Local files: `index.html`, `about.html`, `contact.html`, `privacy.html`, `terms.html`, `thankyou.html`, `ads.txt`, `script.js`.
- Lighthouse mobile lab run, 2026-11-01 (`lh-home-mobile.json`): Performance 87, Accessibility 75, SEO 100, Best Practices 96.

**Limitations:** no AdSense account data, approval history, policy messages, traffic, RPM or revenue data was available. No approval outcome is predicted. Policy details can change; verify against Google's current documentation before implementation.

---

*End of ADSENSE-READINESS.md*
