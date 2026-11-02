# Website Audit — Pro Gravel Calculator

> **Research date:** 2026-11-01  
> **Site audited:** https://www.progravelcalculator.online/  
> **Local project:** `C:\Users\Abdullah\Documents\GitHub\Gravel-Calculator`  
> **Scope:** Phase 1 (understand the existing website) + Phase 6 (technical SEO audit)  
> **Evidence labels used in this report:** `[Measured]` = directly observed in code, live HTTP response, DNS, or Lighthouse. `[Observed]` = seen in search results or on a competitor page. `[Estimate]` = analyst judgment. `[Unavailable]` = not measured and not claimed.

---

## 1. Executive snapshot

Pro Gravel Calculator is a fast, clean, static gravel-and-aggregate estimator. It is genuinely useful for a first-pass material estimate: three shapes, four materials, imperial/metric input, live cubic-yard/ton/bag output, SVG preview, print, PDF and a quote hand-off to the contact page.

The site is **not yet competitive as an SEO product** for three reasons:

1. **One page is carrying almost every commercial query.** The homepage targets the generic “gravel calculator” intent, but there are no dedicated pages for driveway, pea gravel, crushed stone, cost, bags, coverage or French drains. Competitors have built those pages and are winning the specific intents.
2. **The calculator lacks the features users now expect**: cost estimation, waste/compaction allowance, bag-size choice, more materials/custom density, metric outputs, presets and shareable calculation links.
3. **Trust and conversion leaks are visible**: the contact form does not submit, the best-gravel-types guide quotes Pakistan rupees while the site targets the US, the About page contradicts the calculator’s own density figure, and the privacy policy claims AdSense/Analytics that are not installed.

The technical foundation is better than average: HTTPS/HSTS, self-referencing canonicals, a valid sitemap, clean robots.txt, a noindexed thank-you page, no broken internal links, and a Lighthouse SEO score of 100. The main technical risks are a **duplicate/conflicting FAQPage schema**, **Tailwind CDN runtime cost**, **missing asset caching**, **missing favicon**, **no custom 404**, and **accessibility defects**.

**Bottom line:** fix trust/conversion first, then close the product gaps, then build intent-specific landing pages. Do not mass-publish articles before the calculator and the contact path are trustworthy.

---

## 2. What the tool actually does

### 2.1 Problem it solves

Users know the area they want to cover (a driveway, path, patio, yard, road, or irregular L-shaped area) and need to convert that area plus a depth into a quantity they can order: **cubic yards, tons, and 50 lb bags**. The calculator removes the manual volume/density arithmetic and gives an order-ready estimate.

### 2.2 Primary purpose

A free, no-signup **gravel and aggregate quantity estimator** for residential and light commercial projects.

### 2.3 Target audience

- US homeowners and DIYers planning driveways, paths, patios, yards and drainage.
- Small contractors, landscapers and hardscapers who need a quick take-off.
- English-speaking users in the UK, Canada and Australia (the site supports metric input, but not metric output — see §7.4).

The site’s content mixes US, UK and Pakistan references. That is a positioning problem, not just a copy problem: the audience is unclear.

### 2.4 Features confirmed in the code

| Feature | Status | Evidence |
|---|---|---|
| Rectangle area | Working | `calculateRectangleArea()` in `script.js` |
| Circle area (diameter input) | Working | `calculateCircleArea()` |
| L-shape (two rectangles, Section A + B) | Working | `calculateLShapeArea()` |
| Imperial input (ft + in) | Working | `toFeet()` |
| Metric input (m + cm) | Working | `toFeet()` with ×3.28084 |
| In-place unit conversion when toggling | Working | `toggleUnits()` / `convertValues()` |
| Depth slider 0–24 in, 0.5 in steps | Working | `#depth-slider` |
| 4 material densities | Working | `DENSITIES` object |
| Cubic yards output | Working | `calculateVolume()` |
| Short tons output | Working | `calculateWeight()` |
| 50 lb bag count | Working | `calculateBags()` |
| Live recalculation | Working | `input` listeners call `performCalculation()` |
| SVG dimension preview | Working | `updateSVGVisualizer()` |
| Print view | Working | `window.onbeforeprint` + hidden `#invoice-wrapper` |
| PDF export | Working (lazy CDN) | `generatePDF()` loads html2pdf.js |
| Share button | Partial | Shares current URL, not the current calculation |
| Quote hand-off | Working | `getQuote()` passes results to `contact.html` query string |
| Query-param prefill | Working | `loadQueryParams()` |
| Ad slots with CLS prevention | Present but empty | `.ad-slot`, `.ad-container`; no AdSense code |
| Contact form submission | **Broken** | `<form>` has no `action`/`method`; button is `type="button"`; no submit handler |

