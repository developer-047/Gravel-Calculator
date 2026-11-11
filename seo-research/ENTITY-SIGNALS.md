# Phase 4 — Task 4-6: branded entity signals

**Status 2026-11-10: blocked.** Nothing in this task can be completed from inside the repository,
because every item needs an identity the site does not currently have. This file records exactly what
is missing, what it unlocks, and the code that is ready to ship the moment the profiles exist.

---

## 1. Current state `[Measured]`

| Signal | State | Evidence |
|---|---|---|
| Organisation schema | Present, but **no `sameAs`** | `index.html:54` opens the `Organization` node; grep for `sameAs` across the site returns nothing |
| Google Business Profile | None | Not claimable: the site publishes no address or phone (`privacy.html:214`, `contact.html:161` placeholder `(555) 123-4567`) |
| Social profiles | None published | No outbound profile links in any footer |
| Consistent brand name | Partly | "Pro Gravel Calculator" is used in titles, `og:site_name` and the widget attribution, but there is no registered trading name |
| Postal address / phone | None, by design | `privacy.html:214`: "We do not publish a postal address"; `about.html:255`: "Independent tool — not a quarry or contractor" |

**Why this matters more than it looks:** `sameAs` is how Google ties an organisation to the accounts
that represent it. Leaving it empty is correct while no profiles exist — an invented `sameAs` is a
fabricated entity signal and would be worse than nothing. The Task 4-2 directory verdict (see
`DIRECTORY-SUBMISSIONS.md`) has the same root cause: no NAP, no local listings.

---

## 2. What the owner has to decide (in order)

1. **Trading name.** "Pro Gravel Calculator" as a sole-trader or registered name? Some directories and
   all four local platforms ask for a legal or trading name.
2. **Address and phone.** A Google Business Profile for a service-area business can hide the address
   from the public, but it still has to be verified against a real one, and a phone number is required.
   This is the single decision that unblocks GBP, Bing Places, Apple Business Connect and Yelp at once.
3. **Which profiles to claim.** Recommendation, cheapest first:
   - LinkedIn company page (no verification friction, useful for `sameAs` immediately).
   - X/Twitter handle matching the brand.
   - Facebook page.
   - Google Business Profile **only** if 1 and 2 are settled — a suspended profile is worse than none.
4. **Who answers messages.** A profile with no reply for months is a negative signal.

## 3. The code, ready to paste

Once — and only once — the profiles are live, add this to the `Organization` node in `index.html`.
Replace every `...` with the real URL; leave the node alone if any profile does not exist yet.

```json
"sameAs": [
    "https://www.linkedin.com/company/<handle>",
    "https://x.com/<handle>",
    "https://www.facebook.com/<handle>"
],
"logo": "https://www.progravelcalculator.online/icon-512.png",
"email": "<the address the owner is willing to publish>"
```

Rules for that edit:

- `logo` must be the existing `icon-512.png` (there is no `favicon-512x512.png`; that name does not
  exist in the repo).
- Add `email` only if the owner wants it public. `contact.html` currently takes messages through a form.
- Do not add `address` unless the owner is willing to publish one.
- After editing, `npm test` re-validates the JSON-LD parse and the social image paths, and
  `python tests/site-audit.py` re-checks every page.

## 4. What this task is not

- It is not a directory-submission task; that is 4-2, and its verdict is already written.
- It is not a link-building task. Profiles are `nofollow` almost everywhere; the value is entity
  consistency and brand queries, not PageRank.
- It is not a shortcut around the missing NAP. Claiming a profile with an invented address breaks the
  platform terms and can get the profile suspended.

## 5. Definition of done for 4-6

- [ ] Owner supplies trading name, address/phone decision, and the profile set (needs owner input)
- [ ] Profiles created with identical name, description and logo
- [ ] `sameAs` added to `Organization` with only the profiles that actually exist
- [ ] Brand name spelled identically on every profile and in every page title
- [ ] Profiles monitored; replies within a few days

Profiles claimed: **0**. `sameAs` entries: **0** (correctly so, until profiles exist).
