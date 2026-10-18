// J.S. Aerospace - Controlador de Navegación Móvil
(function () {
    'use strict';

    function initMobileNav() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks') || navbar.querySelector('.nav-links');

        // Si no existe el botón hamburguesa, crearlo dinámicamente
        if (!navToggle && navLinks) {
            navToggle = document.createElement('button');
            navToggle.id = 'navToggle';
            navToggle.className = 'nav-toggle';
            navToggle.setAttribute('aria-label', 'Abrir Menú de Navegación');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            navbar.appendChild(navToggle);
        }

        // Crear backdrop si no existe en body
        let backdrop = document.querySelector('.nav-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'nav-backdrop';
            document.body.appendChild(backdrop);
        }

        if (navToggle && navLinks) {
            if (navToggle.dataset.navInitialized === 'true') return;
            navToggle.dataset.navInitialized = 'true';

            const toggleMenu = function (forceState) {
                const isOpen = typeof forceState === 'boolean' ? forceState : !navLinks.classList.contains('open');
                navLinks.classList.toggle('open', isOpen);
                backdrop.classList.toggle('active', isOpen);

                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
                }
                navToggle.setAttribute('aria-expanded', String(isOpen));
                if (isOpen) {
                    document.body.classList.add('nav-open');
                } else {
                    document.body.classList.remove('nav-open');
                }
            };

            navToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                toggleMenu();
            });

            backdrop.addEventListener('click', function () {
                toggleMenu(false);
            });

            // Cerrar menú al hacer clic en cualquier enlace
            navLinks.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    toggleMenu(false);
                });
            });

            // Cerrar con Escape
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                    toggleMenu(false);
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNav);
    } else {
        initMobileNav();
    }
    window.addEventListener('load', initMobileNav);
})();
