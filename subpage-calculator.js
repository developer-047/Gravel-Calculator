/**
 * Pro Gravel Calculator — calculator page wiring.
 *
 * Loads after calculator-engine.js on every calculator subpage. Each initialiser
 * reads that page's existing form controls, calls the shared engine, and writes
 * the results into the page's existing result containers. No calculator maths is
 * duplicated here: densities, geometry, allowances, bags and conversions all come
 * from window.GravelEngine.
 */
(function () {
    'use strict';

    var ENGINE = typeof window !== 'undefined' ? window.GravelEngine : null;
    var BAGS_PER_PALLET = 40;
    var LB_PER_SHORT_TON = 2000;
    var LB_PER_METRIC_TONNE = 2204.6226218487757;
    var KG_PER_LB = 0.45359237;
    var SQ_FT_PER_SQ_M = 10.76391041671;

    // Page values that are aliases or size codes, not engine keys.
    var MATERIAL_ALIASES = {
        masonry_sand: 'sand',
        '#57': 'crushed_stone',
        '#411': 'crushed_stone',
        '#304': 'crushed_stone',
        crusher: 'crushed_stone',
        crusher_run: 'crushed_stone',
        stone_304: 'crushed_stone',
        'drainage rock': 'crushed_stone'
    };

    var DENSITY_BY_VALUE = {
        '#57': 100,
        '#411': 110,
        '#304': 105,
        crusher: 105,
        crusher_run: 105,
        stone_304: 105,
        'drainage rock': 105,
        masonry_sand: 110
    };

    function byId(id) {
        return document.getElementById(id);
    }

    function valueOf(id) {
        var element = byId(id);
        return element ? element.value : '';
    }

    function numberFrom(id, fallback) {
        var raw = valueOf(id);
        if (raw === '' || raw === null || raw === undefined) return fallback;
        var value = Number(raw);
        if (!isFinite(value)) return fallback;
        return Math.max(0, value);
    }

    function setText(id, text) {
        var element = byId(id);
        if (element) element.textContent = text;
    }

    function show(id) {
        var element = byId(id);
        if (element) element.classList.remove('hidden');
    }

    function hide(id) {
        var element = byId(id);
        if (element) element.classList.add('hidden');
    }

    function round(value, decimals) {
        var places = typeof decimals === 'number' ? decimals : 2;
        var factor = Math.pow(10, places);
        return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
    }

    function fmt(value, decimals) {
        return round(value, decimals).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    function fmtInt(value) {
        return Math.round(Number(value) || 0).toLocaleString('en-US');
    }

    function ceilQuantity(value) {
        var number = Math.max(0, Number(value) || 0);
        if (number === 0) return 0;
        var nearest = Math.round(number);
        var tolerance = Math.max(1e-9, Math.abs(number) * 1e-12);
        return Math.abs(number - nearest) <= tolerance ? nearest : Math.ceil(number);
    }

    function money(value, currency) {
        var amount = Number(value) || 0;
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency || 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        } catch (error) {
            return '$' + fmt(amount, 2);
        }
    }

    function track(name, params) {
        if (window.PGC && typeof window.PGC.track === 'function') {
            window.PGC.track(name, params || {});
        }
    }

    function resolveMaterial(value) {
        if (value === 'custom') return 'crushed_stone';
        return MATERIAL_ALIASES[value] || value;
    }

    function resolveDensity(value, customDensity) {
        if (value === 'custom') {
            var custom = Number(customDensity);
            return isFinite(custom) && custom > 0 ? custom : null;
        }
        return DENSITY_BY_VALUE[value] || null;
    }

    function readDimensions(prefix, shape) {
        function feet(ftId, inId) {
            return ENGINE.toFeet(
                numberFrom(ftId, 0),
                numberFrom(inId, 0),
                'imperial'
            );
        }

        if (shape === 'circle') {
            return {
                diameterFt: numberFrom(prefix + '-circle-diameter-ft', 0)
            };
        }

        if (shape === 'lshape') {
            return {
                aLengthFt: numberFrom(prefix + '-lshape-a-length-ft', 0),
                aWidthFt: numberFrom(prefix + '-lshape-a-width-ft', 0),
                bLengthFt: numberFrom(prefix + '-lshape-b-length-ft', 0),
                bWidthFt: numberFrom(prefix + '-lshape-b-width-ft', 0)
            };
        }

        return {
            lengthFt: feet(prefix + '-rect-length-ft', prefix + '-rect-length-in'),
            widthFt: feet(prefix + '-rect-width-ft', prefix + '-rect-width-in')
        };
    }

    function bindShapeToggle(selectId, groups) {
        var select = byId(selectId);
        if (!select) return;

        function apply() {
            var shape = select.value;
            Object.keys(groups).forEach(function (key) {
                var target = byId(groups[key]);
                if (target) target.classList.toggle('hidden', key !== shape);
            });
        }

        select.addEventListener('change', apply);
        apply();
    }

    function bindBagButtons(selector, hiddenId, onChange) {
        var buttons = Array.prototype.slice.call(document.querySelectorAll(selector));
        var hidden = byId(hiddenId);
        if (buttons.length === 0) return;

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                var size = button.getAttribute('data-size');
                if (hidden) hidden.value = size;

                buttons.forEach(function (other) {
                    var active = other === button;
                    other.classList.toggle('active', active);
                    other.setAttribute('aria-pressed', active ? 'true' : 'false');
                    other.classList.toggle('border-blue-600', active);
                    other.classList.toggle('bg-blue-50', active);
                    other.classList.toggle('text-blue-700', active);
                    other.classList.toggle('border-slate-200', !active);
                    other.classList.toggle('bg-white', !active);
                    other.classList.toggle('text-slate-700', !active);
                });

                if (onChange) onChange();
            });
        });
    }

    function bagDisplay(results, preferMetric, bagSizeKg) {
        if (preferMetric) {
            return {
                count: results.bags25kg,
                label: (bagSizeKg || results.bagSizeKg) + ' kg bags',
                altCount: results.bags,
                altLabel: results.bagSizeLb + ' lb bags'
            };
        }
        return {
            count: results.bags,
            label: results.bagSizeLb + ' lb bags',
            altCount: results.bags25kg,
            altLabel: (bagSizeKg || results.bagSizeKg) + ' kg bags'
        };
    }

    function palletText(results, metric) {
        var pallets = metric ? results.palletsMetric : results.pallets;
        var full = metric ? results.fullPalletsMetric : results.fullPallets;
        var loose = metric ? results.looseBagsMetric : results.looseBags;
        if (pallets <= 0) return '0 pallets';
        return pallets + (pallets === 1 ? ' pallet' : ' pallets') +
            ' (' + full + ' full + ' + loose + ' loose)';
    }

    function renderVolumeWeightBags(results, ids, preferMetric, bagSizeKg) {
        var bags = bagDisplay(results, preferMetric, bagSizeKg);

        setText(ids.volume, fmt(results.volumeCuYd, 2) + ' yd³');
        setText(ids.volumeAlt, fmt(results.volumeM3, 2) + ' m³');
        setText(ids.weight, fmt(results.weightShortTons, 2) + ' short tons');
        setText(ids.weightAlt, fmt(results.weightMetricTonnes, 2) + ' metric tonnes · ' +
            fmtInt(results.weightKg) + ' kg');
        setText(ids.bags, fmtInt(bags.count) + ' × ' + bags.label);
        setText(ids.bagsAlt, fmtInt(bags.altCount) + ' × ' + bags.altLabel +
            ' · ' + palletText(results, preferMetric));
    }

    function coverageRows(density, depths) {
        return depths.map(function (depth, index) {
            var sqFt = 24000 / (density * depth);
            var sqIn = sqFt * 144;
            return '<tr class="' + (index % 2 === 1 ? 'bg-white ' : '') + 'border-b">' +
                '<td class="p-3">' + depth + '″</td>' +
                '<td class="p-3">' + fmtInt(sqFt) + '</td>' +
                '<td class="p-3">' + fmtInt(sqIn) + '</td>' +
                '<td class="p-3">' + Math.ceil(2000 / 50) + '</td>' +
                '</tr>';
        }).join('');
    }

    function renderCoverageTable(tbodyId, density, depths) {
        var body = byId(tbodyId);
        if (body) body.innerHTML = coverageRows(density, depths);
    }

    function calculatorInput(options) {
        return {
            shape: options.shape || 'rectangle',
            dimensions: options.dimensions || {},
            areaSqFt: options.areaSqFt,
            depthInches: options.depthInches,
            material: options.material || 'pea_gravel',
            customDensityLbPerCuFt: options.customDensityLbPerCuFt,
            unit: 'imperial',
            wastePercent: options.wastePercent || 0,
            compactionPercent: options.compactionPercent || 0,
            bagSizeLb: options.bagSizeLb || 50,
            bagSizeKg: options.bagSizeKg || 25,
            bagsPerPallet: BAGS_PER_PALLET
        };
    }

    function fail(statusId) {
        setText(statusId, 'The calculator engine did not load. Refresh the page and try again.');
    }

    // -----------------------------------------------------------------
    // Pea gravel
    // -----------------------------------------------------------------
    function initPea() {
        var form = byId('pg-calc-form');
        if (!form) return;

        bindShapeToggle('pg-shape', {
            rectangle: 'pg-rect-dimensions',
            circle: 'pg-circle-dimensions',
            lshape: 'pg-lshape-dimensions'
        });

        var tracked = false;

        function update() {
            if (!ENGINE) return fail('pg-calc-status');

            var shape = valueOf('pg-shape') || 'rectangle';
            var bagValue = valueOf('pg-bag-size-hidden') || '50';
            var preferMetric = bagValue === '25';
            var results = ENGINE.calculate(calculatorInput({
                shape: shape,
                dimensions: readDimensions('pg', shape),
                depthInches: numberFrom('pg-depth', 2),
                material: valueOf('pg-material') || 'pea_gravel',
                wastePercent: numberFrom('pg-waste', 0),
                compactionPercent: numberFrom('pg-compaction', 0)
            }));

            if (!results.hasVolume) {
                hide('pg-results');
                hide('pg-results-note');
                setText('pg-calc-status', 'Enter dimensions and depth to see an estimate.');
                return;
            }

            show('pg-results');
            show('pg-results-note');
            setText('pg-calc-status', 'Estimate updated.');

            renderVolumeWeightBags(results, {
                volume: 'pg-volume',
                volumeAlt: 'pg-volume-alt',
                weight: 'pg-weight',
                weightAlt: 'pg-weight-alt',
                bags: 'pg-bags',
                bagsAlt: 'pg-bags-alt'
            }, preferMetric, 25);

            var price = numberFrom('pg-price', 0);
            if (price > 0) {
                var currency = valueOf('pg-currency') || 'USD';
                var delivery = numberFrom('pg-delivery', 0);
                var taxRate = numberFrom('pg-tax', 0);
                var materialCost = round(results.weightShortTons * price, 2);
                var tax = round((materialCost + delivery) * taxRate / 100, 2);
                var total = round(materialCost + delivery + tax, 2);
                setText('pg-cost-total', money(total, currency));
                setText('pg-cost-alt', 'Material ' + money(materialCost, currency) +
                    ' + delivery ' + money(delivery, currency) +
                    ' + tax ' + money(tax, currency));
                show('pg-cost-card');
            } else {
                hide('pg-cost-card');
            }

            if (!tracked) {
                tracked = true;
                track('calculator_complete', { page: 'pea_gravel', material: results.material });
            }
        }

        bindBagButtons('.pg-bag-btn', 'pg-bag-size-hidden', update);
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            update();
        });
        form.addEventListener('input', update);
        form.addEventListener('change', update);
        update();
    }

    // -----------------------------------------------------------------
    // French drain
    // -----------------------------------------------------------------
    function initFrenchDrain() {
        var form = byId('fd-calc-form');
        if (!form) return;

        var tracked = false;

        function update() {
            if (!ENGINE) return fail('fd-calc-status');

            var lengthFt = ENGINE.toFeet(
                numberFrom('fd-trench-length-ft', 0),
                numberFrom('fd-trench-length-in', 0),
                'imperial'
            );
            var widthFt = ENGINE.toFeet(
                numberFrom('fd-trench-width-ft', 0),
                numberFrom('fd-trench-width-in', 0),
                'imperial'
            );
            var depthInches = numberFrom('fd-trench-depth', 18);
            var stoneValue = valueOf('fd-stone-type') || 'crushed_stone';
            var material = resolveMaterial(stoneValue);
            var customDensity = resolveDensity(stoneValue);
            var bagValue = valueOf('fd-bag-size') || '50';
            var preferMetric = bagValue === '25' || bagValue === '40';
            var bagSizeKg = preferMetric ? Number(bagValue) : 25;

            var results = ENGINE.calculate(calculatorInput({
                shape: 'rectangle',
                dimensions: { lengthFt: lengthFt, widthFt: widthFt },
                depthInches: depthInches,
                material: material,
                customDensityLbPerCuFt: customDensity,
                wastePercent: numberFrom('fd-waste', 0),
                compactionPercent: numberFrom('fd-compaction', 0),
                bagSizeKg: bagSizeKg
            }));

            if (!results.hasVolume) {
                hide('fd-results');
                hide('fd-extra');
                hide('fd-results-note');
                setText('fd-calc-status', 'Enter trench length, width and depth to see an estimate.');
                return;
            }

            var pipeDiameter = numberFrom('fd-pipe-diameter', 0);
            var pipeLength = numberFrom('fd-pipe-length', 0);
            var pipeCuFt = Math.PI * Math.pow(pipeDiameter / 24, 2) * pipeLength;
            var netCuFt = Math.max(0, results.volumeCuFt - pipeCuFt);
            var netCuYd = netCuFt / 27;
            var netLb = netCuFt * results.densityLbPerCuFt;
            var netShortTons = netLb / LB_PER_SHORT_TON;
            var netKg = netLb * KG_PER_LB;
            var netMetricTonnes = netKg / 1000;
            var netBags = netLb > 0 ? ceilQuantity(netLb / results.bagSizeLb) : 0;
            var netBagsKg = netKg > 0 ? ceilQuantity(netKg / bagSizeKg) : 0;

            show('fd-results');
            show('fd-extra');
            show('fd-results-note');
            setText('fd-calc-status', 'Estimate updated.');

            setText('fd-volume', fmt(netCuYd, 2) + ' yd³');
            setText('fd-volume-alt', fmt(netCuFt, 2) + ' ft³ · before pipe deduction ' +
                fmt(results.volumeCuYd, 2) + ' yd³');
            setText('fd-weight', fmt(netShortTons, 2) + ' short tons');
            setText('fd-weight-alt', fmt(netMetricTonnes, 2) + ' metric tonnes · ' +
                fmtInt(netKg) + ' kg');
            setText('fd-bags', fmtInt(preferMetric ? netBagsKg : netBags) + ' × ' +
                (preferMetric ? bagSizeKg + ' kg bags' : results.bagSizeLb + ' lb bags'));
            setText('fd-bags-alt', fmtInt(preferMetric ? netBags : netBagsKg) + ' × ' +
                (preferMetric ? results.bagSizeLb + ' lb bags' : bagSizeKg + ' kg bags'));

            if (pipeCuFt > 0) {
                setText('fd-pipe-deduction', 'Pipe volume deducted: ' + fmt(pipeCuFt, 2) +
                    ' ft³ (' + fmt(pipeCuFt / 27, 2) + ' yd³) for a ' + pipeDiameter +
                    '″ pipe × ' + fmt(pipeLength, 2) + ' ft.');
            } else {
                setText('fd-pipe-deduction', 'No pipe deduction entered.');
            }

            var trenchDepthFt = depthInches / 12;
            var fabricWidthFt = widthFt + (2 * trenchDepthFt) + 2;
            var fabricArea = lengthFt * fabricWidthFt;
            setText('fd-fabric-estimate', fmt(fabricArea, 0) + ' ft² of fabric (about ' +
                fmtInt(fabricArea / 3) + ' linear ft at 3 ft wide). Planning estimate assumes ' +
                '12″ overlap on each side.');

            var price = numberFrom('fd-price-amount', 0);
            if (price > 0) {
                var currency = valueOf('fd-currency') || 'USD';
                var delivery = numberFrom('fd-delivery', 0);
                var taxRate = numberFrom('fd-tax', 0);
                var materialCost = round(netShortTons * price, 2);
                var tax = round((materialCost + delivery) * taxRate / 100, 2);
                var total = round(materialCost + delivery + tax, 2);
                setText('fd-cost-total', money(total, currency));
                setText('fd-cost-alt', 'Material ' + money(materialCost, currency) +
                    ' + delivery ' + money(delivery, currency) +
                    ' + tax ' + money(tax, currency));
                show('fd-cost-card');
            } else {
                hide('fd-cost-card');
            }

            if (!tracked) {
                tracked = true;
                track('calculator_complete', { page: 'french_drain', material: results.material });
            }
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            update();
        });
        form.addEventListener('input', update);
        form.addEventListener('change', update);
        update();
    }

    // -----------------------------------------------------------------
    // Gravel bag calculator
    // -----------------------------------------------------------------
    function initBag() {
        var form = byId('bag-calc-form');
        if (!form) return;

        bindShapeToggle('bag-shape', {
            rectangle: 'rect-dimensions',
            circle: 'circle-dimensions',
            lshape: 'lshape-dimensions'
        });

        var tracked = false;

        function update() {
            if (!ENGINE) return fail('bag-calc-status');

            var shape = valueOf('bag-shape') || 'rectangle';
            var materialValue = valueOf('bag-material') || 'pea_gravel';
            var material = resolveMaterial(materialValue);
            var customDensity = resolveDensity(materialValue);
            var bagValue = Number(valueOf('bag-size-hidden') || 50);
            var bagSizeLb = isFinite(bagValue) && bagValue > 0 ? bagValue : 50;

            var results = ENGINE.calculate(calculatorInput({
                shape: shape,
                dimensions: readDimensions('bag', shape),
                depthInches: numberFrom('bag-depth', 4),
                material: material,
                customDensityLbPerCuFt: customDensity,
                wastePercent: numberFrom('bag-waste', 0),
                compactionPercent: numberFrom('bag-compaction', 0),
                bagSizeLb: bagSizeLb
            }));

            if (!results.hasVolume) {
                hide('bag-results');
                hide('bag-bulk-vs-bag-section');
                setText('bag-calc-status', 'Enter dimensions and depth to see a bag estimate.');
                return;
            }

            show('bag-results');
            setText('bag-calc-status', 'Estimate updated.');
            setText('bag-quantity', fmtInt(results.bags) + ' × ' + bagSizeLb + ' lb bags');
            setText('bag-quantity-alt', fmtInt(results.bags25kg) + ' × 25 kg bags · ' +
                fmt(results.volumeCuYd, 2) + ' yd³');
            setText('bag-pallets', fmtInt(results.pallets) + (results.pallets === 1 ? ' pallet' : ' pallets'));
            setText('bag-pallets-detail', results.fullPallets + ' full + ' +
                results.looseBags + ' loose · 40 bags per pallet');

            var bulkPrice = numberFrom('bulk-price-per-ton', 0);
            var bagPrice = numberFrom('bag-price-per-' + bagSizeLb, 0);

            if (bulkPrice > 0 && bagPrice > 0) {
                var bulkCost = round(results.weightShortTons * bulkPrice, 2);
                var bagCost = round(results.bags * bagPrice, 2);
                var difference = round(Math.abs(bulkCost - bagCost), 2);
                var cheaper = 'equal';
                var savingsPercent = 0;

                if (bulkCost < bagCost) {
                    cheaper = 'bulk';
                    savingsPercent = bagCost > 0 ? round((difference / bagCost) * 100, 1) : 0;
                } else if (bagCost < bulkCost) {
                    cheaper = 'bag';
                    savingsPercent = bulkCost > 0 ? round((difference / bulkCost) * 100, 1) : 0;
                }

                show('bag-bulk-vs-bag-section');
                if (cheaper === 'bulk') {
                    setText('bag-bulk-vs-bag', 'Bulk is cheaper');
                    setText('bag-savings-amount', 'Save ' + money(difference, 'USD') +
                        ' (' + savingsPercent + '%) at these example prices.');
                    setText('bag-verdict', 'Bulk delivery is cheaper by ' + money(difference, 'USD') +
                        ' for this project at the prices entered.');
                    setText('bag-savings-badge', 'Savings: ' + savingsPercent + '% · Bulk ' +
                        money(bulkCost, 'USD') + ' vs bags ' + money(bagCost, 'USD'));
                } else if (cheaper === 'bag') {
                    setText('bag-bulk-vs-bag', 'Bags are cheaper');
                    setText('bag-savings-amount', 'Save ' + money(difference, 'USD') +
                        ' (' + savingsPercent + '%) at these example prices.');
                    setText('bag-verdict', 'Bags are cheaper by ' + money(difference, 'USD') +
                        ' for this project at the prices entered.');
                    setText('bag-savings-badge', 'Savings: ' + savingsPercent + '% · Bags ' +
                        money(bagCost, 'USD') + ' vs bulk ' + money(bulkCost, 'USD'));
                } else {
                    setText('bag-bulk-vs-bag', 'Equal cost');
                    setText('bag-savings-amount', 'Both options total ' + money(bulkCost, 'USD') + '.');
                    setText('bag-verdict', 'Both options cost the same at the prices entered.');
                    setText('bag-savings-badge', 'Equal cost');
                }
            } else {
                hide('bag-bulk-vs-bag-section');
                setText('bag-bulk-vs-bag', 'Enter prices');
                setText('bag-savings-amount', 'Add a bulk price per ton and a price for the selected bag size to compare.');
            }

            if (!tracked) {
                tracked = true;
                track('calculator_complete', { page: 'gravel_bags', material: results.material });
            }
        }

        bindBagButtons('.bag-size-btn', 'bag-size-hidden', update);
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            update();
        });
        form.addEventListener('input', update);
        form.addEventListener('change', update);
        update();
    }

    // -----------------------------------------------------------------
    // Gravel calculator in tons
    // -----------------------------------------------------------------
    function initTons() {
        var form = byId('tons-calc-form');
        if (!form) return;

        var tracked = false;

        function updateSections() {
            var direction = valueOf('tons-direction') || 'yards-to-tons';
            var groups = {
                'yards-to-tons': 'yards-to-tons',
                'tons-to-yards': 'tons-to-yards',
                'tons-to-coverage': 'tons-to-coverage'
            };
            Object.keys(groups).forEach(function (key) {
                var element = byId(groups[key]);
                if (element) element.classList.toggle('hidden', key !== direction);
            });

            var customDensity = byId('tons-custom-density-wrap');
            if (customDensity) {
                customDensity.classList.toggle('hidden', valueOf('tons-material') !== 'custom');
            }
        }

        function update() {
            if (!ENGINE) return fail('tons-calc-status');

            updateSections();

            var direction = valueOf('tons-direction') || 'yards-to-tons';
            var materialValue = valueOf('tons-material') || 'pea_gravel';
            var material = resolveMaterial(materialValue);
            var customDensity = resolveDensity(materialValue, valueOf('tons-custom-density'));
            var density = customDensity || (ENGINE.getMaterial(material) || ENGINE.MATERIALS.pea_gravel).densityLbPerCuFt;
            var depthInches = numberFrom('tons-depth', 2);
            var weightLb = 0;
            var volumeCuFt = 0;
            var primaryLabel = 'Weight';
            var primaryValue = '';
            var primaryAlt = '';

            if (direction === 'tons-to-yards') {
                var checked = document.querySelector('input[name="unit"]:checked');
                var unit = checked ? checked.value : 'short_tons';
                var tonnes = unit === 'metric tonnes'
                    ? numberFrom('tons-metric-tonnes', 0)
                    : numberFrom('tons-short-tons', 0);
                weightLb = unit === 'metric tonnes' ? tonnes * LB_PER_METRIC_TONNE : tonnes * LB_PER_SHORT_TON;
                volumeCuFt = density > 0 ? weightLb / density : 0;
                primaryLabel = 'Volume';
            } else if (direction === 'tons-to-coverage') {
                var tons = numberFrom('tons-coverage-tons', 0);
                weightLb = tons * LB_PER_SHORT_TON;
                volumeCuFt = density > 0 ? weightLb / density : 0;
                primaryLabel = 'Volume';
            } else {
                var yards = numberFrom('tons-yards', 1);
                volumeCuFt = yards * 27;
                weightLb = volumeCuFt * density;
                primaryLabel = 'Weight';
            }

            var volumeCuYd = volumeCuFt / 27;
            var shortTons = weightLb / LB_PER_SHORT_TON;
            var metricTonnes = weightLb * KG_PER_LB / 1000;
            var depthFt = depthInches > 0 ? depthInches / 12 : 0;
            var coverageSqFt = depthFt > 0 ? volumeCuFt / depthFt : 0;
            var bags = weightLb > 0 ? ceilQuantity(weightLb / 50) : 0;

            if (!(weightLb > 0) || !(volumeCuFt > 0)) {
                hide('tons-results');
                hide('tons-coverage-table');
                setText('tons-calc-status', 'Enter a positive quantity to see a conversion.');
                return;
            }

            show('tons-results');
            show('tons-coverage-table');
            setText('tons-calc-status', 'Conversion updated.');

            setText('tons-converted-label', primaryLabel);
            if (primaryLabel === 'Volume') {
                primaryValue = fmt(volumeCuYd, 2) + ' yd³';
                primaryAlt = fmt(volumeCuFt, 2) + ' ft³ · ' + fmt(volumeCuYd * 0.764554857984, 2) + ' m³';
            } else {
                primaryValue = fmt(shortTons, 2) + ' short tons';
                primaryAlt = fmt(metricTonnes, 2) + ' metric tonnes · ' + fmtInt(weightLb) + ' lb';
            }

            setText('tons-converted-weight', primaryValue);
            setText('tons-converted-weight-alt', primaryAlt);
            setText('tons-coverage-area', fmt(coverageSqFt, 0) + ' ft²');
            setText('tons-coverage-area-alt', fmt(coverageSqFt / SQ_FT_PER_SQ_M, 1) + ' m² at ' +
                depthInches + '″ deep');
            setText('tons-bag-count', fmtInt(bags) + ' × 50 lb bags');
            setText('tons-bag-count-alt', fmt(metricTonnes, 2) + ' metric tonnes · ' +
                fmtInt(weightLb) + ' lb');

            var materialRecord = ENGINE.getMaterial(material) || ENGINE.MATERIALS.pea_gravel;
            var caption = byId('tons-coverage-caption');
            if (caption) {
                caption.textContent = 'How much area 1 short ton of ' + materialRecord.label.toLowerCase() +
                    ' covers at different depths. Calculated at ' + density + ' lb/ft³; 50 lb bags.';
            }
            renderCoverageTable('tons-coverage-body', density, [1, 2, 3, 4, 6, 12]);

            if (!tracked) {
                tracked = true;
                track('calculator_complete', { page: 'gravel_tons', material: material });
            }
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            update();
        });
        form.addEventListener('input', update);
        form.addEventListener('change', update);
        update();
    }

    // -----------------------------------------------------------------
    // Crushed stone
    // -----------------------------------------------------------------
    function initCrushedStone() {
        var form = byId('stone-calc-form');
        if (!form) return;

        bindShapeToggle('stone-shape', {
            rectangle: 'stone-rect-dimensions',
            circle: 'stone-circle-dimensions',
            lshape: 'stone-lshape-dimensions'
        });

        var tracked = false;

        function layerResults(materialValue, density, depthInches, waste, compaction) {
            return ENGINE.calculate(calculatorInput({
                shape: valueOf('stone-shape') || 'rectangle',
                dimensions: readDimensions('stone', valueOf('stone-shape') || 'rectangle'),
                depthInches: depthInches,
                material: resolveMaterial(materialValue),
                customDensityLbPerCuFt: density,
                wastePercent: waste,
                compactionPercent: compaction
            }));
        }

        function combinedResults(layers) {
            var totalVolumeCuFt = 0;
            var totalWeightLb = 0;
            layers.forEach(function (layer) {
                totalVolumeCuFt += layer.volumeCuFt;
                totalWeightLb += layer.weightLb;
            });
            var totalBags = totalWeightLb > 0 ? ceilQuantity(totalWeightLb / 50) : 0;
            return {
                volumeCuFt: totalVolumeCuFt,
                volumeCuYd: totalVolumeCuFt / 27,
                volumeM3: (totalVolumeCuFt / 27) * 0.764554857984,
                weightLb: totalWeightLb,
                weightShortTons: totalWeightLb / LB_PER_SHORT_TON,
                weightKg: totalWeightLb * KG_PER_LB,
                weightMetricTonnes: (totalWeightLb * KG_PER_LB) / 1000,
                bags: totalBags,
                bags25kg: totalWeightLb > 0 ? ceilQuantity((totalWeightLb * KG_PER_LB) / 25) : 0,
                pallets: totalBags > 0 ? Math.ceil(totalBags / BAGS_PER_PALLET) : 0,
                fullPallets: totalBags > 0 ? Math.floor(totalBags / BAGS_PER_PALLET) : 0,
                looseBags: totalBags > 0 ? totalBags % BAGS_PER_PALLET : 0,
                palletsMetric: 0,
                fullPalletsMetric: 0,
                looseBagsMetric: 0,
                bagSizeLb: 50,
                bagSizeKg: 25,
                hasVolume: totalVolumeCuFt > 0
            };
        }

        function update() {
            if (!ENGINE) return fail('stone-calc-status');

            var code = valueOf('stone-size-code') || '#57';
            var application = valueOf('stone-application') || 'base';
            var depth = numberFrom('stone-depth', 4);
            var waste = numberFrom('stone-waste', 0);
            var compaction = numberFrom('stone-compaction', 0);
            var density = resolveDensity(code) || 100;
            var results;
            var note;

            if (application === 'driveway') {
                var base = layerResults('crusher_run', 105, 4, waste, compaction);
                var surface = layerResults(code, density, depth, waste, compaction);
                results = combinedResults([base, surface]);
                note = 'Driveway total: 4″ crusher run base + ' + depth + '″ ' + code +
                    ' surface. Allowances apply to both layers.';
            } else if (application === 'surface') {
                results = layerResults(code, density, depth, waste, compaction);
                note = 'Surface layer: ' + depth + '″ of ' + code + ' at ' + density + ' lb/ft³.';
            } else {
                results = layerResults(code, density, depth, waste, compaction);
                note = 'Base layer: ' + depth + '″ of ' + code + ' at ' + density + ' lb/ft³.';
            }

            if (!results.hasVolume) {
                hide('stone-results');
                hide('stone-coverage');
                hide('stone-results-note');
                setText('stone-calc-status', 'Enter area dimensions and depth to see an estimate.');
                return;
            }

            show('stone-results');
            show('stone-coverage');
            show('stone-results-note');
            setText('stone-calc-status', 'Estimate updated.');
            setText('stone-results-note', note);

            renderVolumeWeightBags(results, {
                volume: 'stone-volume',
                volumeAlt: 'stone-volume-alt',
                weight: 'stone-weight',
                weightAlt: 'stone-weight-alt',
                bags: 'stone-bags',
                bagsAlt: 'stone-bags-alt'
            }, false, 25);

            var caption = byId('stone-coverage-caption');
            if (caption) {
                caption.textContent = 'How much area 1 short ton of ' + code + ' covers at different depths. ' +
                    'Calculated at ' + density + ' lb/ft³; 50 lb bags.';
            }
            renderCoverageTable('stone-coverage-body', density, [2, 3, 4]);

            if (!tracked) {
                tracked = true;
                track('calculator_complete', { page: 'crushed_stone', material: 'crushed_stone' });
            }
        }

        var application = byId('stone-application');
        if (application) {
            application.addEventListener('change', function () {
                var depth = byId('stone-depth');
                if (!depth) return;
                if (application.value === 'base') depth.value = 4;
                else if (application.value === 'surface') depth.value = 2;
                else if (application.value === 'driveway') depth.value = 2;
            });
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            update();
        });
        form.addEventListener('input', update);
        form.addEventListener('change', update);
        update();
    }

    // -----------------------------------------------------------------
    // Driveway
    // -----------------------------------------------------------------
    function initDriveway() {
        var form = byId('driveway-calc-form');
        if (!form) return;

        bindShapeToggle('driveway-shape', {
            rectangle: 'driveway-rect-dimensions',
            circle: 'driveway-circle-dimensions'
        });

        var tracked = false;

        function layerResults(materialValue, density, depthInches, waste, compaction) {
            return ENGINE.calculate(calculatorInput({
                shape: valueOf('driveway-shape') || 'rectangle',
                dimensions: readDimensions('driveway', valueOf('driveway-shape') || 'rectangle'),
                depthInches: depthInches,
                material: resolveMaterial(materialValue),
                customDensityLbPerCuFt: density,
                wastePercent: waste,
                compactionPercent: compaction
            }));
        }

        function combinedResults(layers) {
            var totalVolumeCuFt = 0;
            var totalWeightLb = 0;
            layers.forEach(function (layer) {
                totalVolumeCuFt += layer.volumeCuFt;
                totalWeightLb += layer.weightLb;
            });
            var totalBags = totalWeightLb > 0 ? ceilQuantity(totalWeightLb / 50) : 0;
            return {
                volumeCuFt: totalVolumeCuFt,
                volumeCuYd: totalVolumeCuFt / 27,
                volumeM3: (totalVolumeCuFt / 27) * 0.764554857984,
                weightLb: totalWeightLb,
                weightShortTons: totalWeightLb / LB_PER_SHORT_TON,
                weightKg: totalWeightLb * KG_PER_LB,
                weightMetricTonnes: (totalWeightLb * KG_PER_LB) / 1000,
                bags: totalBags,
                bags25kg: totalWeightLb > 0 ? ceilQuantity((totalWeightLb * KG_PER_LB) / 25) : 0,
                pallets: totalBags > 0 ? Math.ceil(totalBags / BAGS_PER_PALLET) : 0,
                fullPallets: totalBags > 0 ? Math.floor(totalBags / BAGS_PER_PALLET) : 0,
                looseBags: totalBags > 0 ? totalBags % BAGS_PER_PALLET : 0,
                palletsMetric: 0,
                fullPalletsMetric: 0,
                looseBagsMetric: 0,
                bagSizeLb: 50,
                bagSizeKg: 25,
                hasVolume: totalVolumeCuFt > 0
            };
        }

        function update() {
            if (!ENGINE) return fail('driveway-calc-status');

            var materialValue = valueOf('driveway-material') || 'pea_gravel';
            var config = valueOf('driveway-config') || 'base-only';
            var depth = numberFrom('driveway-depth', 4);
            var waste = numberFrom('driveway-waste', 0);
            var compaction = numberFrom('driveway-compaction', 0);
            var density = resolveDensity(materialValue, valueOf('driveway-custom-density'));
            var results;
            var note;

            if (config === 'base-and-surface') {
                var base = layerResults('crusher_run', 105, 4, waste, compaction);
                var surface = layerResults(materialValue, density, depth, waste, compaction);
                results = combinedResults([base, surface]);
                note = 'Driveway total: 4″ crusher run base + ' + depth + '″ ' +
                    (density ? density + ' lb/ft³' : '') + ' surface.';
            } else if (config === 'surface-only') {
                results = layerResults(materialValue, density, depth, waste, compaction);
                note = 'Surface layer only: ' + depth + '″ at ' +
                    (density || 'the selected') + ' lb/ft³.';
            } else {
                results = layerResults(materialValue, density, depth, waste, compaction);
                note = 'Base layer only: ' + depth + '″ at ' +
                    (density || 'the selected') + ' lb/ft³.';
            }

            if (!results.hasVolume) {
                hide('driveway-results');
                hide('driveway-coverage');
                hide('driveway-results-note');
                setText('driveway-calc-status', 'Enter driveway dimensions and depth to see an estimate.');
                return;
            }

            show('driveway-results');
            show('driveway-coverage');
            show('driveway-results-note');
            setText('driveway-calc-status', 'Estimate updated.');
            setText('driveway-results-note', note);

            renderVolumeWeightBags(results, {
                volume: 'driveway-volume',
                volumeAlt: 'driveway-volume-alt',
                weight: 'driveway-weight',
                weightAlt: 'driveway-weight-alt',
                bags: 'driveway-bags',
                bagsAlt: 'driveway-bags-alt'
            }, false, 25);

            var densityForTable = density || 105;
            var caption = byId('driveway-coverage-caption');
            if (caption) {
                caption.textContent = 'How much area 1 short ton covers at different depths for this driveway material. ' +
                    'Calculated at ' + densityForTable + ' lb/ft³; 50 lb bags.';
            }
            renderCoverageTable('driveway-coverage-body', densityForTable, [2, 4]);

            if (!tracked) {
                tracked = true;
                track('calculator_complete', { page: 'driveway' });
            }
        }

        var config = byId('driveway-config');
        if (config) {
            config.addEventListener('change', function () {
                var depth = byId('driveway-depth');
                if (!depth) return;
                if (config.value === 'base-only') depth.value = 4;
                else if (config.value === 'surface-only') depth.value = 2;
                else if (config.value === 'base-and-surface') depth.value = 2;
            });
        }

        var material = byId('driveway-material');
        if (material) {
            material.addEventListener('change', function () {
                var custom = byId('driveway-custom-density-wrap');
                if (custom) custom.classList.toggle('hidden', material.value !== 'custom');
            });
            var custom = byId('driveway-custom-density-wrap');
            if (custom) custom.classList.toggle('hidden', material.value !== 'custom');
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            update();
        });
        form.addEventListener('input', update);
        form.addEventListener('change', update);
        update();
    }

    // -----------------------------------------------------------------
    // Gravel cost
    // -----------------------------------------------------------------
    function initCost() {
        var form = byId('cost-calc-form');
        if (!form) return;

        bindShapeToggle('cost-shape', {
            rectangle: 'cost-rect-dimensions',
            circle: 'cost-circle-dimensions',
            lshape: 'cost-lshape-dimensions'
        });

        var tracked = false;

        function update() {
            if (!ENGINE) return fail('cost-calc-status');

            var shape = valueOf('cost-shape') || 'rectangle';
            var materialValue = valueOf('cost-material') || 'pea_gravel';
            var material = resolveMaterial(materialValue);
            var customDensity = resolveDensity(materialValue, valueOf('cost-custom-density'));
            var results = ENGINE.calculate(calculatorInput({
                shape: shape,
                dimensions: readDimensions('cost', shape),
                depthInches: numberFrom('cost-depth', 3),
                material: material,
                customDensityLbPerCuFt: customDensity,
                wastePercent: numberFrom('cost-waste-percent', 0),
                compactionPercent: numberFrom('cost-compaction-percent', 0)
            }));

            if (!results.hasVolume) {
                hide('cost-results');
                hide('cost-quantity');
                hide('cost-verdict');
                setText('cost-calc-status', 'Enter project dimensions and depth to see a cost estimate.');
                return;
            }

            var currency = valueOf('cost-currency') || 'USD';
            var delivery = numberFrom('cost-delivery', 0);
            var taxRate = numberFrom('cost-tax', 0);

            var bulkByTon = numberFrom('cost-price-per-ton', 0);
            var bulkByYard = numberFrom('cost-price-per-yard', 0);
            var bulkOptions = [];

            if (bulkByTon > 0) {
                var tonMaterial = round(results.weightShortTons * bulkByTon, 2);
                var tonTax = round((tonMaterial + delivery) * taxRate / 100, 2);
                bulkOptions.push({
                    basis: 'per short ton',
                    material: tonMaterial,
                    delivery: delivery,
                    tax: tonTax,
                    total: round(tonMaterial + delivery + tonTax, 2)
                });
            }

            if (bulkByYard > 0) {
                var yardMaterial = round(results.volumeCuYd * bulkByYard, 2);
                var yardTax = round((yardMaterial + delivery) * taxRate / 100, 2);
                bulkOptions.push({
                    basis: 'per cubic yard',
                    material: yardMaterial,
                    delivery: delivery,
                    tax: yardTax,
                    total: round(yardMaterial + delivery + yardTax, 2)
                });
            }

            var bagOptions = [];
            [50, 40, 60].forEach(function (size) {
                var price = numberFrom('cost-bag-price-' + size, 0);
                if (price <= 0) return;
                var bags = ceilQuantity(results.weightLb / size);
                var materialCost = round(bags * price, 2);
                var tax = round(materialCost * taxRate / 100, 2);
                bagOptions.push({
                    size: size,
                    bags: bags,
                    price: price,
                    material: materialCost,
                    delivery: 0,
                    tax: tax,
                    total: round(materialCost + tax, 2)
                });
            });

            if (bulkOptions.length === 0 && bagOptions.length === 0) {
                hide('cost-results');
                hide('cost-quantity');
                hide('cost-verdict');
                setText('cost-calc-status', 'Enter a bulk price per ton, a bulk price per cubic yard, or a bag price.');
                return;
            }

            bulkOptions.sort(function (a, b) { return a.total - b.total; });
            bagOptions.sort(function (a, b) { return a.total - b.total; });

            var bulk = bulkOptions[0] || null;
            var bag = bagOptions[0] || null;

            show('cost-results');
            setText('cost-quantity', fmt(results.volumeCuYd, 2) + ' yd³ · ' +
                fmt(results.weightShortTons, 2) + ' short tons · ' +
                fmt(results.volumeM3, 2) + ' m³');
            show('cost-quantity');
            setText('cost-calc-status', 'Cost estimate updated. Delivery applies to bulk; bags are treated as pickup.');

            if (bag) {
                setText('cost-bag-total', money(bag.total, currency));
                setText('cost-bag-total-alt', fmtInt(bag.bags) + ' × ' + bag.size + ' lb bags at ' +
                    money(bag.price, currency) + ' each · includes ' + money(bag.tax, currency) + ' tax');
            } else {
                setText('cost-bag-total', '—');
                setText('cost-bag-total-alt', 'Enter a bag price to compare.');
            }

            if (bulk) {
                setText('cost-bulk-total', money(bulk.total, currency));
                setText('cost-bulk-total-alt', money(bulk.material, currency) + ' material + ' +
                    money(bulk.delivery, currency) + ' delivery + ' +
                    money(bulk.tax, currency) + ' tax · priced ' + bulk.basis);
            } else {
                setText('cost-bulk-total', '—');
                setText('cost-bulk-total-alt', 'Enter a bulk price to compare.');
            }

            if (bulk && bag) {
                var difference = round(Math.abs(bulk.total - bag.total), 2);
                var cheaper = 'equal';
                var savingsPercent = 0;
                if (bulk.total < bag.total) {
                    cheaper = 'bulk';
                    savingsPercent = bag.total > 0 ? round((difference / bag.total) * 100, 1) : 0;
                } else if (bag.total < bulk.total) {
                    cheaper = 'bag';
                    savingsPercent = bulk.total > 0 ? round((difference / bulk.total) * 100, 1) : 0;
                }

                setText('cost-savings', money(difference, currency));
                if (cheaper === 'bulk') {
                    setText('cost-savings-alt', 'Bulk is cheaper by ' + savingsPercent + '%.');
                    setText('cost-verdict-text', 'Bulk delivery is cheaper for this project.');
                    setText('cost-savings-percent', 'Save ' + money(difference, currency) +
                        ' (' + savingsPercent + '%) compared with the lowest bag option.');
                } else if (cheaper === 'bag') {
                    setText('cost-savings-alt', 'Bags are cheaper by ' + savingsPercent + '%.');
                    setText('cost-verdict-text', 'Bags are cheaper for this project at the prices entered.');
                    setText('cost-savings-percent', 'Save ' + money(difference, currency) +
                        ' (' + savingsPercent + '%) compared with the bulk option.');
                } else {
                    setText('cost-savings', money(0, currency));
                    setText('cost-savings-alt', 'Both options cost the same.');
                    setText('cost-verdict-text', 'Both options cost the same at the prices entered.');
                    setText('cost-savings-percent', 'No difference.');
                }
                show('cost-verdict');
            } else {
                setText('cost-savings', '—');
                setText('cost-savings-alt', 'Enter both a bulk price and a bag price to compare.');
                hide('cost-verdict');
            }

            if (!tracked) {
                tracked = true;
                track('calculator_complete', { page: 'gravel_cost', material: material });
            }
        }

        var material = byId('cost-material');
        if (material) {
            material.addEventListener('change', function () {
                var custom = byId('cost-custom-density');
                if (custom) custom.classList.toggle('hidden', material.value !== 'custom');
            });
            var custom = byId('cost-custom-density');
            if (custom) custom.classList.toggle('hidden', material.value !== 'custom');
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            update();
        });
        form.addEventListener('input', update);
        form.addEventListener('change', update);
        update();
    }

    function boot() {
        initPea();
        initFrenchDrain();
        initBag();
        initTons();
        initCrushedStone();
        initDriveway();
        initCost();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
}());
