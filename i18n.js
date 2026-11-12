/* J.S. Aerospace - motor de traducción ES <-> EN
 * Cómo funciona:
 *  - El idioma se guarda en localStorage ('jsa-lang') o se fuerza con ?lang=en / ?lang=es.
 *  - Los diccionarios (lang/en-*.js) llenan window.JSA_EN  { "texto en español": "English text" }
 *    y window.JSA_EN_RE  [ [/regex/, 'reemplazo $1'], ... ] para textos con valores dinámicos.
 *  - Se traducen nodos de texto y los atributos placeholder / title / alt / aria-label / meta content,
 *    incluido el contenido que el JS de cada página genera después (MutationObserver).
 *  - Lo que no está en el diccionario queda en español, sin romper nada.
 */
(function () {
  'use strict';
  var KEY = 'jsa-lang';
  var lang = 'es';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    lang = q || localStorage.getItem(KEY) || 'es';
    if (lang !== 'es' && lang !== 'en') lang = 'es';
    localStorage.setItem(KEY, lang);
  } catch (e) { /* sin storage: queda 'es' */ }
  window.JSA_LANG = lang;
  document.documentElement.lang = lang;

  /* ---------- Selector de idioma ---------- */
  function addSwitcher() {
    if (document.getElementById('jsaLangSwitch')) return;
    var box = document.createElement('div');
    box.id = 'jsaLangSwitch';
    box.setAttribute('translate', 'no');
    box.style.cssText = 'display:inline-flex;gap:4px;align-items:center;font-family:Orbitron,sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;';
    [['es', 'ES'], ['en', 'EN']].forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = p[1];
      b.setAttribute('aria-label', p[0] === 'es' ? 'Español' : 'English');
      var on = lang === p[0];
      b.style.cssText = 'cursor:pointer;padding:5px 9px;border-radius:6px;font:inherit;border:1px solid ' +
        (on ? '#00f3ff' : 'rgba(255,255,255,.25)') + ';background:' + (on ? 'rgba(0,243,255,.2)' : 'transparent') +
        ';color:' + (on ? '#fff' : 'rgba(255,255,255,.65)') + ';';
      b.onclick = function () {
        try { localStorage.setItem(KEY, p[0]); } catch (e) {}
        var u = new URL(location.href);
        u.searchParams.delete('lang');
        if (u.href === location.href) location.reload(); else location.href = u.href;
      };
      box.appendChild(b);
    });
    var nav = document.getElementById('navLinks') || document.querySelector('.nav-links');
    if (nav) {
      var li = document.createElement('li');
      li.appendChild(box);
      nav.appendChild(li);
    } else {
      box.style.cssText += 'position:fixed;top:12px;right:12px;z-index:10000;';
      document.body.appendChild(box);
    }
  }

  document.addEventListener('DOMContentLoaded', addSwitcher);
  if (lang !== 'en') return;   // en español no hay nada más que hacer

  /* ---------- Traducción ---------- */
  var style = document.createElement('style');
  style.textContent = 'html.i18n-pending body{visibility:hidden}';
  document.head.appendChild(style);
  document.documentElement.classList.add('i18n-pending');
  var reveal = function () { document.documentElement.classList.remove('i18n-pending'); };
  setTimeout(reveal, 2500); // red de seguridad

  var DICT = window.JSA_EN || {};
  var RULES = window.JSA_EN_RE || [];
  var norm = function (s) { return s.replace(/\s+/g, ' ').trim(); };

  function tr(s) {
    var k = norm(s);
    if (!k) return null;
    if (Object.prototype.hasOwnProperty.call(DICT, k)) return DICT[k];
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][0].test(k)) return k.replace(RULES[i][0], RULES[i][1]);
    }
    return null;
  }

  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, CODE: 1 };
  function textNode(n) {
    var p = n.parentNode;
    if (!p || SKIP[p.nodeName]) return;
    if (p.closest && p.closest('[translate="no"]')) return;
    var raw = n.nodeValue;
    var t = tr(raw);
    if (t == null || t === norm(raw)) return;
    var lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
    var out = lead + t + trail;
    if (out !== raw) n.nodeValue = out;
  }

  var ATTRS = ['placeholder', 'title', 'alt', 'aria-label'];
  function attr(el, name) {
    var v = el.getAttribute(name);
    if (!v) return;
    var t = tr(v);
    if (t != null && t !== v) el.setAttribute(name, t);
  }
  function metaContent(el) {
    if (el.nodeName !== 'META') return;
    var n = el.getAttribute('name') || el.getAttribute('property') || '';
    if (/^(description|og:title|og:description|og:image:alt|twitter:title|twitter:description)$/.test(n)) attr(el, 'content');
  }

  function walk(root) {
    if (root.nodeType === 3) return textNode(root);
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    var el = root.nodeType === 9 ? root.documentElement : root;
    if (el.nodeType === 1) {
      ATTRS.forEach(function (a) { if (el.hasAttribute(a)) attr(el, a); });
      metaContent(el);
    }
    var tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = tw.nextNode())) textNode(n);
    if (el.querySelectorAll) {
      var list = el.querySelectorAll('[placeholder],[title],[alt],[aria-label],meta');
      for (var i = 0; i < list.length; i++) {
        ATTRS.forEach(function (a) { if (list[i].hasAttribute(a)) attr(list[i], a); });
        metaContent(list[i]);
      }
    }
  }

  var mo = new MutationObserver(function (muts) {
    for (var i = 0; i < muts.length; i++) {
      var m = muts[i];
      if (m.type === 'characterData') textNode(m.target);
      else if (m.type === 'attributes') { if (m.target.nodeType === 1) attr(m.target, m.attributeName); }
      else for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
    }
  });
  mo.observe(document.documentElement, {
    childList: true, subtree: true, characterData: true,
    attributes: true, attributeFilter: ATTRS
  });

  function full() { walk(document); }
  document.addEventListener('DOMContentLoaded', function () { full(); reveal(); });
  window.addEventListener('load', full);
  window.jsaT = function (s) { var t = tr(s); return t == null ? s : t; };   // para JS que arma textos a mano

  /* alert / confirm / prompt también salen en inglés */
  ['alert', 'confirm', 'prompt'].forEach(function (fn) {
    var orig = window[fn];
    if (typeof orig !== 'function') return;
    window[fn] = function (msg) {
      var args = Array.prototype.slice.call(arguments);
      if (typeof msg === 'string') args[0] = window.jsaT(msg);
      if (fn === 'prompt' && typeof args[1] === 'string') args[1] = window.jsaT(args[1]);
      return orig.apply(window, args);
    };
  });
})();
