/**
 * Regression tests for calculator-engine.js.
 * Run with: npm test
 *
 * These tests lock the pre-engine homepage output at 0% waste / 0% compaction.
 */
'use strict';

const assert = require('assert');
const Engine = require('../calculator-engine.js');

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

function close(actual, expected, tolerance, label) {
    const delta = Math.abs(actual - expected);
    assert.ok(
        delta <= (tolerance === undefined ? 1e-9 : tolerance),
        (label || 'value') + ': expected ' + expected + ', got ' + actual
    );
}

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------

test('materials database exposes the four published densities', () => {
    const list = Engine.getMaterialList();
    assert.strictEqual(list.length, 4);
    assert.strictEqual(Engine.MATERIALS.pea_gravel.densityLbPerCuFt, 105);
    assert.strictEqual(Engine.MATERIALS.crushed_stone.densityLbPerCuFt, 100);
    assert.strictEqual(Engine.MATERIALS.sand.densityLbPerCuFt, 110);
    assert.strictEqual(Engine.MATERIALS.river_rock.densityLbPerCuFt, 108);
    list.forEach((material) => {
        assert.ok(material.use, material.key + ' needs a use note');
        assert.ok(material.source, material.key + ' needs a source note');
    });
});

// ---------------------------------------------------------------------------
// Default parity with the original calculator
// ---------------------------------------------------------------------------

test('default homepage input (10x10 ft, 3 in, pea gravel) matches legacy output', () => {
    const result = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 10, widthFt: 10 },
        depthInches: 3,
        material: 'pea_gravel'
    });

    close(result.areaSqFt, 100);
    close(result.baseVolumeCuYd, 25 / 27);
    close(result.weightShortTons, 1.3125);
    assert.strictEqual(result.bags, 53);
    assert.strictEqual(result.volumeCuYd.toFixed(2), '0.93');
    assert.strictEqual(result.weightShortTons.toFixed(2), '1.31');
});

test('crushed stone 10x10 ft at 3 in returns 1.25 tons and 50 bags', () => {
    const result = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 10, widthFt: 10 },
        depthInches: 3,
        material: 'crushed_stone'
    });
    close(result.weightShortTons, 1.25);
    assert.strictEqual(result.bags, 50);
});

test('circle area uses diameter, not radius', () => {
    const result = Engine.calculate({
        shape: 'circle',
        dimensions: { diameterFt: 10 },
        depthInches: 6,
        material: 'sand'
    });
    close(result.areaSqFt, Math.PI * 25);
    close(result.volumeCuYd, (Math.PI * 25 * 0.5) / 27);
    assert.strictEqual(result.bags, 87);
});

test('L-shape adds section A and section B', () => {
    const result = Engine.calculate({
        shape: 'lshape',
        dimensions: { aLengthFt: 10, aWidthFt: 10, bLengthFt: 5, bWidthFt: 4 },
        depthInches: 4,
        material: 'river_rock'
    });
    close(result.areaSqFt, 120);
    close(result.volumeCuYd, (120 * (4 / 12)) / 27);
    assert.strictEqual(result.bags, 87);
});

// ---------------------------------------------------------------------------
// Allowances
// ---------------------------------------------------------------------------

test('waste and compaction are independent multipliers', () => {
    const result = Engine.calculate({
        shape: 'rectangle',
        areaSqFt: 27,
        depthInches: 12,
        material: 'crushed_stone',
        wastePercent: 10,
        compactionPercent: 10
    });

    close(result.baseVolumeCuYd, 1);
    close(result.volumeCuYd, 1.21);
    close(result.weightShortTons, 1.6335);
    assert.strictEqual(result.bags, Math.ceil((1.21 * 27 * 100) / 50));
});

test('0% allowances preserve the exact base volume', () => {
    const base = Engine.calculate({
        shape: 'rectangle',
        areaSqFt: 27,
        depthInches: 12,
        material: 'crushed_stone'
    });
    const adjusted = Engine.calculate({
        shape: 'rectangle',
        areaSqFt: 27,
        depthInches: 12,
        material: 'crushed_stone',
        wastePercent: 0,
        compactionPercent: 0
    });
    assert.strictEqual(adjusted.volumeCuYd, base.volumeCuYd);
    assert.strictEqual(adjusted.weightShortTons, base.weightShortTons);
    assert.strictEqual(adjusted.bags, base.bags);
});

