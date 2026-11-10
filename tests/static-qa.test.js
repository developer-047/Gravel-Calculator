/**
 * Static QA audit for the Pro Gravel Calculator site.
 * Run with: npm test
 *
 * This covers the parts of Task 2-11 that can be checked without a browser:
 * markup structure, canonical/noindex rules, anchors, internal links, local
 * assets, JSON-LD, sitemap accuracy, production exclusions, compiled Tailwind
 * classes used by JavaScript, analytics consent state and calculator defaults.
 *
 * Browser-only checks (real browsers, 320-1440 px widths, PDF rendering,
 * keyboard and screen-reader passes, console errors) are intentionally NOT
 * covered here and stay listed as pending in memory.md.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Engine = require('../calculator-engine.js');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://www.progravelcalculator.online';

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        passed += 1;
        console.log('PASS  ' + name);
    } catch (error) {
        failed += 1;
        console.error('FAIL  ' + name);
        console.error('      ' + error.message);
    }
}

function read(file) {
    return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function exists(file) {
    return fs.existsSync(path.join(ROOT, file));
}

function stripScriptsAndStyles(html) {
    return html
        .replace(/<script\b[\s\S]*?<\/script>/gi, '')
        .replace(/<style\b[\s\S]*?<\/style>/gi, '');
}

function idsIn(html) {
    const ids = [];
    const pattern = /\sid=["']([^"']+)["']/gi;
    let match;
    while ((match = pattern.exec(html)) !== null) {
        ids.push(match[1]);
    }
    return ids;
}

function canonicalIn(html) {
    const tag = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i);
    if (!tag) return null;
    const href = tag[0].match(/href=["']([^"']+)["']/i);
    return href ? href[1] : null;
}

function isNoindex(html) {
    return /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
}

function internalTarget(pageFile, href) {
    if (!href) return null;
    const value = href.trim();
    if (!value || value.startsWith('http') || value.startsWith('//')) return null;
    if (/^(mailto:|tel:|javascript:|data:)/i.test(value)) return null;

    if (value.startsWith('#')) {
        return { file: pageFile, hash: value.slice(1) };
    }

    const [rawPath, rawHash] = value.split('#');
    const cleanPath = rawPath.split('?')[0];
    const lastSegment = cleanPath.split('/').pop();
    const hasExtension = /\.[A-Za-z0-9]+$/.test(lastSegment);

    let file;
    if (cleanPath === '') {
        file = pageFile;
    } else if (cleanPath.startsWith('/')) {
        file = cleanPath === '/' ? 'index.html' : cleanPath.replace(/^\//, '');
    } else {
        file = path.posix.normalize(path.posix.join(path.posix.dirname(pageFile), cleanPath));
    }

    // Only extensionless paths are directory URLs; every other path is a file
    // (site.webmanifest, tailwind.css, favicon.ico, ...).
    if (cleanPath !== '' && cleanPath !== '/' && !hasExtension) {
        file = path.posix.join(file, 'index.html');
    }

    return { file, hash: rawHash || '' };
}

const htmlFiles = fs.readdirSync(ROOT).filter((file) => file.endsWith('.html')).sort();
const subpageFiles = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && exists(entry.name + '/index.html'))
    .map((entry) => entry.name + '/index.html')
    .sort();
const allHtmlFiles = htmlFiles.concat(subpageFiles);
const indexableFiles = allHtmlFiles.filter((file) => !isNoindex(read(file)));

// ---------------------------------------------------------------------------
// Markup structure
// ---------------------------------------------------------------------------

test('every HTML page has a lang, charset, viewport, title, description and one H1', () => {
    allHtmlFiles.forEach((file) => {
        const html = read(file);
        const structural = stripScriptsAndStyles(html);

        assert.ok(/<html\b[^>]*\slang=["'][^"']+["']/i.test(html), file + ': missing lang');
        assert.ok(/<meta\b[^>]*charset=/i.test(html), file + ': missing charset');
        assert.ok(/<meta\b[^>]*name=["']viewport["']/i.test(html), file + ': missing viewport');

        const title = html.match(/<title>([\s\S]*?)<\/title>/i);
        assert.ok(title && title[1].trim(), file + ': missing title');
        assert.ok(title[1].trim().length <= 65, file + ': title is ' + title[1].trim().length + ' chars');

        const description = html.match(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
        assert.ok(description && description[1].trim(), file + ': missing meta description');
        assert.ok(description[1].trim().length >= 80, file + ': description is ' + description[1].trim().length + ' chars');
        assert.ok(description[1].trim().length <= 165, file + ': description is ' + description[1].trim().length + ' chars');

        const h1Count = (structural.match(/<h1\b/gi) || []).length;
        assert.strictEqual(h1Count, 1, file + ': expected exactly one H1, found ' + h1Count);
    });
});

test('canonical tags are self-referencing and noindex pages stay out of the index', () => {
    allHtmlFiles.forEach((file) => {
        const html = read(file);
        const canonical = canonicalIn(html);
        let expected;
        if (file === 'index.html') {
            expected = SITE + '/';
        } else if (file.endsWith('/index.html')) {
            expected = SITE + '/' + file.replace(/index\.html$/, '');
        } else {
            expected = SITE + '/' + file;
        }

        if (isNoindex(html)) {
            // Utility pages are noindex; a canonical is optional, but if one is
            // present it must still point at the page itself.
            if (canonical) {
                assert.strictEqual(canonical, expected, file + ': canonical should be ' + expected);
            }
            return;
        }

        assert.ok(canonical, file + ': missing canonical');
        assert.strictEqual(canonical, expected, file + ': canonical should be ' + expected);
    });
});

test('no duplicate element IDs within a page', () => {
    allHtmlFiles.forEach((file) => {
        const ids = idsIn(stripScriptsAndStyles(read(file)));
        const seen = new Set();
        const duplicates = [];
        ids.forEach((id) => {
            if (seen.has(id)) duplicates.push(id);
            seen.add(id);
        });
        assert.deepStrictEqual(duplicates, [], file + ': duplicate IDs ' + duplicates.join(', '));
    });
});

test('every form control has a label or an accessible name', () => {
    allHtmlFiles.forEach((file) => {
        const html = stripScriptsAndStyles(read(file));
        const controls = html.match(/<(input|select|textarea)\b[^>]*>/gi) || [];

        controls.forEach((tag) => {
            if (/type=["']hidden["']/i.test(tag)) return;
            if (/aria-label(ledby)?=/i.test(tag) || /title=/i.test(tag)) return;

            const idMatch = tag.match(/\sid=["']([^"']+)["']/i);
            if (!idMatch) {
                assert.fail(file + ': unlabelled control ' + tag.slice(0, 90));
            }

            const id = idMatch[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const label = new RegExp('<label\\b[^>]*\\sfor=["\']' + id + '["\']', 'i');
            assert.ok(label.test(html), file + ': no label for #' + idMatch[1]);
        });
    });
});

test('JSON-LD blocks parse as valid JSON', () => {
    allHtmlFiles.forEach((file) => {
        const html = read(file);
        const blocks = html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
        blocks.forEach((block, index) => {
            const json = block.replace(/^[\s\S]*?>/, '').replace(/<\/script>$/i, '');
            try {
                JSON.parse(json);
            } catch (error) {
                assert.fail(file + ': JSON-LD block ' + (index + 1) + ' does not parse: ' + error.message);
            }
        });
    });
});

// ---------------------------------------------------------------------------
// Links and assets
// ---------------------------------------------------------------------------

test('every internal link and anchor resolves', () => {
    allHtmlFiles.forEach((file) => {
        const html = stripScriptsAndStyles(read(file));
        const hrefs = [];
        const pattern = /\shref=["']([^"']+)["']/gi;
        let match;

        while ((match = pattern.exec(html)) !== null) {
            hrefs.push(match[1]);
        }

        hrefs.forEach((href) => {
            const target = internalTarget(file, href);
            if (!target) return;

            assert.ok(exists(target.file), file + ': broken link ' + href + ' -> ' + target.file);

            if (target.hash) {
                const targetHtml = read(target.file);
                const ids = new Set(idsIn(targetHtml));
                assert.ok(ids.has(target.hash), file + ': missing anchor #' + target.hash + ' in ' + target.file);
            }
        });
    });
});

test('local scripts, stylesheets and images exist', () => {
    allHtmlFiles.forEach((file) => {
        const html = stripScriptsAndStyles(read(file));
        const tags = html.match(/<(script|link|img)\b[^>]*>/gi) || [];

        tags.forEach((tag) => {
            let url = null;
            if (/^<script/i.test(tag)) {
                const match = tag.match(/\ssrc=["']([^"']+)["']/i);
                url = match ? match[1] : null;
            } else if (/^<link/i.test(tag)) {
                const match = tag.match(/\shref=["']([^"']+)["']/i);
                url = match ? match[1] : null;
            } else {
                const match = tag.match(/\ssrc=["']([^"']+)["']/i);
                url = match ? match[1] : null;
            }

            if (!url || /^(https?:)?\/\//i.test(url) || /^(data:|mailto:|tel:)/i.test(url)) return;
            const clean = url.split('?')[0].split('#')[0].replace(/^\//, '');
            assert.ok(clean === '' || exists(clean), file + ': missing local asset ' + url);
        });
    });
});

test('Open Graph and Twitter images point at the existing local image', () => {
    allHtmlFiles.forEach((file) => {
        const html = read(file);
        const metaPattern = /<meta\b[^>]*(property|name)=["'](og:image|twitter:image)["'][^>]*content=["']([^"']+)["'][^>]*>/gi;
        const reversePattern = /<meta\b[^>]*content=["']([^"']+)["'][^>]*(property|name)=["'](og:image|twitter:image)["'][^>]*>/gi;

        const values = [];
        let match;

        while ((match = metaPattern.exec(html)) !== null) values.push(match[3]);
        while ((match = reversePattern.exec(html)) !== null) values.push(match[1]);

        values.forEach((value) => {
            if (!value.startsWith(SITE + '/')) return;
            const local = value.slice((SITE + '/').length);
            assert.ok(exists(local), file + ': social image missing ' + local);
        });
    });
});

// ---------------------------------------------------------------------------
// Sitemap, robots and production exclusions
// ---------------------------------------------------------------------------

test('sitemap lists exactly the indexable pages with matching canonicals', () => {
    const sitemap = read('sitemap.xml');
    const urls = [];
    const pattern = /<loc>([^<]+)<\/loc>/gi;
    let match;

    while ((match = pattern.exec(sitemap)) !== null) {
        urls.push(match[1].trim());
    }

    assert.strictEqual(urls.length, indexableFiles.length, 'sitemap should contain ' + indexableFiles.length + ' URLs, found ' + urls.length);

    const mapped = urls.map((url) => {
        if (url === SITE + '/') return 'index.html';
        const file = url.replace(SITE + '/', '');
        return file.endsWith('/') ? file + 'index.html' : file;
    });
    mapped.forEach((file, index) => {
        assert.ok(exists(file), 'sitemap URL has no file: ' + file);
        const html = read(file);
        assert.ok(!isNoindex(html), file + ': noindex page must not be in the sitemap');
        assert.strictEqual(canonicalIn(html), urls[index], file + ': canonical/sitemap mismatch');
    });

    assert.deepStrictEqual(mapped.slice().sort(), indexableFiles.slice().sort(), 'sitemap and indexable pages differ');
});

test('calculator cluster pages are linked from the homepage', () => {
    const home = read('index.html');
    const pages = [
        'french-drain-gravel-calculator',
        'gravel-bag-calculator',
        'pea-gravel-calculator',
        'gravel-calculator-tons',
        'crushed-stone-calculator',
        'driveway-gravel-calculator',
        'gravel-cost-calculator'
    ];

    pages.forEach((page) => {
        assert.ok(home.indexOf('href="/' + page + '/"') >= 0, 'homepage is missing a link to /' + page + '/');
    });
});

test('robots.txt allows crawling, blocks utility/docs URLs and references the sitemap', () => {
    const robots = read('robots.txt');
    assert.ok(/User-agent:\s*\*/i.test(robots), 'robots.txt needs a wildcard user-agent');
    assert.ok(/Sitemap:\s*https:\/\/www\.progravelcalculator\.online\/sitemap\.xml/i.test(robots), 'robots.txt needs the sitemap URL');
    ['/thankyou.html', '/404.html', '/memory.md', '/seo-research/'].forEach((rule) => {
        assert.ok(robots.indexOf('Disallow: ' + rule) >= 0, 'robots.txt should disallow ' + rule);
    });
});

