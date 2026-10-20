// J.S. Aerospace — enlaces compartibles con foto y descripción
//
// Discord, WhatsApp y Telegram no ejecutan JavaScript: leen las etiquetas
// <meta> del HTML que baja el servidor. Por eso cada lanzamiento (y cada
// propulsor) tiene una copia estática de su ficha en la raíz del sitio:
//   m-<clave>.html  → mision.html?id=<clave>
//   p-<nombre>.html → booster.html?b=<nombre>
// Las genera tools/build-share.py en cada despliegue.
//
// Este archivo arma el enlace compartible, lo copia al portapapeles y, cuando
// la copia existe, deja esa URL en la barra del navegador para que copiarla a
// mano también produzca una vista previa completa.
(function () {
    'use strict';

    var TOAST_ID = 'jsShareToast';

    function dirPath() {
        return location.pathname.replace(/[^/]*$/, '');
    }

    // Mismo criterio que tools/build-share.py
    function slug(value) {
        var s = String(value == null ? '' : value).replace(/[^A-Za-z0-9._-]/g, '-').replace(/^-+/, '');
        return s || 'sin-id';
    }

    function previewUrl(kind, value) {
        var file = (kind === 'booster' ? 'p-' : 'm-') + slug(value) + '.html';
        return location.origin + dirPath() + file;
    }

    function exists(url) {
        if (!window.fetch) return Promise.resolve(false);
        return fetch(url, { method: 'HEAD', cache: 'no-store' })
            .then(function (res) { return !!res.ok; })
            .catch(function () { return false; });
    }

    function toast(message) {
        var node = document.getElementById(TOAST_ID);
        if (!node) {
            node = document.createElement('div');
            node.id = TOAST_ID;
            node.className = 'js-toast';
            node.setAttribute('role', 'status');
            node.setAttribute('aria-live', 'polite');
            document.body.appendChild(node);
        }
        node.textContent = message;
        node.classList.add('in');
        clearTimeout(toast.timer);
        toast.timer = setTimeout(function () { node.classList.remove('in'); }, 3600);
    }

    function legacyCopy(text) {
        var area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.top = '-1000px';
        area.style.opacity = '0';
        document.body.appendChild(area);
        var ok = false;
        try {
            area.select();
            ok = document.execCommand('copy');
        } catch (e) { ok = false; }
        document.body.removeChild(area);
        return ok;
    }

    function copy(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        return Promise.reject(new Error('portapapeles no disponible'));
    }

    function attach(cfg) {
        var btn = cfg.button;
        if (!btn || btn.dataset.shareReady === 'true') return;
        btn.dataset.shareReady = 'true';

        var target;
        var ready;
        if (window.__SHARE_STATIC__) {
            target = window.__SHARE_URL__ || location.href;
            ready = Promise.resolve(target);
        } else {
            var preview = previewUrl(cfg.kind, cfg.id);
            ready = exists(preview).then(function (ok) {
                if (!ok) {
                    // Sin copia publicada todavía: se comparte el enlace directo.
                    target = location.href;
                    return target;
                }
                target = preview;
                if (location.pathname !== new URL(preview, location.href).pathname) {
                    try { history.replaceState(null, '', preview); } catch (e) { /* sin history: se ignora */ }
                }
                return target;
            }).catch(function () {
                target = location.href;
                return target;
            });
        }

        btn.addEventListener('click', function () {
            var wasDisabled = btn.disabled;
            btn.disabled = true;
            ready.then(function (url) {
                var canNativeShare = navigator.share && window.matchMedia &&
                    window.matchMedia('(pointer: coarse)').matches;
                if (canNativeShare) {
                    return navigator.share({
                        title: cfg.title || document.title,
                        text: cfg.text || '',
                        url: url
                    }).catch(function () { /* el usuario canceló: no hacemos nada */ });
                }
                return copy(url).then(function () {
                    toast('Enlace copiado · pegalo en Discord o WhatsApp');
                }).catch(function () {
                    if (legacyCopy(url)) toast('Enlace copiado · pegalo en Discord o WhatsApp');
                    else toast('Copiá el enlace: ' + url);
                });
            }).catch(function () {
                if (legacyCopy(target || location.href)) toast('Enlace copiado · pegalo en Discord o WhatsApp');
                else toast('Copiá el enlace: ' + (target || location.href));
            }).then(function () {
                btn.disabled = wasDisabled;
            });
        });
    }

    window.JSShare = {
        previewUrl: previewUrl,
        attach: attach
    };
})();
