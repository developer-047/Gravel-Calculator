/*
 * Consent-gated analytics and event tracking.
 *
 * - Google Analytics never loads until the visitor accepts analytics.
 * - No measurement ID means no tag, no banner and no tracking.
 * - Events are pushed only after consent; nothing is queued beforehand.
 */
(function () {
    'use strict';

    var config = window.PGC_ANALYTICS || {};
    var measurementId = String(config.measurementId || '').trim();
    var hasMeasurementId = /^G-[A-Z0-9]{6,}$/i.test(measurementId);
    var consentVersion = Number(config.consentVersion) || 1;
    var consentKey = 'pgc_consent';
    var maxConsentAge = 365 * 24 * 60 * 60 * 1000; // 12 months

    var banner = null;
    var lastFocused = null;

    function readConsent() {
        try {
            var raw = window.localStorage.getItem(consentKey);
            if (!raw) return null;
            var saved = JSON.parse(raw);
            if (!saved || saved.version !== consentVersion) return null;
            if (saved.analytics !== 'granted' && saved.analytics !== 'denied') return null;
            if (saved.updatedAt && Date.now() - Date.parse(saved.updatedAt) > maxConsentAge) return null;
            return saved.analytics;
        } catch (error) {
            return null;
        }
    }

    function writeConsent(value) {
        try {
            window.localStorage.setItem(consentKey, JSON.stringify({
                analytics: value,
                version: consentVersion,
                updatedAt: new Date().toISOString()
            }));
        } catch (error) {
            // Storage can be blocked; the choice still applies for this page view.
        }
    }

    function loadGoogleAnalytics() {
        if (!hasMeasurementId || window.__pgcGaLoaded) return;
        window.__pgcGaLoaded = true;

        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };

        // Analytics storage starts denied and is updated only after acceptance.
        window.gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied'
        });
        window.gtag('consent', 'update', { analytics_storage: 'granted' });
        window.gtag('js', new Date());
        window.gtag('config', measurementId, {
            anonymize_ip: true,
            send_page_view: true
        });

        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
        script.onerror = function () {
            if (config.debug) console.warn('[PGC analytics] Google Analytics failed to load.');
        };
        document.head.appendChild(script);
    }

    function applyConsent(value) {
        if (value === 'granted') {
            if (!window.__pgcGaLoaded) {
                loadGoogleAnalytics();
            } else if (window.gtag) {
                window.gtag('consent', 'update', { analytics_storage: 'granted' });
            }
        } else if (window.gtag) {
            window.gtag('consent', 'update', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied'
            });
        }
    }

    function track(name, params) {
        if (!name) return;
        var payload = {};
        Object.keys(params || {}).forEach(function (key) {
            payload[key] = params[key];
        });

        if (readConsent() === 'granted' && hasMeasurementId && typeof window.gtag === 'function') {
            window.gtag('event', name, payload);
        } else if (config.debug) {
            console.info('[PGC analytics]', name, payload);
        }
    }

    function setBodyBannerState(isOpen) {
        if (document.body) {
            document.body.classList.toggle('has-consent-banner', isOpen);
        }
    }

    function hideBanner(restoreFocus) {
        if (!banner) return;
        banner.hidden = true;
        setBodyBannerState(false);
        if (restoreFocus && lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
        }
    }

    function createBanner() {
        if (banner) return banner;

        banner = document.createElement('section');
        banner.id = 'consent-banner';
        banner.className = 'consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-modal', 'false');
        banner.setAttribute('aria-labelledby', 'consent-title');
        banner.setAttribute('aria-describedby', 'consent-text');
        banner.hidden = true;
        document.body.appendChild(banner);

        banner.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                hideBanner(true);
            }
        });

        return banner;
    }

    function showConsentBanner(manual) {
        createBanner();

        if (!hasMeasurementId) {
            banner.innerHTML =
                '<div class="consent-inner">' +
                    '<div class="consent-copy">' +
                        '<h2 id="consent-title" class="consent-title" tabindex="-1">Analytics settings</h2>' +
                        '<p id="consent-text" class="consent-text">Analytics is not connected on this site yet. No analytics tag is loaded and no analytics cookies are set. When a measurement ID is configured, you will be asked before any tracking starts. Read the <a href="/privacy.html">privacy policy</a>.</p>' +
                    '</div>' +
                    '<div class="consent-actions">' +
                        '<button type="button" class="consent-btn consent-btn-primary" data-consent-close>Close</button>' +
                    '</div>' +
                '</div>';
            banner.hidden = false;
            setBodyBannerState(true);
            if (manual) {
                var unavailableTitle = banner.querySelector('.consent-title');
                if (unavailableTitle) unavailableTitle.focus();
            }
            return;
        }

        var current = readConsent();
        banner.innerHTML =
            '<div class="consent-inner">' +
                '<div class="consent-copy">' +
                    '<h2 id="consent-title" class="consent-title" tabindex="-1">Analytics settings</h2>' +
                    '<p id="consent-text" class="consent-text">We use optional Google Analytics to understand which pages and calculator features are useful. It is off until you accept, and calculator inputs are never sent. ' +
                    (current === 'granted' ? 'Analytics is currently on. ' : '') +
                    'Read the <a href="/privacy.html">privacy policy</a>.</p>' +
                '</div>' +
                '<div class="consent-actions">' +
                    '<button type="button" class="consent-btn consent-btn-secondary" data-consent="denied">' +
                        (current === 'granted' ? 'Turn off analytics' : 'Decline analytics') +
                    '</button>' +
                    '<button type="button" class="consent-btn consent-btn-primary" data-consent="granted">' +
                        (current === 'granted' ? 'Keep analytics on' : 'Accept analytics') +
                    '</button>' +
                '</div>' +
            '</div>';

        banner.hidden = false;
        setBodyBannerState(true);

        if (manual) {
            var title = banner.querySelector('.consent-title');
            if (title) title.focus();
        }
    }

    function openConsent() {
        lastFocused = document.activeElement;
        showConsentBanner(true);
    }

    function handleConsentClick(event) {
        var closeButton = event.target.closest('[data-consent-close]');
        if (closeButton) {
            hideBanner(true);
            return;
        }

        var choiceButton = event.target.closest('[data-consent]');
        if (!choiceButton) return;

        var choice = choiceButton.getAttribute('data-consent');
        if (choice !== 'granted' && choice !== 'denied') return;

        writeConsent(choice);
        applyConsent(choice);
        hideBanner(true);

        if (choice === 'granted') {
            track('consent_update', { analytics_consent: 'granted' });
        }
    }

    function bindEvents() {
        document.addEventListener('click', function (event) {
            var opener = event.target.closest('[data-open-consent]');
            if (opener) {
                event.preventDefault();
                openConsent();
                return;
            }

            if (banner && !banner.hidden && banner.contains(event.target)) {
                handleConsentClick(event);
            }
        });

        // The toggle event does not bubble, so use capture.
        document.addEventListener('toggle', function (event) {
            var element = event.target;
            if (!element || element.tagName !== 'DETAILS' || !element.open) return;
            var summary = element.querySelector('summary');
            var question = summary ? summary.textContent.replace(/\s+/g, ' ').trim() : element.id;
            track('faq_open', {
                question: question,
                page: window.location.pathname
            });
        }, true);

        window.addEventListener('beforeprint', function () {
            if (document.getElementById('result-volume')) {
                track('print_estimate', { page: 'calculator' });
            }
        });
    }

    function init() {
        bindEvents();

        var consent = readConsent();
        if (hasMeasurementId && consent === 'granted') {
            applyConsent('granted');
        } else if (hasMeasurementId && consent === null) {
            showConsentBanner(false);
        }
    }

    window.PGC = window.PGC || {};
    window.PGC.track = track;
    window.PGC.openConsent = openConsent;
    window.PGC.getConsent = readConsent;
    window.PGC.analyticsConfigured = hasMeasurementId;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