### 2.5 Unique selling points the site can legitimately claim

- L-shape mode with two measured sections — useful and less common than plain rectangles.
- Circle mode with diameter input.
- Transparent material densities shown in the UI.
- Print/PDF estimate and a quote hand-off — more complete than many simple calculators.
- Fast, no-signup, no email gate, clean mobile layout.
- No ad clutter today (a short-term UX advantage, but also a monetization gap).

### 2.6 Technology stack

| Layer | Implementation |
|---|---|
| Hosting | Vercel (`Server: Vercel`, `X-Vercel-Cache: HIT`) |
| HTML | Static multi-page HTML5 — 8 HTML pages total: 7 indexable + 1 noindex thank-you page |
| CSS | Tailwind CSS loaded from `https://cdn.tailwindcss.com` (runtime JIT) + local `style.css` (12,988 bytes) |
| JavaScript | Vanilla ES5/ES6 in `script.js` (34,268 bytes), deferred |
| PDF | `html2pdf.bundle.min.js` loaded on demand from cdnjs |
| Images | `image_8.webp` (23,504 bytes) with `image_8.png` fallback (378,084 bytes) |
| Analytics/consent | None detected |
| Ads | `ads.txt` present; no AdSense script or ad code |
| Redirects | `vercel.json`, `_redirects`, `.htaccess` each redirect old `-2026` article URLs |

**Architecture implication:** there is no build step and no templating. Every new landing page duplicates the header/footer. That is workable for 10–20 pages, but it increases the risk of inconsistent navigation, schema and internal links. A small static-site generator or shared partials would reduce maintenance, but that is a code change requiring approval.

---

## 3. Page inventory

Approximate visible word counts below exclude `<script>`, `<style>` and comments but include navigation/footer. `[Measured]`

| URL | Title length | Meta description length | H1 count | H2 count | Approx. words | Indexable | In sitemap |
|---|---:|---:|---:|---:|---:|---|---|
| `/` | 80 | 153 | 2 | 10 | 1,381 | Yes | Yes |
| `/best-gravel-types.html` | 93 | 139 | 1 | 8 | 1,323 | Yes | Yes |
| `/driveway-cost-guide.html` | 86 | 135 | 1 | 9 | 1,439 | Yes | Yes |
| `/about.html` | 34 | 132 | 1 | 4 | 269 | Yes | Yes |
| `/contact.html` | 46 | 136 | 1 | 0 | 84 | Yes | Yes |
| `/privacy.html` | 40 | 130 | 1 | 5 | 288 | Yes | Yes |
| `/terms.html` | 42 | 136 | 1 | 4 | 270 | Yes | Yes |
| `/thankyou.html` | 35 | 112 | 1 | 0 | 83 | No (`noindex, follow`) | No |

All eight live URLs returned HTTP 200 on 2026-11-01. `[Measured]`

### 3.1 Page roles

- **Homepage** — the calculator, a long “how to measure” guide, a 5-question FAQ, quote/print/PDF/share actions.
- **Best Gravel Types** — comparison guide: pea gravel vs crushed stone vs river rock.
- **Driveway Cost Guide** — 2026 cost breakdown with US/UK examples.
- **About** — brand/trust page, claims civil-engineering input.
- **Contact** — quote request form; auto-fills from calculator query parameters.
- **Privacy / Terms** — legal pages.
- **Thank You** — post-submit confirmation page, correctly noindexed.

---

## 4. SEO foundation — what is already correct

