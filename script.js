// ========================================
// CALCULATION ENGINE
// ========================================
// calculator-engine.js is the single source of truth for densities and math.
// The inline fallback keeps the page working if that file ever fails to load.
const ENGINE = typeof window !== 'undefined' ? window.GravelEngine : null;

const FALLBACK_DENSITIES = {
    pea_gravel: 105,      // lbs per cubic foot
    crushed_stone: 100,   // lbs per cubic foot
    sand: 110,            // lbs per cubic foot
    river_rock: 108       // lbs per cubic foot
};

const DENSITIES = ENGINE
    ? Object.keys(ENGINE.MATERIALS).reduce(function (map, key) {
        map[key] = ENGINE.MATERIALS[key].densityLbPerCuFt;
        return map;
    }, {})
    : FALLBACK_DENSITIES;

// Exact conversion constants shared with calculator-engine.js.
const M3_PER_CU_YD = 0.764554857984;
const KG_PER_LB = 0.45359237;
const SQ_FT_PER_SQ_M = 10.76391041671;
const MAX_TAX_RATE = 100;

const COST_BASES = {
    short_ton: {
        resultKey: 'weightShortTons',
        quantityLabel: 'short tons',
        priceUnitLabel: 'short ton',
        decimals: 2
    },
    cubic_yard: {
        resultKey: 'volumeCuYd',
        quantityLabel: 'cubic yards (yd³)',
        priceUnitLabel: 'cubic yard',
        decimals: 2
    },
    bag_50lb: {
        resultKey: 'bags',
        quantityLabel: '× 50 lb bags',
        priceUnitLabel: 'bag',
        decimals: 0
    },
    metric_tonne: {
        resultKey: 'weightMetricTonnes',
        quantityLabel: 'metric tonnes',
        priceUnitLabel: 'metric tonne',
        decimals: 2
    },
    cubic_metre: {
        resultKey: 'volumeM3',
        quantityLabel: 'cubic metres (m³)',
        priceUnitLabel: 'cubic metre',
        decimals: 2
    },
    bag_25kg: {
        resultKey: 'bags25kg',
        quantityLabel: '× 25 kg bags',
        priceUnitLabel: 'bag',
        decimals: 0
    }
};

const CURRENCY_SYMBOLS = {
    USD: '$',
    CAD: 'CA$',
    GBP: '£',
    EUR: '€',
    AUD: 'A$'
};

// ========================================
// STATE MANAGEMENT
// ========================================
let currentShape = 'rectangle';
let currentMaterial = 'pea_gravel';
let currentDepthInches = 3; // Slider value in inches
let currentWastePercent = 0; // Waste allowance, 0-25%
let currentCompactionPercent = 0; // Compaction allowance, 0-20%
let currentUnit = 'imperial'; // 'imperial' or 'metric'
let currentBagSizeLb = 50; // 40, 50, 60 lb
let currentBagSizeKg = 25; // 20, 25, 40 kg
const BAGS_PER_PALLET = 40;
let hasTrackedCompletion = false;
let lastAnnouncement = '';
let lastResults = null;
let lastWarningsSignature = '';
let lastTrackedWastePercent = null;
let lastTrackedCompactionPercent = null;

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Sends an analytics event only when consent-aware analytics is available.
 * Never include raw dimensions or contact details in the payload.
 */
function trackEvent(name, params) {
    if (window.PGC && typeof window.PGC.track === 'function') {
        window.PGC.track(name, params || {});
    }
}

/**
 * Converts input values to feet for uniform calculation.
 * Handles both imperial (ft/in) and metric (m/cm). Delegates to the shared
 * engine when available so the page and the engine use identical constants.
 */
function toFeet(largeUnitVal, smallUnitVal) {
    if (ENGINE && typeof ENGINE.toFeet === 'function') {
        return ENGINE.toFeet(largeUnitVal, smallUnitVal, currentUnit);
    }

    let large = parseFloat(largeUnitVal) || 0;
    let small = parseFloat(smallUnitVal) || 0;
    large = Math.max(0, large);
    small = Math.max(0, small);

    if (currentUnit === 'imperial') {
        // Feet & Inches
        return large + (small / 12);
    } else {
        // Meters & Centimeters
        const totalMeters = large + (small / 100);
        return totalMeters * 3.280839895013123;
    }
}

/**
 * Calculates volume in cubic yards
 * Formula: Volume = (Area × Depth) / 27
 */
function calculateVolume(areaSqFt, depthFt) {
    const volumeCubicFeet = areaSqFt * depthFt;
    const volumeCubicYards = volumeCubicFeet / 27;
    return volumeCubicYards;
}

/**
 * Calculates weight in tons
 */
function calculateWeight(cubicYards, densityLbsPerCubicFt) {
    const cubicFeet = cubicYards * 27;
    const totalLbs = cubicFeet * densityLbsPerCubicFt;
    const tons = totalLbs / 2000;
    return tons;
}

/**
 * Rounds up a bag count without turning floating-point noise into an extra bag.
 */
function ceilQuantity(value) {
    const number = Math.max(0, Number(value) || 0);
    if (number === 0) return 0;
    const nearest = Math.round(number);
    const tolerance = Math.max(1e-9, Math.abs(number) * 1e-12);
    return Math.abs(number - nearest) <= tolerance ? nearest : Math.ceil(number);
}

/**
 * Formats a decimal with fixed precision and thousands separators.
 */
function formatDecimal(value, decimals) {
    const places = typeof decimals === 'number' ? decimals : 2;
    return Number(value || 0).toLocaleString('en-US', {
        minimumFractionDigits: places,
        maximumFractionDigits: places
    });
}

/**
 * Formats a whole number with thousands separators.
 */
function formatInteger(value) {
    return Math.round(Number(value) || 0).toLocaleString('en-US');
}

/**
 * Formats a money amount in the selected currency.
 */
function formatCurrency(value, currency) {
    const amount = Number(value) || 0;
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    } catch (error) {
        return '$' + formatDecimal(amount, 2);
    }
}

/**
 * Formats a tax rate without trailing zeros (7%, 7.5%, 7.25%).
 */
function formatRate(value) {
    const rate = Math.round((Number(value) || 0) * 100) / 100;
    return rate.toLocaleString('en-US', { maximumFractionDigits: 2 }) + '%';
}

/**
 * Reads an optional non-negative number from a cost field.
 * A blank value returns null so the caller can distinguish it from zero.
 */
function readCostValue(id) {
    const input = document.getElementById(id);
    if (!input) return null;
    const raw = input.value.trim();
    if (raw === '') return null;
    const value = parseFloat(raw);
    return isFinite(value) && value >= 0 ? value : null;
}

/**
 * Keeps the currency symbol prefixes in sync with the selected currency.
 */
function updateCostCurrencySymbols() {
    const select = document.getElementById('cost-currency');
    const symbol = select ? (CURRENCY_SYMBOLS[select.value] || '$') : '$';
    document.querySelectorAll('.cost-currency-symbol').forEach(function (element) {
        element.textContent = symbol;
    });
}

/**
 * Updates an element's text only when it exists.
 */
