/*
 * Analytics configuration.
 *
 * Current setup: direct GA4.
 *   measurementId: "G-5P009C37K2"
 *
 * Alternative: Google Tag Manager.
 *   containerId: "GTM-XXXXXXX"
 *   Add the GA4 tag inside the GTM container and leave measurementId empty.
 *
 * Enable only one mode at a time so the same page view is not counted twice.
 * The GA4 stream ID (for example 16301390077) is only used inside Google
 * Analytics and is not needed in this file.
 *
 * Until a valid ID is present, analytics.js will not load any Google tag and
 * will not show an analytics consent prompt. Nothing is tracked.
 */
window.PGC_ANALYTICS = {
    measurementId: "G-5P009C37K2",
    containerId: "",
    consentVersion: 1,
    // Set to true only while testing locally. It logs events to the console and
    // never sends them anywhere.
    debug: false
};
