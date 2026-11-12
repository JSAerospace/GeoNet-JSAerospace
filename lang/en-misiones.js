/* Diccionario ES -> EN : misiones.html */
window.JSA_EN = window.JSA_EN || {};
window.JSA_EN_RE = window.JSA_EN_RE || [];
Object.assign(window.JSA_EN, {
  /* <head> */
  'J.S. Aerospace | Lanzamientos y Misiones': 'J.S. Aerospace | Launches and Missions',
  'Manifiesto completo de lanzamientos de J.S. Aerospace: misiones programadas y vuelos históricos con vehículo, carga útil, destino y estado.':
    'Complete launch manifest of J.S. Aerospace: scheduled missions and historic flights with vehicle, payload, destination and status.',
  'Manifiesto de lanzamientos · J.S. Aerospace': 'Launch Manifest · J.S. Aerospace',
  'Misiones programadas y vuelos históricos de J.S. Aerospace con vehículo, carga útil, destino y estado.':
    'Scheduled missions and historic flights of J.S. Aerospace with vehicle, payload, destination and status.',
  'J.S. Aerospace · manifiesto de lanzamientos': 'J.S. Aerospace · launch manifest',
  'J.S.Aerospace Logo': 'J.S.Aerospace Logo',

  /* Pestañas y filtros */
  'Lanzamientos': 'Launches',
  'Estadísticas': 'Statistics',
  'Todos': 'All',
  'Programados': 'Scheduled',
  'Éxito': 'Success',
  'Fallo': 'Failure',
  'COHETE': 'ROCKET',
  'TODOS': 'ALL',
  'PLATAFORMA': 'PAD',
  'TODO': 'ALL',
  'Buscar misión...': 'Search mission...',
  'Recientes': 'Newest',
  'Antiguos': 'Oldest',
  'Cargando lanzamientos...': 'Loading launches...',
  'No hay lanzamientos que coincidan con los filtros.': 'No launches match the filters.',

  /* Tarjetas y héroe */
  'MISIÓN LISTA': 'MISSION READY',
  'MISIÓN EN CURSO / FINALIZADA': 'MISSION IN PROGRESS / COMPLETED',
  'T-MINUS': 'T-MINUS',
  'A DEFINIR': 'TBD',
  'VER DETALLES': 'VIEW DETAILS',
  'ÉXITO': 'SUCCESS',
  'FALLO': 'FAILURE',
  'EN VUELO': 'IN FLIGHT',
  'PROGRAMADO': 'SCHEDULED',
  'PRÓXIMO': 'UPCOMING',
  'FALLIDO': 'FAILED',
  'Hora por confirmar': 'Time to be confirmed',
  'Proveedor:': 'Provider:',
  'Aterrizaje:': 'Landing:',
  'Gasto': 'Expended',
  'No Earlier Than: la fecha puede moverse': 'No Earlier Than: the date may change',
  'Alternar NET': 'Toggle NET',
  '✏️ EDITAR': '✏️ EDIT',
  '🗑 ELIMINAR': '🗑 DELETE',
  'ENERO': 'JAN', 'FEBRERO': 'FEB', 'MARZO': 'MAR', 'ABRIL': 'APR', 'MAYO': 'MAY', 'JUNIO': 'JUN',
  'JULIO': 'JUL', 'AGOSTO': 'AUG', 'SEPTIEMBRE': 'SEP', 'OCTUBRE': 'OCT', 'NOVIEMBRE': 'NOV', 'DICIEMBRE': 'DEC',

  /* Estadísticas */
  'Análisis Operativo': 'Operational Analysis',
  'ÉXITOS': 'SUCCESSES',
  'FALLOS': 'FAILURES',
  'PROGRAMADOS': 'SCHEDULED',
  'TOTAL': 'TOTAL',
  'Aterrizajes': 'Landings',
  'INTENTOS': 'ATTEMPTS',

  /* Formulario de misión */
  'Nueva Misión': 'New Mission',
  'Editar Misión': 'Edit Mission',
  'Configura los detalles del lanzamiento': 'Set up the launch details',
  'Nombre de la Misión': 'Mission Name',
  'Ej: TOMCAT IFT-2 • CARGA ORBITAL': 'E.g. TOMCAT IFT-2 • ORBITAL PAYLOAD',
  'Fecha': 'Date',
  'Hora (Local)': 'Time (Local)',
  '· OPCIONAL EN NET': '· OPTIONAL FOR NET',
  'Opcional en fechas NET': 'Optional for NET dates',
  '(No Earlier Than)': '(No Earlier Than)',
  'Marca el lanzamiento como «no antes de» esta fecha. La fecha puede deslizarse y el distintivo NET se muestra en las tarjetas, el calendario y el contador de inicio.':
    'Marks the launch as "no earlier than" this date. The date may slip, and the NET badge is shown on the cards, the calendar and the home countdown.',
  'Precisión de la fecha NET': 'NET date precision',
  'Solo año (ej: 2027)': 'Year only (e.g. 2027)',
  'Año y mes (ej: NOV 2027)': 'Year and month (e.g. NOV 2027)',
  'Año, mes y día (fecha completa)': 'Year, month and day (full date)',
  'La fecha guardada se usa para ordenar, pero solo se publica hasta la precisión elegida.':
    'The saved date is used for sorting, but only published up to the chosen precision.',
  'Nota NET (opcional)': 'NET note (optional)',
  'Ej: Pendiente de licencia de lanzamiento': 'E.g. Pending launch license',
  'Estado': 'Status',
  'Ubicación / Plataforma': 'Location / Pad',
  'Ej: LC-39B / Pad 1': 'E.g. LC-39B / Pad 1',
  'Proveedor': 'Provider',
  'Vehículo': 'Vehicle',
  'Ej: Tomcat': 'E.g. Tomcat',
  'Propulsor (primera etapa)': 'Booster (first stage)',
  'Sin asignar': 'Unassigned',
  'Solo para misiones del Tomcat. El historial del núcleo se arma con estas asignaciones; también podés hacerlo desde la sección Propulsores.':
    "Only for Tomcat missions. The core's flight history is built from these assignments; you can also do it from the Boosters section.",
  'Carga Útil': 'Payload',
  'Ej: Satélites GeoNet L1': 'E.g. GeoNet L1 satellites',
  'Destino / Órbita': 'Destination / Orbit',
  'Ej: LEO, GEO, Mun': 'E.g. LEO, GEO, Mun',
  'Aterrizaje': 'Landing',
  'Ej: Captura en Torre / LZ-1': 'E.g. Tower catch / LZ-1',
  'Descripción': 'Description',
  'Detalles del perfil de vuelo...': 'Flight profile details...',
  'Imágenes (Una URL por línea o ruta)': 'Images (one URL or path per line)',
  'Guardar Misión': 'Save Mission',
  'Añadir Misión': 'Add Mission'
});
window.JSA_EN_RE.push(
  [/^Lanzamientos (\d+)$/, 'Launches $1'],
  [/^Ver detalles de (.+)$/, 'View details of $1'],
  [/^Ventana NET (.+)\. Misión operada desde (.+)\.$/, 'NET window $1. Mission operated from $2.'],
  [/^Programado para el (\d{2}) de (\S+) a las (\d{2}:\d{2})\. Misión operada desde (.+)\.$/, function (m, d, mon, t, loc) {
    var M = { ENERO: 'January', FEBRERO: 'February', MARZO: 'March', ABRIL: 'April', MAYO: 'May', JUNIO: 'June', JULIO: 'July', AGOSTO: 'August', SEPTIEMBRE: 'September', OCTUBRE: 'October', NOVIEMBRE: 'November', DICIEMBRE: 'December' };
    return 'Scheduled for ' + (M[mon] || mon) + ' ' + d + ' at ' + t + '. Mission operated from ' + loc + '.';
  }],
  [/^(\d{2}:\d{2}) \(Local\)$/, '$1 (Local)'],
  [/^(🕒) (\d{2}:\d{2}) \(Local\)$/, '$1 $2 (Local)'],
  [/^No se pudo actualizar NET: (.*)$/, 'Could not update NET: $1'],
  [/^Error al guardar: (.*)$/, 'Error saving: $1'],
  [/^Error al conectar con Google: (.*)$/, 'Error connecting to Google: $1']
);
