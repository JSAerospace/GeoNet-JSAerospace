// J.S. Aerospace — Propulsores (primera etapa)
// Datos compartidos por boosters.html (listado) y booster.html (ficha).
// Los registros viven en Firebase (`boosters`); si el nodo todavía no existe,
// el sitio muestra este catálogo inicial y un admin puede publicarlo.
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

    // Resultado de un vuelo
    function resultOf(value) {
        var v = String(value == null ? '' : value).toLowerCase().trim();
        if (v === 'failed' || v === 'failure' || v === 'fallo' || v === 'fallido' || v === 'fail') return 'failed';
        if (v === 'partial' || v === 'parcial') return 'partial';
        if (v === 'scheduled' || v === 'programado') return 'scheduled';
        return 'success';
    }

    function resultLabel(value) {
        var r = resultOf(value);
        if (r === 'failed') return 'FALLO';
        if (r === 'partial') return 'PARCIAL';
        if (r === 'scheduled') return 'PROGRAMADO';
        return 'ÉXITO';
    }

    function statusKey(value) {
        var v = String(value == null ? '' : value).toLowerCase().trim();
        return STATUS_ALIASES[v] || 'active';
    }

    function statusMeta(value) {
        return STATUS[statusKey(value)] || STATUS.active;
    }

    // Fechas: acepta "YYYY-MM-DD", "DD/MM/YYYY" o ISO completo.
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

    function normalizeFlight(f) {
        if (!f) return null;
        if (typeof f === 'string') {
            var parts = f.split('|').map(function (s) { return s.trim(); });
            return normalizeFlight({ date: parts[0], mission: parts[1], landing: parts[2], result: parts[3] });
        }
        var date = f.date || f.fecha || '';
        var mission = f.mission || f.mision || f.misión || f.title || 'Vuelo';
        var landing = f.landing || f.aterrizaje || f.site || '';
        return {
            date: date,
            dateObj: parseDate(date),
            mission: String(mission),
            missionId: f.missionId || f.mission_id || '',
            landing: String(landing || ''),
            result: resultOf(f.result || f.resultado || f.status),
            note: f.note || f.nota || ''
        };
    }

    function flightsOf(b) {
        var list = b && b.flights;
        if (!list) list = [];
        if (typeof list === 'string') {
            list = list.split('\n').map(function (line) {
                var p = line.split('|').map(function (s) { return s.trim(); });
                return { date: p[0], mission: p[1], landing: p[2], result: p[3] };
            }).filter(function (f) { return f.date || f.mission; });
        } else if (typeof list === 'object' && !Array.isArray(list)) {
            list = Object.values(list);
        }
        return (list || [])
            .map(normalizeFlight)
            .filter(Boolean)
            .sort(function (a, b2) {
                var da = a.dateObj ? a.dateObj.getTime() : 0;
                var db = b2.dateObj ? b2.dateObj.getTime() : 0;
                return db - da;
            });
    }

    var NO_RECOVERY = /(gasto|desechab|expendable|sin recuperaci|n\/a|^—$|^-$)/i;

    function isRecovered(flight) {
        if (!flight || flight.result === 'failed' || flight.result === 'scheduled') return false;
        if (NO_RECOVERY.test(flight.landing || '')) return false;
        return true;
    }

    function stats(b) {
        var flights = flightsOf(b);
        var total = flights.length;
        var landings = flights.filter(isRecovered).length;
        var failures = flights.filter(function (f) { return f.result === 'failed'; }).length;
        var last = flights[0] || null;
        var first = flights[total - 1] || null;
        return {
            flights: flights,
            total: total,
            landings: landings,
            failures: failures,
            reuses: total > 0 ? total - 1 : 0,
            recoveries: total > 0 ? landings : 0,
            successRate: total > 0 ? Math.round((landings / total) * 100) : 0,
            last: last,
            first: first
        };
    }

    function normalize(raw, id) {
        var b = raw || {};
        var name = String(b.name || b.nombre || b.id || '').trim() || 'SIN NOMBRE';
        var out = {
            id: id || b.id || name.toLowerCase(),
            name: name,
            vehicle: b.vehicle || b.vehiculo || b.cohete || 'Tomcat',
            block: b.block || b.bloque || '',
            status: statusKey(b.status || b.estado),
            base: b.base || b.pad || b.plataforma || 'LC-39B',
            firstFlight: b.firstFlight || b.primerVuelo || '',
            description: b.description || b.descripcion || b.descripción || '',
            notes: b.notes || b.notas || '',
            image: b.image || b.imagen || '',
            images: imageList(b),
            flights: flightsOf(b),
            specs: {
                height: (b.specs && (b.specs.height || b.specs.altura)) || b.height || b.altura || '',
                engines: (b.specs && (b.specs.engines || b.specs.motores)) || b.engines || b.motores || '',
                propellant: (b.specs && (b.specs.propellant || b.specs.propelente)) || b.propellant || b.propelente || '',
                recovery: (b.specs && (b.specs.recovery || b.specs.recuperacion)) || b.recovery || b.recuperacion || ''
            },
            seed: !!b.seed
        };
        var s = stats(out);
        out.totalFlights = s.total;
        out.lastFlight = s.last ? s.last.date : '';
        out.stats = s;
        return out;
    }

    // Catálogo inicial: se muestra mientras el nodo `boosters` esté vacío.
    // Los vuelos se pueden corregir desde el panel de administración.
    var SEED_RAW = [
        {
            id: 'z2003',
            name: 'Z2003',
            vehicle: 'Tomcat',
            block: 'Booster · Bloque 1',
            status: 'active',
            base: 'LC-39B',
            image: 'Imagenes/Tomcat-Booster.png',
            images: ['Imagenes/Tomcat-Booster.png', 'Imagenes/Tomcat-Completo.png'],
            description: 'Tercer núcleo operativo del programa Tomcat. Asumió la campaña de despliegue de GeoNet a fines de 2026, con dos vuelos consecutivos y recuperación en barcaza.',
            specs: { height: '71 m', engines: '33 × TQ-15', propellant: 'Metano / LOX', recovery: 'Barcaza autónoma' },
            flights: [
                { date: '2026-10-12', mission: 'Transporter-2', landing: 'I Thought I Lost You', result: 'success', note: 'Inserción polar y retorno a barcaza.' },
                { date: '2026-09-27', mission: 'GeoNet 3', landing: 'I Thought I Lost You', result: 'success', note: 'Tercer plano GeoNet en órbita de Duna.' }
            ]
        },
        {
            id: 'z2002',
            name: 'Z2002',
            vehicle: 'Tomcat',
            block: 'Booster · Bloque 1',
            status: 'active',
            base: 'LC-39B',
            image: 'Imagenes/Tomcat-Booster.png',
            images: ['Imagenes/Tomcat-Booster.png'],
            description: 'Núcleo de alta cadencia del Tomcat. Encadenó tres misiones en nueve días durante la ventana de despliegue de la constelación GeoNet, sin inspección mayor entre vuelos.',
            specs: { height: '71 m', engines: '33 × TQ-15', propellant: 'Metano / LOX', recovery: 'Barcaza autónoma' },
            flights: [
                { date: '2026-09-27', mission: 'GeoNet 2', landing: 'I Thought I Lost You', result: 'success' },
                { date: '2026-09-20', mission: 'ICOM 1', landing: 'I Thought I Lost You', result: 'success' },
                { date: '2026-09-19', mission: 'GeoNet 1', landing: 'I Thought I Lost You', result: 'success', note: 'Primer vuelo del núcleo; despliegue del plano GeoNet IA.' }
            ]
        },
        {
            id: 'z2001',
            name: 'Z2001',
            vehicle: 'Tomcat',
            block: 'Booster · Bloque 1',
            status: 'active',
            base: 'LC-39B',
            image: 'Imagenes/Tomcat-Booster.png',
            images: ['Imagenes/Tomcat-Booster.png', 'Imagenes/Tomcat 4.png'],
            description: 'Núcleo inaugural del Tomcat. Abrió el programa con el vuelo de calificación y después pasó a la campaña comercial con MercadoLink y el telescopio solar.',
            specs: { height: '71 m', engines: '33 × TQ-15', propellant: 'Metano / LOX', recovery: 'Barcaza autónoma' },
            flights: [
                { date: '2026-08-14', mission: 'Solar Telescope', landing: 'I Thought I Lost You', result: 'success' },
                { date: '2026-07-31', mission: 'MercadoLink 4', landing: 'I Thought I Lost You', result: 'success' },
                { date: '2026-06-21', mission: 'Test Flight', landing: 'I Thought I Lost You', result: 'success', note: 'Primer vuelo del cohete Tomcat.' }
            ]
        },
        {
            id: 'z1001',
            name: 'Z1001',
            vehicle: 'Astro-3',
            block: 'Booster · Bloque 1',
            status: 'active',
            base: 'LC-39B',
            image: 'Imagenes/BOOSTER.png',
            images: ['Imagenes/BOOSTER.png', 'Imagenes/ASTRO-3COMPLETE.png'],
            description: 'Núcleo de la familia Astro-3. Voló la misión tripulada ElRond 1 con retorno a zona de aterrizaje y luego el despliegue comercial de MercadoLink 3.',
            specs: { height: '77 m', engines: '33 × J.S. Engine 2', propellant: 'Metano / LOX', recovery: 'LZ-1 / Barcaza' },
            flights: [
                { date: '2026-04-22', mission: 'MercadoLink 3', landing: 'I Thought I Lost You', result: 'success' },
                { date: '2026-03-29', mission: 'ElRond 1', landing: 'LZ-1', result: 'success', note: 'Retorno a zona de aterrizaje tras la primera misión tripulada a Laythe.' }
            ]
        },
        {
            id: 'z1002',
            name: 'Z1002',
            vehicle: 'Astro-3',
            block: 'Booster · Bloque 1',
            status: 'testing',
            base: 'LC-39B',
            image: 'Imagenes/BOOSTER.png',
            images: ['Imagenes/BOOSTER.png'],
            description: 'Núcleo nuevo de Astro-3 en campaña de aceptación. Todavía no registra vuelos orbitales: está asignado a la próxima ventana de lanzamiento.',
            specs: { height: '77 m', engines: '33 × J.S. Engine 2', propellant: 'Metano / LOX', recovery: 'LZ-1 / Barcaza' },
            flights: []
        }
    ];

    function seedCatalog() {
        return SEED_RAW.map(function (b) {
            var copy = JSON.parse(JSON.stringify(b));
            copy.seed = true;
            return normalize(copy, b.id);
        });
    }

    // Une los vuelos guardados en el booster con las misiones que lo referencian
    // (campo `booster` de cada misión), sin duplicar por misión + fecha.
    function mergeMissionFlights(b, missions) {
        if (!b) return b;
        var list = (missions || [])
            .filter(function (m) {
                return String(m.booster || '').trim().toUpperCase() === b.name.toUpperCase();
            })
            .map(function (m) {
                return normalizeFlight({
                    date: m.date,
                    mission: m.title || m.mission || m.name || 'Misión',
                    missionId: m.id || '',
                    landing: m.landing || '',
                    result: m.status
                });
            });
        var seen = {};
        flightsOf(b).forEach(function (f) {
            seen[(f.mission || '').toLowerCase() + '|' + (f.date || '')] = true;
        });
        var added = list.filter(function (f) {
            var key = (f.mission || '').toLowerCase() + '|' + (f.date || '');
            if (seen[key]) return false;
            seen[key] = true;
            return true;
        });
        var merged = b.flights.concat(added);
        var out = Object.assign({}, b, { flights: merged });
        var s = stats(out);
        out.stats = s;
        out.totalFlights = s.total;
        out.lastFlight = s.last ? s.last.date : '';
        return out;
    }

    // Texto del formulario: "YYYY-MM-DD | Misión | Lugar | ok|fail"
    function parseFlightsText(text) {
        return String(text || '')
            .split('\n')
            .map(function (line) { return line.trim(); })
            .filter(function (line) { return line && line.charAt(0) !== '#'; })
            .map(function (line) {
                var p = line.split('|').map(function (s) { return s.trim(); });
                return {
                    date: p[0] || '',
                    mission: p[1] || '',
                    landing: p[2] || '',
                    result: p[3] || 'success',
                    note: p[4] || ''
                };
            })
            .filter(function (f) { return f.date || f.mission; });
    }

    function flightsToText(flights) {
        return (flights || []).map(function (f) {
            return [f.date || '', f.mission || '', f.landing || '', f.result || 'success'].join(' | ');
        }).join('\n');
    }

    window.JSBoosters = {
        STATUS: STATUS,
        statusKey: statusKey,
        statusMeta: statusMeta,
        resultOf: resultOf,
        resultLabel: resultLabel,
        parseDate: parseDate,
        fmtDate: fmtDate,
        fmtShort: fmtShort,
        resolveImg: resolveImg,
        imageList: imageList,
        normalize: normalize,
        flightsOf: flightsOf,
        stats: stats,
        isRecovered: isRecovered,
        seedCatalog: seedCatalog,
        mergeMissionFlights: mergeMissionFlights,
        parseFlightsText: parseFlightsText,
        flightsToText: flightsToText,
        MONTHS: MONTHS
    };
})();