function setTextContent(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

// ========================================
// SHAPE CALCULATION FUNCTIONS
// ========================================

function calculateRectangleArea() {
    const lengthFt = document.getElementById('rect-length-ft').value;
    const lengthIn = document.getElementById('rect-length-in').value;
    const widthFt = document.getElementById('rect-width-ft').value;
    const widthIn = document.getElementById('rect-width-in').value;

    const length = toFeet(lengthFt, lengthIn);
    const width = toFeet(widthFt, widthIn);

    return { area: length * width, length, width };
}

function calculateCircleArea() {
    const diameterFt = document.getElementById('circle-diameter-ft').value;
    const diameterIn = document.getElementById('circle-diameter-in').value;

    const diameter = toFeet(diameterFt, diameterIn);
    const radius = diameter / 2;

    return { area: Math.PI * radius * radius, diameter, radius };
}

function calculateLShapeArea() {
    // Section A
    const aLengthFt = document.getElementById('lshape-a-length-ft').value;
    const aLengthIn = document.getElementById('lshape-a-length-in').value;
    const aWidthFt = document.getElementById('lshape-a-width-ft').value;
    const aWidthIn = document.getElementById('lshape-a-width-in').value;

    const aLength = toFeet(aLengthFt, aLengthIn);
    const aWidth = toFeet(aWidthFt, aWidthIn);
    const areaA = aLength * aWidth;

    // Section B
    const bLengthFt = document.getElementById('lshape-b-length-ft').value;
    const bLengthIn = document.getElementById('lshape-b-length-in').value;
    const bWidthFt = document.getElementById('lshape-b-width-ft').value;
    const bWidthIn = document.getElementById('lshape-b-width-in').value;

    const bLength = toFeet(bLengthFt, bLengthIn);
    const bWidth = toFeet(bWidthFt, bWidthIn);
    const areaB = bLength * bWidth;

    return {
        area: areaA + areaB,
        aLength, aWidth,
        bLength, bWidth
    };
}

// ========================================
// SVG VISUALIZER FUNCTIONS
// ========================================

function updateSVGVisualizer() {
    let data;

    switch (currentShape) {
        case 'rectangle':
            data = calculateRectangleArea();
            updateRectangleSVG(data.length, data.width);
            break;
        case 'circle':
            data = calculateCircleArea();
            updateCircleSVG(data.radius);
            break;
        case 'lshape':
            data = calculateLShapeArea();
            updateLShapeSVG(data.aLength, data.aWidth, data.bLength, data.bWidth);
            break;
    }
}

function updateRectangleSVG(length, width) {
    const rect = document.querySelector('#svg-rectangle rect');

    // Scale to fit viewBox (240x240), leaving margins
    const maxDim = Math.max(length, width) || 1;
    const scale = 160 / maxDim;

    const scaledWidth = Math.max(width * scale, 20);
    const scaledHeight = Math.max(length * scale, 20);

    const x = 120 - scaledWidth / 2;
    const y = 120 - scaledHeight / 2;

    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', scaledWidth);
    rect.setAttribute('height', scaledHeight);
}

function updateCircleSVG(radius) {
    const circle = document.querySelector('#svg-circle circle');

    // Scale to fit viewBox
    const scaledRadius = Math.max(Math.min(radius * 8, 80), 20);

    circle.setAttribute('r', scaledRadius);
}

function updateLShapeSVG(aLength, aWidth, bLength, bWidth) {
    const path = document.querySelector('#svg-lshape path');

    // Simple L-shape: vertical rect + horizontal rect
    const scale = 3;

    const aH = Math.max(aLength * scale, 20);
    const aW = Math.max(aWidth * scale, 20);
    const bH = Math.max(bLength * scale, 20);
    const bW = Math.max(bWidth * scale, 20);

    // Create L-shape path
    const d = `M 40 40 L ${40 + aW} 40 L ${40 + aW} ${40 + aH} L ${40 + aW + bW} ${40 + aH} L ${40 + aW + bW} ${40 + aH + bH} L 40 ${40 + aH + bH} Z`;

    path.setAttribute('d', d);
}

// ========================================
// MAIN CALCULATION FUNCTION
// ========================================

function performCalculation() {
    let areaData;
    let area = 0;

    // Get area based on current shape
    switch (currentShape) {
        case 'rectangle':
            areaData = calculateRectangleArea();
            area = areaData.area;
            break;
        case 'circle':
            areaData = calculateCircleArea();
            area = areaData.area;
            break;
        case 'lshape':
            areaData = calculateLShapeArea();
            area = areaData.area;
            break;
    }

    // Convert depth from inches to feet
    const depth = currentDepthInches / 12;

    // Get current material density (fallback path only)
    const density = DENSITIES[currentMaterial];

    // Prefer the shared engine so every page uses identical maths.
    const engineResult = ENGINE && typeof ENGINE.calculate === 'function'
        ? ENGINE.calculate({
            shape: currentShape,
            areaSqFt: area,
            depthInches: currentDepthInches,
            material: currentMaterial,
            unit: currentUnit,
            wastePercent: currentWastePercent,
            compactionPercent: currentCompactionPercent,
            bagSizeLb: currentBagSizeLb,
            bagSizeKg: currentBagSizeKg,
            bagsPerPallet: BAGS_PER_PALLET
        })
        : null;

    let results;

    if (engineResult) {
        results = engineResult;
    } else {
        // Legacy fallback: preserve the pre-engine output and add metric values
        // using the same exact conversion constants as calculator-engine.js.
        const baseVolume = calculateVolume(area, depth);
        const baseWeight = calculateWeight(baseVolume, density);
        const multiplier = (1 + (currentWastePercent / 100)) * (1 + (currentCompactionPercent / 100));
        const volume = baseVolume * multiplier;
        const weight = baseWeight * multiplier;
        const weightKg = weight * 2000 * KG_PER_LB;
        const baseWeightKg = baseWeight * 2000 * KG_PER_LB;

        const bags = ceilQuantity((weight * 2000) / currentBagSizeLb);
        const bags25kg = ceilQuantity(weightKg / currentBagSizeKg);
        const pallets = bags > 0 ? Math.ceil(bags / BAGS_PER_PALLET) : 0;
        const fullPallets = bags > 0 ? Math.floor(bags / BAGS_PER_PALLET) : 0;
        const looseBags = bags > 0 ? (bags % BAGS_PER_PALLET) : 0;

        const palletsMetric = bags25kg > 0 ? Math.ceil(bags25kg / BAGS_PER_PALLET) : 0;
        const fullPalletsMetric = bags25kg > 0 ? Math.floor(bags25kg / BAGS_PER_PALLET) : 0;
        const looseBagsMetric = bags25kg > 0 ? (bags25kg % BAGS_PER_PALLET) : 0;

        const weightPerCuYd = 27 * density;
        const bagsPerCuYd = Math.round((weightPerCuYd / currentBagSizeLb) * 10) / 10;
        const bagsPerShortTon = Math.round((2000 / currentBagSizeLb) * 10) / 10;
        const densityKgPerCuM = (weightPerCuYd * KG_PER_LB) / M3_PER_CU_YD;
        const bagsPerCuM = Math.round((densityKgPerCuM / currentBagSizeKg) * 10) / 10;
        const bagsPerMetricTonne = Math.round((1000 / currentBagSizeKg) * 10) / 10;

        results = {
            volumeCuYd: volume,
            volumeM3: volume * M3_PER_CU_YD,
            weightShortTons: weight,
            weightKg: weightKg,
            weightMetricTonnes: weightKg / 1000,
            bags: bags,
            bags25kg: bags25kg,
            pallets: pallets,
            fullPallets: fullPallets,
            looseBags: looseBags,
            palletsMetric: palletsMetric,
            fullPalletsMetric: fullPalletsMetric,
            looseBagsMetric: looseBagsMetric,
            bagSizeLb: currentBagSizeLb,
            bagSizeKg: currentBagSizeKg,
            bagsPerPallet: BAGS_PER_PALLET,
            bagsPerCuYd: bagsPerCuYd,
            bagsPerShortTon: bagsPerShortTon,
            bagsPerCuM: bagsPerCuM,
            bagsPerMetricTonne: bagsPerMetricTonne,
            areaSqFt: area,
            areaSqM: area / SQ_FT_PER_SQ_M,
            baseVolumeCuYd: baseVolume,
            baseVolumeM3: baseVolume * M3_PER_CU_YD,
            baseWeightShortTons: baseWeight,
            baseWeightKg: baseWeightKg,
            baseWeightMetricTonnes: baseWeightKg / 1000
        };
    }

    lastResults = results;

    // Display results
    displayResults(results);

    // Update SVG visualizer
    updateSVGVisualizer();
}

/**
 * Picks "a" or "an" for an allowance percentage (8%, 11%, 18%).
 */
function allowanceArticle(percent) {
    return /^(8|11|18)(\D|$)/.test(String(percent)) ? 'an' : 'a';
}

/**
 * Builds a readable description of the active allowances.
 */
function describeAllowances(wastePercent, compactionPercent) {
    const parts = [];
    if (wastePercent > 0) parts.push(allowanceArticle(wastePercent) + ' ' + wastePercent + '% waste allowance');
    if (compactionPercent > 0) parts.push(allowanceArticle(compactionPercent) + ' ' + compactionPercent + '% compaction allowance');
    if (parts.length === 0) return 'no allowances';
    if (parts.length === 1) return parts[0];
    return parts[0] + ' and ' + parts[1];
}

/**
 * Builds the unit-aware display strings used by the results card and the
 * print/PDF order sheet. Primary values follow the selected unit system; the
 * alternate values keep the other system visible at all times.
 */
function buildResultDisplay(results) {
    const metric = currentUnit === 'metric';
    const volumePrimary = metric ? results.volumeM3 : results.volumeCuYd;
    const weightPrimary = metric ? results.weightMetricTonnes : results.weightShortTons;
    const bagsPrimary = metric ? results.bags25kg : results.bags;
    const sizeLb = results.bagSizeLb || currentBagSizeLb;
    const sizeKg = results.bagSizeKg || currentBagSizeKg;

    const pallets = metric ? (results.palletsMetric || 0) : (results.pallets || 0);
    const fullPallets = metric ? (results.fullPalletsMetric || 0) : (results.fullPallets || 0);
    const looseBags = metric ? (results.looseBagsMetric || 0) : (results.looseBags || 0);

    let palletsBreakdown = '0 bags';
    if (pallets > 0) {
        if (looseBags === 0) {
            palletsBreakdown = formatInteger(fullPallets) + (fullPallets === 1 ? ' full pallet' : ' full pallets');
        } else if (fullPallets === 0) {
            palletsBreakdown = formatInteger(looseBags) + (looseBags === 1 ? ' loose bag' : ' loose bags');
        } else {
            palletsBreakdown = formatInteger(fullPallets) + ' full + ' + formatInteger(looseBags) + ' loose';
        }
    }

    const bagsPerVol = metric ? formatDecimal(results.bagsPerCuM || 0, 1) : formatDecimal(results.bagsPerCuYd || 0, 1);
    const bagsPerVolLabel = metric ? 'Bags per cubic metre (m³)' : 'Bags per cubic yard (yd³)';
    const bagsPerWeight = metric ? formatDecimal(results.bagsPerMetricTonne || 0, 1) : formatDecimal(results.bagsPerShortTon || 0, 1);
    const bagsPerWeightLabel = metric ? 'Bags per metric tonne' : 'Bags per short ton';

    return {
        volume: formatDecimal(volumePrimary, 2),
        volumeUnitLong: metric ? 'cubic metres (m³)' : 'cubic yards (yd³)',
        volumeAltText: metric
            ? formatDecimal(results.volumeCuYd, 2) + ' cubic yards (yd³)'
            : formatDecimal(results.volumeM3, 2) + ' cubic metres (m³)',
        weight: formatDecimal(weightPrimary, 2),
        weightUnitLong: metric ? 'metric tonnes (1,000 kg)' : 'short tons (2,000 lb)',
        weightAltText: metric
            ? formatInteger(results.weightKg) + ' kg · ' + formatDecimal(results.weightShortTons, 2) + ' short tons'
            : formatDecimal(results.weightMetricTonnes, 2) + ' metric tonnes · ' + formatInteger(results.weightKg) + ' kg',
        bags: formatInteger(bagsPrimary),
        bagsUnitLong: metric ? sizeKg + ' kg bags' : sizeLb + ' lb bags',
        bagsUnitShort: metric ? '× ' + sizeKg + ' kg' : '× ' + sizeLb + ' lb',
        bagsAltText: metric
            ? formatInteger(results.bags) + ' × ' + sizeLb + ' lb bags'
            : formatInteger(results.bags25kg) + ' × ' + sizeKg + ' kg bags',
        pallets: formatInteger(pallets),
        palletsBreakdown: palletsBreakdown,
        bagsPerVol: bagsPerVol,
        bagsPerVolLabel: bagsPerVolLabel,
        bagsPerWeight: bagsPerWeight,
        bagsPerWeightLabel: bagsPerWeightLabel,
        baseVolume: formatDecimal(metric ? results.baseVolumeM3 : results.baseVolumeCuYd, 2),
        baseVolumeUnit: metric ? 'm³' : 'yd³',
        baseWeight: formatDecimal(metric ? results.baseWeightMetricTonnes : results.baseWeightShortTons, 2),
        baseWeightUnit: metric ? 'metric tonnes' : 'short tons'
    };
}

/**
 * Builds the optional cost estimate from the current results and cost fields.
 * Returns null when no positive material price has been entered, which hides
 * the whole cost section. No default price is ever supplied.
 */
function getCostEstimate(results) {
    const priceInput = document.getElementById('price-amount');
    const basisSelect = document.getElementById('price-basis');
    const currencySelect = document.getElementById('cost-currency');
    if (!priceInput || !basisSelect || !currencySelect || !results) return null;

    const priceValue = readCostValue('price-amount');
    if (priceValue === null) return null;

    const price = Math.round(priceValue * 100) / 100;
    if (price <= 0) return null;

    const basis = COST_BASES[basisSelect.value] || COST_BASES.short_ton;
    const currency = CURRENCY_SYMBOLS[currencySelect.value] ? currencySelect.value : 'USD';
    const deliveryFee = Math.round((readCostValue('delivery-fee') || 0) * 100) / 100;
    const taxRateValue = readCostValue('tax-rate');
    const clampedTaxRate = Math.min(MAX_TAX_RATE, Math.max(0, taxRateValue === null ? 0 : taxRateValue));
    const taxRate = Math.round(clampedTaxRate * 100) / 100;

    // Costs follow the adjusted quantities, so allowances are included. Use the
    // same two-decimal quantity shown in the results so the arithmetic is easy
    // to check (bag counts are whole numbers already).
    const rawQuantity = Math.max(0, Number(results[basis.resultKey]) || 0);
    const quantity = basis.decimals === 0
        ? Math.round(rawQuantity)
        : Math.round(rawQuantity * 100) / 100;
    const materialCost = Math.round(price * quantity * 100) / 100;
    const tax = Math.round((materialCost + deliveryFee) * (taxRate / 100) * 100) / 100;
    const total = Math.round((materialCost + deliveryFee + tax) * 100) / 100;
    const areaSqFt = Math.max(0, Number(results.areaSqFt) || 0);
    const areaSqM = Math.max(0, Number(results.areaSqM) || (areaSqFt / SQ_FT_PER_SQ_M));

    return {
        price: price,
        basis: basis,
        currency: currency,
        deliveryFee: deliveryFee,
        taxRate: taxRate,
        quantity: quantity,
        materialCost: materialCost,
        tax: tax,
        total: total,
        costPerSqFt: areaSqFt > 0 ? total / areaSqFt : null,
        costPerSqM: areaSqM > 0 ? total / areaSqM : null
    };
}

let lastTrackedCostKey = '';

/**
 * Tracks cost calculation events when a price and calculation are established.
 * Avoids recording sensitive financial amounts or personal data.
 */
function trackCostEstimate(estimate) {
    if (!estimate || estimate.price <= 0) return;
    const basisKey = estimate.basis ? (estimate.basis.resultKey || 'short_ton') : 'short_ton';
    const costKey = estimate.currency + ':' + basisKey + ':' + (estimate.deliveryFee > 0) + ':' + (estimate.taxRate > 0);
    if (costKey === lastTrackedCostKey) return;
    lastTrackedCostKey = costKey;
    trackEvent('cost_calculate', {
        basis: estimate.basis ? estimate.basis.priceUnitLabel : 'unit',
        currency: estimate.currency,
        has_delivery: estimate.deliveryFee > 0,
        has_tax: estimate.taxRate > 0
    });
}

/**
 * Renders the cost breakdown on screen and in the print/PDF layout.
 * The section stays hidden while the price field is blank or zero.
 */
function updateCostEstimate(results) {
    const block = document.getElementById('cost-result');
    const printBlock = document.getElementById('print-cost-block');
    const estimate = getCostEstimate(results);

    if (!estimate) {
        if (block) block.classList.add('hidden');
        if (printBlock) printBlock.classList.add('hidden');
        if (updateCostEstimate.announceTimer) {
            window.clearTimeout(updateCostEstimate.announceTimer);
            updateCostEstimate.announceTimer = null;
        }
        if (updateCostEstimate.trackTimer) {
            window.clearTimeout(updateCostEstimate.trackTimer);
            updateCostEstimate.trackTimer = null;
        }
        lastTrackedCostKey = '';
        const emptySummary = document.getElementById('cost-summary');
        if (emptySummary) emptySummary.textContent = '';
        return;
    }

    const metric = currentUnit === 'metric';
    const currency = estimate.currency;
    const quantityText = estimate.basis.decimals === 0
        ? formatInteger(estimate.quantity)
        : formatDecimal(estimate.quantity, 2);
    const basisDetail = quantityText + ' ' + estimate.basis.quantityLabel + ' at ' +
        formatCurrency(estimate.price, currency) + ' per ' + estimate.basis.priceUnitLabel;
    const taxLabel = 'Tax (' + formatRate(estimate.taxRate) + ')';
    const perAreaLabel = metric ? 'Cost per m²' : 'Cost per ft²';
    const perAreaValue = metric ? estimate.costPerSqM : estimate.costPerSqFt;
    const perAreaAlt = metric
        ? (estimate.costPerSqFt === null ? '' : '≈ ' + formatCurrency(estimate.costPerSqFt, currency) + ' per ft²')
        : (estimate.costPerSqM === null ? '' : '≈ ' + formatCurrency(estimate.costPerSqM, currency) + ' per m²');

    if (block) block.classList.remove('hidden');

    setTextContent('cost-currency-note', currency);
    setTextContent('cost-material', formatCurrency(estimate.materialCost, currency));
    setTextContent('cost-delivery', formatCurrency(estimate.deliveryFee, currency));
    setTextContent('cost-tax-label', taxLabel);
    setTextContent('cost-tax', formatCurrency(estimate.tax, currency));
    setTextContent('cost-total', formatCurrency(estimate.total, currency));
    setTextContent('cost-basis-detail', basisDetail);
    setTextContent('cost-per-area-label', perAreaLabel);
    setTextContent('cost-per-area', perAreaValue === null ? '—' : formatCurrency(perAreaValue, currency));
    setTextContent('cost-per-area-alt', perAreaAlt);

    const perAreaRow = document.getElementById('cost-per-area-row');
    if (perAreaRow) perAreaRow.classList.toggle('hidden', perAreaValue === null);

    if (printBlock) {
        printBlock.classList.remove('hidden');
        setTextContent('print-cost-material', formatCurrency(estimate.materialCost, currency));
        setTextContent('print-cost-delivery', formatCurrency(estimate.deliveryFee, currency));
        setTextContent('print-cost-tax-label', taxLabel + ':');
        setTextContent('print-cost-tax', formatCurrency(estimate.tax, currency));
        setTextContent('print-cost-total', formatCurrency(estimate.total, currency));
        setTextContent('print-cost-per-area-label', perAreaLabel + ':');
        setTextContent('print-cost-per-area', perAreaValue === null ? '—' : formatCurrency(perAreaValue, currency));
        setTextContent('print-cost-note', basisDetail + '. Prices entered by you in ' + currency + '; confirm delivery and tax with your supplier.');
        const printPerAreaRow = document.getElementById('print-cost-per-area-row');
        if (printPerAreaRow) printPerAreaRow.classList.toggle('hidden', perAreaValue === null);
    }

    // Announce the total without repeating it on every keystroke.
    const summary = document.getElementById('cost-summary');
    if (summary) {
        if (updateCostEstimate.announceTimer) {
            window.clearTimeout(updateCostEstimate.announceTimer);
        }
        updateCostEstimate.announceTimer = window.setTimeout(function () {
            summary.textContent = 'Estimated total ' + formatCurrency(estimate.total, currency) +
                ': ' + formatCurrency(estimate.materialCost, currency) + ' material, ' +
                formatCurrency(estimate.deliveryFee, currency) + ' delivery and ' +
                formatCurrency(estimate.tax, currency) + ' tax.';
            updateCostEstimate.announceTimer = null;
        }, 600);
    }

    // Debounced tracking: fires once the visitor finishes typing or adjusting prices
    if (updateCostEstimate.trackTimer) {
        window.clearTimeout(updateCostEstimate.trackTimer);
    }
    updateCostEstimate.trackTimer = window.setTimeout(function () {
        trackCostEstimate(estimate);
        updateCostEstimate.trackTimer = null;
    }, 800);
}

function displayResults(results) {
    const display = buildResultDisplay(results);

    setTextContent('result-volume', display.volume);
    setTextContent('result-volume-unit', display.volumeUnitLong);
    setTextContent('result-volume-alt', display.volumeAltText);
    setTextContent('result-weight', display.weight);
    setTextContent('result-weight-unit', display.weightUnitLong);
    setTextContent('result-weight-alt', display.weightAltText);
    setTextContent('result-bags', display.bags);
    setTextContent('result-bags-unit', display.bagsUnitLong);
    setTextContent('result-bags-alt', display.bagsAltText);
    setTextContent('result-pallets', display.pallets);
    setTextContent('result-pallets-breakdown', display.palletsBreakdown);
    setTextContent('result-bags-per-vol', display.bagsPerVol);
    setTextContent('result-bags-per-vol-label', display.bagsPerVolLabel);
    setTextContent('result-bags-per-weight', display.bagsPerWeight);
    setTextContent('result-bags-per-weight-label', display.bagsPerWeightLabel);

    // Show the base quantity when waste or compaction is active.
    const wastePercent = currentWastePercent;
    const compactionPercent = currentCompactionPercent;
    const hasAllowance = (wastePercent > 0 || compactionPercent > 0) && results.volumeCuYd > 0;
    const allowanceNote = document.getElementById('allowance-note');
    const resultsNote = document.getElementById('results-note');

    if (allowanceNote && resultsNote) {
        allowanceNote.classList.toggle('hidden', !hasAllowance);
        resultsNote.classList.toggle('hidden', hasAllowance);

        if (hasAllowance) {
            setTextContent('allowance-note-summary', describeAllowances(wastePercent, compactionPercent));
            setTextContent('allowance-note-base-volume', display.baseVolume);
            setTextContent('allowance-note-base-volume-unit', display.baseVolumeUnit);
            setTextContent('allowance-note-base-weight', display.baseWeight);
            setTextContent('allowance-note-base-weight-unit', display.baseWeightUnit);
        }
    }

    // Update assumption warnings and project recommendations
    updateWarningsUI(results);

    // Toggle Export Buttons (both desktop and mobile versions)
    const hasData = results.volumeCuYd > 0;

    // Desktop buttons
    const printBtn = document.getElementById('btn-print');
    const pdfBtn = document.getElementById('btn-pdf');
    if (printBtn) printBtn.disabled = !hasData;
    if (pdfBtn) pdfBtn.disabled = !hasData;

    // Mobile buttons
    const printBtnMobile = document.getElementById('btn-print-mobile');
    const pdfBtnMobile = document.getElementById('btn-pdf-mobile');
    if (printBtnMobile) printBtnMobile.disabled = !hasData;
    if (pdfBtnMobile) pdfBtnMobile.disabled = !hasData;

    // Announce the estimate without repeating the same sentence for every keystroke.
    const summary = document.getElementById('results-summary');
    if (summary) {
        if (displayResults.announceTimer) {
            window.clearTimeout(displayResults.announceTimer);
        }
        displayResults.announceTimer = window.setTimeout(function () {
            const materialSelect = document.getElementById('material-select');
            const materialText = materialSelect && materialSelect.selectedIndex >= 0
                ? materialSelect.options[materialSelect.selectedIndex].text.replace(/\s*\([^)]*\)\s*$/, '')
                : 'gravel';
            const allowanceText = (wastePercent > 0 || compactionPercent > 0)
                ? 'Includes ' + describeAllowances(wastePercent, compactionPercent) + '.'
                : 'This excludes waste and compaction allowances.';
            const message = hasData
                ? 'Estimate: ' + formatDecimal(results.volumeCuYd, 2) + ' cubic yards or ' +
                  formatDecimal(results.volumeM3, 2) + ' cubic metres; ' +
                  formatDecimal(results.weightShortTons, 2) + ' short tons or ' +
                  formatDecimal(results.weightMetricTonnes, 2) + ' metric tonnes (' +
                  formatInteger(results.weightKg) + ' kilograms); ' +
                  formatInteger(results.bags) + ' fifty pound bags or ' +
                  formatInteger(results.bags25kg) + ' twenty-five kilogram bags of ' + materialText +
                  '. ' + allowanceText
                : 'Enter length, width or diameter and depth to see an estimate.';

            if (message !== lastAnnouncement) {
                summary.textContent = message;
                lastAnnouncement = message;
            }
        }, 600);
    }

    // One completion event per page view avoids firing on every keystroke.
    if (hasData && !hasTrackedCompletion) {
        hasTrackedCompletion = true;
        trackEvent('calculator_complete', {
            material: currentMaterial,
            shape: currentShape,
            unit: currentUnit
        });
    }

    // Keep the optional cost breakdown in sync with the adjusted quantities.
    updateCostEstimate(results);

    // Keep the bulk vs bag comparison in sync if active.
    updateBulkVsBagComparison(results);
}