test('allowance ranges are clamped to the published limits', () => {
    const result = Engine.calculate({
        shape: 'rectangle',
        areaSqFt: 27,
        depthInches: 12,
        material: 'crushed_stone',
        wastePercent: 99,
        compactionPercent: 99
    });
    assert.strictEqual(result.wastePercent, 25);
    assert.strictEqual(result.compactionPercent, 20);
});

test('bag rounding ignores floating-point noise at exact multiples', () => {
    const result = Engine.calculate({
        shape: 'rectangle',
        areaSqFt: 100,
        depthInches: 6,
        material: 'crushed_stone',
        wastePercent: 10
    });
    close(result.weightLb, 5500, 1e-6);
    assert.strictEqual(result.bags, 110, 'exact 110-bag order must not round up to 111');
});

// ---------------------------------------------------------------------------
// Bags and metric outputs
// ---------------------------------------------------------------------------

test('bag size changes the bag count but not the volume or weight', () => {
    const fifty = Engine.calculate({
        shape: 'rectangle',
        areaSqFt: 100,
        depthInches: 3,
        material: 'crushed_stone'
    });
    const forty = Engine.calculate({
        shape: 'rectangle',
        areaSqFt: 100,
        depthInches: 3,
        material: 'crushed_stone',
        bagSizeLb: 40
    });
    close(fifty.volumeCuYd, forty.volumeCuYd);
    close(fifty.weightShortTons, forty.weightShortTons);
    assert.strictEqual(fifty.bags, 50);
    assert.strictEqual(forty.bags, 63);
});

test('metric outputs convert from the same weight', () => {
    const result = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: Engine.toFeet(1, 0, 'metric'), widthFt: Engine.toFeet(1, 0, 'metric') },
        depthInches: 12,
        material: 'crushed_stone'
    });

    close(result.volumeM3, 0.3048, 1e-6);
    close(result.weightKg, Engine.toFeet(1, 0, 'metric') * Engine.toFeet(1, 0, 'metric') * 100 * 0.45359237, 1e-6);
    close(result.weightMetricTonnes, result.weightKg / 1000);
    assert.strictEqual(result.bags25kg, Math.ceil(result.weightKg / 25));
});

test('3 m x 3 m x 10 cm stays within 1% of the metric volume', () => {
    const result = Engine.calculate({
        shape: 'rectangle',
        dimensions: {
            lengthFt: Engine.toFeet(3, 0, 'metric'),
            widthFt: Engine.toFeet(3, 0, 'metric')
        },
        depthInches: Engine.toInches(10, 'metric'),
        material: 'pea_gravel'
    });

    const expectedVolumeM3 = 3 * 3 * 0.10;
    const drift = Math.abs(result.volumeM3 - expectedVolumeM3) / expectedVolumeM3;
    assert.ok(drift <= 0.01, 'volume drift must stay under 1%, got ' + drift);
    close(result.volumeM3, expectedVolumeM3, 0.01);

    assert.ok(result.weightKg > 0, 'metric weight must be populated');
    assert.ok(result.bags25kg > 0, '25 kg bag count must be populated');
    assert.strictEqual(result.bags25kg, Math.ceil(result.weightKg / 25));
    close(result.volumeM3, result.volumeCuYd * 0.764554857984, 1e-9);
    close(result.weightMetricTonnes, result.weightKg / 1000, 1e-9);
});

test('metric base quantities use the unadjusted geometry', () => {
    const result = Engine.calculate({
        shape: 'rectangle',
        areaSqFt: 100,
        depthInches: 3,
        material: 'pea_gravel',
        wastePercent: 10,
        compactionPercent: 12
    });

    close(result.baseVolumeM3, result.baseVolumeCuYd * 0.764554857984, 1e-9);
    close(result.baseWeightMetricTonnes, result.baseWeightKg / 1000, 1e-9);
    close(result.baseWeightKg, result.baseWeightLb * 0.45359237, 1e-9);
    close(result.baseVolumeCuYd, 0.9259259259259259, 1e-9);
    close(result.volumeM3 / result.baseVolumeM3, 1.1 * 1.12, 1e-12);
});

