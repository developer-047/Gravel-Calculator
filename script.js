// ========================================
// DENSITY DATABASE
// ========================================
const DENSITIES = {
    pea_gravel: 105,      // lbs per cubic foot
    crushed_stone: 100,   // lbs per cubic foot
    sand: 110,            // lbs per cubic foot
    river_rock: 108       // lbs per cubic foot
};

// ========================================
// STATE MANAGEMENT
// ========================================
let currentShape = 'rectangle';
let currentMaterial = 'pea_gravel';
let currentDepthInches = 3; // Slider value in inches
let currentUnit = 'imperial'; // 'imperial' or 'metric'

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Converts input values to feet for uniform calculation
 * Handles both Imperial (ft/in) and Metric (m/cm) inputs
 */
function toFeet(largeUnitVal, smallUnitVal) {
    let large = parseFloat(largeUnitVal) || 0;
    let small = parseFloat(smallUnitVal) || 0;
    large = Math.max(0, large);
    small = Math.max(0, small);

    if (currentUnit === 'imperial') {
        // Feet & Inches
        return large + (small / 12);
    } else {
        // Meters & Centimeters
        // Convert everything to feet
        const metersFromLarge = large;
        const metersFromSmall = small / 100;
        const totalMeters = metersFromLarge + metersFromSmall;
        return totalMeters * 3.28084; // Convert meters to feet
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
 * Calculates number of 50lb bags needed
 */
function calculateBags(tons) {
    const totalLbs = tons * 2000;
    const bags = Math.ceil(totalLbs / 50);
    return bags;
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

    // Get current material density
    const density = DENSITIES[currentMaterial];

    // Calculate results
    const volume = calculateVolume(area, depth);
    const weight = calculateWeight(volume, density);
    const bags = calculateBags(weight);

    // Display results
    displayResults(volume, weight, bags);

    // Update SVG visualizer
    updateSVGVisualizer();
}

function displayResults(volume, weight, bags) {
    document.getElementById('result-volume').textContent = volume.toFixed(2);
    document.getElementById('result-weight').textContent = weight.toFixed(2);
    document.getElementById('result-bags').textContent = bags.toLocaleString();

    // Toggle Export Buttons (both desktop and mobile versions)
    const hasData = volume > 0;

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
}

// ========================================
// UI INTERACTION HANDLERS
// ========================================

function switchShape(shape) {
    currentShape = shape;

    // Update shape buttons
    document.querySelectorAll('.shape-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-shape="${shape}"]`).classList.add('active');

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

    // Recalculate
    performCalculation();
}

function updateMaterial() {
    const select = document.getElementById('material-select');
    currentMaterial = select.value;
    performCalculation();
}

function updateDepth() {
    const slider = document.getElementById('depth-slider');
    currentDepthInches = parseFloat(slider.value);

    // Update display
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

    performCalculation();
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
}

/**
 * Converts all input fields to the target unit
 */
function convertValues(toUnit) {
    const inputs = document.querySelectorAll('.dimension-input');

    // We process "ft/m" (large) and "in/cm" (small) separately based on ID naming
    // But since logic is local, we can just iterate. 
    // Actually, converting individually is tricky because say 1ft 6in -> 0m 45cm.
    // It's a combined unit conversion.
    // Strategy: Read pair by pair.

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

        // Step A: Normalize to Feet first
        if (currentUnit === 'imperial') {
            totalFeet = largeVal + (smallVal / 12);
        } else {
            // currently metric: large=m, small=cm
            totalFeet = (largeVal * 3.28084) + (smallVal / 100 * 3.28084);
        }

        // Step B: Convert to Target
        if (toUnit === 'metric') {
            // Feet -> Meters
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
            // Meters -> Feet (actually Feet -> Feet since we normalized to feet)
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

    // Handle Depth Slider conversion? 
    // The slider value is always in inches stored in `currentDepthInches`.
    // It is view-independent. We only update the label text in `updateDepth()`.
}

function updateUnitUI() {
    // Labels
    document.querySelectorAll('.unit-label-large').forEach(el => {
        el.textContent = currentUnit === 'imperial' ? 'ft' : 'm';
    });
    document.querySelectorAll('.unit-label-small').forEach(el => {
        el.textContent = currentUnit === 'imperial' ? 'in' : 'cm';
    });

    // Toggle Pill Animation
    const pill = document.getElementById('unit-pill');
    const btnImp = document.getElementById('btn-imperial');
    const btnMet = document.getElementById('btn-metric');

    if (currentUnit === 'imperial') {
        pill.style.transform = 'translateX(0)';
        btnImp.classList.replace('text-slate-500', 'text-blue-600');
        btnMet.classList.replace('text-blue-600', 'text-slate-500');
    } else {
        pill.style.transform = 'translateX(100%)';
        // Need to account for the gap? 
        // css logic: left-1. 100% moves it to right edge aligned? 
        // actually w-[calc(50%-4px)]. 
        // parent padding-1. relative.
        // translate-x-full works if width is exactly 50%.
        // Let's rely on simple pixel math or percentage if possible.
        // Tailwind 'translate-x-[104%]' might be needed or standard css.
        pill.style.transform = 'translateX(calc(100% + 4px))'; // Move over width + gap

        btnImp.classList.replace('text-blue-600', 'text-slate-500');
        btnMet.classList.replace('text-slate-500', 'text-blue-600');
    }
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

    // Material selection listener
    document.getElementById('material-select').addEventListener('change', updateMaterial);

    // Depth slider listener
    document.getElementById('depth-slider').addEventListener('input', updateDepth);

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

    // Initial calculation
    performCalculation();
});

// ========================================
// INITIALIZATION
// ========================================

// Set initial values
currentMaterial = document.getElementById('material-select').value;
updateDepth(); // Set initial depth display

// ========================================
// PRINT & EXPORT LOGIC
// ========================================

/**
 * Prepares the hidden print layout with current data
 */
function preparePrintView() {
    // 1. Date
    const dateOpts = { year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById('print-date').textContent = new Date().toLocaleDateString('en-US', dateOpts);

    // 2. Material
    const matSelect = document.getElementById('material-select');
    const matText = matSelect.options[matSelect.selectedIndex].text;
    document.getElementById('print-material').textContent = matText;

    // 3. Shape & Dimensions
    document.getElementById('print-shape').textContent = currentShape.charAt(0).toUpperCase() + currentShape.slice(1);

    let dimString = '';

    // Labels based on Unit
    const uLarge = currentUnit === 'imperial' ? "'" : 'm';
    const uSmall = currentUnit === 'imperial' ? '"' : 'cm';

    if (currentShape === 'rectangle') {
        const lF = document.getElementById('rect-length-ft').value || 0;
        const lI = document.getElementById('rect-length-in').value || 0;
        const wF = document.getElementById('rect-width-ft').value || 0;
        const wI = document.getElementById('rect-width-in').value || 0;
        dimString = `Length: ${lF}${uLarge} ${lI}${uSmall}, Width: ${wF}${uLarge} ${wI}${uSmall}`;
    } else if (currentShape === 'circle') {
        const dF = document.getElementById('circle-diameter-ft').value || 0;
        const dI = document.getElementById('circle-diameter-in').value || 0;
        dimString = `Diameter: ${dF}${uLarge} ${dI}${uSmall}`;
    } else if (currentShape === 'lshape') {
        const aLF = document.getElementById('lshape-a-length-ft').value || 0;
        const aWF = document.getElementById('lshape-a-width-ft').value || 0;
        const bLF = document.getElementById('lshape-b-length-ft').value || 0;
        const bWF = document.getElementById('lshape-b-width-ft').value || 0;
        dimString = `Section A: ${aLF}${uLarge} x ${aWF}${uLarge} | Section B: ${bLF}${uLarge} x ${bWF}${uLarge}`;
    }

    // Depth Label
    let depthStr = '';
    if (currentUnit === 'imperial') {
        depthStr = `${currentDepthInches}"`;
    } else {
        const mm = Math.round(currentDepthInches * 25.4);
        depthStr = `${mm}mm`;
    }

    document.getElementById('print-dims').textContent = dimString + ` @ ${depthStr} Depth`;

    // 4. Results
    document.getElementById('print-volume').textContent = document.getElementById('result-volume').textContent;
    document.getElementById('print-weight').textContent = document.getElementById('result-weight').textContent;
    document.getElementById('print-bags').textContent = document.getElementById('result-bags').textContent;
}

// Hook into window print event
window.onbeforeprint = preparePrintView;

/**
 * Lazy loads html2pdf and generates PDF
 */
function generatePDF() {
    const btn = document.getElementById('btn-pdf');
    const originalContent = btn.innerHTML;

    // Loading State
    btn.innerHTML = `<svg class="animate-spin h-5 w-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> <span>Generating...</span>`;
    btn.disabled = true;

    // Load Library
    if (!window.html2pdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => createPdf(btn, originalContent);
        document.head.appendChild(script);
    } else {
        createPdf(btn, originalContent);
    }
}

function createPdf(btn, originalContent) {
    preparePrintView();

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

    // Loading State
    btn.innerHTML = `<svg class="animate-spin h-5 w-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> <span>Generating...</span>`;
    btn.disabled = true;

    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5], // Top, Left, Bottom, Right
        filename: 'Gravel_Estimate_' + new Date().toISOString().split('T')[0] + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollY: 0, // Critical: force canvas to start at top
            scrollX: 0
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(clone).save().then(() => {
        // Cleanup
        document.body.removeChild(container);
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }).catch(err => {
        console.error(err);
        // Cleanup on error
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
        btn.innerHTML = '<span>Error</span>';
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }, 2000);
    });
}

// ========================================
// SHARE TOOL FUNCTION
// ========================================

/**
 * Shares the calculator tool using Web Share API or clipboard fallback
 */
function shareTool() {
    const shareData = {
        title: 'Pro Gravel & Aggregate Calculator',
        text: 'Calculate cubic yards, tons, and bags needed for your gravel project with this free professional tool!',
        url: window.location.href
    };

    // Try Web Share API first (works on mobile and some desktop browsers)
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => {
                console.log('Shared successfully');
            })
            .catch((err) => {
                // User cancelled or error - fallback to clipboard
                if (err.name !== 'AbortError') {
                    copyToClipboard();
                }
            });
    } else {
        // Fallback: Copy URL to clipboard
        copyToClipboard();
    }
}

/**
 * Copies the page URL to clipboard and shows feedback
 */
function copyToClipboard() {
    const url = window.location.href;

    navigator.clipboard.writeText(url).then(() => {
        showShareFeedback('Link copied to clipboard!', true);
    }).catch(() => {
        // Final fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            showShareFeedback('Link copied to clipboard!', true);
        } catch (err) {
            showShareFeedback('Could not copy link', false);
        }

        document.body.removeChild(textArea);
    });
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