/**
 * Inline fallback for generating assumption warnings if engine is not loaded.
 */
function getWarningsFallback(input, results) {
    const warnings = [];
    const depth = input.depthInches !== undefined ? input.depthInches : currentDepthInches;
    const wastePercent = input.wastePercent !== undefined ? input.wastePercent : currentWastePercent;
    const compactionPercent = input.compactionPercent !== undefined ? input.compactionPercent : currentCompactionPercent;
    const isMetric = input.unit === 'metric';

    if (results && results.volumeCuYd > 0) {
        if (depth < 2) {
            warnings.push({
                code: 'depth-under-2',
                level: 'warning',
                message: isMetric
                    ? 'A depth under 50 mm (2 in) is a decorative skim. Walking paths usually need 50–75 mm (2–3 in) and driveways 100–150 mm (4–6 in).'
                    : 'A depth under 2 in is a decorative skim. Walking paths usually need 2–3 in and driveways 4–6 in.'
            });
        } else if (depth < 4 && depth >= 2) {
            warnings.push({
                code: 'depth-under-4',
                level: 'info',
                message: isMetric
                    ? 'If this is a driveway, 100–150 mm (4–6 in) is the usual compacted depth. Paths and borders are fine at 50–75 mm (2–3 in).'
                    : 'If this is a driveway, 4–6 in is the usual compacted depth. Paths and borders are fine at 2–3 in.'
            });
        }

        if (depth > 12) {
            warnings.push({
                code: 'depth-over-12',
                level: 'warning',
                message: isMetric
                    ? 'A depth over 300 mm (12 in) is unusual for a surface layer. Double-check whether dimensions are entered consistently.'
                    : 'A depth over 12 in is unusual for a surface layer. Double-check whether the area is measured in feet and metres consistently.'
            });
        }

        if (compactionPercent > 0 && wastePercent > 0) {
            warnings.push({
                code: 'combined-allowances',
                level: 'info',
                message: 'Waste and compaction are applied one after the other, not added together. Confirm the total with your supplier.'
            });
        }
    }

    return warnings;
}

