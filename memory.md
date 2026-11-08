# Project Memory — Pro Gravel Calculator

Last refresh: 2026-11-08 (local working session)
Active site root: `C:\Users\Abdullah\Documents\GitHub\Gravel-Calculator`

## Current phase
Phase 3 — content cluster + homepage polish.
Today's task scope: Phase 3 homepage UI/UX polish only, homepage first, calculator math unchanged.

## Today's result
- `style.css` recolored for the homepage toward a grounded evergreen system:
  - primary `#2f5d3a` / `#1f4029`
  - accent `#a96a3a` / `#f7efe7`
  - neutral ink `#1f2421` / `#4b5550`
  - border/panel `#d8ded6` / `#f6f7f3`
- applied to shape buttons, slider thumbs, sliders, FAQ, consent, forms, methodology strip, guide cards, result values, order button, fallback chip
- `npm run build:css` rebuilt `tailwind.css`
- `npm test` still passes: 35 engine + 18 static = 53 PASS, 0 FAIL
- default calculator output still unchanged: `0.93 yd³ / 1.31 short tons / 53 bags`
- no new component markup added; only existing ids/classes restyled

## How to continue after today
1. Reread `index.html`, `style.css`, `tailwind.config.js`, `script.js` if another round is needed.
2. Re-run `npm run build:css && npm test` after any CSS or Tailwind utility change.
3. Visual check before any deploy decision.

## Phase 3 checklist
### Calculator pages — done
- [x] 1 — `/french-drain-gravel-calculator/index.html`
- [x] 2 — `/gravel-bag-calculator/index.html`
- [x] 3 — `/pea-gravel-calculator/index.html`
- [x] 4 — `/gravel-calculator-tons/index.html`
- [x] 5 — `/crushed-stone-calculator/index.html`
- [x] 6 — `/driveway-gravel-calculator/index.html`
- [x] 7 — `/gravel-cost-calculator/index.html`
- [x] Homepage visual polish (style.css recolor, no math change)
### Reference assets — still open
- [ ] 1 — Open Graph / social image asset
- [ ] 2 — Favicon / app icon set refresh if needed
- [ ] 3 — Search Console + GA4 wiring prerequisites
- [ ] 4 — Contact form delivery endpoint/email
- [ ] 5 — Deployment approval + publish decision

## Hard constraints
- Default calculator output must stay `0.93 yd³ / 1.31 short tons / 53 bags` on the homepage default.
- `.html` URLs and existing functionality stay intact.
- Do not invent GA4 IDs, GSC data, prices, reviews, or contact details.
- Do not commit, push, or deploy without explicit owner approval.
- Update `memory.md` after every completed task.

## Verified earlier
- Phase 2 Tasks 2-1 through 2-10 treated as verified, including browser check of cost estimator, bag sizes/pallets, share URL, PDF order sheet.
- `npm test` 53 PASS, 0 FAIL in this session.

## Pending
- Phase 2 Task 2-11 cross-browser/responsive-width matrix still open in the plan if it gets picked up again.

## Local run notes
- Local dev command used earlier: `npm run dev` (python static server on `127.0.0.1:4173`).
- Tailwind config: `tailwind.config.js` with content `['./*.html','./*.js']` and `@tailwindcss/typography` plugin.
- Custom CSS layer: `style.css`; utility layer: `tailwind.css` (do not edit by hand).

## External blockers still open
- Search Console access.
- Real GA4 measurement ID.
- Contact-form delivery endpoint/email.
- Deployment approval.
