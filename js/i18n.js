// js/i18n.js
console.log('🔍 i18n.js loaded');

(function(){
  // Absolute paths ensure flags load correctly from any folder level
  const flagPaths = {
    id: '/img/flag-id.png',
    en: '/img/flag-en.jpeg'
  };

  const defaultLang = localStorage.getItem('lang') || 'id';
  console.log('defaultLang:', defaultLang);

  function getNested(obj, key) {
    return key.split('.').reduce((o, k) => (o || {})[k], obj) || '';
  }

  function loadLanguage(lang) {
    console.log('🔄 loadLanguage(', lang, ')');
    return fetch(`/lang/${lang}.json`)
      .then(res => {
        console.log(`fetch /lang/${lang}.json status:`, res.status);
        if (!res.ok) throw new Error(`Cannot load /lang/${lang}.json`);
        return res.json();
      })
      .then(translations => {
        console.log('✅ loaded translations for', lang, translations);

        // 1) Inject translated text
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          const txt = getNested(translations, key);
          if (txt) el.textContent = txt;
        });

        // 2) Inject translated placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
          const key = el.getAttribute('data-i18n-placeholder');
          const txt = getNested(translations, key);
          if (txt) el.setAttribute('placeholder', txt);
        });

        // 3) Inject translated alt attributes
        document.querySelectorAll('[data-i18n-alt]').forEach(el => {
          const key = el.getAttribute('data-i18n-alt');
          const txt = getNested(translations, key);
          if (txt) el.setAttribute('alt', txt);
        });

        // 4) Update document language and persist
        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);

        // 5) Update flag icon
        const flagEl = document.getElementById('current-flag');
        if (flagEl) flagEl.src = flagPaths[lang];
      })
      .catch(err => console.error('i18n error:', err));
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    loadLanguage(defaultLang);

    // Language switcher buttons
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const newLang = btn.getAttribute('data-lang');
        loadLanguage(newLang);

        // Close mobile navbar
        const navEl = document.getElementById('navbarNav');
        if (navEl) {
          const bsCollapse = bootstrap.Collapse.getInstance(navEl)
                            || new bootstrap.Collapse(navEl, { toggle: false });
          bsCollapse.hide();
        }
      });
    });
  });
})();
