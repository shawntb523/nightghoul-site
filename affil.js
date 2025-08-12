/*
 * Affiliate link rewriting script for Nightghoul Deals & Settings Lab.
 *
 * This script reads a JSON configuration from `/config.json` and rewrites
 * hyperlinks marked with a `data-affil` attribute. It supports three
 * modes of rewriting:
 *  - append: Appends query parameters (e.g. Amazon tag and subid) to the
 *    destination URL.
 *  - template: Uses a deeplink template provided by the affiliate program,
 *    inserting the destination URL and subid into placeholders.
 *  - static: Uses a fixed referral link (with optional {SUBID} substitution).
 *
 * Each affiliate link can specify its own `data-subid`. If omitted, the
 * `subid` is generated automatically using the default rule defined in
 * `config.json` (e.g. `site-{PAGE}-{BUTTON}`), where `{PAGE}` is the
 * `data-page` attribute on the `<body>` element and `{BUTTON}` is a
 * sequential identifier (e.g. `btn0`, `btn1`). UTM parameters defined
 * in the config will be appended to the final URL if they are not already
 * present.
 */
(async function () {
  try {
    const resp = await fetch('/config.json');
    const config = await resp.json();
    const affiliates = config.affiliates || {};
    const defaults = config.defaults || {};
    // Determine current page slug from the body's data attribute
    const pageSlug = document.body.getAttribute('data-page') || 'unknown';
    // Counter for generating unique button identifiers per page
    let buttonCounter = 0;
    // Process each anchor element that declares a data-affil attribute
    document.querySelectorAll('a[data-affil]').forEach((el) => {
      const affilKey = el.dataset.affil;
      const dest = el.dataset.url || '';
      let subid = el.dataset.subid;
      if (!subid) {
        subid = defaults.subid
          .replace('{PAGE}', pageSlug)
          .replace('{BUTTON}', 'btn' + buttonCounter++);
      }
      const affConfig = affiliates[affilKey];
      let finalUrl = dest;
      if (affConfig) {
        if (affConfig.mode === 'append') {
          const query = affConfig.append.replace('{SUBID}', subid);
          finalUrl = dest + (dest.includes('?') ? '&' : '?') + query;
        } else if (affConfig.mode === 'template') {
          finalUrl = affConfig.template
            .replace('{DEST}', encodeURIComponent(dest))
            .replace('{SUBID}', subid);
        } else if (affConfig.mode === 'static') {
          finalUrl = affConfig.link.replace('{SUBID}', subid);
        }
        // Append UTM parameters if defined and not already present
        if (defaults.utm) {
          const hasUtm = /utm_source=/i.test(finalUrl);
          if (!hasUtm) {
            finalUrl += (finalUrl.includes('?') ? '&' : '?') + defaults.utm;
          }
        }
      }
      // Apply attributes for affiliate compliance
      el.href = finalUrl;
      el.target = '_blank';
      el.rel = 'sponsored noopener noreferrer';
    });
  } catch (err) {
    console.error('Affiliate script error:', err);
  }
})();
