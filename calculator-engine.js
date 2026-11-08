/**
 * Pro Gravel Calculator — shared calculation engine.
 *
 * One source of truth for material densities, geometry, volume/weight/bag math,
 * URL state serialisation, order-sheet data and assumption warnings.
 *
 * The engine has no DOM dependencies. It runs in the browser as
 * `window.GravelEngine` and in Node (`require('./calculator-engine.js')`) so the
 * same maths can be regression-tested.
 *
 * Rules preserved from the original homepage calculator:
 *   volume (yd³) = area (ft²) × depth (ft) ÷ 27
 *   short tons   = volume (yd³) × 27 × density (lb/ft³) ÷ 2,000
 *   bags         = ceil(total pounds ÷ bag size)
 *
 * At 0% waste and 0% compaction every output matches the pre-engine calculator.
 */
(function (root, factory) {
    'use strict';

    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.GravelEngine = factory();
    }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    var UNIT_IMPERIAL = 'imperial';
    var UNIT_METRIC = 'metric';

    var LB_PER_SHORT_TON = 2000;
    var LB_PER_KG = 2.2046226218487757;
    var KG_PER_LB = 0.45359237;
    var KG_PER_CU_M_PER_LB_PER_CU_FT = 16.018463373960142;
    var CU_FT_PER_CU_YD = 27;
    var M3_PER_CU_YD = 0.764554857984;
    var SQ_FT_PER_SQ_M = 10.76391041671;

    var DEFAULT_BAG_LB = 50;
    var DEFAULT_BAG_KG = 25;
    var BAGS_PER_PALLET = 40;

    /**
     * Typical loose bulk densities used by the calculator.
     *
     * These intentionally match the values published on /about.html and must not
     * be changed without updating that page and the density chart.
     * `source` is a short provenance note; supplier test data always wins.
     */
    var MATERIALS = {
        pea_gravel: {
            key: 'pea_gravel',
            label: 'Pea Gravel',
            densityLbPerCuFt: 105,
            densityRange: [95, 115],
            use: 'Paths, patios, playgrounds and decorative borders',
            source: 'Typical loose bulk density for pea gravel; confirm with the supplier.'
        },
        crushed_stone: {
            key: 'crushed_stone',
            label: 'Crushed Stone',
            densityLbPerCuFt: 100,
            densityRange: [90, 110],
            use: 'Driveways, base layers and drainage',
            source: 'Typical loose bulk density for crushed stone; compacted stone weighs more.'
        },
        sand: {
            key: 'sand',
            label: 'Sand',
            densityLbPerCuFt: 110,
            densityRange: [100, 120],
            use: 'Bedding, jointing sand and fill',
            source: 'Typical loose bulk density for masonry sand; moisture increases weight.'
        },
        river_rock: {
            key: 'river_rock',
            label: 'River Rock',
            densityLbPerCuFt: 108,
            densityRange: [95, 120],
            use: 'Decorative beds, dry creeks and borders',
            source: 'Typical loose bulk density for rounded river rock; shape and moisture vary.'
        }
    };

    /** Broad sanity guard for custom densities supplied by a caller. */
    var SANITY_DENSITY_RANGE = [60, 140];

    var SHAPE_LABELS = {
        rectangle: 'Rectangle',
        circle: 'Circle',
        lshape: 'L-Shape'
    };

    var SHAPE_KEYS = ['rectangle', 'circle', 'lshape'];

    // ---------------------------------------------------------------------
    // Generic helpers
    // ---------------------------------------------------------------------

    function clampNumber(value, minimum, maximum, fallback) {
        if (value === null || value === undefined || value === '') return fallback;
        var number = Number(value);
        if (!isFinite(number)) return fallback;
        return Math.min(maximum, Math.max(minimum, number));
    }

    function nonNegative(value) {
        var number = Number(value);
        if (!isFinite(number) || number < 0) return 0;
        return number;
    }

    function round(value, decimals) {
        var places = typeof decimals === 'number' ? decimals : 2;
        var factor = Math.pow(10, places);
        return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
    }

    function toFeet(largeValue, smallValue, unit) {
        var large = nonNegative(largeValue);
        var small = nonNegative(smallValue);
        if (unit === UNIT_METRIC) {
            return (large + (small / 100)) * 3.280839895013123;
        }
        return large + (small / 12);
    }

    function toInches(value, unit) {
        var number = nonNegative(value);
        return unit === UNIT_METRIC ? number / 2.54 : number;
    }

    function formatNumber(value, decimals) {
        var places = typeof decimals === 'number' ? decimals : 2;
        return round(value, places).toFixed(places);
    }

    function formatInteger(value) {
        return Math.round(nonNegative(value)).toLocaleString('en-US');
    }

    /**
     * Rounds up a bag/pallet count without turning floating-point noise into an
     * extra unit. 110.00000000000001 bags is 110, while 110.01 is 111.
     */
    function ceilQuantity(value) {
        var number = nonNegative(value);
        if (number === 0) return 0;
        var nearest = Math.round(number);
        var tolerance = Math.max(1e-9, Math.abs(number) * 1e-12);
        return Math.abs(number - nearest) <= tolerance ? nearest : Math.ceil(number);
    }

    // ---------------------------------------------------------------------
    // Materials
    // ---------------------------------------------------------------------

    function getMaterial(key) {
        return MATERIALS[key] || null;
    }

    function getMaterialList() {
        return Object.keys(MATERIALS).map(function (key) {
            return MATERIALS[key];
        });
    }

    function resolveDensity(input) {
        if (isFinite(Number(input.customDensityLbPerCuFt)) && Number(input.customDensityLbPerCuFt) > 0) {
            return Number(input.customDensityLbPerCuFt);
        }
        var material = getMaterial(input.material);
        return material ? material.densityLbPerCuFt : MATERIALS.pea_gravel.densityLbPerCuFt;
    }

    // ---------------------------------------------------------------------
    // Geometry
    // ---------------------------------------------------------------------

    /**
     * Resolves area in square feet.
     *
     * Accepts either `areaSqFt` directly or shape dimensions already converted to
     * feet:
     *   rectangle: { lengthFt, widthFt }
     *   circle:    { diameterFt }
     *   lshape:    { aLengthFt, aWidthFt, bLengthFt, bWidthFt }
     */
    function computeArea(shape, dimensions, explicitAreaSqFt) {
        if (isFinite(Number(explicitAreaSqFt)) && Number(explicitAreaSqFt) >= 0) {
            return nonNegative(explicitAreaSqFt);
        }

        var dims = dimensions || {};
        var area = 0;

        switch (shape) {
            case 'circle': {
                var radius = nonNegative(dims.diameterFt) / 2;
                area = Math.PI * radius * radius;
                break;
            }
            case 'lshape':
                area = (nonNegative(dims.aLengthFt) * nonNegative(dims.aWidthFt)) +
                    (nonNegative(dims.bLengthFt) * nonNegative(dims.bWidthFt));
                break;
            case 'rectangle':
            default:
                area = nonNegative(dims.lengthFt) * nonNegative(dims.widthFt);
                break;
        }

        return area;
    }

    function toCubicYards(cubicFeet) {
        return nonNegative(cubicFeet) / CU_FT_PER_CU_YD;
    }

    function toShortTons(cubicFeet, densityLbPerCuFt) {
        return (nonNegative(cubicFeet) * nonNegative(densityLbPerCuFt)) / LB_PER_SHORT_TON;
    }

    // ---------------------------------------------------------------------
    // Core calculation
    // ---------------------------------------------------------------------

    /**
     * Calculates every material output for a project.
     *
     * @param {Object} input
     * @param {string} [input.shape='rectangle']   rectangle | circle | lshape
     * @param {Object} [input.dimensions]          dimensions in feet (see computeArea)
     * @param {number} [input.areaSqFt]            optional pre-computed area
     * @param {number} [input.depthInches=3]       depth in inches
     * @param {string} [input.material='pea_gravel']
     * @param {number} [input.customDensityLbPerCuFt]
     * @param {string} [input.unit='imperial']     label context (imperial | metric)
     * @param {number} [input.wastePercent=0]      0–25
     * @param {number} [input.compactionPercent=0] 0–20
     * @param {number} [input.bagSizeLb=50]
     * @param {number} [input.bagSizeKg=25]
     * @returns {Object} raw and formatted results
     */
    function calculate(input) {
        var options = input || {};
        var shape = SHAPE_KEYS.indexOf(options.shape) >= 0 ? options.shape : 'rectangle';
        var material = getMaterial(options.material) ? options.material : 'pea_gravel';
        var materialRecord = MATERIALS[material];
        var unit = options.unit === UNIT_METRIC ? UNIT_METRIC : UNIT_IMPERIAL;

        var depthInches = clampNumber(options.depthInches, 0, 240, 3);
        var depthFeet = depthInches / 12;

        var wastePercent = clampNumber(options.wastePercent, 0, 25, 0);
        var compactionPercent = clampNumber(options.compactionPercent, 0, 20, 0);
        var wasteMultiplier = 1 + (wastePercent / 100);
        var compactionMultiplier = 1 + (compactionPercent / 100);

        var bagSizeLb = clampNumber(options.bagSizeLb, 1, 100, DEFAULT_BAG_LB);
        var bagSizeKg = clampNumber(options.bagSizeKg, 1, 100, DEFAULT_BAG_KG);
        var bagsPerPallet = clampNumber(options.bagsPerPallet, 1, 200, BAGS_PER_PALLET);

        var densityLbPerCuFt = resolveDensity(options);
        var areaSqFt = computeArea(shape, options.dimensions, options.areaSqFt);

        var baseVolumeCuFt = areaSqFt * depthFeet;
        var baseVolumeCuYd = toCubicYards(baseVolumeCuFt);

        var adjustedVolumeCuFt = baseVolumeCuFt * wasteMultiplier * compactionMultiplier;
        var adjustedVolumeCuYd = toCubicYards(adjustedVolumeCuFt);

        var baseWeightLb = baseVolumeCuFt * densityLbPerCuFt;
        var baseWeightKg = baseWeightLb * KG_PER_LB;
        var baseWeightShortTons = baseWeightLb / LB_PER_SHORT_TON;

        var weightLb = adjustedVolumeCuFt * densityLbPerCuFt;
        var weightShortTons = weightLb / LB_PER_SHORT_TON;
        var weightKg = weightLb * KG_PER_LB;
        var weightMetricTonnes = weightKg / 1000;

        var bags = weightLb > 0 ? ceilQuantity(weightLb / bagSizeLb) : 0;
        var bags25kg = weightKg > 0 ? ceilQuantity(weightKg / bagSizeKg) : 0;

        var pallets = bags > 0 ? Math.ceil(bags / bagsPerPallet) : 0;
        var fullPallets = bags > 0 ? Math.floor(bags / bagsPerPallet) : 0;
        var looseBags = bags > 0 ? (bags % bagsPerPallet) : 0;

        var palletsMetric = bags25kg > 0 ? Math.ceil(bags25kg / bagsPerPallet) : 0;
        var fullPalletsMetric = bags25kg > 0 ? Math.floor(bags25kg / bagsPerPallet) : 0;
        var looseBagsMetric = bags25kg > 0 ? (bags25kg % bagsPerPallet) : 0;

        var weightPerCuYd = CU_FT_PER_CU_YD * densityLbPerCuFt;
        var bagsPerCuYd = round(weightPerCuYd / bagSizeLb, 1);
        var bagsPerShortTon = round(LB_PER_SHORT_TON / bagSizeLb, 1);

        var densityKgPerCuM = (weightPerCuYd * KG_PER_LB) / M3_PER_CU_YD;
        var bagsPerCuM = round(densityKgPerCuM / bagSizeKg, 1);
        var bagsPerMetricTonne = round(1000 / bagSizeKg, 1);

        return {
            shape: shape,
            shapeLabel: SHAPE_LABELS[shape],
            material: material,
            materialLabel: materialRecord.label,
            unit: unit,
            densityLbPerCuFt: densityLbPerCuFt,
            areaSqFt: areaSqFt,
            areaSqM: areaSqFt / SQ_FT_PER_SQ_M,
            depthInches: depthInches,
            depthFeet: depthFeet,
            depthCm: depthInches * 2.54,
            wastePercent: wastePercent,
            compactionPercent: compactionPercent,
            wasteMultiplier: wasteMultiplier,
            compactionMultiplier: compactionMultiplier,
            baseVolumeCuFt: baseVolumeCuFt,
            baseVolumeCuYd: baseVolumeCuYd,
            baseVolumeM3: baseVolumeCuYd * M3_PER_CU_YD,
            baseWeightLb: baseWeightLb,
            baseWeightKg: baseWeightKg,
            baseWeightShortTons: baseWeightShortTons,
            baseWeightMetricTonnes: baseWeightKg / 1000,
            volumeCuFt: adjustedVolumeCuFt,
            volumeCuYd: adjustedVolumeCuYd,
            volumeM3: adjustedVolumeCuYd * M3_PER_CU_YD,
            weightLb: weightLb,
            weightShortTons: weightShortTons,
            weightKg: weightKg,
            weightMetricTonnes: weightMetricTonnes,
            bagSizeLb: bagSizeLb,
            bagSizeKg: bagSizeKg,
            bagsPerPallet: bagsPerPallet,
            bags: bags,
            bags25kg: bags25kg,
            pallets: pallets,
            fullPallets: fullPallets,
            looseBags: looseBags,
            palletsMetric: palletsMetric,
            fullPalletsMetric: fullPalletsMetric,
            looseBagsMetric: looseBagsMetric,
            bagsPerCuYd: bagsPerCuYd,
            bagsPerShortTon: bagsPerShortTon,
            bagsPerCuM: bagsPerCuM,
            bagsPerMetricTonne: bagsPerMetricTonne,
            hasVolume: adjustedVolumeCuFt > 0
        };
    }

    // ---------------------------------------------------------------------
    // Bulk vs Bag comparison
    // ---------------------------------------------------------------------

    /**
     * Compares the total cost of purchasing in bulk vs purchasing in bags.
     *
     * @param {Object} results - output from calculate()
     * @param {Object} bulk - { price: number, basis: string, deliveryFee: number, taxRate: number }
     *   basis options: 'short_ton' | 'cubic_yard' | 'metric_tonne' | 'cubic_metre'
     * @param {Object} bag - { price: number, deliveryFee: number, taxRate: number, bagCount: number }
     * @returns {Object|null} comparison details or null if either price is invalid
     */
    function compareBulkVsBag(results, bulk, bag) {
        if (!results || !bulk || !bag) return null;

        var bulkPrice = Number(bulk.price);
        var bagPrice = Number(bag.price);
        if (!isFinite(bulkPrice) || bulkPrice <= 0 || !isFinite(bagPrice) || bagPrice <= 0) {
            return null;
        }

        var bulkBasis = bulk.basis || (results.unit === UNIT_METRIC ? 'metric_tonne' : 'short_ton');
        var bulkQuantity = 0;
        if (bulkBasis === 'short_ton') bulkQuantity = results.weightShortTons;
        else if (bulkBasis === 'cubic_yard') bulkQuantity = results.volumeCuYd;
        else if (bulkBasis === 'metric_tonne') bulkQuantity = results.weightMetricTonnes;
        else if (bulkBasis === 'cubic_metre') bulkQuantity = results.volumeM3;
        else bulkQuantity = results.weightShortTons;

        var roundedBulkQty = round(bulkQuantity, 2);
        var bulkDeliveryFee = Math.max(0, Number(bulk.deliveryFee) || 0);
        var bulkTaxRate = Math.max(0, Number(bulk.taxRate) || 0);

        var bulkMaterialCost = round(roundedBulkQty * bulkPrice, 2);
        var bulkTax = round((bulkMaterialCost + bulkDeliveryFee) * (bulkTaxRate / 100), 2);
        var bulkTotal = round(bulkMaterialCost + bulkDeliveryFee + bulkTax, 2);

        var bagCount = (bag.bagCount !== undefined && bag.bagCount !== null)
            ? Math.max(0, Number(bag.bagCount) || 0)
            : (results.unit === UNIT_METRIC ? results.bags25kg : results.bags);
        var bagDeliveryFee = Math.max(0, Number(bag.deliveryFee) || 0);
        var bagTaxRate = Math.max(0, Number(bag.taxRate) || 0);

        var bagMaterialCost = round(bagCount * bagPrice, 2);
        var bagTax = round((bagMaterialCost + bagDeliveryFee) * (bagTaxRate / 100), 2);
        var bagTotal = round(bagMaterialCost + bagDeliveryFee + bagTax, 2);

        var difference = round(Math.abs(bulkTotal - bagTotal), 2);
        var cheaper = 'equal';
        var savingsPercent = 0;

        if (bulkTotal < bagTotal) {
            cheaper = 'bulk';
            savingsPercent = bagTotal > 0 ? round((difference / bagTotal) * 100, 1) : 0;
        } else if (bagTotal < bulkTotal) {
            cheaper = 'bag';
            savingsPercent = bulkTotal > 0 ? round((difference / bulkTotal) * 100, 1) : 0;
        }

        return {
            bulk: {
                quantity: roundedBulkQty,
                basis: bulkBasis,
                price: bulkPrice,
                materialCost: bulkMaterialCost,
                deliveryFee: bulkDeliveryFee,
                tax: bulkTax,
                total: bulkTotal
            },
            bag: {
                quantity: bagCount,
                price: bagPrice,
                materialCost: bagMaterialCost,
                deliveryFee: bagDeliveryFee,
                tax: bagTax,
                total: bagTotal
            },
            difference: difference,
            cheaper: cheaper,
            savingsPercent: savingsPercent
        };
    }

    // ---------------------------------------------------------------------
    // Warnings
    // ---------------------------------------------------------------------

    /**
     * Returns assumption warnings for a project.
     * Severity is "info" or "warning"; callers decide how to display them.
     */
    function getWarnings(input, results) {
        var options = input || {};
        var calculated = results || calculate(options);
        var warnings = [];

        if (!calculated.hasVolume) {
            warnings.push({
                code: 'no-dimensions',
                level: 'info',
                message: 'Enter the area dimensions and depth to see an estimate.'
            });
            return warnings;
        }

        var isMetric = options.unit === UNIT_METRIC || calculated.unit === UNIT_METRIC;

        if (calculated.depthInches < 2) {
            warnings.push({
                code: 'depth-under-2',
                level: 'warning',
                message: isMetric
                    ? 'A depth under 50 mm (2 in) is a decorative skim. Walking paths usually need 50–75 mm (2–3 in) and driveways 100–150 mm (4–6 in).'
                    : 'A depth under 2 in is a decorative skim. Walking paths usually need 2–3 in and driveways 4–6 in.'
            });
        } else if (calculated.depthInches < 4 && calculated.depthInches >= 2) {
            warnings.push({
                code: 'depth-under-4',
                level: 'info',
                message: isMetric
                    ? 'If this is a driveway, 100–150 mm (4–6 in) is the usual compacted depth. Paths and borders are fine at 50–75 mm (2–3 in).'
                    : 'If this is a driveway, 4–6 in is the usual compacted depth. Paths and borders are fine at 2–3 in.'
            });
        }

        if (calculated.depthInches > 12) {
            warnings.push({
                code: 'depth-over-12',
                level: 'warning',
                message: isMetric
                    ? 'A depth over 300 mm (12 in) is unusual for a surface layer. Double-check whether dimensions are entered consistently.'
                    : 'A depth over 12 in is unusual for a surface layer. Double-check whether the area is measured in feet and metres consistently.'
            });
        }

        if (calculated.wastePercent === 0) {
            warnings.push({
                code: 'no-waste',
                level: 'info',
                message: 'No waste allowance is included. Ordering about 10% extra covers compaction, spillage and uneven ground.'
            });
        }

        if (calculated.compactionPercent > 0 && calculated.wastePercent > 0) {
            warnings.push({
                code: 'combined-allowances',
                level: 'info',
                message: 'Waste and compaction are applied one after the other, not added together. Confirm the total with your supplier.'
            });
        }

        if (isFinite(Number(options.customDensityLbPerCuFt)) && Number(options.customDensityLbPerCuFt) > 0) {
            var density = Number(options.customDensityLbPerCuFt);
            var densityMaterial = getMaterial(calculated.material) || MATERIALS.pea_gravel;
            var typicalRange = densityMaterial.densityRange || SANITY_DENSITY_RANGE;

            if (density < typicalRange[0] || density > typicalRange[1]) {
                var enteredDensity = formatNumber(density, 1) + ' lb/ft³' +
                    (isMetric
                        ? ' ≈ ' + formatNumber(density * KG_PER_CU_M_PER_LB_PER_CU_FT, 0) + ' kg/m³'
                        : '');
                var typicalDensity = typicalRange[0] + '–' + typicalRange[1] + ' lb/ft³' +
                    (isMetric
                        ? ' (' + formatNumber(typicalRange[0] * KG_PER_CU_M_PER_LB_PER_CU_FT, 0) + '–' +
                            formatNumber(typicalRange[1] * KG_PER_CU_M_PER_LB_PER_CU_FT, 0) + ' kg/m³)'
                        : '');
                var materialName = densityMaterial.label.toLowerCase();

                warnings.push({
                    code: 'density-out-of-range',
                    level: 'warning',
                    message: 'The entered density (' + enteredDensity + ') is outside the typical ' + typicalDensity +
                        ' range for ' + materialName + '. The calculator normally uses ' +
                        densityMaterial.densityLbPerCuFt + ' lb/ft³ for ' + materialName +
                        '; check the supplier sheet before ordering.'
                });
            }
        }

        return warnings;
    }

    // ---------------------------------------------------------------------
    // URL state serialisation
    // ---------------------------------------------------------------------

    var DIMENSION_PARAMS = [
        ['rect_l_ft', 'rect', 'lFt'],
        ['rect_l_in', 'rect', 'lIn'],
        ['rect_w_ft', 'rect', 'wFt'],
        ['rect_w_in', 'rect', 'wIn'],
        ['circle_d_ft', 'circle', 'dFt'],
        ['circle_d_in', 'circle', 'dIn'],
        ['l_a_l_ft', 'lshape', 'aLFt'],
        ['l_a_l_in', 'lshape', 'aLIn'],
        ['l_a_w_ft', 'lshape', 'aWFt'],
        ['l_a_w_in', 'lshape', 'aWIn'],
        ['l_b_l_ft', 'lshape', 'bLFt'],
        ['l_b_l_in', 'lshape', 'bLIn'],
        ['l_b_w_ft', 'lshape', 'bWFt'],
        ['l_b_w_in', 'lshape', 'bWIn']
    ];

    function defaultState() {
        return {
            unit: UNIT_IMPERIAL,
            shape: 'rectangle',
            material: 'pea_gravel',
            depthInches: 3,
            wastePercent: 0,
            compactionPercent: 0,
            bagSizeLb: DEFAULT_BAG_LB,
            dimensions: {
                rect: { lFt: 10, lIn: 0, wFt: 10, wIn: 0 },
                circle: { dFt: 0, dIn: 0 },
                lshape: {
                    aLFt: 0, aLIn: 0, aWFt: 0, aWIn: 0,
                    bLFt: 0, bLIn: 0, bWFt: 0, bWIn: 0
                }
            }
        };
    }

    function parseNumber(value, fallback) {
        if (value === null || value === undefined || value === '') return fallback;
        var number = Number(value);
        return isFinite(number) && number >= 0 ? number : fallback;
    }

    /**
     * Serialises calculator state to a query string.
     * Uses the same parameter names as the homepage loader for backwards
     * compatibility; new allowance parameters are only added when non-zero.
     */
    function serialize(state) {
        var source = state || defaultState();
        var dims = source.dimensions || {};
        var params = new URLSearchParams();

        params.set('unit', source.unit === UNIT_METRIC ? UNIT_METRIC : UNIT_IMPERIAL);
        params.set('shape', SHAPE_KEYS.indexOf(source.shape) >= 0 ? source.shape : 'rectangle');
        params.set('material', getMaterial(source.material) ? source.material : 'pea_gravel');
        params.set('depth', String(parseNumber(source.depthInches, 3)));

        DIMENSION_PARAMS.forEach(function (mapping) {
            var group = dims[mapping[1]] || {};
            var value = parseNumber(group[mapping[2]], 0);
            params.set(mapping[0], String(value));
        });

        if (parseNumber(source.wastePercent, 0) > 0) {
            params.set('waste', String(parseNumber(source.wastePercent, 0)));
        }
        if (parseNumber(source.compactionPercent, 0) > 0) {
            params.set('compaction', String(parseNumber(source.compactionPercent, 0)));
        }
        if (parseNumber(source.bagSizeLb, DEFAULT_BAG_LB) !== DEFAULT_BAG_LB) {
            params.set('bag', String(parseNumber(source.bagSizeLb, DEFAULT_BAG_LB)));
        }
        if (source.bagSizeKg !== undefined && parseNumber(source.bagSizeKg, DEFAULT_BAG_KG) !== DEFAULT_BAG_KG) {
            params.set('bag_kg', String(parseNumber(source.bagSizeKg, DEFAULT_BAG_KG)));
        }
        if (source.price !== null && source.price !== undefined && Number(source.price) > 0) {
            params.set('price', String(round(Number(source.price), 2)));
            if (source.priceBasis) {
                params.set('basis', source.priceBasis);
            }
            if (parseNumber(source.deliveryFee, 0) > 0) {
                params.set('delivery', String(round(Number(source.deliveryFee), 2)));
            }
            if (parseNumber(source.taxRate, 0) > 0) {
                params.set('tax', String(round(Number(source.taxRate), 2)));
            }
            if (source.currency) {
                params.set('cur', source.currency);
            }
        }

        return params.toString();
    }

    /**
     * Parses calculator state from a query string or URLSearchParams instance.
     * Unknown or invalid values fall back to the documented defaults.
     */
    function deserialize(search) {
        var params = search instanceof URLSearchParams
            ? search
            : new URLSearchParams(String(search || '').replace(/^\?/, ''));
        var state = defaultState();
        var unit = params.get('unit');
        var shape = params.get('shape');
        var material = params.get('material');

        if (unit === UNIT_METRIC || unit === UNIT_IMPERIAL) state.unit = unit;
        if (SHAPE_KEYS.indexOf(shape) >= 0) state.shape = shape;
        if (getMaterial(material)) state.material = material;

        state.depthInches = clampNumber(params.get('depth'), 0, 24, 3);
        state.wastePercent = clampNumber(params.get('waste'), 0, 25, 0);
        state.compactionPercent = clampNumber(params.get('compaction'), 0, 20, 0);
        state.bagSizeLb = clampNumber(params.get('bag'), 1, 100, DEFAULT_BAG_LB);
        if (params.get('bag_kg') !== null) {
            state.bagSizeKg = clampNumber(params.get('bag_kg'), 1, 100, DEFAULT_BAG_KG);
        }
        if (params.get('price') !== null) {
            var parsedPrice = parseNumber(params.get('price'), null);
            if (parsedPrice !== null && parsedPrice > 0) {
                state.price = round(parsedPrice, 2);
                if (params.get('basis') !== null) state.priceBasis = params.get('basis');
                if (params.get('delivery') !== null) state.deliveryFee = parseNumber(params.get('delivery'), 0);
                if (params.get('tax') !== null) state.taxRate = clampNumber(params.get('tax'), 0, 100, 0);
                if (params.get('cur') !== null) state.currency = params.get('cur');
            }
        }

        DIMENSION_PARAMS.forEach(function (mapping) {
            var group = state.dimensions[mapping[1]];
            var raw = params.get(mapping[0]);
            if (raw !== null) {
                group[mapping[2]] = parseNumber(raw, 0);
            }
        });

        return state;
    }

    function dimensionsFromState(state) {
        var source = state || defaultState();
        var dims = source.dimensions || {};
        var unit = source.unit === UNIT_METRIC ? UNIT_METRIC : UNIT_IMPERIAL;
        var rect = dims.rect || {};
        var circle = dims.circle || {};
        var lshape = dims.lshape || {};

        return {
            lengthFt: toFeet(rect.lFt, rect.lIn, unit),
            widthFt: toFeet(rect.wFt, rect.wIn, unit),
            diameterFt: toFeet(circle.dFt, circle.dIn, unit),
            aLengthFt: toFeet(lshape.aLFt, lshape.aLIn, unit),
            aWidthFt: toFeet(lshape.aWFt, lshape.aWIn, unit),
            bLengthFt: toFeet(lshape.bLFt, lshape.bLIn, unit),
            bWidthFt: toFeet(lshape.bWFt, lshape.bWIn, unit)
        };
    }

    /**
     * Convenience wrapper: state object in, full results out.
     */
    function calculateFromState(state) {
        var source = state || defaultState();
        return calculate({
            shape: source.shape,
            dimensions: dimensionsFromState(source),
            depthInches: source.depthInches,
            material: source.material,
            unit: source.unit,
            wastePercent: source.wastePercent,
            compactionPercent: source.compactionPercent,
            bagSizeLb: source.bagSizeLb,
            bagSizeKg: source.bagSizeKg
        });
    }

    // ---------------------------------------------------------------------
    // Order sheet (data for the PDF / print view)
    // ---------------------------------------------------------------------

    function formatDepth(inches, unit) {
        var value = nonNegative(inches);
        if (unit === UNIT_METRIC) {
            var mm = Math.round(value * 25.4);
            return mm < 100 ? mm + ' mm' : formatNumber(mm / 10, 1) + ' cm';
        }
        if (value < 12) return formatNumber(value, value % 1 === 0 ? 0 : 1) + ' in';
        var feet = Math.floor(value / 12);
        var remainder = round(value % 12, 1);
        if (remainder === 0) return feet + ' ft';
        return feet + ' ft ' + remainder + ' in';
    }

    function formatStateDimensions(state) {
        var source = state || defaultState();
        var dims = source.dimensions || {};
        var unit = source.unit === UNIT_METRIC ? 'm' : 'ft';
        var unitSmall = source.unit === UNIT_METRIC ? 'cm' : 'in';

        function pair(group, largeKey, smallKey) {
            var large = parseNumber(group[largeKey], 0);
            var small = parseNumber(group[smallKey], 0);
            return large + ' ' + unit + ' ' + small + ' ' + unitSmall;
        }

        if (source.shape === 'circle') {
            return 'Diameter: ' + pair(dims.circle || {}, 'dFt', 'dIn');
        }
        if (source.shape === 'lshape') {
            var lshape = dims.lshape || {};
            return 'Section A: ' + pair(lshape, 'aLFt', 'aLIn') + ' × ' + pair(lshape, 'aWFt', 'aWIn') +
                ' | Section B: ' + pair(lshape, 'bLFt', 'bLIn') + ' × ' + pair(lshape, 'bWFt', 'bWIn');
        }
        var rect = dims.rect || {};
        return 'Length: ' + pair(rect, 'lFt', 'lIn') + ' | Width: ' + pair(rect, 'wFt', 'wIn');
    }

    /**
     * Builds a complete, supplier-ready order sheet object.
     * The PDF step in task 2-8 can render this without re-doing any maths.
     */
    function generateOrderSheet(state, options) {
        var source = state || defaultState();
        var settings = options || {};
        var results = settings.results || calculateFromState(source);
        var warnings = settings.warnings || getWarnings({
            shape: source.shape,
            dimensions: dimensionsFromState(source),
            depthInches: source.depthInches,
            material: source.material,
            unit: source.unit,
            wastePercent: source.wastePercent,
            compactionPercent: source.compactionPercent,
            bagSizeLb: source.bagSizeLb,
            bagSizeKg: source.bagSizeKg
        }, results);

        var generatedAt = settings.generatedAt ? new Date(settings.generatedAt) : new Date();
        var url = settings.url || (typeof window !== 'undefined' && window.location ? window.location.href : '');
        var densityKgPerCuM = round((CU_FT_PER_CU_YD * results.densityLbPerCuFt * KG_PER_LB) / M3_PER_CU_YD, 0);

        return {
            title: 'Pro Gravel Calculator — Material Order Sheet',
            generatedAt: isNaN(generatedAt.getTime()) ? new Date().toISOString() : generatedAt.toISOString(),
            generatedDate: (isNaN(generatedAt.getTime()) ? new Date() : generatedAt)
                .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            url: url,
            material: results.materialLabel,
            density: results.densityLbPerCuFt + ' lb/ft³ (' + formatInteger(densityKgPerCuM) + ' kg/m³)',
            densityLbPerCuFt: results.densityLbPerCuFt,
            densityKgPerCuM: densityKgPerCuM,
            shape: results.shapeLabel,
            area: results.unit === UNIT_METRIC
                ? formatNumber(results.areaSqM, 2) + ' m² (' + formatNumber(results.areaSqFt, 2) + ' sq ft)'
                : formatNumber(results.areaSqFt, 2) + ' sq ft (' + formatNumber(results.areaSqM, 2) + ' m²)',
            dimensions: formatStateDimensions(source),
            depth: formatDepth(source.depthInches, source.unit),
            allowances: {
                wastePercent: results.wastePercent,
                compactionPercent: results.compactionPercent
            },
            cost: settings.cost || null,
            display: {
                volumeCuYd: formatNumber(results.volumeCuYd, 2),
                volumeM3: formatNumber(results.volumeM3, 2),
                weightShortTons: formatNumber(results.weightShortTons, 2),
                weightMetricTonnes: formatNumber(results.weightMetricTonnes, 2),
                weightKg: formatInteger(results.weightKg),
                bags: formatInteger(results.bags),
                bags25kg: formatInteger(results.bags25kg),
                pallets: formatInteger(results.pallets),
                palletsMetric: formatInteger(results.palletsMetric),
                fullPallets: results.fullPallets,
                looseBags: results.looseBags,
                fullPalletsMetric: results.fullPalletsMetric,
                looseBagsMetric: results.looseBagsMetric,
                bagSizeLb: results.bagSizeLb,
                bagSizeKg: results.bagSizeKg,
                bagsPerCuYd: results.bagsPerCuYd,
                bagsPerShortTon: results.bagsPerShortTon,
                bagsPerCuM: results.bagsPerCuM,
                bagsPerMetricTonne: results.bagsPerMetricTonne,
                areaSqFt: formatNumber(results.areaSqFt, 2),
                areaSqM: formatNumber(results.areaSqM, 2),
                baseVolumeCuYd: formatNumber(results.baseVolumeCuYd, 2),
                baseVolumeM3: formatNumber(results.baseVolumeM3, 2),
                baseWeightShortTons: formatNumber(results.baseWeightShortTons, 2),
                baseWeightMetricTonnes: formatNumber(results.baseWeightMetricTonnes, 2)
            },
            results: results,
            warnings: warnings
        };
    }

    return {
        VERSION: '1.0.0',
        MATERIALS: MATERIALS,
        SHAPE_LABELS: SHAPE_LABELS,
        BAGS_PER_PALLET: BAGS_PER_PALLET,
        DEFAULT_BAG_LB: DEFAULT_BAG_LB,
        DEFAULT_BAG_KG: DEFAULT_BAG_KG,
        getMaterial: getMaterial,
        getMaterialList: getMaterialList,
        toFeet: toFeet,
        toInches: toInches,
        computeArea: computeArea,
        calculate: calculate,
        calculateFromState: calculateFromState,
        compareBulkVsBag: compareBulkVsBag,
        getWarnings: getWarnings,
        serialize: serialize,
        deserialize: deserialize,
        dimensionsFromState: dimensionsFromState,
        defaultState: defaultState,
        formatDepth: formatDepth,
        generateOrderSheet: generateOrderSheet,
        round: round,
        formatNumber: formatNumber
    };
}));