| Check | Result | Evidence |
|---|---|---|
| HTTPS | Pass | HTTPS 200; HTTP → HTTPS 308; HSTS `max-age=63072000` |
| Canonical host | Pass | `www` is canonical; apex 307 → `https://www...` |
| Self-referencing canonicals | Pass | Present on every page |
| Robots meta | Pass | `index, follow` on all indexable pages; `noindex, follow` on thank-you |
| robots.txt | Pass | Allows all; declares sitemap |
| XML sitemap | Pass | 7 URLs; all 200; thank-you excluded |
| Sitemap accuracy | Pass | No noindex or 404 URLs included |
| Internal links | Pass | No broken local `href` targets found |
| Duplicate meta descriptions | Pass | Each page has a unique description |
| Mobile viewport | Pass | `width=device-width, initial-scale=1` |
| Language | Pass | `<html lang="en">` on all pages |
| Image alt text | Pass | The single `<img>` has descriptive alt text |
| Lazy image loading | Pass | `loading="lazy"` |
| WebP delivery | Pass | `<picture>` serves WebP first |
| Redirects from old URLs | Pass | `vercel.json` 301s old `-2026` URLs |
| Thank-you page indexing | Pass | `noindex, follow`; excluded from sitemap |

These are not small wins. Many competing calculator sites still ship duplicate canonicals, index their thank-you pages, or break their sitemap. Keep this foundation intact.

---

## 5. Measured performance and Core Web Vitals (lab)

**Method:** Lighthouse 12 locally (headless Chrome, mobile emulation, cold load) against the live homepage on 2026-11-01. This is **lab data**, not field CrUX data. `[Measured]`

| Metric | Result | Assessment |
|---|---:|---|
| Performance score | **87 / 100** | Good, not excellent |
| SEO score | **100 / 100** | Excellent |
| Accessibility score | **75 / 100** | Needs work |
| Best Practices score | **96 / 100** | One console error |
| First Contentful Paint | **2.5 s** | Slow (good ≤1.8 s) |
| Largest Contentful Paint | **2.5 s** | At the “good” boundary |
| Total Blocking Time | **280 ms** | Moderate |
| Cumulative Layout Shift | **0** | Excellent |
| Speed Index | **2.8 s** | Good |
| Time to Interactive | **2.9 s** | Good |
| Server response time | **70 ms** | Excellent |
| Total page weight | **174 KiB** | Light |
| Document transfer | **13.6 KiB** compressed | Light |

### 5.1 What is consuming the time

| Resource | Transfer size | Note |
|---|---:|---|
| `https://cdn.tailwindcss.com/3.4.17` | **126,865 bytes** | Runtime Tailwind; the largest resource |
| `image_8.webp` | 23,664 bytes | Below-fold, lazy |
| Homepage document | 13,576 bytes | Compressed |
| `script.js` | 9,773 bytes | Deferred |
| `style.css` | 3,618 bytes | Render-blocking stylesheet |
| `favicon.ico` | 188 bytes | **404 error** |

Lighthouse attributes **2.16 s of main-thread work** to the homepage document and Tailwind runtime; script evaluation is 0.97 s, style/layout 1.18 s. Tailwind CDN also logs a production warning to the console. `[Measured]`

### 5.2 Performance conclusion

The page is light, but the **Tailwind CDN runtime** is the main performance tax. Compiling Tailwind to a static CSS file (or using the Tailwind CLI at build time) should reduce JavaScript, remove the console warning, and improve FCP/TBT. This is a build/tooling change and needs approval.

---

## 6. Technical SEO audit — prioritized issues

Priorities: **CRITICAL** = blocks trust/conversion/indexation or creates policy risk; **HIGH** = materially limits rankings, trust or revenue; **MEDIUM** = meaningful improvement; **LOW** = polish.

### 6.1 CRITICAL

| ID | Issue | Evidence | Why it matters | Recommended fix |
|---|---|---|---|---|
| C1 | **Contact form does not submit** | `contact.html` form has no `action`/`method`; submit button is `type="button"`; no submit handler in the page script | The primary conversion path is broken. Users cannot request a quote. AdSense reviewers and users expect a working contact method. Every “Request Quote” click is wasted. | Connect the form to a form endpoint (Formspree, Netlify Forms, Vercel serverless function, or email service) with validation, spam protection, success → `thankyou.html`, error state, and a real fallback email address. Add `required`, `name`, `autocomplete` and accessible labels. |
| C2 | **Duplicate, conflicting FAQPage schema** | Two `FAQPage` JSON-LD blocks: one in `<head>` with 4 questions, one before the footer with 5 different questions. The head answers are not visible on the page. | Google requires FAQ structured data to match visible content. Conflicting blocks risk losing FAQ rich results and can be treated as spammy structured data. | Keep **one** `FAQPage` block that exactly matches the visible FAQ. Remove the head block or rewrite it to the visible questions. Validate in Rich Results Test. |
| C3 | **Country/currency mismatch on a US-targeted guide** | `best-gravel-types.html` says “2026 Pakistan Market Averages”, “across Pakistan”, and prices in **PKR** in the main comparison table, while other sections use USD | A US searcher landing on PKR prices will bounce. It also undermines the site’s claim to be a US/English-market resource and creates inconsistent cost data across pages. | Rewrite the table in **USD** (with a clear “US average, 2026” label and source/date). Remove Pakistan references. If international pricing is valuable, add a region selector later, not mixed currencies on one page. |

