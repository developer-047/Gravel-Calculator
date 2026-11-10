#!/usr/bin/env python3
"""Static SEO and internal-link audit for the Pro Gravel Calculator site.

Run from the repository root:
    python tests/site-audit.py

The script checks local files, not the deployed host. It verifies:
  * exactly one H1, canonical and meta description per page;
  * canonical URLs match the page path and trailing-slash style;
  * internal links resolve to a local file without redirects;
  * sitemap URLs match page canonicals;
  * the /index.html redirect and trailingSlash setting are present.
"""

from __future__ import annotations

import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://www.progravelcalculator.online"
SKIP_DIRS = {".git", ".freebuff", "agent", "node_modules", "seo-research", "src", "tests"}
CALCULATORS = [
    "french-drain-gravel-calculator",
    "gravel-bag-calculator",
    "pea-gravel-calculator",
    "gravel-calculator-tons",
    "crushed-stone-calculator",
    "driveway-gravel-calculator",
    "gravel-cost-calculator",
]

errors: list[str] = []
warnings: list[str] = []


def html_pages() -> list[Path]:
    pages = []
    for path in ROOT.rglob("*.html"):
        if any(part in SKIP_DIRS for part in path.relative_to(ROOT).parts):
            continue
        pages.append(path)
    return sorted(pages)


def page_url(page: Path) -> str:
    rel = page.relative_to(ROOT).as_posix()
    if rel == "index.html":
        return "/"
    if page.name == "index.html":
        return "/" + page.parent.relative_to(ROOT).as_posix() + "/"
    return "/" + rel


def local_target(raw_path: str) -> tuple[Path | None, bool]:
    """Return (file, needs_redirect) for an internal URL path."""
    path = unquote(raw_path or "/")
    if path == "/":
        return ROOT / "index.html", False

    candidate = ROOT / path.lstrip("/")
    if path.endswith("/"):
        return candidate / "index.html", False
    if candidate.is_file():
        return candidate, False
    if candidate.is_dir():
        return candidate / "index.html", True
    return candidate, False


pages = html_pages()
canonical_by_file: dict[Path, str] = {}

print(f"Auditing {len(pages)} HTML pages in {ROOT}\n")

for page in pages:
    rel = page.relative_to(ROOT).as_posix()
    soup = BeautifulSoup(page.read_text(encoding="utf-8"), "html.parser")

    h1s = soup.find_all("h1")
    if len(h1s) != 1:
        errors.append(f"{rel}: expected exactly 1 H1, found {len(h1s)}")

    robots = soup.find("meta", attrs={"name": "robots"})
    is_noindex = bool(robots and "noindex" in (robots.get("content") or "").lower())

    canonical_tags = soup.find_all("link", rel=lambda value: value and "canonical" in value)
    if len(canonical_tags) != 1:
        errors.append(f"{rel}: expected exactly 1 canonical, found {len(canonical_tags)}")
    else:
        canonical = (canonical_tags[0].get("href") or "").strip()
        canonical_by_file[page.resolve()] = canonical
        expected = BASE + page_url(page)
        if canonical != expected:
            errors.append(f"{rel}: canonical is {canonical!r}, expected {expected!r}")

    # Social metadata must be absolute so it resolves off-site.
    og_url = soup.find("meta", attrs={"property": "og:url"})
    og_image = soup.find("meta", attrs={"property": "og:image"})
    twitter_image = soup.find("meta", attrs={"name": "twitter:image"})
    for label, tag in (("og:url", og_url), ("og:image", og_image), ("twitter:image", twitter_image)):
        value = (tag.get("content") or "").strip() if tag else ""
        if not value.startswith(BASE + "/"):
            errors.append(f"{rel}: {label} must be an absolute {BASE}/ URL, found {value!r}")
    if og_url and og_image and canonical and (og_url.get("content") or "").strip() != canonical:
        errors.append(f"{rel}: og:url does not match the canonical")

    descriptions = soup.find_all("meta", attrs={"name": "description"})
    if len(descriptions) != 1:
        errors.append(f"{rel}: expected exactly 1 meta description, found {len(descriptions)}")
    elif not (descriptions[0].get("content") or "").strip():
        errors.append(f"{rel}: meta description is empty")

    for anchor in soup.find_all("a", href=True):
        href = anchor["href"].strip()
        if not href or href.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
            continue

        absolute = urljoin(BASE + page_url(page), href)
        parsed = urlparse(absolute)
        if parsed.scheme not in ("http", "https"):
            continue
        if parsed.netloc.lower() not in ("www.progravelcalculator.online", "progravelcalculator.online"):
            continue
        if parsed.scheme == "http" or parsed.netloc.lower() != "www.progravelcalculator.online":
            errors.append(f"{rel}: internal link should use the canonical https://www host: {href}")
        if parsed.path.endswith("index.html"):
            errors.append(f"{rel}: internal link uses index.html instead of /: {href}")

        target, needs_redirect = local_target(parsed.path)
        if target is None or not target.exists():
            errors.append(f"{rel}: internal link target is missing: {href}")
        elif needs_redirect:
            errors.append(f"{rel}: internal link relies on a trailing-slash redirect: {href}")

    # Embedded frames, images and scripts are navigations too: a missing local
    # file here is a 404 even though it is not an <a> tag.
    for tag in soup.find_all(["iframe", "img", "script"]):
        raw = (tag.get("src") or "").strip()
        if not raw or raw.startswith(("data:", "//")):
            continue
        parsed = urlparse(urljoin(BASE + page_url(page), raw))
        if parsed.scheme not in ("http", "https"):
            continue
        if parsed.netloc.lower() not in ("www.progravelcalculator.online", "progravelcalculator.online"):
            continue
        target, needs_redirect = local_target(parsed.path)
        if target is None or not target.exists():
            errors.append(f"{rel}: {tag.name} target is missing: {raw}")
        elif needs_redirect:
            errors.append(f"{rel}: {tag.name} target relies on a redirect: {raw}")