test('metric 25 kg bags include waste and compaction', () => {
    const result = Engine.calculate({
        shape: 'rectangle',
        dimensions: {
            lengthFt: Engine.toFeet(3, 0, 'metric'),
            widthFt: Engine.toFeet(3, 0, 'metric')
        },
        depthInches: Engine.toInches(10, 'metric'),
        material: 'pea_gravel',
        wastePercent: 10,
        compactionPercent: 12
    });

    const expectedVolumeM3 = 3 * 3 * 0.10 * 1.1 * 1.12;
    close(result.volumeM3, expectedVolumeM3, 0.001);
    close(result.weightKg, result.weightLb * 0.45359237, 1e-9);
    close(result.weightMetricTonnes, result.weightKg / 1000, 1e-12);
    assert.strictEqual(result.bags25kg, Math.ceil(result.weightKg / 25 - 1e-9));
});

test('metric conversion stays within 1% for every material', () => {
    Engine.getMaterialList().forEach((material) => {
        const result = Engine.calculate({
            shape: 'rectangle',
            areaSqFt: 100,
            depthInches: 3,
            material: material.key,
            wastePercent: 10,
            compactionPercent: 12
        });

        // 100 sq ft = 9.290304 m² and 3 in = 0.0762 m exactly.
        const expectedVolumeM3 = 100 * 0.09290304 * 0.0762 * 1.1 * 1.12;
        const drift = Math.abs(result.volumeM3 - expectedVolumeM3) / expectedVolumeM3;
        assert.ok(drift < 0.01, material.key + ' volume drift must stay under 1%, got ' + drift);
        close(result.weightKg, result.weightLb * 0.45359237, 1e-9);
        close(result.weightMetricTonnes, result.weightKg / 1000, 1e-12);
        assert.strictEqual(result.bags25kg, Math.ceil(result.weightKg / 25 - 1e-9));
    });
});

test('metric order sheet exposes m³, tonnes, kg and 25 kg bags', () => {
    const state = Engine.defaultState();
    state.unit = 'metric';
    state.depthInches = Engine.toInches(10, 'metric');
    state.dimensions.rect = { lFt: 3, lIn: 0, wFt: 3, wIn: 0 };

    const sheet = Engine.generateOrderSheet(state, { url: 'https://example.test/?unit=metric' });

    assert.strictEqual(sheet.display.volumeM3, '0.90');
    assert.strictEqual(sheet.display.weightMetricTonnes, '1.51');
    assert.strictEqual(sheet.display.bags25kg, '61');
    assert.ok(sheet.depth.indexOf('cm') >= 0, 'metric depth should use cm, got ' + sheet.depth);
    assert.ok(sheet.dimensions.indexOf('3 m 0 cm') >= 0, 'metric dimensions should use m/cm');
});

test('order sheet exposes density, area, base quantities, allowances and cost details', () => {
    const state = Engine.defaultState();
    state.wastePercent = 10;
    state.compactionPercent = 5;

    const sheet = Engine.generateOrderSheet(state, {
        url: 'https://www.progravelcalculator.online/?waste=10&compaction=5',
        cost: {
            materialCost: 60.50,
            deliveryFee: 25.00,
            tax: 6.41,
            total: 91.91,
            currency: 'USD'
        }
    });

    assert.strictEqual(sheet.title, 'Pro Gravel Calculator — Material Order Sheet');
    assert.strictEqual(sheet.allowances.wastePercent, 10);
    assert.strictEqual(sheet.allowances.compactionPercent, 5);
    assert.ok(sheet.density.indexOf('105 lb/ft³') >= 0);
    assert.ok(sheet.area.indexOf('100.00 sq ft') >= 0);
    assert.strictEqual(sheet.display.baseVolumeCuYd, '0.93');
    assert.strictEqual(sheet.display.volumeCuYd, '1.07');
    assert.strictEqual(sheet.cost.total, 91.91);
    assert.strictEqual(sheet.url, 'https://www.progravelcalculator.online/?waste=10&compaction=5');
});

