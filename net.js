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

    function label(dateObj, precision) {
        if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '';
        var year = dateObj.getFullYear();
        var month = MONTHS_ES[dateObj.getMonth()];
        var day = dateObj.getDate();
        if (precision === 'year') return String(year);
        if (precision === 'month') return month + ' ' + year;
        return day + ' ' + month + ' ' + year;
    }

    function labelFor(mission, dateObj) {
        return label(dateObj, precisionOf(mission));
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