test('.vercelignore keeps internal docs and build files out of production', () => {
    const ignore = read('.vercelignore').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    ['memory.md', 'SEO Prompt.md', 'SEO Prompt - 2.md', 'seo-research/', 'README.md', 'node_modules/', 'src/', 'package.json', 'package-lock.json', 'tailwind.config.js', 'tests/'].forEach((entry) => {
        assert.ok(ignore.indexOf(entry) >= 0, '.vercelignore is missing ' + entry);
    });
});

// ---------------------------------------------------------------------------
// Build and analytics state
// ---------------------------------------------------------------------------

test('Tailwind is compiled locally and includes classes generated by JavaScript', () => {
    htmlFiles.forEach((file) => {
        assert.ok(read(file).indexOf('cdn.tailwindcss.com') === -1, file + ': Tailwind CDN reference found');
    });

    const css = read('tailwind.css');
    const required = [
        // Assumption warnings
        'bg-amber-50', 'border-amber-300', 'text-amber-900', 'text-amber-950',
        'bg-blue-50', 'border-blue-200', 'text-blue-900', 'text-blue-950',
        // Bulk vs bag verdict
        'bg-emerald-50', 'border-emerald-200', 'text-emerald-900', 'bg-emerald-200',
        'bg-slate-50', 'border-slate-200', 'text-slate-800', 'bg-slate-200',
        // Cost inputs and preset states
        'pl-11', 'pr-9', 'border-blue-500', 'bg-white', 'text-slate-600'
    ];

    required.forEach((name) => {
        const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const selector = new RegExp('\\.' + escaped + '(?=[{,:])');
        assert.ok(selector.test(css), 'tailwind.css is missing .' + name + ' (run npm run build:css)');
    });
});

