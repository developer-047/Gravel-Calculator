# Phase 4 — Task 4-2: foundation directory submissions (prep + verdict)

**Date:** 2026-11-10. **Status:** prepared, not submitted — three submissions need an owner account,
and every local-business directory is ineligible as the site stands.

**Headline finding:** for a website with no business identity, most of the "foundation link" list in
the plan is unavailable, and the three openings that do exist are `nofollow` or unverified. This task
should not absorb a week. Evidence and the exact blocked/unblocked split are below.

---

## 1. Why the local directories are blocked

Nothing in the repository supplies a business identity. Evidence:

- `privacy.html:214` — "We do not publish a postal address."
- `about.html:255` — "© 2026 Pro Gravel Calculator. All rights reserved. Independent tool — not a
  quarry or contractor."
- `contact.html` — a form only; the phone field is a placeholder (`(555) 123-4567`), no number is
  published, and no email address appears on any page.

Directory requirements, checked 2026-11-10:

| Directory | Requirement | Verdict |
|---|---|---|
| Google Business Profile | Verified business, physical or service-area address, phone, category, postcard/phone/video verification | **Blocked** — no address, no phone |
| Bing Places | "All businesses must provide a valid address for verification"; a service-area business may hide the address publicly but must still supply one, plus service areas | **Blocked** — same gap |
| Apple Business Connect, Yelp for Business | Registered business with location and phone | **Blocked** |
| Houzz, Angi, Thumbtack, BBB | Contractor/service-business profile, most are paid lead generation rather than links | **Blocked and off-strategy** — we are explicitly "not a quarry or contractor" |

Nothing here can be worked around by inventing an address, a phone number or a trading name. If the
owner has a registered business (even a home-based service-area one), four of these become available
overnight — that is the single highest-leverage unblock in this task, and it is owner input.

## 2. What is actually open (3)
| Target | Cost | Route | Link | Value |
|---|---|---|---|---|
| **AlternativeTo** (`alternativeto.net`) | Free (paid priority review exists) | Register → user icon → **Suggest new application** → fill Platforms, License, Descriptions, Tags → Submit; then moderator backlog | **Disputed.** `dr.serp.co` and `saasreviews.org` both report `rel="nofollow"` on the website link; `submit.co` claims dofollow. AlternativeTo publishes no rule. Assume **no ranking value** until verified on the live listing. | Referral traffic plus a brand mention on a DR~80 domain. Review backlog is described as long ("a few months" in a third-party test); priority review is a small one-off fee. |
| **Product Hunt** (`producthunt.com/launch`) | Free | Personal account only — company accounts are prohibited — log in, **Submit → New Product**, product URL first | Not stated by Product Hunt; treat as nofollow | One-shot launch, real referral traffic if the launch is worked. Not a repeatable tactic. |
| **SaaSHub** (`saashub.com/submit`) | Free | Submit and verify the product, then use the management page's Submit tab | Unverified | Low. Its more useful asset is the public 110-site submission list, which is a discovery aid, not a submission target. |

AlternativeTo's own rejection rules matter: they "decline a lot of submissions… we only list things
someone would plausibly come to AlternativeTo looking for an alternative to." The honest angle is
therefore not "here is our calculator" but **"an alternative to Omni Calculator / Calculator.net for
gravel quantities"** — which is literally true, and is the framing to use.

### 2.1 Plan-named calculator directories

The plan names `toolcalculator.com` and `freecalc.com`. Neither host resolved from this environment on
2026-11-11 (`curl` returned "Could not resolve host"; the fetch tool also failed), so neither was
assessed or submitted. Do not submit blind: re-check whether they are live before spending time on
them, and treat them as low-value directory links until they show a real editorial audience.

## 3. Do not do (link-scheme risk, from the plan's own rules)

- Paid "100 directory submissions" packages, Fiverr/Gig link bundles, PBNs.
- Generic "add your URL" free-for-all directories, reciprocal link pages, guest-post farms.
- Mass-submitting the SaaSHub list. Submitting to 110 sites is a footprint, not a strategy, and most
  of those entries are nofollow or dead.
- Inventing a trading name, address or phone to unlock the local directories.

## 4. Copy block (paste as-is, all facts verified in the repo)

```
Name:        Pro Gravel Calculator
URL:         https://www.progravelcalculator.online/
Tagline:     Free gravel calculator - cubic yards, tons and 50 lb bags for driveways,
             paths and French drains. No signup.
Category:    Calculator / Construction / Home & Garden (pick the narrowest each site offers)
License:     Free
Platforms:   Web
Pricing:     Free
Logo:        icon-512.png   (or og-image.png, verified 1200x630)
Screenshots: capture homepage results card + a subpage calculator
```

Long description (two short paragraphs, no invented claims):

> Pro Gravel Calculator converts three measurements — area, depth and material — into the volume,
> weight and bag count you need before ordering aggregate. It covers gravel, crushed stone, pea
> gravel, river rock and sand, in imperial or metric units, with waste and compaction allowances
> applied as explicit multipliers rather than baked into the density.
>
> The site also publishes a reference gravel density chart, a French drain stone guide with pipe
> volume deduction, and a 2026 material price index. It is free, needs no signup, and the same
> engine powers an embeddable widget other sites can drop in.

Keep the same tagline and description everywhere so the entity reads consistently across listings.

## 5. Definition of done

- [ ] Owner confirms whether a registered business identity exists (unblocks GBP, Bing, Apple, Yelp)
- [ ] AlternativeTo submission sent, listing URL recorded, link attribute checked on the live page
- [ ] Product Hunt launch date chosen or explicitly deferred
- [ ] SaaSHub listing submitted and link attribute checked
- [ ] Tracker row per submission: date, URL, status, link attribute (`nofollow` / `follow` / unknown)
- [ ] Nothing in §3 attempted

## 6. Recommendation

Send AlternativeTo and defer Product Hunt to a week when there is something to announce (a new
calculator or the widget's first real publisher). Then stop: expected ranking impact from all three is
**zero to negligible**, and the remaining Phase 4 hours are better spent on Task 4-3, where the links
are editorial and the density chart is genuinely citable.