/**
 * Renders assumption warnings and project recommendations based on current inputs.
 */
function updateWarningsUI(results) {
    const container = document.getElementById('assumption-warnings');
    if (!container) return;

    if (!results || results.volumeCuYd <= 0) {
        lastWarningsSignature = '';
        if (container.innerHTML !== '') container.innerHTML = '';
        container.classList.add('hidden');
        return;
    }

    const input = {
        shape: currentShape,
        depthInches: currentDepthInches,
        material: currentMaterial,
        wastePercent: currentWastePercent,
        compactionPercent: currentCompactionPercent,
        unit: currentUnit,
        areaSqFt: results.areaSqFt
    };

    const warnings = (ENGINE && typeof ENGINE.getWarnings === 'function')
        ? ENGINE.getWarnings(input, results)
        : getWarningsFallback(input, results);

    // Filter out 'no-waste' (handled by results-note) and 'no-dimensions' (volume > 0)
    const visibleWarnings = warnings.filter(function (w) {
        return w.code !== 'no-waste' && w.code !== 'no-dimensions';
    });

    if (visibleWarnings.length === 0) {
        lastWarningsSignature = '';
        if (container.innerHTML !== '') container.innerHTML = '';
        container.classList.add('hidden');
        return;
    }

    // Rebuild the region only when the advice actually changes. Recreating
    // role="alert" nodes on every keystroke re-announces the same warning.
    const signature = visibleWarnings.map(function (warning) {
        return warning.code + '|' + warning.level + '|' + warning.message;
    }).join('~');

    if (signature === lastWarningsSignature) {
        container.classList.remove('hidden');
        return;
    }

    lastWarningsSignature = signature;
    container.innerHTML = '';
    container.classList.remove('hidden');

    visibleWarnings.forEach(function (warning) {
        const item = document.createElement('div');
        const isWarning = warning.level === 'warning';

        item.className = 'rounded-lg p-3 text-xs leading-relaxed flex items-start gap-2.5 transition-all ' +
            (isWarning
                ? 'bg-amber-50 border border-amber-300 text-amber-900'
                : 'bg-blue-50 border border-blue-200 text-blue-900');
        item.setAttribute('role', isWarning ? 'alert' : 'status');

        const iconSvg = isWarning
            ? '<svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>'
            : '<svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';

        let titleText = isWarning ? 'Depth Warning' : 'Project Guidance';
        if (warning.code === 'depth-under-2') {
            titleText = 'Shallow Depth Warning';
        } else if (warning.code === 'depth-over-12') {
            titleText = 'Unusual Depth Warning';
        } else if (warning.code === 'depth-under-4') {
            titleText = 'Driveway Depth Guidance';
        } else if (warning.code === 'combined-allowances') {
            titleText = 'Sequential Allowances';
        } else if (warning.code === 'density-out-of-range') {
            titleText = 'Density Range Warning';
        }

        item.innerHTML = iconSvg + '<div></div>';

        const body = item.lastElementChild;
        const title = document.createElement('span');
        title.className = 'font-bold block mb-0.5 ' + (isWarning ? 'text-amber-950' : 'text-blue-950');
        title.textContent = titleText;
        const warningText = document.createElement('span');
        warningText.textContent = warning.message;
        body.appendChild(title);
        body.appendChild(warningText);

        container.appendChild(item);
    });
}

// ========================================
// BAG SIZE & PALLET LOGIC
// ========================================

/**
 * Switches the selected bag size and triggers recalculation.
 */
function switchBagSize(size) {
    const numSize = parseFloat(size);
    if (!isFinite(numSize) || numSize <= 0) return;

    // Clicking the active bag size is a no-op; it must not emit another event.
    const activeSize = currentUnit === 'metric' ? currentBagSizeKg : currentBagSizeLb;
    if (numSize === activeSize) return;

    if (currentUnit === 'metric') {
        currentBagSizeKg = numSize;
    } else {
        currentBagSizeLb = numSize;
    }

    renderBagSizeButtons();
    performCalculation();
    trackEvent('bag_size_change', {
        size: numSize,
        unit: currentUnit
    });
}

/**
 * Renders the bag size buttons matching the current unit system.
 */
function renderBagSizeButtons() {
    const container = document.getElementById('bag-size-buttons');
    const hint = document.getElementById('bag-size-hint');
    if (!container) return;

    const metric = currentUnit === 'metric';
    const sizes = metric ? [20, 25, 40] : [40, 50, 60];
    const unitLabel = metric ? 'kg' : 'lb';
    const currentSize = metric ? currentBagSizeKg : currentBagSizeLb;
    const standardSize = metric ? 25 : 50;

    if (hint) {
        hint.textContent = 'Standard: ' + standardSize + ' ' + unitLabel;
    }

    container.innerHTML = '';
    sizes.forEach(function (size) {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = size === currentSize;
        btn.className = 'bag-size-btn px-2 py-1.5 text-xs font-semibold rounded-lg border-2 transition-all ' +
            (isActive
                ? 'border-blue-600 bg-blue-50 text-blue-700 active'
                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300');
        btn.setAttribute('data-size', String(size));
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        btn.textContent = size + ' ' + unitLabel;
        btn.addEventListener('click', function () {
            switchBagSize(size);
        });
        container.appendChild(btn);
    });

    const compBagSizeLabel = document.getElementById('compare-bag-size-label');
    if (compBagSizeLabel) {
        compBagSizeLabel.textContent = 'per ' + currentSize + ' ' + unitLabel + ' bag';
    }
}

// ========================================
// BULK VS BAG COMPARISON
// ========================================

/**
 * Updates the Bulk vs Bag comparison card whenever inputs or calculation changes.
 */
function updateBulkVsBagComparison(results) {
    const section = document.getElementById('bulk-vs-bag-section');
    const resultBox = document.getElementById('compare-result');
    if (!section || !resultBox || !results) return;

    const bulkPriceInput = document.getElementById('compare-bulk-price');
    const bagPriceInput = document.getElementById('compare-bag-price');
    const bulkDeliveryInput = document.getElementById('compare-bulk-delivery');
    const bagDeliveryInput = document.getElementById('compare-bag-delivery');
    const currencySelect = document.getElementById('cost-currency');
    const currency = currencySelect && CURRENCY_SYMBOLS[currencySelect.value] ? currencySelect.value : 'USD';

    const rawBulkPrice = bulkPriceInput ? parseFloat(bulkPriceInput.value) : null;
    const rawBagPrice = bagPriceInput ? parseFloat(bagPriceInput.value) : null;
    const rawBulkDelivery = bulkDeliveryInput ? parseFloat(bulkDeliveryInput.value) : 0;
    const rawBagDelivery = bagDeliveryInput ? parseFloat(bagDeliveryInput.value) : 0;

    const metric = currentUnit === 'metric';
    const bulkBasisLabel = document.getElementById('compare-bulk-basis-label');
    if (bulkBasisLabel) {
        bulkBasisLabel.textContent = metric ? 'per tonne' : 'per ton';
    }
    const bagSizeLabel = document.getElementById('compare-bag-size-label');
    if (bagSizeLabel) {
        bagSizeLabel.textContent = 'per ' + (metric ? currentBagSizeKg + ' kg' : currentBagSizeLb + ' lb') + ' bag';
    }

    if (!isFinite(rawBulkPrice) || rawBulkPrice <= 0 || !isFinite(rawBagPrice) || rawBagPrice <= 0) {
        resultBox.classList.add('hidden');
        return;
    }

    const mainTax = readCostValue('tax-rate') || 0;
    const bulkInput = {
        price: rawBulkPrice,
        basis: metric ? 'metric_tonne' : 'short_ton',
        deliveryFee: isFinite(rawBulkDelivery) && rawBulkDelivery >= 0 ? rawBulkDelivery : 0,
        taxRate: mainTax
    };
    const bagInput = {
        price: rawBagPrice,
        deliveryFee: isFinite(rawBagDelivery) && rawBagDelivery >= 0 ? rawBagDelivery : 0,
        taxRate: mainTax,
        bagCount: metric ? results.bags25kg : results.bags
    };

    let comparison = null;
    if (ENGINE && typeof ENGINE.compareBulkVsBag === 'function') {
        comparison = ENGINE.compareBulkVsBag(results, bulkInput, bagInput);
    } else {
        const bulkQty = metric ? results.weightMetricTonnes : results.weightShortTons;
        const bulkMatCost = Math.round(bulkQty * rawBulkPrice * 100) / 100;
        const bulkTax = Math.round((bulkMatCost + bulkInput.deliveryFee) * (mainTax / 100) * 100) / 100;
        const bulkTotal = Math.round((bulkMatCost + bulkInput.deliveryFee + bulkTax) * 100) / 100;

        const bagQty = metric ? results.bags25kg : results.bags;
        const bagMatCost = Math.round(bagQty * rawBagPrice * 100) / 100;
        const bagTax = Math.round((bagMatCost + bagInput.deliveryFee) * (mainTax / 100) * 100) / 100;
        const bagTotal = Math.round((bagMatCost + bagInput.deliveryFee + bagTax) * 100) / 100;

        const diff = Math.round(Math.abs(bulkTotal - bagTotal) * 100) / 100;
        let cheaper = 'equal';
        let savingsPercent = 0;
        if (bulkTotal < bagTotal) {
            cheaper = 'bulk';
            savingsPercent = bagTotal > 0 ? Math.round((diff / bagTotal) * 1000) / 10 : 0;
        } else if (bagTotal < bulkTotal) {
            cheaper = 'bag';
            savingsPercent = bulkTotal > 0 ? Math.round((diff / bulkTotal) * 1000) / 10 : 0;
        }

        comparison = {
            bulk: { quantity: bulkQty, total: bulkTotal },
            bag: { quantity: bagQty, total: bagTotal },
            difference: diff,
            cheaper: cheaper,
            savingsPercent: savingsPercent
        };
    }

    if (!comparison) {
        updateBulkVsBagComparison.lastCheaper = null;
        resultBox.classList.add('hidden');
        return;
    }

    resultBox.classList.remove('hidden');

    if (comparison && comparison.cheaper) {
        if (!updateBulkVsBagComparison.lastCheaper || updateBulkVsBagComparison.lastCheaper !== comparison.cheaper) {
            updateBulkVsBagComparison.lastCheaper = comparison.cheaper;
            trackEvent('bag_vs_bulk_compare', { cheaper: comparison.cheaper });
        }
    }

    const titleEl = document.getElementById('compare-verdict-title');
    const badgeEl = document.getElementById('compare-savings-badge');
    const bulkTotalEl = document.getElementById('compare-bulk-total');
    const bagTotalEl = document.getElementById('compare-bag-total');
    const diffEl = document.getElementById('compare-difference');
    const recEl = document.getElementById('compare-recommendation');

    if (bulkTotalEl) bulkTotalEl.textContent = formatCurrency(comparison.bulk.total, currency);
    if (bagTotalEl) bagTotalEl.textContent = formatCurrency(comparison.bag.total, currency);
    if (diffEl) diffEl.textContent = formatCurrency(comparison.difference, currency);

    if (comparison.cheaper === 'bulk') {
        resultBox.className = 'rounded-lg p-3 border transition-all mt-3 bg-emerald-50 border-emerald-200';
        if (titleEl) {
            titleEl.className = 'font-bold text-sm text-emerald-900';
            titleEl.textContent = 'Bulk Delivery is Cheaper';
        }
        if (badgeEl) {
            badgeEl.className = 'text-xs font-semibold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900';
            badgeEl.textContent = 'Save ' + formatCurrency(comparison.difference, currency) + ' (' + comparison.savingsPercent + '%)';
        }
        if (recEl) {
            recEl.textContent = 'Bulk delivery saves money for this project size. Make sure your site has adequate clearance for a dump truck and space to pile the aggregate.';
        }
    } else if (comparison.cheaper === 'bag') {
        resultBox.className = 'rounded-lg p-3 border transition-all mt-3 bg-blue-50 border-blue-200';
        if (titleEl) {
            titleEl.className = 'font-bold text-sm text-blue-900';
            titleEl.textContent = 'Bags are Cheaper';
        }
        if (badgeEl) {
            badgeEl.className = 'text-xs font-semibold px-2 py-0.5 rounded bg-blue-200 text-blue-900';
            badgeEl.textContent = 'Save ' + formatCurrency(comparison.difference, currency) + ' (' + comparison.savingsPercent + '%)';
        }
        if (recEl) {
            recEl.textContent = 'Buying bags avoids high bulk delivery minimums. Bags are easy to carry to awkward spots, but check vehicle payload capacity before hauling.';
        }
    } else {
        resultBox.className = 'rounded-lg p-3 border transition-all mt-3 bg-slate-50 border-slate-200';
        if (titleEl) {
            titleEl.className = 'font-bold text-sm text-slate-900';
            titleEl.textContent = 'Both Options Cost the Same';
        }
        if (badgeEl) {
            badgeEl.className = 'text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800';
            badgeEl.textContent = 'Equal Cost';
        }
        if (recEl) {
            recEl.textContent = 'Both options cost the same for this volume. Choose bulk if you have easy dump truck access, or bags if you need staged delivery or carry-in access.';
        }
    }
}

/**
 * Initializes the toggle and listeners for the bulk-vs-bag comparison.
 */
function initBulkVsBagToggle() {
    const toggleBtn = document.getElementById('btn-toggle-bulk-vs-bag');
    const content = document.getElementById('bulk-vs-bag-content');
    const icon = document.getElementById('bulk-vs-bag-icon');
    if (!toggleBtn || !content) return;

    toggleBtn.addEventListener('click', function () {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        const newExpanded = !isExpanded;
        toggleBtn.setAttribute('aria-expanded', newExpanded ? 'true' : 'false');
        content.classList.toggle('hidden', !newExpanded);
        if (icon) {
            icon.classList.toggle('rotate-180', newExpanded);
        }
        if (newExpanded && lastResults) {
            updateBulkVsBagComparison(lastResults);
            trackEvent('bag_vs_bulk_view');
        }
    });

    ['compare-bulk-price', 'compare-bag-price', 'compare-bulk-delivery', 'compare-bag-delivery'].forEach(function (id) {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function () {
                if (lastResults) updateBulkVsBagComparison(lastResults);
            });
        }
    });
}