test('analytics is consent-gated and loads only configured Google tags', () => {
    // Strip comments so the documented example IDs are not mistaken for
    // configured values.
    const config = read('analytics-config.js')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|[^:])\/\/.*$/gm, '$1');
    const measurementId = config.match(/measurementId\s*:\s*["']([^"']*)["']/i);
    const containerId = config.match(/containerId\s*:\s*["']([^"']*)["']/i);
    assert.ok(measurementId, 'analytics-config.js must define measurementId');
    assert.ok(containerId, 'analytics-config.js must define containerId');

    const ga = measurementId[1].trim();
    const gtm = containerId[1].trim();
    if (ga) assert.ok(/^G-[A-Z0-9]{6,}$/i.test(ga), 'measurementId must look like G-XXXXXXXXXX');
    if (gtm) assert.ok(/^GTM-[A-Z0-9]{4,}$/i.test(gtm), 'containerId must look like GTM-XXXXXXX');
    assert.ok(ga || gtm, 'at least one analytics ID must be configured');
    assert.ok(!(ga && gtm), 'enable only one analytics mode to avoid duplicate page views');

    const analytics = read('analytics.js');
    assert.ok(analytics.indexOf("readConsent() === 'granted'") >= 0, 'track() must check granted consent');
    assert.ok(analytics.indexOf('hasAnalytics') >= 0, 'analytics must require a configured tag');
    assert.ok(analytics.indexOf("gtag('consent', 'default'") >= 0, 'analytics must set consent defaults');
    assert.ok(analytics.indexOf("analytics_storage: 'denied'") >= 0, 'analytics storage must start denied');

    htmlFiles.forEach((file) => {
        const html = read(file);
        assert.ok(html.indexOf('googletagmanager.com/gtag/js') === -1, file + ': hardcoded GA tag found');
        assert.ok(html.indexOf('googletagmanager.com/gtm.js') === -1, file + ': hardcoded GTM tag found');
        assert.ok(!/gtag\(\s*['"]config['"]/.test(html), file + ': inline gtag config found');
    });
});

test('calculator script order keeps the shared engine ahead of script.js', () => {
    const html = read('index.html');
    const engineAt = html.indexOf('calculator-engine.js');
    const scriptAt = html.indexOf('script.js');
    const configAt = html.indexOf('analytics-config.js');
    const analyticsAt = html.indexOf('analytics.js');

    assert.ok(engineAt >= 0, 'index.html must load calculator-engine.js');
    assert.ok(scriptAt >= 0, 'index.html must load script.js');
    assert.ok(engineAt < scriptAt, 'calculator-engine.js must load before script.js');
    assert.ok(configAt >= 0 && analyticsAt >= 0, 'analytics files must be loaded');
    assert.ok(configAt < analyticsAt, 'analytics-config.js must load before analytics.js');
});

test('calculator UI hooks required by the Phase 2 features exist', () => {
    const html = read('index.html');
    [
        'id="assumption-warnings"',
        'id="waste-slider"',
        'id="compaction-slider"',
        'id="bag-size-buttons"',
        'id="price-amount"',
        'id="bulk-vs-bag-section"',
        'id="invoice-wrapper"',
        'id="print-density"',
        'id="print-project-url"',
        'id="result-volume"',
        'id="btn-pdf"',
        'id="btn-print"'
    ].forEach((needle) => {
        assert.ok(html.indexOf(needle) >= 0, 'index.html is missing ' + needle);
    });

    const warningsTag = html.match(/<div\b[^>]*id=["']assumption-warnings["'][^>]*>/i);
    assert.ok(warningsTag, 'assumption-warnings element missing');
    assert.ok(/role=["']region["']/i.test(warningsTag[0]), 'warning region needs role="region"');
    assert.ok(/aria-label=/i.test(warningsTag[0]), 'warning region needs an aria-label');
});

test('every calculator subpage has calculator-engine.js, subpage-calculator.js, a form, and a results container', () => {
    assert.strictEqual(subpageFiles.length, 7, 'expected 7 calculator subpages');
    subpageFiles.forEach((file) => {
        const html = read(file);
        const engineAt = html.indexOf('/calculator-engine.js');
        const subpageAt = html.indexOf('/subpage-calculator.js');

        assert.ok(engineAt >= 0, file + ': missing /calculator-engine.js');
        assert.ok(subpageAt >= 0, file + ': missing /subpage-calculator.js');
        assert.ok(engineAt < subpageAt, file + ': /calculator-engine.js must load before /subpage-calculator.js');
        assert.ok(/<script\b[^>]*src=["']\/calculator-engine\.js["'][^>]*defer/i.test(html), file + ': /calculator-engine.js should defer');
        assert.ok(/<script\b[^>]*src=["']\/subpage-calculator\.js["'][^>]*defer/i.test(html), file + ': /subpage-calculator.js should defer');

        assert.ok(/<form\b[^>]*id=["'][^"']*calc-form["']/i.test(html), file + ': missing form with id ending in calc-form');
        assert.ok(/\sid=["'][^"']*-results["']/i.test(html), file + ': missing results container with id ending in -results');
    });
});

// ---------------------------------------------------------------------------
// Calculator regression matrix (static equivalents)
// ---------------------------------------------------------------------------

test('default calculator output is unchanged (0.93 yd³, 1.31 short tons, 53 bags)', () => {
    const result = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 10, widthFt: 10 },
        depthInches: 3,
        material: 'pea_gravel',
        wastePercent: 0,
        compactionPercent: 0
    });

    assert.strictEqual(Number(result.volumeCuYd.toFixed(2)), 0.93);
    assert.strictEqual(Number(result.weightShortTons.toFixed(2)), 1.31);
    assert.strictEqual(result.bags, 53);
    assert.strictEqual(result.volumeM3.toFixed(2), '0.71');
    assert.strictEqual(result.bags25kg, 48);
});

test('all three shapes and both unit systems stay within tolerance', () => {
    const rectangle = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 10, widthFt: 10 },
        depthInches: 3,
        material: 'pea_gravel'
    });
    const circle = Engine.calculate({
        shape: 'circle',
        dimensions: { diameterFt: 10 },
        depthInches: 3,
        material: 'pea_gravel'
    });
    const lshape = Engine.calculate({
        shape: 'lshape',
        dimensions: { aLengthFt: 10, aWidthFt: 10, bLengthFt: 10, bWidthFt: 10 },
        depthInches: 3,
        material: 'pea_gravel'
    });

    assert.ok(rectangle.areaSqFt > 0 && circle.areaSqFt > 0 && lshape.areaSqFt > 0, 'every shape needs an area');
    assert.ok(circle.areaSqFt < rectangle.areaSqFt, 'circle with the same span must be smaller than the square');
    assert.strictEqual(lshape.areaSqFt, 200);

    const metric = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 0, widthFt: 0 },
        areaSqFt: 100,
        depthInches: 3.937007874015748,
        material: 'pea_gravel',
        unit: 'metric'
    });

    // 100 sq ft at 10 cm deep = 32.808 ft³ = 0.92903 m³.
    const delta = Math.abs(metric.volumeM3 - 0.92903);
    assert.ok(delta <= 0.0001, 'metric conversion drifted by ' + delta);
});

