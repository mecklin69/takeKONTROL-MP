/**
 * takeKONTROL — Google Translate widget (optional)
 * =================================================================
 * The site translates its own navigation, headings and buttons through
 * the dictionaries in assets/js/i18n/. Google Translate was bolted on
 * top of that to catch the body copy, and the two fought each other:
 * cart.js carries comments about the i18n sweep wiping its buttons.
 *
 * It is kept, but opt-in. A page gets it only with:
 *
 *     <body data-google-translate>
 *
 * index, cart, enquiry, produktsicherheit and login carry that attribute
 * because they had the widget before. shop and checkout do not, because
 * they never did.
 *
 * Loading it from here rather than from a <script> tag in the markup
 * fixes an ordering hazard: the callback name must exist before Google's
 * script runs, and with page scripts now being deferred modules that was
 * no longer guaranteed.
 * =================================================================
 */

const SCRIPT_SRC = 'https://translate.google.com/translate_a/element.js?cb=tkGoogleTranslateInit';
const CALLBACK = 'tkGoogleTranslateInit';

export function mountGoogleTranslate({ pageLanguage = 'de', languages = 'en,de' } = {}) {
  if (!document.body.hasAttribute('data-google-translate')) return;
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

  // The widget needs a host element. Pages used to hard-code an empty
  // div; creating it here means one less thing to remember in markup.
  let host = document.getElementById('google_translate_element');
  if (!host) {
    host = document.createElement('div');
    host.id = 'google_translate_element';
    document.body.appendChild(host);
  }

  window[CALLBACK] = function tkGoogleTranslateInit() {
    const google = window.google;
    if (!google || !google.translate) return;
    new google.translate.TranslateElement(
      {
        pageLanguage,
        includedLanguages: languages,
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      },
      'google_translate_element'
    );
  };

  const script = document.createElement('script');
  script.src = SCRIPT_SRC;
  script.async = true;
  script.onerror = () => console.warn('[tk] Google Translate did not load; dictionaries still apply.');
  document.head.appendChild(script);
}

/**
 * Drive the widget's hidden <select> so the Google layer follows the
 * language the visitor picked in our own toggle. Called on
 * tk:lang-changed by site.js; a no-op when the widget is not present.
 */
export function syncGoogleTranslate(lang) {
  const host = window.location.hostname;
  const expire = 'expires=Thu, 01 Jan 1970 00:00:00 UTC';

  if (lang === 'de') {
    document.cookie = `googtrans=; path=/; domain=${host}; ${expire}; samesite=lax`;
    document.cookie = `googtrans=; path=/; ${expire}; samesite=lax`;
  } else {
    document.cookie = `googtrans=/de/${lang}; path=/; domain=${host}; secure; samesite=lax`;
    document.cookie = `googtrans=/de/${lang}; path=/; secure; samesite=lax`;
  }

  const combo = document.querySelector('.goog-te-combo');
  if (combo) {
    combo.value = lang;
    combo.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
