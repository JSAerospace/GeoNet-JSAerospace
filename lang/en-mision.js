/* Diccionario ES -> EN : mision.html (ficha de misión) */
window.JSA_EN = window.JSA_EN || {};
window.JSA_EN_RE = window.JSA_EN_RE || [];
Object.assign(window.JSA_EN, {
  /* <head> */
  'Misión · J.S. Aerospace': 'Mission · J.S. Aerospace',
  'Ficha de misión de J.S. Aerospace: estado, vehículo, carga útil, recuperación y perfil de vuelo.':
    'J.S. Aerospace mission sheet: status, vehicle, payload, recovery and flight profile.',
  'J.S. Aerospace · lanzadores reutilizables y conectividad orbital': 'J.S. Aerospace · reusable launch vehicles and orbital connectivity',

  /* Cabecera / estados */
  'Saltar al contenido': 'Skip to content',
  'J.S. Aerospace · Manifiesto': 'J.S. Aerospace · Manifest',
  'Cargando misión': 'Loading mission',
  'Error 404': 'Error 404',
  'Misión no encontrada': 'Mission not found',
  'No pudimos cargar esta misión. Puede que se haya eliminado del manifiesto o que el enlace esté mal.':
    'We could not load this mission. It may have been removed from the manifest or the link may be wrong.',
  'Volver al manifiesto': 'Back to the manifest',
  'Falta el identificador de la misión en el enlace.': 'The mission identifier is missing from the link.',
  'Misión sin título': 'Untitled mission',

  /* Héroe y estado */
  'Migas de pan': 'Breadcrumb',
  'Lanzamientos': 'Launches',
  'ÉXITO': 'SUCCESS',
  'FALLO': 'FAILURE',
  'EN VUELO': 'IN FLIGHT',
  'PROGRAMADO': 'SCHEDULED',
  'TRIPULADA': 'CREWED',
  'A DEFINIR': 'TBD',
  'MISIÓN EN CURSO / FINALIZADA': 'MISSION IN PROGRESS / COMPLETED',
  'Compartir': 'Share',
  'Estado de la misión': 'Mission status',
  'Lanzamiento': 'Launch',
  'Aterrizaje': 'Landing',
  'Propulsor': 'Booster',
  'PENDIENTE': 'PENDING',
  '✕ FALLIDO': '✕ FAILED',
  'SIN RECUPERACIÓN': 'NO RECOVERY',
  '✓ RECUPERADO': '✓ RECOVERED',
  '⚓ RECUPERADO': '⚓ RECOVERED',

  /* Secciones */
  'INTRODUCCIÓN': 'INTRODUCTION',
  '01 ·': '01 ·', '02 ·': '02 ·', '03 ·': '03 ·', '04 ·': '04 ·',
  'Introducción': 'Introduction',
  'FICHA TÉCNICA': 'DATA SHEET',
  'Detalles técnicos': 'Technical Details',
  'VUELO': 'FLIGHT',
  'Perfil de vuelo': 'Flight Profile',
  'REGISTRO': 'RECORD',
  'Galería de la misión': 'Mission Gallery',
  'Misiones relacionadas': 'Related missions',
  'Misión siguiente →': 'Next mission →',
  '← Misión anterior': '← Previous mission',
  'Enlaces relacionados': 'Related links',
  'Vehículo': 'Vehicle',
  'Ficha del lanzador': 'Launch vehicle sheet',
  'Manifiesto': 'Manifest',
  'Todos los lanzamientos': 'All launches',
  'Historial completo de J.S. Aerospace': 'Full history of J.S. Aerospace',

  /* Fichas */
  'Proveedor': 'Provider',
  'Plataforma': 'Pad',
  'Núcleo': 'Core',
  'Carga útil': 'Payload',
  'Carga': 'Payload',
  'Destino': 'Destination',
  'Tipo': 'Type',
  'Tripulada': 'Crewed',
  'Tripulación': 'Crew',
  'Recuperación': 'Recovery',
  'Zona': 'Zone',
  'Resultado': 'Result',
  'Fecha y hora': 'Date and Time',
  'Fecha': 'Date',
  'Hora local': 'Local time',
  'UTC': 'UTC',
  'Precisión': 'Precision',
  'Exacta': 'Exact',
  'Por confirmar': 'To be confirmed',
  'No especificada': 'Not specified',
  'Pendiente': 'Pending',
  'Fallido': 'Failed',
  'Sin recuperación': 'No recovery',
  'Recuperado': 'Recovered',
  'Etapa desechable': 'Expendable stage',
  'Etapa recuperada': 'Recovered stage',
  'No recuperada': 'Not recovered',
  'RTLS · en tierra': 'RTLS · on land',
  'Plataforma en mar': 'Sea platform',

  /* Perfil de vuelo */
  'Ascenso': 'Ascent',
  'Segunda etapa': 'Second stage',
  'Despegue': 'Liftoff',
  'Max-Q': 'Max-Q',
  'Máxima presión aerodinámica': 'Maximum aerodynamic pressure',
  'MECO y separación': 'MECO and separation',
  'Apagado de la primera etapa': 'First-stage shutdown',
  'Encendido de retorno': 'Boostback burn',
  'La etapa invierte el rumbo': 'The stage reverses course',
  'Quema de entrada y descenso': 'Entry burn and descent',
  'Zona de aterrizaje': 'Landing zone',
  'SECO': 'SECO',
  'la plataforma': 'the pad',
  'la órbita de destino': 'the target orbit'
});
window.JSA_EN_RE.push(
  /* Fechas cortas: "14 ene 2026" y "14 ene 2026 · 10:00" */
  [/^(\d{1,2}) (ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic) (\d{4})( · (\d{2}:\d{2}))?$/, function (m, d, mon, y, g, t) {
    var M = { ene: 'Jan', feb: 'Feb', mar: 'Mar', abr: 'Apr', may: 'May', jun: 'Jun', jul: 'Jul', ago: 'Aug', sep: 'Sep', oct: 'Oct', nov: 'Nov', dic: 'Dec' };
    return M[mon] + ' ' + d + ', ' + y + (t ? ' · ' + t : '');
  }],
  [/^(\d{2}:\d{2}) \(local\)$/, '$1 (local)'],
  [/^NET · (.+)$/, function (m, r) { return 'NET · ' + ({ 'año': 'year', 'mes': 'month' }[r] || r); }],
  [/^(.+) · (\d{2}:\d{2}) · (.+)$/, function (m, a, t, s) { return window.jsaT(a) + ' · ' + t + ' · ' + window.jsaT(s); }],
  [/^Desde (.+)$/, 'From $1'],
  [/^Inyección a (.+)$/, 'Injection into $1'],
  [/^(.+) · en tierra$/, '$1 · on land'],
  [/^(.+) · plataforma en mar$/, '$1 · sea platform'],
  [/^Núcleo de (.+)$/, '$1 core'],
  [/^Vehículo (.+)$/, 'Vehicle $1'],
  [/^Perfil de vuelo de (.+)$/, 'Flight profile of $1'],
  [/^Trayectoria de ascenso, segunda etapa( y recuperación de la primera etapa)?, con (\d+) hitos numerados\.$/, function (m, rec, n) {
    return 'Ascent trajectory, second stage' + (rec ? ' and first-stage recovery' : '') + ', with ' + n + ' numbered milestones.';
  }],
  [/^Abrir imagen de (.+)$/, 'Open image of $1'],
  [/^Tripulación a bordo: (.+)\.$/, 'Crew on board: $1.'],
  [/^Ficha de la misión (.+): estado, vehículo, carga útil, recuperación y perfil de vuelo\.$/, 'Mission sheet for $1: status, vehicle, payload, recovery and flight profile.'],
  [/^(.+) es una misión de J\.S\. Aerospace lanzada a bordo del (.+) desde (.+), con (.+) como carga útil y destino (.+)\.$/,
    '$1 is a J.S. Aerospace mission launched aboard the $2 from $3, with $4 as its payload and $5 as its destination.'],
  [/^No encontramos la misión "(.+)" en el manifiesto\.$/, 'We could not find the mission "$1" in the manifest.'],
  [/^No pudimos conectar con la base de datos de misiones\. (.*)$/, 'We could not connect to the missions database. $1']
);
