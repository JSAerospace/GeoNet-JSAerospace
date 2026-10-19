// J.S. Aerospace — Propulsores (primera etapa del Tomcat)
// Datos compartidos por boosters.html (listado) y booster.html (ficha).
//
// Los núcleos viven en Firebase (`boosters`) y su historial NO se carga a mano:
// se deriva de las misiones que tengan el campo `booster` con el nombre del
// núcleo. Así, asignar un lanzamiento desde Misiones o desde el panel de
// propulsores es la única forma de sumarle un vuelo.
(function () {
    'use strict';

    var MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

    var STATUS = {
        active: { label: 'EN SERVICIO', cls: 'ok', mark: '●' },
        testing: { label: 'EN PRUEBAS', cls: 'live', mark: '◐' },
        maintenance: { label: 'MANTENIMIENTO', cls: 'next', mark: '▲' },
        retired: { label: 'RETIRADO', cls: 'plain', mark: '○' },
        lost: { label: 'PERDIDO', cls: 'bad', mark: '✕' }
    };

    var STATUS_ALIASES = {
        active: 'active', 'en servicio': 'active', servicio: 'active', activo: 'active', operativo: 'active',
        testing: 'testing', 'en pruebas': 'testing', pruebas: 'testing', preparacion: 'testing', 'en preparación': 'testing',
        maintenance: 'maintenance', mantenimiento: 'maintenance',
        retired: 'retired', retirado: 'retired', retiro: 'retired',
        lost: 'lost', perdido: 'lost', destruido: 'lost'
    };

    // Especificaciones fijas del booster Tomcat (no editables)
    var FIXED_SPECS = {
        height: '45 m',
        engines: '7 × JS-4',
        propellant: 'Metano / LOX'
    };

    function statusKey(value) {
        var v = String(value == null ? '' : value).toLowerCase().trim();
        return STATUS_ALIASES[v] || 'active';
    }

    function statusMeta(value) {
        return STATUS[statusKey(value)] || STATUS.active;
    }

    function resultOf(value) {
        var v = String(value == null ? '' : value).toLowerCase().trim();
        if (v === 'failed' || v === 'failure' || v === 'fallo' || v === 'fallido' || v === 'fail') return 'failed';
        if (v === 'partial' || v === 'parcial') return 'partial';
        if (v === 'upcoming' || v === 'scheduled' || v === 'programado' || v === 'in_flight') return 'scheduled';
        return 'success';
    }

    function resultLabel(value) {
        var r = resultOf(value);
        if (r === 'failed') return 'FALLO';
        if (r === 'partial') return 'PARCIAL';
        if (r === 'scheduled') return 'PROGRAMADO';
        return 'ÉXITO';
    }

    function parseDate(raw) {
        var s = String(raw == null ? '' : raw).trim();
        if (!s) return null;
        var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
        m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
        var d = new Date(s);
        return isNaN(d.getTime()) ? null : d;
    }

    function fmtDate(raw) {
        var d = raw instanceof Date ? raw : parseDate(raw);
        if (!d) return '';
        return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
    }

    function fmtShort(raw) {
        var d = raw instanceof Date ? raw : parseDate(raw);
        if (!d) return '—';
        return String(d.getDate()).padStart(2, '0') + ' ' + MONTHS[d.getMonth()].toUpperCase() + ' ' + d.getFullYear();
    }

    function resolveImg(path) {
        var fallback = 'Imagenes/Tomcat-Booster.png';
        if (!path) return fallback;
        var p = String(path).trim();
        if (!p) return fallback;
        if (/^(https?:)?\/\//i.test(p) || p.indexOf('data:') === 0) return p;
        if (p.indexOf('/') !== -1) return p;
        return 'Imagenes/' + p;
    }

    function imageList(b) {
        var imgs = b && b.images;
        if (!imgs) imgs = [];
        if (typeof imgs === 'object' && !Array.isArray(imgs)) imgs = Object.values(imgs);
        imgs = (imgs || []).filter(Boolean);
        if (!imgs.length && b && b.image) imgs = [b.image];
        return imgs;
    }

    // Solo los núcleos del Tomcat forman parte de la flota.
    function isTomcat(b) {
        return String((b && b.vehicle) || '').trim().toLowerCase() === 'tomcat';
    }

    // Vuelos = misiones que apuntan a este núcleo. Nada se escribe a mano.
    function flightsFromMissions(name, missions) {
        var target = String(name || '').trim().toUpperCase();
        if (!target) return [];
        return (missions || [])
            .filter(function (m) {
                return String(m.booster || '').trim().toUpperCase() === target;
            })
            .map(function (m) {
                return {
                    mission: m.title || m.mission || m.name || 'Misión',
                    missionId: m.id || m.__key || '',
                    date: m.date || '',
                    dateObj: parseDate(m.date),
                    landing: m.landing || '',
                    result: resultOf(m.status),
                    status: m.status || ''
                };
            })
            .filter(function (f) { return f.result !== 'scheduled'; })
            .sort(function (a, b) {
                var da = a.dateObj ? a.dateObj.getTime() : 0;
                var db = b.dateObj ? b.dateObj.getTime() : 0;
                return db - da;
            });
    }

    var NO_RECOVERY = /(gasto|desechab|expendable|sin recuperaci|n\/a|^—$|^-$)/i;

    function isRecovered(flight) {
        if (!flight || flight.result === 'failed') return false;
        if (NO_RECOVERY.test(flight.landing || '')) return false;
        return true;
    }

    function statsOf(flights) {
        var total = flights.length;
        var landings = flights.filter(isRecovered).length;
        return {
            flights: flights,
            total: total,
            landings: landings,
            failures: flights.filter(function (f) { return f.result === 'failed'; }).length,
            reuses: total > 0 ? total - 1 : 0,
            successRate: total > 0 ? Math.round((landings / total) * 100) : 0,
            last: flights[0] || null,
            first: flights[total - 1] || null
        };
    }

    function normalize(raw, id) {
        var b = raw || {};
        var name = String(b.name || b.nombre || b.id || '').trim() || 'SIN NOMBRE';
        var out = {
            id: id || b.id || name.toLowerCase(),
            name: name,
            vehicle: String(b.vehicle || b.vehiculo || 'Tomcat').trim() || 'Tomcat',
            block: b.block || b.bloque || '',
            status: statusKey(b.status || b.estado),
            base: b.base || b.pad || 'LC-39B',
            description: b.description || b.descripcion || b.descripción || '',
            notes: b.notes || b.notas || '',
            image: b.image || b.imagen || '',
            images: imageList(b),
            specs: {
                height: FIXED_SPECS.height,
                engines: FIXED_SPECS.engines,
                propellant: FIXED_SPECS.propellant,
                recovery: (b.specs && (b.specs.recovery || b.specs.recuperacion)) || b.recovery || b.recuperacion || 'Barcaza autónoma / LZ-1'
            },
            flights: [],
            seed: !!b.seed
        };
        out.stats = statsOf([]);
        return out;
    }

    function withMissions(b, missions) {
        if (!b) return b;
        var flights = flightsFromMissions(b.name, missions);
        var out = Object.assign({}, b, { flights: flights });
        var s = statsOf(flights);
        out.stats = s;
        out.totalFlights = s.total;
        out.lastFlight = s.last ? s.last.date : '';
        return out;
    }

    // Catálogo de referencia: solo Tomcat, sin historial inventado.
    // El historial aparece a medida que se asignan misiones.
    var SEED_RAW = [
        {
            id: 'z2001',
            name: 'Z2001',
            status: 'active',
            block: 'Booster · Bloque 1',
            base: 'LC-39B',
            image: 'Imagenes/Tomcat-Booster.png',
            images: ['Imagenes/Tomcat-Booster.png', 'Imagenes/Tomcat 4.png'],
            description: 'Núcleo inaugural del programa Tomcat. Abrió la campaña con el vuelo de calificación y después pasó a las misiones comerciales.',
            specs: { recovery: 'Barcaza autónoma' }
        },
        {
            id: 'z2002',
            name: 'Z2002',
            status: 'active',
            block: 'Booster · Bloque 1',
            base: 'LC-39B',
            image: 'Imagenes/Tomcat-Booster.png',
            images: ['Imagenes/Tomcat-Booster.png'],
            description: 'Núcleo de alta cadencia del Tomcat, pensado para encadenar misiones con inspección mínima entre vuelos.',
            specs: { recovery: 'Barcaza autónoma' }
        },
        {
            id: 'z2003',
            name: 'Z2003',
            status: 'active',
            block: 'Booster · Bloque 1',
            base: 'LC-39B',
            image: 'Imagenes/Tomcat-Booster.png',
            images: ['Imagenes/Tomcat-Booster.png', 'Imagenes/Tomcat-Completo.png'],
            description: 'Tercer núcleo operativo del Tomcat. Asignado a la campaña de despliegue de la constelación GeoNet.',
            specs: { recovery: 'Barcaza autónoma' }
        },
        {
            id: 'z2004',
            name: 'Z2004',
            status: 'testing',
            block: 'Booster · Bloque 1',
            base: 'LC-39B',
            image: 'Imagenes/Tomcat-Booster.png',
            images: ['Imagenes/Tomcat-Booster.png'],
            description: 'Núcleo nuevo en campaña de aceptación. Todavía no registra vuelos orbitales.',
            specs: { recovery: 'LZ-1 / Barcaza' }
        }
    ];

    function seedCatalog(missions) {
        return SEED_RAW.map(function (b) {
            var copy = JSON.parse(JSON.stringify(b));
            copy.seed = true;
            return withMissions(normalize(copy, b.id), missions || []);
        });
    }

    window.JSBoosters = {
        STATUS: STATUS,
        FIXED_SPECS: FIXED_SPECS,
        statusKey: statusKey,
        statusMeta: statusMeta,
        resultOf: resultOf,
        resultLabel: resultLabel,
        parseDate: parseDate,
        fmtDate: fmtDate,
        fmtShort: fmtShort,
        resolveImg: resolveImg,
        imageList: imageList,
        isTomcat: isTomcat,
        flightsFromMissions: flightsFromMissions,
        stats: statsOf,
        isRecovered: isRecovered,
        normalize: normalize,
        withMissions: withMissions,
        seedCatalog: seedCatalog,
        MONTHS: MONTHS
    };
})();
