/* Diccionario ES -> EN : booster.html (ficha de un núcleo). Se usa junto a en-boosters.js */
window.JSA_EN = window.JSA_EN || {};
window.JSA_EN_RE = window.JSA_EN_RE || [];
Object.assign(window.JSA_EN, {
  /* <head> */
  'Propulsor · J.S. Aerospace': 'Booster · J.S. Aerospace',
  'Ficha de propulsor de J.S. Aerospace: estado, historial de vuelos, recuperaciones y reutilización.':
    'J.S. Aerospace booster sheet: status, flight history, recoveries and reuse.',

  /* Estados de carga y error */
  'Saltar al contenido': 'Skip to content',
  'J.S. Aerospace · Registro de propulsores': 'J.S. Aerospace · Booster registry',
  'Cargando núcleo': 'Loading core',
  'Error 404': 'Error 404',
  'Propulsor no encontrado': 'Booster not found',
  'No pudimos cargar este núcleo. Puede que se haya eliminado del registro o que el enlace esté mal.':
    'We could not load this core. It may have been removed from the registry or the link may be wrong.',
  'Volver a propulsores': 'Back to boosters',
  'Falta el identificador del propulsor en el enlace.': 'The booster identifier is missing from the link.',

  /* Cabecera */
  'Ruta de navegación': 'Breadcrumb',
  'Inicio': 'Home',
  'Propulsores': 'Boosters',
  'Catálogo de referencia': 'Reference catalog',
  '← Todos los propulsores': '← All boosters',
  'Manifiesto de misiones': 'Mission manifest',
  'Compartir': 'Share',
  'Editar núcleo': 'Edit core',
  'Publicar catálogo': 'Publish catalog',

  /* Tarjetas de estado */
  'Estado': 'Status',
  'Vuelos': 'Flights',
  'Aterrizajes': 'Landings',
  'Habilitado para la próxima ventana de lanzamiento.': 'Cleared for the next launch window.',
  'En campaña de aceptación, sin vuelos orbitales.': 'In its acceptance campaign, with no orbital flights.',
  'Fuera de servicio; se conserva su historial.': 'Out of service; its history is preserved.',
  'No se recuperó tras su último vuelo.': 'Not recovered after its last flight.',
  'Fuera de línea por inspección o mantenimiento.': 'Offline for inspection or maintenance.',
  'Sin vuelos registrados.': 'No flights recorded.',
  'Sin intentos de recuperación.': 'No recovery attempts.',

  /* Secciones */
  'INTRODUCCIÓN': 'INTRODUCTION',
  'Historia del núcleo': 'Core History',
  'Registro actualizado desde el panel de administración de propulsores.': 'Registry updated from the booster admin panel.',
  'FICHA TÉCNICA': 'DATA SHEET',
  'El núcleo en números': 'The Core in Numbers',
  'Vehículo': 'Vehicle',
  'Familia': 'Family',
  'Variante': 'Variant',
  'Altura': 'Height',
  'Propulsión': 'Propulsion',
  'Motores': 'Engines',
  'Propelentes': 'Propellants',
  'Reutilizable': 'Reusable',
  'Sí': 'Yes',
  'Recuperación': 'Recovery',
  'Método': 'Method',
  'Base': 'Base',
  'Operación': 'Operations',
  'Primer vuelo': 'First flight',
  'Último vuelo': 'Last flight',
  'Reutilizaciones': 'Reuses',
  'BITÁCORA': 'LOGBOOK',
  'Historial de vuelos': 'Flight History',
  'vuelo': 'flight', 'vuelos': 'flights',
  'aterrizajes': 'landings',
  'reutilizaciones': 'reuses',
  'recuperación': 'recovery',
  'Este núcleo todavía no tiene vuelos registrados. Cuando se cargue una misión con su nombre en el manifiesto, va a aparecer acá automáticamente.':
    'This core has no recorded flights yet. When a mission with its name is added to the manifest, it will appear here automatically.',
  'Vuelo': 'Flight',
  'Sin recuperación': 'No recovery',
  '← Núcleo anterior': '← Previous core',
  'Núcleo siguiente →': 'Next core →',
  'Flota': 'Fleet',
  'Todos los propulsores': 'All boosters',
  'Manifiesto': 'Manifest',
  'Misiones lanzadas': 'Launched missions',
  'REGISTRO': 'RECORD',
  'Galería del núcleo': 'Core Gallery'
});
window.JSA_EN_RE.push(
  [/^(.+) · Propulsor · J\.S\. Aerospace$/, '$1 · Booster · J.S. Aerospace'],
  [/^Último: (.+) · (\d{2} [A-Z]{3} \d{4})$/, function (m, name, d) { return 'Last: ' + name + ' · ' + window.jsaT(d); }],
  [/^Último: (.+) · —$/, 'Last: $1 · —'],
  [/^Tasa de recuperación del (\d+)% · (\d+) reutilizaciones\.$/, 'Recovery rate of $1% · $2 reuses.'],
  [/^Vuelo (\d{2})$/, 'Flight $1'],
  [/^Primer vuelo (.+)$/, function (m, d) { return 'First flight ' + window.jsaT(d); }],
  [/^(\d+) (vuelo|vuelos)$/, function (m, n, w) { return n + ' ' + (w === 'vuelo' ? 'flight' : 'flights'); }],
  [/^(.+) · (\d+) vuelos$/, '$1 · $2 flights'],
  [/^Nota operativa: (.+)$/, 'Operational note: $1'],
  [/^(.+) es un núcleo de primera etapa de (.+) operado por J\.S\. Aerospace desde (.+)\. (Acumula (\d+) (vuelo|vuelos) con (\d+) (recuperación|recuperaciones)\.|Todavía no registra vuelos orbitales\.)$/,
    function (m, name, veh, base, tail, n, fw, r, rw) {
      var t = n ? ('It has accumulated ' + n + (n === '1' ? ' flight' : ' flights') + ' with ' + r + (r === '1' ? ' recovery.' : ' recoveries.')) : 'It has not logged any orbital flights yet.';
      return name + ' is a first-stage core of the ' + veh + ' operated by J.S. Aerospace from ' + base + '. ' + t;
    }],
  [/^Ficha del propulsor (.+) \((.+)\): (\d+) vuelos, (\d+) aterrizajes y estado (.+)\.$/, function (m, name, veh, f, l, st) {
    var S = { 'en servicio': 'in service', 'en pruebas': 'in testing', 'mantenimiento': 'maintenance', 'retirado': 'retired', 'perdido': 'lost' };
    return 'Booster sheet for ' + name + ' (' + veh + '): ' + f + ' flights, ' + l + ' landings and status ' + (S[st] || st) + '.';
  }],
  [/^(.+) · (\d+) vuelos · (\d+) aterrizajes$/, '$1 · $2 flights · $3 landings'],
  [/^No existe un propulsor con el identificador «(.+)» en el registro\.$/, 'There is no booster with the identifier «$1» in the registry.'],
  [/^No se pudo leer el registro de propulsores: (.*)$/, 'Could not read the booster registry: $1']
);