test('pallets round up at 40 bags per pallet', () => {
    const result = Engine.calculate({
        shape: 'rectangle',
        areaSqFt: 100,
        depthInches: 3,
        material: 'pea_gravel'
    });
    assert.strictEqual(result.bags, 53);
    assert.strictEqual(result.pallets, 2);
});

// ---------------------------------------------------------------------------
// URL state
// ---------------------------------------------------------------------------

test('serialize/deserialize round-trips a complete state', () => {
    const state = {
        unit: 'metric',
        shape: 'lshape',
        material: 'sand',
        depthInches: 6,
        wastePercent: 10,
        compactionPercent: 5,
        bagSizeLb: 40,
        dimensions: {
            rect: { lFt: 3, lIn: 4, wFt: 5, wIn: 6 },
            circle: { dFt: 7, dIn: 8 },
            lshape: { aLFt: 9, aLIn: 10, aWFt: 11, aWIn: 0, bLFt: 1, bLIn: 2, bWFt: 3, bWIn: 4 }
        }
    };

    const serialized = Engine.serialize(state);
    const restored = Engine.deserialize(serialized);
    assert.deepStrictEqual(restored, state);
});

test('deserialize uses documented defaults for missing parameters', () => {
    const state = Engine.deserialize('');
    assert.strictEqual(state.unit, 'imperial');
    assert.strictEqual(state.shape, 'rectangle');
    assert.strictEqual(state.material, 'pea_gravel');
    assert.strictEqual(state.depthInches, 3);
    assert.strictEqual(state.wastePercent, 0);
    assert.strictEqual(state.compactionPercent, 0);
    assert.strictEqual(state.bagSizeLb, 50);
});

test('serialize omits zero allowances and the default bag size', () => {
    const params = new URLSearchParams(Engine.serialize(Engine.defaultState()));
    assert.strictEqual(params.get('waste'), null);
    assert.strictEqual(params.get('compaction'), null);
    assert.strictEqual(params.get('bag'), null);
});

test('serialize/deserialize round-trips state with bag sizes and cost estimator', () => {
    const state = {
        unit: 'metric',
        shape: 'rectangle',
        material: 'crushed_stone',
        depthInches: 4,
        wastePercent: 10,
        compactionPercent: 12,
        bagSizeLb: 60,
        bagSizeKg: 20,
        price: 45.5,
        priceBasis: 'metric_tonne',
        deliveryFee: 50,
        taxRate: 8.5,
        currency: 'EUR',
        dimensions: {
            rect: { lFt: 6, lIn: 0, wFt: 3, wIn: 50 },
            circle: { dFt: 0, dIn: 0 },
            lshape: { aLFt: 0, aLIn: 0, aWFt: 0, aWIn: 0, bLFt: 0, bLIn: 0, bWFt: 0, bWIn: 0 }
        }
    };

    const serialized = Engine.serialize(state);
    const restored = Engine.deserialize(serialized);
    assert.deepStrictEqual(restored, state);
});

test('serialize omits cost parameters and bag_kg when not set', () => {
    const state = Engine.defaultState();
    const serialized = Engine.serialize(state);
    const params = new URLSearchParams(serialized);
    assert.strictEqual(params.get('price'), null);
    assert.strictEqual(params.get('basis'), null);
    assert.strictEqual(params.get('delivery'), null);
    assert.strictEqual(params.get('tax'), null);
    assert.strictEqual(params.get('cur'), null);
    assert.strictEqual(params.get('bag_kg'), null);
});

// ---------------------------------------------------------------------------
// Warnings
// ---------------------------------------------------------------------------