// ========================================
// UI INTERACTION HANDLERS
// ========================================

function switchShape(shape) {
    currentShape = shape;

    // Update shape buttons and their pressed state
    document.querySelectorAll('.shape-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-shape') === shape;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // Update dimension panels
    document.querySelectorAll('.dimensions-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`inputs-${shape}`).classList.add('active');

    // Update SVG shapes
    document.querySelectorAll('.svg-shape').forEach(svg => {
        svg.classList.remove('active');
    });
    document.getElementById(`svg-${shape}`).classList.add('active');

    trackEvent('shape_change', { shape: shape });

    // Recalculate
    performCalculation();
}

function updateMaterial() {
    const select = document.getElementById('material-select');
    currentMaterial = select.value;
    trackEvent('material_change', { material: currentMaterial });
    performCalculation();
}

function updateDepth() {
    const slider = document.getElementById('depth-slider');
    currentDepthInches = parseFloat(slider.value);

    // Update display
    const display = document.getElementById('depth-display');
    if (currentDepthInches === 0) {
        display.textContent = currentUnit === 'imperial' ? '0 inches' : '0 mm';
    } else {
        if (currentUnit === 'imperial') {
            if (currentDepthInches < 12) {
                display.textContent = `${currentDepthInches} ${currentDepthInches === 1 ? 'inch' : 'inches'}`;
            } else {
                const feet = Math.floor(currentDepthInches / 12);
                const inches = currentDepthInches % 12;
                if (inches === 0) {
                    display.textContent = `${feet} ${feet === 1 ? 'foot' : 'feet'}`;
                } else {
                    display.textContent = `${feet}' ${inches}"`;
                }
            }
        } else {
            // Metric Depth Display (mm/cm)
            const mm = Math.round(currentDepthInches * 25.4);
            if (mm < 100) {
                display.textContent = `${mm} mm`;
            } else {
                display.textContent = `${(mm / 10).toFixed(1)} cm`;
            }
        }
    }

    if (slider) {
        slider.setAttribute('aria-valuetext', display.textContent);
    }

    performCalculation();
}

/**
 * Refreshes the waste slider label and accessibility text without tracking.
 */
function syncWasteUI() {
    const slider = document.getElementById('waste-slider');
    const display = document.getElementById('waste-display');
    if (!slider) return;

    currentWastePercent = Math.min(25, Math.max(0, parseFloat(slider.value) || 0));
    if (display) display.textContent = currentWastePercent + '%';
    slider.setAttribute('aria-valuetext', currentWastePercent + ' percent');
}

/**
 * Handles a user change to the waste allowance.
 */
function updateWaste() {
    const slider = document.getElementById('waste-slider');
    if (!slider) return;

    syncWasteUI();
    performCalculation();
}

/**
 * Records the final waste value once the slider is released.
 */
function trackWasteChange() {
    // A slider click without movement still fires `change`; only report real edits.
    if (currentWastePercent === lastTrackedWastePercent) return;
    lastTrackedWastePercent = currentWastePercent;
    trackEvent('waste_change', { waste_percent: currentWastePercent });
}

/**
 * Refreshes the compaction slider label, preset states and accessibility text.
 */
function syncCompactionUI() {
    const slider = document.getElementById('compaction-slider');
    const display = document.getElementById('compaction-display');
    if (!slider) return;

    currentCompactionPercent = Math.min(20, Math.max(0, parseFloat(slider.value) || 0));
    if (display) display.textContent = currentCompactionPercent + '%';
    slider.setAttribute('aria-valuetext', currentCompactionPercent + ' percent');

    document.querySelectorAll('.compaction-preset').forEach(function (btn) {
        const isActive = parseFloat(btn.getAttribute('data-compaction')) === currentCompactionPercent;
        btn.classList.toggle('border-blue-500', isActive);
        btn.classList.toggle('bg-blue-50', isActive);
        btn.classList.toggle('text-blue-700', isActive);
        btn.classList.toggle('border-slate-200', !isActive);
        btn.classList.toggle('bg-white', !isActive);
        btn.classList.toggle('text-slate-600', !isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}

/**
 * Handles a user change to the compaction allowance.
 */
function updateCompaction() {
    const slider = document.getElementById('compaction-slider');
    if (!slider) return;

    syncCompactionUI();
    performCalculation();
}

/**
 * Records the final compaction value once the slider is released.
 */
function trackCompactionChange() {
    // The slider and the presets share this tracker, so dedupe repeated values.
    if (currentCompactionPercent === lastTrackedCompactionPercent) return;
    lastTrackedCompactionPercent = currentCompactionPercent;
    trackEvent('compaction_change', { compaction_percent: currentCompactionPercent });
}

/**
 * Applies a compaction preset.
 */
function setCompactionPreset(percent) {
    const slider = document.getElementById('compaction-slider');
    if (!slider) return;

    slider.value = String(percent);
    syncCompactionUI();
    performCalculation();
    trackCompactionChange();
}

/**
 * Toggles between Imperial and Metric units
 * Converts existing values in-place
 */
function toggleUnits() {
    const newUnit = currentUnit === 'imperial' ? 'metric' : 'imperial';

    // 1. Convert Input Values
    convertValues(newUnit);

    // 2. Update State
    currentUnit = newUnit;

    // 3. Update UI (Labels & Toggle Switch)
    updateUnitUI();

    // 4. Recalculate
    updateDepth(); // Updates depth display label
    performCalculation();

    trackEvent('unit_change', { unit: currentUnit });
}

/**
 * Converts all input fields to the target unit
 */
function convertValues(toUnit) {
    // We process "ft/m" (large) and "in/cm" (small) as pairs, because
    // 1 ft 6 in becomes 0 m 45 cm (not independent conversions).
    const shapes = ['rect-length', 'rect-width', 'circle-diameter', 'lshape-a-length', 'lshape-a-width', 'lshape-b-length', 'lshape-b-width'];

    shapes.forEach(prefix => {
        const largeInput = document.getElementById(`${prefix}-ft`);
        const smallInput = document.getElementById(`${prefix}-in`);

        // Skip if input doesn't exist (e.g. some typo protection)
        if (!largeInput || !smallInput) return;

        let largeVal = parseFloat(largeInput.value) || 0;
        let smallVal = parseFloat(smallInput.value) || 0;

        // Skip absolute zero to keep fields clean if empty
        if (largeInput.value === '' && smallInput.value === '') return;

        let totalFeet = 0;

        // Step A: Normalize to feet first. 0.3048 is exact by definition.
        if (currentUnit === 'imperial') {
            totalFeet = largeVal + (smallVal / 12);
        } else {
            // currently metric: large=m, small=cm
            totalFeet = (largeVal + (smallVal / 100)) / 0.3048;
        }

        // Step B: Convert to target
        if (toUnit === 'metric') {
            // Feet -> metres
            const totalMeters = totalFeet * 0.3048;
            const m = Math.floor(totalMeters);
            const cm = Math.round((totalMeters - m) * 100);

            // Edge case: 99.5cm rounds to 100cm -> 1m
            if (cm === 100) {
                largeInput.value = m + 1;
                smallInput.value = 0;
            } else {
                largeInput.value = m;
                smallInput.value = cm;
            }
        } else {
            // Metres -> feet (actually feet -> feet since we normalized to feet)
            const feet = Math.floor(totalFeet);
            const inches = Math.round((totalFeet - feet) * 12);

            if (inches === 12) {
                largeInput.value = feet + 1;
                smallInput.value = 0;
            } else {
                largeInput.value = feet;
                smallInput.value = inches;
            }
        }
    });

    // The depth slider is stored in inches internally; its label is updated
    // by updateDepth() and its ticks by updateUnitUI().
}

function updateUnitUI() {
    const metric = currentUnit === 'metric';

    // Labels
    document.querySelectorAll('.unit-label-large').forEach(el => {
        el.textContent = metric ? 'm' : 'ft';
    });
    document.querySelectorAll('.unit-label-small').forEach(el => {
        el.textContent = metric ? 'cm' : 'in';
    });

    // Keep the current unit available to the quote hand-off and other scripts.
    document.documentElement.setAttribute('data-unit', currentUnit);

    // Example badge above the results.
    const exampleLabel = document.getElementById('fallback-label');
    if (exampleLabel) {
        exampleLabel.textContent = metric ? 'Example: 3 m × 3 m × 10 cm' : 'Example: 10 ft × 10 ft × 3 in';
    }

    // Depth slider tick labels follow the selected unit.
    const depthTicks = metric
        ? ['0', '150', '300', '450', '600 mm']
        : ['0"', '6"', '12"', '18"', '24"'];
    document.querySelectorAll('.depth-tick').forEach((tick, index) => {
        if (depthTicks[index] !== undefined) tick.textContent = depthTicks[index];
    });

    // A 0.5-inch drag step is convenient in imperial, but it cannot represent
    // common metric depths (10 cm = 3.937 in). Use a finer step in metric mode
    // so a 10 cm depth stays within 0.1% instead of snapping to 4 in.
    const depthSlider = document.getElementById('depth-slider');
    if (depthSlider) {
        depthSlider.step = metric ? '0.01' : '0.5';
        depthSlider.value = String(currentDepthInches);
    }

    // Explain the metric output set when that mode is active.
    const metricNote = document.getElementById('metric-mode-note');
    if (metricNote) metricNote.classList.toggle('hidden', !metric);

    // Toggle Pill Animation
    const pill = document.getElementById('unit-pill');
    const btnImp = document.getElementById('btn-imperial');
    const btnMet = document.getElementById('btn-metric');

    function setPressed(button, isPressed) {
        if (!button) return;
        button.setAttribute('aria-pressed', isPressed ? 'true' : 'false');
        button.classList.toggle('text-blue-700', isPressed);
        button.classList.toggle('text-slate-600', !isPressed);
    }

    if (!metric) {
        if (pill) pill.style.transform = 'translateX(0)';
        setPressed(btnImp, true);
        setPressed(btnMet, false);
    } else {
        if (pill) pill.style.transform = 'translateX(calc(100% + 4px))';
        setPressed(btnImp, false);
        setPressed(btnMet, true);
    }

    // Refresh bag size preset buttons for the active unit system
    renderBagSizeButtons();
}

function validateInput(input) {
    if (input.value < 0) {
        input.value = 0;
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    // Shape button listeners
    document.querySelectorAll('.shape-btn').forEach(button => {
        button.addEventListener('click', function () {
            const shape = this.getAttribute('data-shape');
            switchShape(shape);
        });
    });

    // Unit toggle listeners
    const imperialBtn = document.getElementById('btn-imperial');
    const metricBtn = document.getElementById('btn-metric');
    if (imperialBtn) {
        imperialBtn.addEventListener('click', function () {
            if (currentUnit !== 'imperial') toggleUnits();
        });
    }
    if (metricBtn) {
        metricBtn.addEventListener('click', function () {
            if (currentUnit !== 'metric') toggleUnits();
        });
    }

    // Material selection listener
    document.getElementById('material-select').addEventListener('change', updateMaterial);

    // Depth slider listener
    const depthSlider = document.getElementById('depth-slider');
    if (depthSlider) {
        depthSlider.addEventListener('input', updateDepth);
        depthSlider.addEventListener('change', function () {
            trackEvent('depth_change', { depth_inches: currentDepthInches });
        });
    }

    // Waste allowance listener
    const wasteSlider = document.getElementById('waste-slider');
    if (wasteSlider) {
        wasteSlider.addEventListener('input', updateWaste);
        wasteSlider.addEventListener('change', trackWasteChange);
    }

    // Compaction allowance listener and presets
    const compactionSlider = document.getElementById('compaction-slider');
    if (compactionSlider) {
        compactionSlider.addEventListener('input', updateCompaction);
        compactionSlider.addEventListener('change', trackCompactionChange);
    }
    document.querySelectorAll('.compaction-preset').forEach(function (btn) {
        btn.addEventListener('click', function () {
            setCompactionPreset(parseFloat(btn.getAttribute('data-compaction')) || 0);
        });
    });

    // Optional cost estimator fields
    updateCostCurrencySymbols();

    ['price-amount', 'delivery-fee', 'tax-rate'].forEach(function (id) {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener('input', function () {
            const value = parseFloat(input.value);
            if (input.value !== '' && isFinite(value) && value < 0) {
                input.value = '0';
            }
            updateCostEstimate(lastResults);
        });

        input.addEventListener('blur', function () {
            const value = parseFloat(input.value);
            if (input.value === '' || !isFinite(value)) return;

            let clamped = Math.max(0, value);
            if (id === 'tax-rate') clamped = Math.min(MAX_TAX_RATE, clamped);
            input.value = String(Math.round(clamped * 100) / 100);
            updateCostEstimate(lastResults);
            trackCostEstimate(getCostEstimate(lastResults));
        });
    });

    const priceBasis = document.getElementById('price-basis');
    if (priceBasis) {
        priceBasis.addEventListener('change', function () {
            updateCostEstimate(lastResults);
            trackCostEstimate(getCostEstimate(lastResults));
        });
    }

    const costCurrency = document.getElementById('cost-currency');
    if (costCurrency) {
        costCurrency.addEventListener('change', function () {
            updateCostCurrencySymbols();
            updateCostEstimate(lastResults);
            trackCostEstimate(getCostEstimate(lastResults));
        });
    }

    // Print button listeners (desktop & mobile)
    ['btn-print', 'btn-print-mobile'].forEach(function (id) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', trackPrintAction);
        }
    });

    // Input validation and real-time calculation
    document.querySelectorAll('.dimension-input').forEach(input => {
        // Validate on input
        input.addEventListener('input', function () {
            validateInput(this);
            performCalculation(); // Real-time calculation
        });

        // Validate on blur
        input.addEventListener('blur', function () {
            validateInput(this);
        });
    });

    // Initialize bulk vs bag comparison toggle
    initBulkVsBagToggle();

    // Render bag size selector buttons
    renderBagSizeButtons();

    // Initial calculation
    performCalculation();
});

function loadQueryParams() {
    const params = new URLSearchParams(window.location.search);

    // 1. Unit (Must do this first so input labels match)
    const unitParam = params.get('unit');
    if (unitParam === 'metric' || unitParam === 'imperial') {
        currentUnit = unitParam;
        updateUnitUI();
    }

    // 2. Shape
    const shapeParam = params.get('shape');
    if (['rectangle', 'circle', 'lshape'].includes(shapeParam)) {
        currentShape = shapeParam;

        // Update shape buttons and pressed state
        document.querySelectorAll('.shape-btn').forEach(btn => {
            const isActive = btn.getAttribute('data-shape') === shapeParam;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        // Update dimension panels
        document.querySelectorAll('.dimensions-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        const dimPanel = document.getElementById(`inputs-${shapeParam}`);
        if (dimPanel) dimPanel.classList.add('active');

        // Update SVG shapes
        document.querySelectorAll('.svg-shape').forEach(svg => {
            svg.classList.remove('active');
        });
        const svgShape = document.getElementById(`svg-${shapeParam}`);
        if (svgShape) svgShape.classList.add('active');
    }

    // 3. Material
    const materialParam = params.get('material');
    if (DENSITIES[materialParam]) {
        currentMaterial = materialParam;
        document.getElementById('material-select').value = materialParam;
    }

    // 4. Depth
    const depthParam = parseFloat(params.get('depth'));
    if (!isNaN(depthParam) && depthParam >= 0 && depthParam <= 24) {
        currentDepthInches = depthParam;
        document.getElementById('depth-slider').value = depthParam;
    }

    // 5. Waste allowance
    const wasteParam = parseFloat(params.get('waste'));
    if (!isNaN(wasteParam) && wasteParam >= 0 && wasteParam <= 25) {
        currentWastePercent = wasteParam;
        const wasteSlider = document.getElementById('waste-slider');
        if (wasteSlider) wasteSlider.value = wasteParam;
    }

    // 6. Compaction allowance
    const compactionParam = parseFloat(params.get('compaction'));
    if (!isNaN(compactionParam) && compactionParam >= 0 && compactionParam <= 20) {
        currentCompactionPercent = compactionParam;
        const compactionSlider = document.getElementById('compaction-slider');
        if (compactionSlider) compactionSlider.value = compactionParam;
    }

    // 7. Dimension Inputs mapping
    const mappings = {
        'rect_l_ft': 'rect-length-ft',
        'rect_l_in': 'rect-length-in',
        'rect_w_ft': 'rect-width-ft',
        'rect_w_in': 'rect-width-in',
        'circle_d_ft': 'circle-diameter-ft',
        'circle_d_in': 'circle-diameter-in',
        'l_a_l_ft': 'lshape-a-length-ft',
        'l_a_l_in': 'lshape-a-length-in',
        'l_a_w_ft': 'lshape-a-width-ft',
        'l_a_w_in': 'lshape-a-width-in',
        'l_b_l_ft': 'lshape-b-length-ft',
        'l_b_l_in': 'lshape-b-length-in',
        'l_b_w_ft': 'lshape-b-width-ft',
        'l_b_w_in': 'lshape-b-width-in'
    };

    for (const [paramKey, elemId] of Object.entries(mappings)) {
        const val = params.get(paramKey);
        if (val !== null) {
            const parsed = parseFloat(val);
            if (!isNaN(parsed) && parsed >= 0) {
                document.getElementById(elemId).value = parsed;
            }
        }
    }

    // 8. Bag sizes
    const bagParam = parseFloat(params.get('bag'));
    if (!isNaN(bagParam) && bagParam > 0 && bagParam <= 100) {
        currentBagSizeLb = bagParam;
    }
    const bagKgParam = parseFloat(params.get('bag_kg'));
    if (!isNaN(bagKgParam) && bagKgParam > 0 && bagKgParam <= 100) {
        currentBagSizeKg = bagKgParam;
    }

    // 9. Cost estimator fields
    const curParam = params.get('cur');
    if (curParam && CURRENCY_SYMBOLS[curParam]) {
        const curSelect = document.getElementById('cost-currency');
        if (curSelect) {
            curSelect.value = curParam;
            updateCostCurrencySymbols();
        }
    }

    const priceParam = parseFloat(params.get('price'));
    if (!isNaN(priceParam) && priceParam > 0) {
        const priceInput = document.getElementById('price-amount');
        if (priceInput) priceInput.value = priceParam;

        const basisParam = params.get('basis');
        if (basisParam && COST_BASES[basisParam]) {
            const basisSelect = document.getElementById('price-basis');
            if (basisSelect) basisSelect.value = basisParam;
        }

        const deliveryParam = parseFloat(params.get('delivery'));
        if (!isNaN(deliveryParam) && deliveryParam >= 0) {
            const deliveryInput = document.getElementById('delivery-fee');
            if (deliveryInput) deliveryInput.value = deliveryParam;
        }

        const taxParam = parseFloat(params.get('tax'));
        if (!isNaN(taxParam) && taxParam >= 0 && taxParam <= MAX_TAX_RATE) {
            const taxInput = document.getElementById('tax-rate');
            if (taxInput) taxInput.value = taxParam;
        }
    }
}

// ========================================
// INITIALIZATION
// ========================================

// Set initial values
loadQueryParams();
currentMaterial = document.getElementById('material-select').value;
updateUnitUI(); // Set labels, ticks, example badge and unit data attribute
updateDepth(); // Set initial depth display
syncWasteUI(); // Set initial waste display from any URL parameter
syncCompactionUI(); // Set initial compaction display and preset from any URL parameter
// Baseline the allowance trackers after any URL restore so clicking an
// already-active preset or releasing the slider unchanged emits nothing.
lastTrackedWastePercent = currentWastePercent;
lastTrackedCompactionPercent = currentCompactionPercent;

// ========================================
// PRINT & EXPORT LOGIC
// ========================================

let lastPrintTrackedTime = 0;

/**
 * Tracks the print action with a cooldown to prevent duplicate events
 * if both a button click and beforeprint fire.
 */
function trackPrintAction() {
    const now = Date.now();
    if (now - lastPrintTrackedTime > 2000) {
        lastPrintTrackedTime = now;
        trackEvent('print', { material: currentMaterial });
    }
}

/**
 * Prepares the hidden print layout with current data.
 */
function preparePrintView(options) {
    if (!options || options.trackPrint !== false) {
        trackPrintAction();
    }
    if (!lastResults) {
        // The first print action can theoretically arrive before the initial
        // calculation has run; make sure the sheet has values either way.
        performCalculation();
    }

    const results = lastResults || (ENGINE
        ? ENGINE.calculateFromState(ENGINE.defaultState())
        : {
            volumeCuYd: 0.9259259259259259,
            volumeM3: 0.708,
            weightShortTons: 1.3125,
            weightKg: 1190.68,
            weightMetricTonnes: 1.19068,
            bags: 53,
            bags25kg: 48,
            areaSqFt: 100,
            areaSqM: 100 / SQ_FT_PER_SQ_M,
            baseVolumeCuYd: 0.9259259259259259,
            baseVolumeM3: 0.708,
            baseWeightShortTons: 1.3125,
            baseWeightKg: 1190.68,
            baseWeightMetricTonnes: 1.19068
        });
    const display = buildResultDisplay(results);
    const metric = currentUnit === 'metric';

    // 1. Date & Reference
    const dateOpts = { year: 'numeric', month: 'short', day: 'numeric' };
    const today = new Date();
    setTextContent('print-date', today.toLocaleDateString('en-US', dateOpts));
    const refDatePart = today.getFullYear() +
        String(today.getMonth() + 1).padStart(2, '0') +
        String(today.getDate()).padStart(2, '0');
    setTextContent('print-ref', 'PGC-' + refDatePart);

    // 2. Material & Density
    const matSelect = document.getElementById('material-select');
    if (matSelect) {
        setTextContent('print-material', matSelect.options[matSelect.selectedIndex].text);
    }
    const densityLb = results.densityLbPerCuFt || (DENSITIES[currentMaterial] || 105);
    const densityKg = Math.round((27 * densityLb * KG_PER_LB) / M3_PER_CU_YD);
    setTextContent('print-density', densityLb + ' lb/ft³ · ≈ ' + densityKg.toLocaleString('en-US') + ' kg/m³');

    // 3. Shape & Calculated Area & Dimensions & Depth
    const shapeLabels = ENGINE && ENGINE.SHAPE_LABELS
        ? ENGINE.SHAPE_LABELS
        : { rectangle: 'Rectangle', circle: 'Circle', lshape: 'L-Shape' };
    setTextContent('print-shape', shapeLabels[currentShape] || currentShape);

    const areaSqFt = results.areaSqFt || 0;
    const areaSqM = results.areaSqM || (areaSqFt / SQ_FT_PER_SQ_M);
    setTextContent('print-area', metric
        ? formatDecimal(areaSqM, 2) + ' m² (' + formatDecimal(areaSqFt, 2) + ' sq ft)'
        : formatDecimal(areaSqFt, 2) + ' sq ft (' + formatDecimal(areaSqM, 2) + ' m²)');

    const uLarge = metric ? 'm' : 'ft';
    const uSmall = metric ? 'cm' : 'in';
    const pair = (large, small) => `${large || 0} ${uLarge} ${small || 0} ${uSmall}`;

    let dimString = '';

    if (currentShape === 'rectangle') {
        const lF = document.getElementById('rect-length-ft').value;
        const lI = document.getElementById('rect-length-in').value;
        const wF = document.getElementById('rect-width-ft').value;
        const wI = document.getElementById('rect-width-in').value;
        dimString = `Length: ${pair(lF, lI)}, Width: ${pair(wF, wI)}`;
    } else if (currentShape === 'circle') {
        const dF = document.getElementById('circle-diameter-ft').value;
        const dI = document.getElementById('circle-diameter-in').value;
        dimString = `Diameter: ${pair(dF, dI)}`;
    } else if (currentShape === 'lshape') {
        const aLF = document.getElementById('lshape-a-length-ft').value;
        const aLI = document.getElementById('lshape-a-length-in').value;
        const aWF = document.getElementById('lshape-a-width-ft').value;
        const aWI = document.getElementById('lshape-a-width-in').value;
        const bLF = document.getElementById('lshape-b-length-ft').value;
        const bLI = document.getElementById('lshape-b-length-in').value;
        const bWF = document.getElementById('lshape-b-width-ft').value;
        const bWI = document.getElementById('lshape-b-width-in').value;
        dimString = `Section A: ${pair(aLF, aLI)} × ${pair(aWF, aWI)} | Section B: ${pair(bLF, bLI)} × ${pair(bWF, bWI)}`;
    }

    const depthLabel = ENGINE && typeof ENGINE.formatDepth === 'function'
        ? ENGINE.formatDepth(currentDepthInches, currentUnit)
        : (metric ? `${Math.round(currentDepthInches * 25.4)} mm` : `${currentDepthInches} in`);
    setTextContent('print-dims', dimString);
    setTextContent('print-depth', depthLabel);

    // 4. Allowances
    setTextContent('print-waste', currentWastePercent + '%');
    setTextContent('print-compaction', currentCompactionPercent + '%');

    // 5. Results (primary values follow the selected unit; the other system is
    // shown underneath so the printed sheet is useful to both audiences).
    setTextContent('print-volume', display.volume);
    setTextContent('print-volume-unit', display.volumeUnitLong);
    setTextContent('print-volume-alt', display.volumeAltText);
    setTextContent('print-weight', display.weight);
    setTextContent('print-weight-unit', display.weightUnitLong);
    setTextContent('print-weight-alt', display.weightAltText);
    setTextContent('print-bags', display.bags);
    setTextContent('print-bags-unit', display.bagsUnitShort);
    setTextContent('print-bags-alt', display.bagsAltText);
    setTextContent('print-pallets', display.pallets + (display.pallets === '1' ? ' pallet' : ' pallets'));
    setTextContent('print-pallets-breakdown', BAGS_PER_PALLET + ' bags/pallet · ' + display.palletsBreakdown);
    setTextContent('print-coverage-rate', display.bagsPerVol + ' ' + (metric ? 'bags/m³' : 'bags/yd³') + ' · ' + display.bagsPerWeight + ' ' + (metric ? 'bags/tonne' : 'bags/ton'));

    // Base quantities (before allowances)
    const hasAllowances = (currentWastePercent > 0 || currentCompactionPercent > 0);
    const baseVolRow = document.getElementById('print-base-volume-row');
    if (baseVolRow) baseVolRow.style.display = hasAllowances ? 'block' : 'none';
    setTextContent('print-base-volume', display.baseVolume);

    const baseWeightRow = document.getElementById('print-base-weight-row');
    if (baseWeightRow) baseWeightRow.style.display = hasAllowances ? 'block' : 'none';
    setTextContent('print-base-weight', display.baseWeight);

    // 6. Notes & Instructions
    const printAllowanceNote = document.getElementById('print-allowance-note');
    if (printAllowanceNote) {
        printAllowanceNote.textContent = hasAllowances
            ? 'The recommended order quantities include ' +
              describeAllowances(currentWastePercent, currentCompactionPercent) + ' over the base geometric area.'
            : 'No allowances are included. For uneven terrain, spillage or machine compaction, suppliers recommend ordering 10% extra.';
    }

    const depthNote = document.getElementById('print-depth-note');
    if (depthNote) {
        if (currentDepthInches < 2) {
            depthNote.textContent = 'Specified depth (' + depthLabel + ') is a decorative skim. Walking paths typically need 2–3 in (50–75 mm); driveways need 4–6 in (100–150 mm).';
        } else if (currentDepthInches >= 4) {
            depthNote.textContent = 'Specified depth (' + depthLabel + ') is suitable for vehicular driveways and structural base courses over prepared subgrade.';
        } else {
            depthNote.textContent = 'Specified depth (' + depthLabel + ') is suitable for pedestrian walkways, garden paths and patio borders.';
        }
    }

    // 7. Cost breakdown
    updateCostEstimate(results);

    // 8. Re-open / Share URL
    const shareUrl = typeof getShareURL === 'function' ? getShareURL() : window.location.href;
    const reopenLink = document.getElementById('print-project-url');
    if (reopenLink) {
        reopenLink.href = shareUrl;
        reopenLink.textContent = shareUrl;
    }
}

// Hook into window print event
window.addEventListener('beforeprint', preparePrintView);

/**
 * Lazy loads html2pdf and generates a PDF from the print layout.
 * Accepts the clicked button so desktop and mobile controls both work.
 */
function generatePDF(trigger) {
    const btn = trigger && trigger.nodeType === 1
        ? trigger
        : document.getElementById('btn-pdf');
    if (!btn || btn.disabled) return;

    const originalContent = btn.innerHTML;
    const status = document.getElementById('pdf-status');

    function setStatus(message) {
        if (status) status.textContent = message;
    }

    function restoreButton() {
        btn.innerHTML = originalContent;
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
    }

    function showError(message) {
        setStatus(message);
        if (typeof showShareFeedback === 'function') {
            showShareFeedback(message, false);
        }
        restoreButton();
    }

    btn.innerHTML =
        '<svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
            '<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>' +
            '<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>' +
        '</svg><span>Generating…</span>';
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    setStatus('Preparing the PDF. This can take a few seconds.');

    // Load the PDF library only when the visitor needs it.
    if (!window.html2pdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = function () {
            if (typeof window.html2pdf === 'function') {
                createPdf(btn, originalContent, setStatus, showError);
            } else {
                showError('The PDF library did not load. Use Print instead, or try again.');
            }
        };
        script.onerror = function () {
            showError('The PDF library could not be loaded. Use Print instead, or check your connection.');
        };
        document.head.appendChild(script);
    } else {
        createPdf(btn, originalContent, setStatus, showError);
    }
}

function createPdf(btn, originalContent, setStatus, showError) {
    // A PDF export reports pdf_download; do not also count it as a print.
    preparePrintView({ trackPrint: false });

    // Get the hidden print wrapper
    const element = document.getElementById('invoice-wrapper');

    // 1. Create a temporary container to hold the clone
    // This ensures we are capturing a clean view starting at (0,0)
    // independent of the user's current scroll position.
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.minHeight = '100vh';
    container.style.zIndex = '9999';
    container.style.background = '#ffffff';
    container.style.pointerEvents = 'none'; // Prevent interaction

    // VISUALS: Center the content in the white overlay
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'flex-start'; // Top alignment looks better for invoices
    container.style.paddingTop = '40px';

    // 2. Clone the element
    const clone = element.cloneNode(true);
    clone.classList.remove('hidden', 'print:block');
    clone.style.display = 'block';
    // Max Width constraint for readability, but 100% to fill PDF width if needed
    clone.style.width = '100%';
    clone.style.maxWidth = '800px';
    clone.style.margin = '0 auto';
    clone.style.padding = '40px';
    clone.style.boxSizing = 'border-box';

    // VISUALS: Center Text Elements specifically
    // Center the Header Area
    const headerDiv = clone.querySelector('.flex.justify-between.items-center');
    if (headerDiv) {
        // Change from row flex to column centered
        headerDiv.classList.remove('flex', 'justify-between', 'items-center', 'border-b-2');
        headerDiv.classList.add('text-center', 'border-b-2', 'pb-4', 'mb-8');

        // Find the date and move it or style it
        // The structure is Div(Title, Subtitle) + Div(Date Label, Date Value)
        // Let's just center text everything.
        const headerChildren = headerDiv.children;
        for (let child of headerChildren) {
            child.style.textAlign = 'center';
            child.classList.remove('text-right'); // Remove right align from date block
            child.style.marginBottom = '10px';
        }
    }

    // Center "Project Summary" Title
    const summaryTitle = clone.querySelector('h2');
    if (summaryTitle) {
        summaryTitle.style.textAlign = 'center';
    }

    // 3. Append clone to container, and container to body
    container.appendChild(clone);
    document.body.appendChild(container);

    // The trigger button is already in its loading state.

    const opt = {
        margin: [0.4, 0.4, 0.4, 0.4], // Top, Left, Bottom, Right
        filename: 'Gravel_Order_Sheet_' + new Date().toISOString().split('T')[0] + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollY: 0, // Critical: force canvas to start at top
            scrollX: 0
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(clone).save().then(() => {
        // Cleanup
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
        btn.innerHTML = originalContent;
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        setStatus('PDF downloaded.');
        trackEvent('pdf_download', { material: currentMaterial });
    }).catch(err => {
        console.error(err);
        // Cleanup on error
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
        showError('The PDF could not be created. Use Print instead, or try again.');
    });
}

// ========================================
// STATE SERIALIZATION & SHARE TOOL
// ========================================

/**
 * Gathers the current calculator state from UI inputs for serialization.
 */
function getCurrentCalculatorState() {
    function readVal(id, fallback) {
        const el = document.getElementById(id);
        if (!el) return fallback !== undefined ? fallback : 0;
        const raw = el.value.trim();
        if (raw === '') return fallback !== undefined ? fallback : 0;
        const val = parseFloat(raw);
        return isFinite(val) && val >= 0 ? val : (fallback !== undefined ? fallback : 0);
    }

    const state = {
        unit: currentUnit === 'metric' ? 'metric' : 'imperial',
        shape: currentShape || 'rectangle',
        material: currentMaterial || 'pea_gravel',
        depthInches: Number(currentDepthInches) || 3,
        wastePercent: Number(currentWastePercent) || 0,
        compactionPercent: Number(currentCompactionPercent) || 0,
        bagSizeLb: Number(currentBagSizeLb) || 50,
        bagSizeKg: Number(currentBagSizeKg) || 25,
        dimensions: {
            rect: {
                lFt: readVal('rect-length-ft', 10),
                lIn: readVal('rect-length-in', 0),
                wFt: readVal('rect-width-ft', 10),
                wIn: readVal('rect-width-in', 0)
            },
            circle: {
                dFt: readVal('circle-diameter-ft', 0),
                dIn: readVal('circle-diameter-in', 0)
            },
            lshape: {
                aLFt: readVal('lshape-a-length-ft', 0),
                aLIn: readVal('lshape-a-length-in', 0),
                aWFt: readVal('lshape-a-width-ft', 0),
                aWIn: readVal('lshape-a-width-in', 0),
                bLFt: readVal('lshape-b-length-ft', 0),
                bLIn: readVal('lshape-b-length-in', 0),
                bWFt: readVal('lshape-b-width-ft', 0),
                bWIn: readVal('lshape-b-width-in', 0)
            }
        }
    };

    // Cost estimator fields (only serialized when a positive price is entered)
    const price = readCostValue('price-amount');
    if (price !== null && price > 0) {
        state.price = Math.round(price * 100) / 100;
        const basisSelect = document.getElementById('price-basis');
        if (basisSelect && basisSelect.value) {
            state.priceBasis = basisSelect.value;
        }
        const deliveryFee = readCostValue('delivery-fee');
        if (deliveryFee !== null && deliveryFee > 0) {
            state.deliveryFee = Math.round(deliveryFee * 100) / 100;
        }
        const taxRate = readCostValue('tax-rate');
        if (taxRate !== null && taxRate > 0) {
            state.taxRate = Math.min(MAX_TAX_RATE, Math.round(taxRate * 100) / 100);
        }
        const curSelect = document.getElementById('cost-currency');
        if (curSelect && curSelect.value) {
            state.currency = curSelect.value;
        }
    }

    return state;
}

/**
 * Builds the full shareable URL containing serialized calculator state.
 */
function getShareURL() {
    const state = getCurrentCalculatorState();
    let queryString = '';

    if (ENGINE && typeof ENGINE.serialize === 'function') {
        queryString = ENGINE.serialize(state);
    } else {
        const params = new URLSearchParams();
        params.set('unit', state.unit);
        params.set('shape', state.shape);
        params.set('material', state.material);
        params.set('depth', String(state.depthInches));

        const dims = state.dimensions || {};
        const rect = dims.rect || {};
        params.set('rect_l_ft', String(rect.lFt || 0));
        params.set('rect_l_in', String(rect.lIn || 0));
        params.set('rect_w_ft', String(rect.wFt || 0));
        params.set('rect_w_in', String(rect.wIn || 0));

        const circle = dims.circle || {};
        params.set('circle_d_ft', String(circle.dFt || 0));
        params.set('circle_d_in', String(circle.dIn || 0));

        const lshape = dims.lshape || {};
        params.set('l_a_l_ft', String(lshape.aLFt || 0));
        params.set('l_a_l_in', String(lshape.aLIn || 0));
        params.set('l_a_w_ft', String(lshape.aWFt || 0));
        params.set('l_a_w_in', String(lshape.aWIn || 0));
        params.set('l_b_l_ft', String(lshape.bLFt || 0));
        params.set('l_b_l_in', String(lshape.bLIn || 0));
        params.set('l_b_w_ft', String(lshape.bWFt || 0));
        params.set('l_b_w_in', String(lshape.bWIn || 0));

        if (state.wastePercent > 0) params.set('waste', String(state.wastePercent));
        if (state.compactionPercent > 0) params.set('compaction', String(state.compactionPercent));
        if (state.bagSizeLb && state.bagSizeLb !== 50) params.set('bag', String(state.bagSizeLb));
        if (state.bagSizeKg && state.bagSizeKg !== 25) params.set('bag_kg', String(state.bagSizeKg));

        if (state.price && state.price > 0) {
            params.set('price', String(state.price));
            if (state.priceBasis) params.set('basis', state.priceBasis);
            if (state.deliveryFee > 0) params.set('delivery', String(state.deliveryFee));
            if (state.taxRate > 0) params.set('tax', String(state.taxRate));
            if (state.currency) params.set('cur', state.currency);
        }
        queryString = params.toString();
    }

    const base = window.location.origin + window.location.pathname;
    return queryString ? (base + '?' + queryString) : base;
}

if (typeof window !== 'undefined') {
    window.getCurrentCalculatorState = getCurrentCalculatorState;
    window.getShareURL = getShareURL;
    window.updateWarningsUI = updateWarningsUI;
    window.trackEvent = trackEvent;
    window.trackCostEstimate = trackCostEstimate;
    window.trackPrintAction = trackPrintAction;
}

/**
 * Shares the calculator tool using Web Share API or clipboard fallback.
 * Serializes the exact current project state so the recipient sees identical results.
 */
function shareTool() {
    const shareUrl = getShareURL();

    // Update browser address bar without reload
    if (window.history && typeof window.history.replaceState === 'function') {
        window.history.replaceState(null, '', shareUrl);
    }

    const shareData = {
        title: 'Pro Gravel & Aggregate Calculator',
        text: 'Calculate cubic yards, tons, and bags needed for your gravel project with this free professional tool!',
        url: shareUrl
    };

    // Try Web Share API first (works on mobile and supported desktop browsers)
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => {
                trackEvent('share', { method: 'web_share' });
                showShareFeedback('Project link shared!', true);
            })
            .catch((err) => {
                // User cancelled or error - fallback to clipboard if not explicit cancellation
                if (err.name !== 'AbortError') {
                    copyToClipboard(shareUrl);
                }
            });
    } else {
        // Fallback: Copy URL to clipboard
        copyToClipboard(shareUrl);
    }
}

/**
 * Copies the serialized project URL to clipboard and shows feedback.
 * Accepts an optional url string, defaulting to getShareURL().
 */
function copyToClipboard(customUrl) {
    const url = customUrl || getShareURL();

    // Update browser address bar
    if (window.history && typeof window.history.replaceState === 'function') {
        window.history.replaceState(null, '', url);
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(url).then(() => {
            showShareFeedback('Project link copied to clipboard!', true);
            trackEvent('share', { method: 'clipboard' });
        }).catch(() => {
            fallbackClipboardCopy(url);
        });
    } else {
        fallbackClipboardCopy(url);
    }
}

/**
 * Legacy textarea fallback for browsers without navigator.clipboard support.
 */
function fallbackClipboardCopy(url) {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        showShareFeedback('Project link copied to clipboard!', true);
        trackEvent('share', { method: 'clipboard_fallback' });
    } catch (err) {
        showShareFeedback('Could not copy link', false);
    }

    document.body.removeChild(textArea);
}

/**
 * Shows a temporary toast notification for share feedback
 */
function showShareFeedback(message, success) {
    // Remove any existing toast
    const existingToast = document.getElementById('share-toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.id = 'share-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        z-index: 9999;
        animation: fadeInUp 0.3s ease-out;
        ${success
            ? 'background: #10B981; color: white;'
            : 'background: #EF4444; color: white;'}
    `;
    toast.textContent = message;

    // Add animation keyframes if not already present
    if (!document.getElementById('share-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'share-toast-styles';
        style.textContent = `
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            @keyframes fadeOutDown {
                from { opacity: 1; transform: translateX(-50%) translateY(0); }
                to { opacity: 0; transform: translateX(-50%) translateY(20px); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Remove after 2.5 seconds with fade out animation
    setTimeout(() => {
        toast.style.animation = 'fadeOutDown 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

/**
 * Monitors advertisement slots and shows them only when an ad is actually loaded.
 */
function initAdObserver() {
    const adContainers = document.querySelectorAll('.ad-container');

    adContainers.forEach(container => {
        const slot = container.closest('.ad-slot');
        if (!slot) return;

        function checkAd() {
            // Check if there is an iframe inside the container
            const hasIframe = container.querySelector('iframe') !== null;

            // Check if there is an ins element with data-ad-status="filled"
            const insElement = container.querySelector('ins.adsbygoogle');
            const isFilled = insElement && insElement.getAttribute('data-ad-status') === 'filled';

            // General check: does it have any non-empty element that is not a comment/script?
            const hasRealContent = Array.from(container.children).some(child => {
                const tagName = child.tagName.toLowerCase();
                // Ignore script tags
                if (tagName === 'script') return false;
                // If it's an ins tag, check if it has children (like an iframe) or is marked as filled
                if (tagName === 'ins') {
                    return child.children.length > 0 || child.getAttribute('data-ad-status') === 'filled';
                }
                return true;
            });

            if (hasIframe || isFilled || hasRealContent) {
                slot.classList.add('ad-filled');
            } else {
                slot.classList.remove('ad-filled');
            }
        }

        // Run initial check
        checkAd();

        // Create observer to watch for dynamic insertions (like AdSense loading)
        const observer = new MutationObserver(() => {
            checkAd();
        });

        observer.observe(container, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-ad-status']
        });
    });
}

// Initialize ad observer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdObserver);
} else {
    initAdObserver();
}