### 6.2 HIGH

| ID | Issue | Evidence | Why it matters | Recommended fix |
|---|---|---|---|---|
| H1 | **No working monetization code** | `ads.txt` exists (`pub-2116230961044763`), but no `adsbygoogle`/`pagead2.googlesyndication` script on any page; ad containers are empty | The site cannot serve AdSense ads yet. `ads.txt` alone is not an AdSense integration. | After trust/content fixes, add the AdSense script (Auto ads or manual units), verify the publisher ID, add consent management, and test fill. Do not apply before C1/C3/H2 are fixed. |
| H2 | **Privacy policy describes tools that are not installed** | Privacy says “We use Google AdSense” and “We may use tools like Google Analytics”; neither script exists. It also references the retired DART cookie. | Inaccurate privacy disclosures are a trust and compliance problem, especially for AdSense. | Rewrite to match reality at launch: list actual cookies/vendors, add a consent/CMP section, update the “last updated” date, and remove DART wording. Revisit when AdSense/Analytics go live. |
| H3 | **E-E-A-T inconsistency and unsubstantiated claims** | About says density formulas use “2,835 lbs/yd³ for crushed stone”; the calculator uses 100 lb/ft³ = **2,700 lbs/yd³**. About also claims “built with civil engineers”, “industry-standard” and “trusted resource” without names, credentials or sources. | Contradictory numbers damage trust. Unverifiable expert claims are a quality risk for Google and AdSense reviewers. | Make the density figure consistent. Add a named author/reviewer with credentials, a methodology note, source citations, and a visible “last updated” date. If there is no named engineer, remove or soften the claim. |
| H4 | **No analytics or Search Console verification** | No `gtag`, GTM, GA4, or `google-site-verification` meta tag found | Without GSC you cannot see queries, impressions, CTR, indexing or CWV. Without analytics you cannot measure conversions or landing-page behavior. | Verify the domain in Search Console (DNS TXT preferred), submit the sitemap, and add a privacy-friendly analytics tool or GA4 with consent. Add event tracking for calculate, print, PDF, share, and quote clicks. |
| H5 | **Tailwind CDN is a production performance tax** | 126,865-byte runtime script; 2.16 s main-thread work; console warning; FCP 2.5 s | Slower first paint and interactivity, especially on mobile. The CDN is explicitly not recommended for production. | Compile Tailwind at build time to a static CSS file, purge unused classes, remove the CDN script, and re-run Lighthouse. Target Performance ≥95 and FCP <1.8 s. |
| H6 | **Best-gravel-types is too long for a SERP title** | Title is 93 characters | Google will truncate it; the differentiating words (“2026”, “Which to Choose”) may be cut. | Rewrite to ≤60 characters, e.g. “Pea Gravel vs Crushed Stone vs River Rock (2026)”. Keep the H1 descriptive. |
| H7 | **Driveway cost guide title is too long** | Title is 86 characters | Truncation in SERPs; lower CTR. | Rewrite to ≤60 characters, e.g. “Gravel Driveway Cost in 2026: Full Breakdown”. |
| H8 | **Homepage title is long** | Title is 80 characters | The “(Metric/Imperial)” suffix may be cut; the core promise should come first. | Rewrite to ≤60 characters, e.g. “Gravel Calculator – Free Yards, Tons & Bags”. |

### 6.3 MEDIUM