test('warnings flag shallow, deep and no-waste projects', () => {
    const shallow = Engine.getWarnings({
        shape: 'rectangle',
        areaSqFt: 100,
        depthInches: 1,
        material: 'pea_gravel',
        wastePercent: 10
    });
    assert.ok(shallow.some((warning) => warning.code === 'depth-under-2'));

    const deep = Engine.getWarnings({
        shape: 'rectangle',
        areaSqFt: 100,
        depthInches: 15,
        material: 'pea_gravel',
        wastePercent: 10
    });
    assert.ok(deep.some((warning) => warning.code === 'depth-over-12'));

    const noWaste = Engine.getWarnings({
        shape: 'rectangle',
        areaSqFt: 100,
        depthInches: 3,
        material: 'pea_gravel'
    });
    assert.ok(noWaste.some((warning) => warning.code === 'no-waste'));
});

test('warnings handle empty input and out-of-range custom density', () => {
    const empty = Engine.getWarnings({});
    assert.ok(empty.some((warning) => warning.code === 'no-dimensions'));

    const density = Engine.getWarnings({
        shape: 'rectangle',
        areaSqFt: 100,
        depthInches: 3,
        material: 'crushed_stone',
        customDensityLbPerCuFt: 50,
        wastePercent: 10
    });
    assert.ok(density.some((warning) => warning.code === 'density-out-of-range'));
});

test('density warning names the material typical range and metric equivalent', () => {
    const insideRange = Engine.getWarnings({
        shape: 'rectangle',
        areaSqFt: 100,
        depthInches: 3,
        material: 'crushed_stone',
        customDensityLbPerCuFt: 95,
        wastePercent: 10
    });
    assert.ok(!insideRange.some((warning) => warning.code === 'density-out-of-range'));

    const outsideRange = Engine.getWarnings({
        shape: 'rectangle',
        areaSqFt: 100,
        depthInches: 3,
        material: 'crushed_stone',
        customDensityLbPerCuFt: 130,
        wastePercent: 10
    });
    const imperialWarning = outsideRange.find((warning) => warning.code === 'density-out-of-range');
    assert.ok(imperialWarning);
    assert.ok(imperialWarning.message.indexOf('90–110 lb/ft³') >= 0);
    assert.ok(imperialWarning.message.indexOf('crushed stone') >= 0);
    assert.ok(imperialWarning.message.indexOf('100 lb/ft³') >= 0);

    const metricOutsideRange = Engine.getWarnings({
        unit: 'metric',
        shape: 'rectangle',
        areaSqFt: 100,
        depthInches: 3,
        material: 'sand',
        customDensityLbPerCuFt: 60,
        wastePercent: 10
    });
    const metricWarning = metricOutsideRange.find((warning) => warning.code === 'density-out-of-range');
    assert.ok(metricWarning);
    assert.ok(metricWarning.message.indexOf('kg/m³') >= 0);
});

test('warnings adapt messages for metric unit system', () => {
    const metricShallow = Engine.getWarnings({
        unit: 'metric',
        shape: 'rectangle',
        areaSqFt: 100,
        depthInches: 1,
        wastePercent: 10
    });
    const warn = metricShallow.find((w) => w.code === 'depth-under-2');
    assert.ok(warn);
    assert.ok(warn.message.indexOf('50 mm') >= 0);
});

test('warnings report combined allowances when waste and compaction are both active', () => {
    const combined = Engine.getWarnings({
        shape: 'rectangle',
        areaSqFt: 100,
        depthInches: 3,
        wastePercent: 10,
        compactionPercent: 5
    });
    assert.ok(combined.some((w) => w.code === 'combined-allowances'));
});

// ---------------------------------------------------------------------------
// Order sheet
// ---------------------------------------------------------------------------

test('order sheet contains supplier-ready fields', () => {
    const state = Engine.defaultState();
    const sheet = Engine.generateOrderSheet(state, { url: 'https://example.test/' });

    assert.strictEqual(sheet.material, 'Pea Gravel');
    assert.strictEqual(sheet.shape, 'Rectangle');
    assert.strictEqual(sheet.depth, '3 in');
    assert.strictEqual(sheet.display.volumeCuYd, '0.93');
    assert.strictEqual(sheet.display.weightShortTons, '1.31');
    assert.strictEqual(sheet.display.bags, '53');
    assert.strictEqual(sheet.url, 'https://example.test/');
    assert.ok(sheet.dimensions.indexOf('Length: 10 ft 0 in') === 0);
    assert.ok(sheet.warnings.length > 0);
});

