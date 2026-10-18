// J.S. Aerospace — Fechas NET (No Earlier Than)
// Una misión NET puede anunciarse con tres precisiones:
//   'year'  → solo el año            (ej: 2027)
//   'month' → año y mes              (ej: NOV 2027)
//   'day'   → año, mes y día         (ej: 27 NOV 2027)
(function () {
    'use strict';

    var MONTHS_ES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    var PRECISIONS = ['year', 'month', 'day'];

    // Precisión efectiva: sin NET la fecha es exacta ('day')
    function precisionOf(mission) {
        if (!mission || !mission.net) return 'day';
        var p = String(mission.netPrecision || 'day').toLowerCase();
        return PRECISIONS.indexOf(p) === -1 ? 'day' : p;
    }

    // true cuando la fecha NET no llega al día (año o año+mes)
    function isCoarse(mission) {
        return precisionOf(mission) !== 'day';
    }

    // Partes de la fecha tal como se guardó (evita saltos de día/mes por zona horaria)
    function partsOf(raw) {
        if (!raw) return null;
        var s = String(raw).trim();
        var m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (m) return { year: +m[1], month: +m[2] - 1, day: +m[3] };
        m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (m) return { year: +m[3], month: +m[2] - 1, day: +m[1] };
        return null;
    }

    function label(dateObj, precision, rawDate) {
        var parts = partsOf(rawDate);
        var year, monthIndex, day;
        if (parts) {
            year = parts.year;
            monthIndex = parts.month;
            day = parts.day;
        } else if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
            year = dateObj.getFullYear();
            monthIndex = dateObj.getMonth();
            day = dateObj.getDate();
        } else {
            return '';
        }
        var month = MONTHS_ES[monthIndex];
        if (precision === 'year') return String(year);
        if (precision === 'month') return month + ' ' + year;
        return day + ' ' + month + ' ' + year;
    }

    function labelFor(mission, dateObj) {
        return label(dateObj, precisionOf(mission), mission && mission.date);
    }

    function description(mission) {
        var p = precisionOf(mission);
        if (!mission || !mission.net) return '';
        if (p === 'year') return 'NET: solo año';
        if (p === 'month') return 'NET: año y mes';
        return 'NET: fecha completa';
    }

    window.JSANet = {
        PRECISIONS: PRECISIONS,
        months: MONTHS_ES,
        precisionOf: precisionOf,
        isCoarse: isCoarse,
        label: label,
        labelFor: labelFor,
        description: description
    };
})();