| ID | Issue | Evidence | Why it matters | Recommended fix |
|---|---|---|---|---|
| M1 | **Two H1s on the homepage** | Print-only `#invoice-wrapper` contains `<h1>Pro Gravel Calculator</h1>`; main content contains `<h1>Free Pro Gravel & Yard Calculator</h1>` | Multiple H1s are not automatically fatal, but the first H1 is a hidden print header, not the page topic. It weakens the heading outline and accessibility. | Change the print header to a `<div>`/`<p>` styled as a heading, or keep one H1 in the main content. |
| M2 | **Hidden `sr-only` H2 keyword variants** | `<div class="sr-only"><h2>Gravel Road Calculator</h2><h2>Gravel Estimator for Driveways and Patios</h2></div>` | This is keyword insertion without visible user value. It looks manipulative and adds no context for screen-reader users. | Remove them. Target those phrases in visible H2s/sections or dedicated pages. |
| M3 | **Footer heading order fails** | Lighthouse `heading-order`: `<h4>` in footer without a preceding `<h3>` in that section | Minor accessibility issue; also a signal of an unstructured outline. | Use `<h2 class="sr-only">Footer</h2>` then `<h3>` for column titles, or change footer headings to styled `<p>` elements. |
| M4 | **Form controls lack programmatic labels** | Lighthouse `label` (range slider) and `select-name` (material select); manual check shows dimension inputs have `<label>` text but no `for`/`id` association | Screen-reader users may not know what each input controls. | Add `for`/`id` pairs for every input, a `<label for="material-select">`, and a `<label for="depth-slider">`. Add `aria-live="polite"` to the results region. |
| M5 | **Contrast failures** | Metric toggle: 4.34:1 (needs 4.5:1); footer copyright: 2.56:1 | Readability issue for low-vision users. | Darken the metric toggle text and footer text (e.g., `text-slate-600`/`text-slate-500`). |
| M6 | **Missing favicon** | `favicon.ico` request returns 404; no `<link rel="icon">` | Browser tab looks unfinished; console error; minor trust/UX. | Add a 32×32/180×180 favicon set and `<link rel="icon">` tags. |
| M7 | **No custom 404 page** | Missing URL returns a 79-byte Vercel default with 404 status | Users who mistype a URL hit a dead end; no navigation back to the calculator. | Create `404.html` with the header, a short message, links to the calculator and top guides. Vercel serves it automatically. |
| M8 | **Static assets are not cached** | `style.css`, `script.js`, `image_8.webp` all return `Cache-Control: public, max-age=0, must-revalidate` | Repeat visits revalidate every asset; slower repeat loads and more requests. | Set long-lived cache headers for static assets (e.g., `max-age=31536000, immutable`) and add hashed filenames or version query strings when changing them. Keep HTML revalidation. |
| M9 | **Image dimensions do not match the file** | `image_8.png` is **1024×1024**; the `<img>` declares `width="800" height="450"` | The reserved aspect ratio is 16:9 but the actual image is 1:1. When the lazy image loads, the layout can shift and the rendered box may be inconsistent. | Set the correct intrinsic dimensions (`width="1024" height="1024"`) or crop/resize the image to the intended aspect ratio. Re-test CLS with the image in view. |
| M10 | **Open Graph image is square** | `og:image` points to the same 1024×1024 PNG | Facebook/LinkedIn/X previews prefer 1200×630; a square image may be cropped or letterboxed. | Create a 1200×630 OG image with the brand, title and a simple gravel visual. |
| M11 | **Weak internal linking** | Home footer “Quick Links” only lists Calculator and Driveway Cost Guide; article footers omit Gravel Types/About/Contact | Important pages receive few internal links; crawl paths and topical relationships are weak. | Add Gravel Types, About, Contact, and future calculator pages to the footer. Add contextual links from every article to the relevant calculator page. |
| M12 | **No visible breadcrumbs on most pages** | BreadcrumbList schema exists on several pages, but visible breadcrumbs appear only on the two guides (class match) | Users lose orientation; schema without a visible equivalent is less useful. | Add a visible breadcrumb trail on all inner pages, matching the schema. |
| M13 | **Article schema lacks image and person author** | `Article` schema uses an Organization author; no `image`; no `author.url`/credentials | Weaker eligibility for article enhancements and weaker E-E-A-T signals. | Add `image` (1200×630), a named author with `url` and `sameAs`, `dateModified`, and `publisher.logo`. |
| M14 | **No visible “last updated” or sources on guides** | Article schema has dates, but the page copy does not show them; cost ranges have no cited source | Cost content is YMYL-adjacent; unsourced numbers reduce trust. | Add “Last updated: …” near the H1, a “Sources” section, and a short methodology note. |
| M15 | **Accessibility: results not announced** | Result numbers update live; no `aria-live` region | Screen-reader users may not hear the new estimate. | Add `aria-live="polite"` and `aria-atomic="true"` to the results container. |
| M16 | **Share button shares the wrong thing** | `shareTool()` uses `window.location.href`; it does not serialize current inputs | “Share This Tool” shares a blank/default calculator, not the user’s calculation — a missed product differentiator. | Encode shape, material, depth and dimensions into the URL before sharing; restore them on load (the loader already exists). |
| M17 | **Metric users get imperial outputs** | Inputs switch to m/cm, but results remain “Cubic Yards”, “Tons”, “Bags” | Confusing for UK/Canada/Australia users; limits international relevance. | Add m³, metric tonnes and kg outputs when Metric is selected; keep the underlying math in feet or convert explicitly. |
| M18 | **No cost or waste/compaction controls** | The calculator outputs volume/weight/bags only; content tells users to add 10% manually | Users must do the two most important purchasing adjustments themselves. Competitors expose these controls. | Add a waste/compaction slider (0–25%) and an optional cost estimate (price per ton/yard, delivery). |