test('calculateFromState matches direct calculate input', () => {
    const state = Engine.defaultState();
    const fromState = Engine.calculateFromState(state);
    const direct = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 10, widthFt: 10 },
        depthInches: 3,
        material: 'pea_gravel'
    });
    assert.strictEqual(fromState.volumeCuYd, direct.volumeCuYd);
    assert.strictEqual(fromState.weightShortTons, direct.weightShortTons);
    assert.strictEqual(fromState.bags, direct.bags);
});

// ---------------------------------------------------------------------------
// Task 2-6: Bag sizes, pallets, coverage rates and bulk-vs-bag comparison
// ---------------------------------------------------------------------------

test('bag size selector: 40 lb, 50 lb and 60 lb imperial bags', () => {
    const calc40 = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 10, widthFt: 10 },
        depthInches: 3,
        material: 'pea_gravel',
        bagSizeLb: 40
    });
    const calc50 = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 10, widthFt: 10 },
        depthInches: 3,
        material: 'pea_gravel',
        bagSizeLb: 50
    });
    const calc60 = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 10, widthFt: 10 },
        depthInches: 3,
        material: 'pea_gravel',
        bagSizeLb: 60
    });

    // 2,625 lb total weight:
    assert.strictEqual(calc40.bags, 66); // ceil(2625 / 40)
    assert.strictEqual(calc50.bags, 53); // ceil(2625 / 50)
    assert.strictEqual(calc60.bags, 44); // ceil(2625 / 60)
});

test('metric bag sizes: 20 kg, 25 kg and 40 kg', () => {
    const calc20 = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 10, widthFt: 10 },
        depthInches: 3,
        material: 'pea_gravel',
        bagSizeKg: 20
    });
    const calc25 = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 10, widthFt: 10 },
        depthInches: 3,
        material: 'pea_gravel',
        bagSizeKg: 25
    });
    const calc40 = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 10, widthFt: 10 },
        depthInches: 3,
        material: 'pea_gravel',
        bagSizeKg: 40
    });

    // ~1,190.68 kg total weight:
    assert.strictEqual(calc20.bags25kg, 60); // ceil(1190.68 / 20)
    assert.strictEqual(calc25.bags25kg, 48); // ceil(1190.68 / 25)
    assert.strictEqual(calc40.bags25kg, 30); // ceil(1190.68 / 40)
});

test('pallet calculator: rounds up to whole pallets and calculates full + loose breakdown', () => {
    const calc = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 10, widthFt: 10 },
        depthInches: 3,
        material: 'pea_gravel'
    });
    // 53 bags at 40 bags/pallet:
    assert.strictEqual(calc.bags, 53);
    assert.strictEqual(calc.pallets, 2);
    assert.strictEqual(calc.fullPallets, 1);
    assert.strictEqual(calc.looseBags, 13);

    // Metric: 48 bags at 40 bags/pallet:
    assert.strictEqual(calc.bags25kg, 48);
    assert.strictEqual(calc.palletsMetric, 2);
    assert.strictEqual(calc.fullPalletsMetric, 1);
    assert.strictEqual(calc.looseBagsMetric, 8);

    // Exact full pallet check (crushed stone 10x10 ft at 3 in = 50 bags):
    const calcExact = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 10, widthFt: 10 },
        depthInches: 3,
        material: 'crushed_stone',
        bagsPerPallet: 50
    });
    assert.strictEqual(calcExact.bags, 50);
    assert.strictEqual(calcExact.pallets, 1);
    assert.strictEqual(calcExact.fullPallets, 1);
    assert.strictEqual(calcExact.looseBags, 0);

    // Zero dimensions check:
    const calcZero = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 0, widthFt: 0 },
        depthInches: 0
    });
    assert.strictEqual(calcZero.bags, 0);
    assert.strictEqual(calcZero.pallets, 0);
    assert.strictEqual(calcZero.fullPallets, 0);
    assert.strictEqual(calcZero.looseBags, 0);
});