test('share URL state round-trips with allowances, bag sizes and cost fields', () => {
    const state = {
        unit: 'metric',
        shape: 'lshape',
        material: 'river_rock',
        depthInches: 12,
        dimensions: {
            rect: { lFt: 10, lIn: 6, wFt: 8, wIn: 0 },
            circle: { dFt: 12, dIn: 0 },
            lshape: { aLFt: 20, aLIn: 0, aWFt: 10, aWIn: 0, bLFt: 8, bLIn: 0, bWFt: 6, bWIn: 0 }
        },
        wastePercent: 10,
        compactionPercent: 12,
        bagSizeLb: 60,
        bagSizeKg: 40,
        price: 42.5,
        priceBasis: 'metric_tonne',
        deliveryFee: 75,
        taxRate: 8.25,
        currency: 'CAD'
    };

    const restored = Engine.deserialize('?' + Engine.serialize(state));
    assert.strictEqual(restored.unit, 'metric');
    assert.strictEqual(restored.shape, 'lshape');
    assert.strictEqual(restored.material, 'river_rock');
    assert.strictEqual(restored.depthInches, 12);
    assert.strictEqual(restored.wastePercent, 10);
    assert.strictEqual(restored.compactionPercent, 12);
    assert.strictEqual(restored.bagSizeLb, 60);
    assert.strictEqual(restored.bagSizeKg, 40);
    assert.strictEqual(restored.price, 42.5);
    assert.strictEqual(restored.priceBasis, 'metric_tonne');
    assert.strictEqual(restored.deliveryFee, 75);
    assert.strictEqual(restored.taxRate, 8.25);
    assert.strictEqual(restored.currency, 'CAD');
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log('\n' + passed + ' passed, ' + failed + ' failed');

if (failed > 0) {
    process.exitCode = 1;
}