### 6.4 LOW

| ID | Issue | Evidence | Recommendation |
|---|---|---|---|
| L1 | Apex → `www` redirect is **307** (temporary) | `https://progravelcalculator.online/` → 307 → `https://www.../` | Make it a permanent 308/301 in Vercel so link equity consolidates. |
| L2 | `/index.html` returns 200 and duplicates `/` | Both return the same 79,694-byte HTML | Add a 301 from `/index.html` to `/`, or ensure all internal links use `/` instead of `index.html`. |
| L3 | Internal links use `index.html` | Header/footer/CTA links | Prefer `/` for the homepage to avoid duplicate paths. Update via a shared header/footer when possible. |
| L4 | Missing security headers | Only HSTS is present; no CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`; `Access-Control-Allow-Origin: *` on HTML | Add standard security headers in `vercel.json`. Low SEO impact, but best-practice/trust improvement. |
| L5 | `HowTo` schema is deprecated for Google rich results | Homepage includes a `HowTo` block | It is not harmful, but it no longer earns the rich result. Keep only if another engine benefits; otherwise remove to reduce markup noise. |
| L6 | No `WebSite` schema | — | Optional: add `WebSite` + `SearchAction` if site search is added. |
| L7 | Sitemap `changefreq`/`priority` | Present | Google ignores them; harmless. Update `lastmod` when pages change. |
| L8 | “DriveAway Cost” typo in navigation | Appears in header on multiple pages | Change to “Driveway Cost”. Small but visible trust signal. |
| L9 | No author page / editorial policy | About only | Add an author page and editorial policy as the content library grows. |
| L10 | No cookie consent / CMP | No consent banner or CMP detected | Required for AdSense in EEA/UK/Switzerland; recommended globally before serving personalized ads. |

---

## 7. Structured data audit

| Page | Schema types | Status |
|---|---|---|
| `/` | `SoftwareApplication`, `HowTo`, `FAQPage` ×2, `BreadcrumbList` | **Fix:** duplicate/conflicting FAQ; HowTo deprecated; Breadcrumb only “Home” |
| `/best-gravel-types.html` | `Article`, `BreadcrumbList` | Add `image`, person author, visible dates/sources |
| `/driveway-cost-guide.html` | `Article`, `BreadcrumbList` | Add `image`, person author, visible dates/sources |
| `/about.html` | `Organization`, `BreadcrumbList` | Add `logo` dimensions, `sameAs`, `contactPoint` if available |
| `/contact.html` | `BreadcrumbList` | Add `ContactPage` schema and a working form |
| `/privacy.html`, `/terms.html` | None | Acceptable; legal pages do not need rich-result schema |
| `/thankyou.html` | None | Correct; noindex page |

### 7.1 The duplicate FAQ problem in detail

- **Head block:** 4 questions — “How many cubic yards of gravel do I need?”, “How many tons of gravel do I need?”, “How deep should a gravel driveway be?”, “What is the difference between pea gravel and crushed stone?”
- **Body block:** 5 questions — “How deep should I make my gravel driveway?”, “How much does gravel shrink after compaction?”, “What is the difference between Pea Gravel and Crushed Stone?”, “How do I calculate gravel for an L-shaped or irregular area?”, “How much does a cubic yard of gravel weigh?”
- **Visible FAQ:** 5 questions, matching the body block closely.

The head block’s first two questions are **not visible on the page**. Google’s FAQ structured data guidelines require the question and answer to be visible to users. Remove the head block or replace it with the visible set.

### 7.2 Recommended schema stack after fixes

- Homepage: `SoftwareApplication` + one `FAQPage` (visible questions) + `BreadcrumbList` (Home only, or remove).
- Calculator landing pages: `SoftwareApplication` or `WebApplication` + `FAQPage` + `BreadcrumbList`.
- Guides: `Article` + `BreadcrumbList` + `FAQPage` where a visible FAQ exists.
- About: `Organization` + `AboutPage` + `BreadcrumbList`.
- Contact: `ContactPage` + `BreadcrumbList`.

---

## 8. Content and E-E-A-T audit

### 8.1 Strengths

- The homepage guide is genuinely useful: measuring complex shapes, depth by application, metric vs imperial, spillage, material choice, final checklist.
- The two guides are substantial (≈1,300–1,440 words) and have clear H2 structures.
- The comparison guide has a real comparison table and worked cost examples.
- The driveway cost guide has US and UK case studies, hidden-cost sections and a checklist.
- The tone is practical and readable, not generic AI filler.

### 8.2 Weaknesses

| Issue | Evidence | Impact |
|---|---|---|
| Mixed geography | Pakistan/PKR in the gravel-types table; US/UK examples elsewhere; metric/imperial messaging | Confuses the target audience and weakens relevance for US queries |
| Unsupported cost ranges | “2026 Global Averages”, “2026 Pakistan Market Averages”, no cited sources or methodology | Cost content needs sources and dates to be trustworthy |
| Expert claims without proof | “built with civil engineers”, “industry-standard”, “trusted resource” | E-E-A-T risk; reviewers cannot verify |
| Density inconsistency | About: 2,835 lbs/yd³; calculator: 2,700 lbs/yd³ for crushed stone | Direct contradiction; users may notice |
| No author/reviewer | Article schema author is an Organization; no byline | Weaker expertise signals |
| No visible dates | Schema dates exist; page copy lacks “last updated” | Freshness is unclear |
| Thin About/Contact | 269 words / 84 words; contact form broken | AdSense/trust risk |
| Only one image | A single 1024×1024 diagram; no original photos or charts | Lower engagement and image-search opportunity |
| No glossary or methodology | — | Missed topical-authority and link opportunities |

### 8.3 Content positioning recommendation

Choose **one primary market**: the United States (USD, cubic yards, short tons, #57/#411 terminology). Keep a clearly labeled metric toggle for UK/Canada/Australia users, but do not mix PKR or “Pakistan market averages” into US pages. If international expansion is a goal, create region-specific pages later (e.g., `/uk/gravel-calculator/`) with local units, prices and terminology.

---

## 9. Accessibility and mobile

**Lighthouse mobile accessibility: 75/100.** `[Measured]`

| Issue | Detail | Fix |
|---|---|---|
| Color contrast | Metric toggle 4.34:1; footer copyright 2.56:1 | Darken foreground colors |
| Heading order | Footer `<h4>` without a preceding `<h3>` | Use correct hierarchy or styled paragraphs |
| Form labels | Range slider and material select lack labels; dimension inputs lack `for`/`id` | Add programmatic labels |
| Live results | No `aria-live` | Add `aria-live="polite"` |
| SVG preview | No accessible name/description | Add `<title>`/`desc` or `aria-hidden="true"` if decorative |
| Keyboard | Buttons and `<details>` are keyboard accessible | Keep; test tab order |
| Tap targets | Shape buttons ≥140 px; inputs large | Good |
| Mobile layout | Responsive flex/grid; calculator stacks well | Good |
| CLS | 0 in lab | Good; re-test after image dimension fix |

Mobile UX is generally solid. The main mobile risk is vertical length: the calculator, guide, preview and FAQ create a long page. Consider a sticky “Calculate” anchor or a compact result summary on mobile.

---

## 10. Indexability, crawl and duplication

| Check | Result |
|---|---|
| robots.txt accessible | Yes, 200 |
| Sitemap accessible | Yes, 200, 1,407 bytes |
| Sitemap URLs live | All 7 return 200 |
| Thank-you excluded | Yes |
| No accidental noindex | None found |
| Canonical conflicts | None found |
| Duplicate `/` and `/index.html` | Both 200; canonical points to `/`; add redirect |
| Apex vs www | 307 to www; make permanent |
| 404 status | Correct 404, but default Vercel page |
| Orphan pages | None among indexable pages |
| JavaScript-dependent content | Calculator requires JS; main content and metadata are static | Good for indexation |
| Pagination/facets | None | No issue |
| Hreflang | None | Fine for a single English site; revisit for region pages |

---

## 11. What is already working (do not break)

- Static, server-rendered HTML with content in the initial response.
- Self-referencing canonicals and a clean `www` canonical host.
- robots.txt + sitemap + noindexed thank-you page.
- No broken internal links or 404 assets except the favicon.
- Fast server response (70 ms) and light page weight.
- CLS 0 in lab.
- Clear calculator UX and mobile layout.
- Print/PDF/quote hand-off.
- Original, readable long-form guides.
- No intrusive ads or popups today.

---

## 12. Top 10 fixes, in order

1. **Make the contact form work** (C1). Add an endpoint, validation, success page, error handling and a real fallback email.
2. **Remove the duplicate FAQ schema** and align structured data with visible content (C2).
3. **Rewrite the Pakistan/PKR content into a US-focused USD table** (C3).
4. **Fix the density contradiction and unsubstantiated expert claims** (H3). Add a named author/reviewer and sources.
5. **Add Search Console + analytics** (H4), with event tracking for calculate/print/PDF/share/quote.
6. **Compile Tailwind CSS** and remove the CDN runtime (H5). Re-test Lighthouse.
7. **Shorten the three long titles** and tighten the homepage H1 (H6–H8, M1).
8. **Fix accessibility defects**: labels, contrast, heading order, `aria-live` (M3–M5, M15).
9. **Add favicon, custom 404, correct image dimensions, OG image, and cache headers** (M6–M10, M8).
10. **Add the missing product controls** — waste/compaction, cost, bag size, metric outputs (M17–M18) — before building landing pages.

After those, build the landing-page cluster in `LANDING-PAGE-STRATEGY.md` and publish the content in `CONTENT-STRATEGY.md`.

---

## 13. Method, limitations and sources

### 13.1 What was measured directly

- Every local HTML/CSS/JS file in the project directory.
- Live HTTP status codes, redirects, headers and asset responses for the homepage, sitemap, robots.txt, ads.txt and all indexable pages.
- DNS resolution for `aggregatecalc.com`, `materialpal.com`, `thegravelcalculator.com` and the audited domain.
- Lighthouse mobile lab audit of the live homepage (local Chrome, 2026-11-01).
- Google Autocomplete suggestions (US/en) used in `KEYWORD-RESEARCH.md`.
- Internal link target existence in the local project.

### 13.2 What was not measured

- Google rankings, impressions, clicks or average position.
- Organic traffic, domain authority, backlink counts or keyword volumes.
- Field Core Web Vitals (CrUX). The PageSpeed Insights API returned a quota error on 2026-11-01; Lighthouse lab data is used instead.
- AdSense revenue or approval probability.

No traffic, ranking, volume or backlink numbers are invented in this report.

### 13.3 Key sources

- Live site: https://www.progravelcalculator.online/
- Sitemap: https://www.progravelcalculator.online/sitemap.xml
- Robots: https://www.progravelcalculator.online/robots.txt
- Lighthouse JSON (local run): `C:\Users\Abdullah\AppData\Local\Temp\opencode\lh-home-mobile.json`
- Google FAQ structured data guidelines: https://developers.google.com/search/docs/appearance/structured-data/faqpage
- Google helpful content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Console documentation: https://support.google.com/webmasters/
- Web.dev Core Web Vitals: https://web.dev/articles/vitals
- Tailwind CDN production warning: https://tailwindcss.com/docs/installation/play-cdn

---

*End of WEBSITE-AUDIT.md*