test('coverage rates: bags per yard, bags per ton, bags per m3 and bags per tonne', () => {
    const calcPea = Engine.calculate({
        material: 'pea_gravel',
        bagSizeLb: 50,
        bagSizeKg: 25
    });
    // Pea gravel (105 lb/ft³):
    // 1 yd³ = 27 * 105 = 2,835 lb. At 50 lb: 2835 / 50 = 56.7 bags/yd³
    assert.strictEqual(calcPea.bagsPerCuYd, 56.7);
    // 1 short ton = 2,000 lb. At 50 lb: 2000 / 50 = 40.0 bags/ton
    assert.strictEqual(calcPea.bagsPerShortTon, 40);
    // 1 metric tonne = 1,000 kg. At 25 kg: 1000 / 25 = 40.0 bags/tonne
    assert.strictEqual(calcPea.bagsPerMetricTonne, 40);
    // 1 m³ ≈ 1,681.94 kg. At 25 kg: 1681.94 / 25 ≈ 67.3 bags/m³
    assert.strictEqual(calcPea.bagsPerCuM, 67.3);

    const calcCrushed = Engine.calculate({
        material: 'crushed_stone',
        bagSizeLb: 50
    });
    // Crushed stone (100 lb/ft³): 27 * 100 = 2,700 lb. 2700 / 50 = 54.0 bags/yd³
    assert.strictEqual(calcCrushed.bagsPerCuYd, 54);
    assert.strictEqual(calcCrushed.bagsPerShortTon, 40);
});

test('bulk vs bag comparison calculates totals, difference and correct cheaper option', () => {
    const results = Engine.calculate({
        shape: 'rectangle',
        dimensions: { lengthFt: 10, widthFt: 10 },
        depthInches: 3,
        material: 'pea_gravel'
    });
    // results: 1.31 short tons, 53 bags

    // Case 1: Bulk delivery is cheaper
    const bulkCheaper = Engine.compareBulkVsBag(
        results,
        { price: 40, basis: 'short_ton', deliveryFee: 50, taxRate: 5 },
        { price: 5, deliveryFee: 0, taxRate: 5 }
    );
    assert.ok(bulkCheaper !== null);
    // Bulk: qty 1.31 * 40 = 52.40 + 50 = 102.40 + 5% tax (5.12) = 107.52
    assert.strictEqual(bulkCheaper.bulk.total, 107.52);
    // Bag: 53 * 5 = 265.00 + 0 = 265.00 + 5% tax (13.25) = 278.25
    assert.strictEqual(bulkCheaper.bag.total, 278.25);
    assert.strictEqual(bulkCheaper.cheaper, 'bulk');
    assert.strictEqual(bulkCheaper.difference, 170.73);
    assert.ok(bulkCheaper.savingsPercent > 60);

    // Case 2: Bags are cheaper (high bulk delivery fee on small job)
    const bagCheaper = Engine.compareBulkVsBag(
        results,
        { price: 50, basis: 'short_ton', deliveryFee: 250, taxRate: 0 },
        { price: 4, deliveryFee: 0, taxRate: 0 }
    );
    assert.strictEqual(bagCheaper.cheaper, 'bag');
    assert.strictEqual(bagCheaper.bag.total, 212); // 53 * 4
    assert.strictEqual(bagCheaper.bulk.total, 315.5); // 1.31 * 50 + 250

    // Case 3: Invalid or zero prices return null
    assert.strictEqual(Engine.compareBulkVsBag(results, { price: 0 }, { price: 5 }), null);
    assert.strictEqual(Engine.compareBulkVsBag(results, { price: 40 }, { price: 0 }), null);
    assert.strictEqual(Engine.compareBulkVsBag(null, { price: 40 }, { price: 5 }), null);
});

// ---------------------------------------------------------------------------

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exitCode = failed === 0 ? 0 : 1;
