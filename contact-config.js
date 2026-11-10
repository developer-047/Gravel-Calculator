/*
 * Contact form delivery configuration.
 *
 * The contact form validates your details in the browser, then posts JSON to
 * whatever endpoint is set here. Any provider that accepts a JSON POST works,
 * for example:
 *
 *   Formspree  endpoint: "https://formspree.io/f/yourFormId"
 *   Web3Forms  endpoint: "https://api.web3forms.com/submit"   + accessKey
 *   Basin      endpoint: "https://usebasin.com/f/yourFormId"
 *   Formspark  endpoint: "https://submit-form.com/yourFormId"
 *
 * While `endpoint` is empty the form still validates input but sends nothing,
 * and the page states that delivery is not connected.
 *
 * Only the endpoint (and, for providers that require one, the public form key)
 * belongs in this file. Never put a private API secret in client-side code.
 */
window.PGC_CONTACT = {
    endpoint: "https://api.web3forms.com/submit",
    // TODO: add the public Web3Forms access key before enabling delivery.
    // The form keeps showing the "delivery not connected" notice until this is set.
    accessKey: "",
    // Providers that support a subject line use this one.
    subject: "New enquiry from Pro Gravel Calculator",
    // Abort slow requests instead of leaving the button stuck on "Sending".
    timeoutMs: 15000,
    // Set to true while testing locally to log delivery errors in the console.
    debug: false
};
