/*
 * Analytics configuration.
 *
 * Add the GA4 measurement ID from your Google Analytics property, for example:
 *   measurementId: "G-XXXXXXXXXX"
 *
 * Until a valid ID is present, analytics.js will not load Google Analytics and
 * will not show an analytics consent prompt. Nothing is tracked.
 */
window.PGC_ANALYTICS = {
    measurementId: "",
    consentVersion: 1,
    // Set to true only while testing locally. It logs events to the console and
    // never sends them anywhere.
    debug: false
};