# Canonical URLs must be unique.
seen: dict[str, str] = {}
for file, canonical in canonical_by_file.items():
    if canonical in seen:
        errors.append(f"duplicate canonical {canonical!r} in {seen[canonical]} and {file}")
    seen[canonical] = str(file)

# Sitemap URLs must match page canonicals.
sitemap_path = ROOT / "sitemap.xml"
sitemap_urls: list[str] = []
if not sitemap_path.exists():
    errors.append("sitemap.xml is missing")
else:
    tree = ET.parse(sitemap_path)
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    for loc in tree.getroot().findall(".//sm:url/sm:loc", namespace):
        loc_text = (loc.text or "").strip()
        sitemap_urls.append(loc_text)
        parsed = urlparse(loc_text)
        target, needs_redirect = local_target(parsed.path)
        if target is None or not target.exists():
            errors.append(f"sitemap: URL has no local page: {loc_text}")
            continue
        canonical = canonical_by_file.get(target.resolve())
        if canonical != loc_text:
            errors.append(f"sitemap: {loc_text} does not match page canonical {canonical!r}")
        if needs_redirect:
            errors.append(f"sitemap: URL requires a redirect: {loc_text}")

for page, canonical in canonical_by_file.items():
    if canonical not in sitemap_urls and page.name != "embed.html":
        soup = BeautifulSoup(page.read_text(encoding="utf-8"), "html.parser")
        robots = soup.find("meta", attrs={"name": "robots"})
        if not robots or "noindex" not in (robots.get("content") or "").lower():
            warnings.append(f"{page.relative_to(ROOT).as_posix()}: canonical is not in sitemap.xml")

# Deployment redirects and trailing-slash configuration.
vercel_path = ROOT / "vercel.json"
if not vercel_path.exists():
    errors.append("vercel.json is missing")
else:
    vercel = json.loads(vercel_path.read_text(encoding="utf-8"))
    if vercel.get("trailingSlash") is not True:
        errors.append("vercel.json: trailingSlash should be true")
    redirects = vercel.get("redirects", [])
    if not any(r.get("source") == "/index.html" and r.get("destination") == "/" for r in redirects):
        errors.append("vercel.json: /index.html -> / redirect is missing")

for filename in ("_redirects", ".htaccess"):
    path = ROOT / filename
    if not path.exists():
        warnings.append(f"{filename}: file not found")
    else:
        content = path.read_text(encoding="utf-8")
        if "/index.html" not in content and r"index\.html" not in content:
            errors.append(f"{filename}: /index.html redirect is missing")

# The seven calculator canonicals must use trailing slashes.
for calculator in CALCULATORS:
    page = (ROOT / calculator / "index.html").resolve()
    canonical = canonical_by_file.get(page)
    if canonical is None:
        errors.append(f"{calculator}: calculator page is missing or has no canonical")
    elif not canonical.endswith("/"):
        errors.append(f"{calculator}: canonical should end with a slash: {canonical}")
    elif canonical not in sitemap_urls:
        errors.append(f"{calculator}: canonical is missing from sitemap.xml")

# Contact delivery configuration.
contact_config = (ROOT / "contact-config.js").read_text(encoding="utf-8")
if "https://api.web3forms.com/submit" not in contact_config:
    errors.append("contact-config.js: Web3Forms endpoint is not configured")
if 'accessKey: ""' not in contact_config:
    warnings.append("contact-config.js: accessKey is no longer empty (verify delivery is intentional)")

# Visible copy on calculator pages, excluding the calculator widget.
print("Calculator page copy (outside the widget):")
for calculator in CALCULATORS:
    page = ROOT / calculator / "index.html"
    soup = BeautifulSoup(page.read_text(encoding="utf-8"), "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "form"]):
        tag.decompose()
    for tag in soup.find_all(id=re.compile(r"(-results$|-calc-status$|-results-note$|cost-card)")):
        tag.decompose()
    main = soup.find("main") or soup
    text = main.get_text(" ", strip=True)
    words = len(re.findall(r"[A-Za-z0-9][A-Za-z0-9'’-]*", text))
    h2_count = len(soup.find_all("h2"))
    faq_count = len(soup.find_all("dt"))
    verdict = "OK" if words >= 400 else "THIN (under 400)"
    print(f"  {calculator}: {words} words, {h2_count} H2, {faq_count} FAQ - {verdict}")
    if words < 400:
        warnings.append(f"{calculator}: only {words} visible words outside the calculator (target 400+)")

print("PASS" if not errors else "FAIL")
if errors:
    print(f"\n{len(errors)} error(s):")
    for item in errors:
        print(f"  - {item}")
else:
    print("\nNo errors found.")

if warnings:
    print(f"\n{len(warnings)} warning(s):")
    for item in warnings:
        print(f"  - {item}")

sys.exit(1 if errors else 0)
