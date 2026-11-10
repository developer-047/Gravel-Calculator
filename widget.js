/**
 * Pro Gravel Calculator — embeddable widget wiring.
 *
 * Runs only on /gravel-calculator-widget.html, the page third-party sites load
 * in an iframe. All maths comes from calculator-engine.js so the widget, the
 * homepage and the calculator subpages can never disagree.
 *
 * The widget deliberately stays small: one shape, dimensions, depth, material
 * and unit system. Waste, compaction, cost and order sheets stay on the full
 * calculator, which the attribution link points at.
 */
(function () {
    'use strict';

    var ENGINE = typeof window !== 'undefined' ? window.GravelEngine : null;
    if (!ENGINE) return;

    var M_TO_FT = 3.280839895013123;
    var CM_TO_IN = 1 / 2.54;

    var form = document.getElementById('gcw-form');
    if (!form) return;

    var shapeSelect = document.getElementById('gcw-shape');
    var unitSelect = document.getElementById('gcw-units');
    var materialSelect = document.getElementById('gcw-material');
    var depthInput = document.getElementById('gcw-depth');

    var panels = {
        rectangle: document.getElementById('gcw-panel-rectangle'),
        circle: document.getElementById('gcw-panel-circle'),
        lshape: [
            document.getElementById('gcw-panel-lshape'),
            document.getElementById('gcw-panel-lshape-b')
        ]
    };

    var inputs = {
        length: document.getElementById('gcw-length'),
        width: document.getElementById('gcw-width'),
        diameter: document.getElementById('gcw-diameter'),
        aLength: document.getElementById('gcw-a-length'),
        aWidth: document.getElementById('gcw-a-width'),
        bLength: document.getElementById('gcw-b-length'),
        bWidth: document.getElementById('gcw-b-width'),
        depth: depthInput
    };

    var outputs = {
        volume: document.getElementById('gcw-result-volume'),
        weight: document.getElementById('gcw-result-weight'),
        bags: document.getElementById('gcw-result-bags')
    };

    function readNumber(input) {
        if (!input) return 0;
        var value = Number(input.value);
        if (!isFinite(value) || value < 0) return 0;
        return value;
    }

    function unitValue() {
        return unitSelect && unitSelect.value === 'metric' ? 'metric' : 'imperial';
    }

    function largeToFeet(value, unit) {
        return unit === 'metric' ? value * M_TO_FT : value;
    }

    function smallToInches(value, unit) {
        return unit === 'metric' ? value * CM_TO_IN : value;
    }

    function dimensions() {
        var unit = unitValue();
        return {
            lengthFt: largeToFeet(readNumber(inputs.length), unit),
            widthFt: largeToFeet(readNumber(inputs.width), unit),
            diameterFt: largeToFeet(readNumber(inputs.diameter), unit),
            aLengthFt: largeToFeet(readNumber(inputs.aLength), unit),
            aWidthFt: largeToFeet(readNumber(inputs.aWidth), unit),
            bLengthFt: largeToFeet(readNumber(inputs.bLength), unit),
            bWidthFt: largeToFeet(readNumber(inputs.bWidth), unit)
        };
    }

    function setText(element, text) {
        if (element) element.textContent = text;
    }

    function formatCount(value) {
        return Math.round(value).toLocaleString('en-US');
    }

    function render() {
        var unit = unitValue();
        var depthInches = smallToInches(readNumber(inputs.depth), unit);

        var results = ENGINE.calculate({
            shape: shapeSelect ? shapeSelect.value : 'rectangle',
            dimensions: dimensions(),
            depthInches: depthInches,
            material: materialSelect ? materialSelect.value : 'pea_gravel',
            unit: unit,
            wastePercent: 0,
            compactionPercent: 0
        });

        if (!results.hasVolume) {
            setText(outputs.volume, '—');
            setText(outputs.weight, '—');
            setText(outputs.bags, '—');
            return;
        }

        if (unit === 'metric') {
            setText(outputs.volume, ENGINE.formatNumber(results.volumeM3, 2) + ' m³');
            setText(outputs.weight, ENGINE.formatNumber(results.weightMetricTonnes, 2) + ' t');
            setText(outputs.bags, formatCount(results.bags25kg) + ' × ' + results.bagSizeKg + ' kg');
        } else {
            setText(outputs.volume, ENGINE.formatNumber(results.volumeCuYd, 2) + ' yd³');
            setText(outputs.weight, ENGINE.formatNumber(results.weightShortTons, 2) + ' tons');
            setText(outputs.bags, formatCount(results.bags) + ' × ' + results.bagSizeLb + ' lb');
        }
    }

    function setPanels(shape) {
        if (panels.rectangle) panels.rectangle.hidden = shape !== 'rectangle';
        if (panels.circle) panels.circle.hidden = shape !== 'circle';
        panels.lshape.forEach(function (panel) {
            if (panel) panel.hidden = shape !== 'lshape';
        });
    }

    function setUnitLabels(unit) {
        var large = unit === 'metric' ? 'm' : 'ft';
        var small = unit === 'metric' ? 'cm' : 'in';

        Array.prototype.forEach.call(document.querySelectorAll('[data-unit-large]'), function (node) {
            node.textContent = large;
        });
        Array.prototype.forEach.call(document.querySelectorAll('[data-unit-small]'), function (node) {
            node.textContent = small;
        });
    }

    /**
     * Switches the displayed unit system without changing the project: the
     * numbers on screen are converted, so a 10 ft × 10 ft area becomes
     * 3.05 m × 3.05 m and the results stay the same.
     */
    function convertInputs(fromUnit, toUnit) {
        ['length', 'width', 'diameter', 'aLength', 'aWidth', 'bLength', 'bWidth'].forEach(function (key) {
            var input = inputs[key];
            if (!input || input.value === '') return;
            var value = Number(input.value);
            if (!isFinite(value)) return;
            var converted = toUnit === 'metric' ? value / M_TO_FT : value * M_TO_FT;
            input.value = String(Math.round(converted * 100) / 100);
        });

        if (depthInput && depthInput.value !== '') {
            var depth = Number(depthInput.value);
            if (isFinite(depth)) {
                var newDepth = toUnit === 'metric' ? depth / CM_TO_IN : depth * CM_TO_IN;
                depthInput.value = String(Math.round(newDepth * 100) / 100);
            }
        }
    }

    var previousUnit = unitValue();

    form.addEventListener('input', render);
    form.addEventListener('change', function (event) {
        if (event.target === shapeSelect) {
            setPanels(shapeSelect.value);
        }

        if (event.target === unitSelect) {
            var nextUnit = unitValue();
            if (nextUnit !== previousUnit) {
                convertInputs(previousUnit, nextUnit);
                setUnitLabels(nextUnit);
                previousUnit = nextUnit;
            }
        }

        render();
    });

    setPanels(shapeSelect ? shapeSelect.value : 'rectangle');
    setUnitLabels(unitValue());
    render();
}());
