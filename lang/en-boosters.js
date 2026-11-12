/* Diccionario ES -> EN : boosters.html + booster.html + datos de boosters.js */
window.JSA_EN = window.JSA_EN || {};
window.JSA_EN_RE = window.JSA_EN_RE || [];
Object.assign(window.JSA_EN, {
  /* <head> boosters.html */
  'Propulsores · J.S. Aerospace': 'Boosters · J.S. Aerospace',
  'Flota de propulsores de J.S. Aerospace: núcleos reutilizables, historial de vuelos, recuperaciones y estado operativo.':
    'J.S. Aerospace booster fleet: reusable cores, flight history, recoveries and operational status.',
  'Flota de propulsores · J.S. Aerospace': 'Booster Fleet · J.S. Aerospace',
  'Núcleos reutilizables Tomcat: historial de vuelos, recuperaciones y estado operativo.':
    'Reusable Tomcat cores: flight history, recoveries and operational status.',
  'J.S. Aerospace · propulsores reutilizables Tomcat': 'J.S. Aerospace · reusable Tomcat boosters',
  'J.S.Aerospace Logo': 'J.S.Aerospace Logo',
  'Boosters': 'Boosters',

  /* Encabezado */
  'Programa de reutilización': 'Reuse Program',
  'Propulsores': 'Boosters',
  'Cada núcleo tiene su historia: misiones encadenadas, recuperaciones en barcaza o en zona de aterrizaje y un registro de vuelos que se actualiza con el manifiesto. Entrá a un booster para ver su historial completo.':
    "Every core has its own story: chained missions, recoveries on a droneship or at a landing zone, and a flight log that updates with the manifest. Open a booster to see its full history.",
  'Núcleos': 'Cores',
  'Vuelos registrados': 'Recorded flights',
  'Aterrizajes': 'Landings',
  'Tasa de recuperación': 'Recovery rate',

  /* Administración */
  '+ Nuevo propulsor': '+ New booster',
  'Quitar boosters Astro-3': 'Remove Astro-3 boosters',
  'Catálogo inicial sin publicar.': 'Initial catalog not published.',
  'Estás viendo el roster de referencia. Al publicarlo se guarda en la base de datos y queda editable desde el panel de administración.':
    'You are viewing the reference roster. Publishing it saves it to the database and makes it editable from the admin panel.',
  'Publicar catálogo inicial': 'Publish initial catalog',
  'Publicando…': 'Publishing…',
  'Añadir Propulsor': 'Add Booster',

  /* Filtros */
  'Todos': 'All',
  'En servicio': 'In service',
  'En pruebas': 'In testing',
  'Retirados': 'Retired',
  'Buscar núcleo o misión...': 'Search core or mission...',
  'Buscar propulsor': 'Search booster',
  '↓ Más vuelos': '↓ Most flights',
  '↓ Más reciente': '↓ Most recent',
  'Sincronizando propulsores': 'Syncing boosters',
  'Leyendo el registro de vuelos…': 'Reading the flight log…',
  'Sin resultados': 'No results',
  'No hay propulsores que coincidan con los filtros.': 'No boosters match the filters.',
  'No se pudo cargar Firebase': 'Could not load Firebase',
  'Revisá la conexión a internet y recargá la página.': 'Check your internet connection and reload the page.',

  /* Estados (boosters.js) */
  'EN SERVICIO': 'IN SERVICE',
  'EN PRUEBAS': 'IN TESTING',
  'MANTENIMIENTO': 'MAINTENANCE',
  'RETIRADO': 'RETIRED',
  'PERDIDO': 'LOST',
  'ÉXITO': 'SUCCESS',
  'FALLO': 'FAILURE',
  'PARCIAL': 'PARTIAL',
  'PROGRAMADO': 'SCHEDULED',

  /* Tarjetas */
  'Récord compartido': 'Shared record',
  'Récord de la flota': 'Fleet record',
  'Récord de vuelos': 'Flight record',
  'Sin vuelos registrados': 'No flights recorded',
  'Vuelos': 'Flights',
  'Último vuelo': 'Last flight',
  'Sin vuelos': 'No flights',
  'Base': 'Base',
  'Ver historial': 'View history',
  'Editar': 'Edit',
  'Eliminar': 'Delete',

  /* Editor */
  'Nuevo Propulsor': 'New Booster',
  'Núcleo, estado y registro de vuelos': 'Core, status and flight log',
  'Nombre del núcleo': 'Core name',
  'Ej: Z2004': 'E.g. Z2004',
  'Vehículo': 'Vehicle',
  'Estado': 'Status',
  'Mantenimiento': 'Maintenance',
  'Retirado': 'Retired',
  'Perdido': 'Lost',
  'Bloque / variante': 'Block / variant',
  'Ej: Booster · Bloque 1': 'E.g. Booster · Block 1',
  'Base / plataforma': 'Base / pad',
  'Ej: LC-39B': 'E.g. LC-39B',
  'Imagen principal (URL o ruta)': 'Main image (URL or path)',
  'Galería (una URL o ruta por línea)': 'Gallery (one URL or path per line)',
  'Descripción': 'Description',
  'Historia operativa del núcleo...': 'Operational history of the core...',
  'Altura': 'Height',
  'Motores': 'Engines',
  'Propelentes': 'Propellants',
  'Metano / LOX': 'Methane / LOX',
  'Recuperación': 'Recovery',
  'Barcaza autónoma': 'Autonomous droneship',
  'Barcaza autónoma / LZ-1': 'Autonomous droneship / LZ-1',
  'LZ-1 / Barcaza': 'LZ-1 / Droneship',
  'Barcaza / LZ-1': 'Droneship / LZ-1',
  'Altura, motores y propelentes son fijos para todos los boosters Tomcat.': 'Height, engines and propellants are fixed for all Tomcat boosters.',
  'Lanzamientos asignados': 'Assigned launches',
  'Cargando misiones…': 'Loading missions…',
  'Marcá los lanzamientos de este núcleo. El historial y las estadísticas se calculan desde el manifiesto; no se cargan vuelos a mano.':
    "Check this core's launches. History and statistics are calculated from the manifest; flights are not entered by hand.",
  'Notas internas (opcional)': 'Internal notes (optional)',
  'Ej: pendiente de inspección mayor': 'E.g. pending major inspection',
  'Guardar Propulsor': 'Save Booster',
  'Guardando…': 'Saving…',
  'No hay misiones del Tomcat en el manifiesto. Creá una desde Misiones y volvé a intentar.':
    'There are no Tomcat missions in the manifest. Create one from Missions and try again.',
  'Misión': 'Mission',

  /* Datos de referencia (boosters.js) */
  'Booster · Bloque 1': 'Booster · Block 1',
  'Núcleo inaugural del programa Tomcat. Abrió la campaña con el vuelo de calificación y después pasó a las misiones comerciales.':
    'Inaugural core of the Tomcat program. It opened the campaign with the qualification flight and then moved on to commercial missions.',
  'Núcleo de alta cadencia del Tomcat, pensado para encadenar misiones con inspección mínima entre vuelos.':
    'High-cadence Tomcat core, designed to chain missions with minimal inspection between flights.',
  'Tercer núcleo operativo del Tomcat. Asignado a la campaña de despliegue de la constelación GeoNet.':
    'Third operational Tomcat core. Assigned to the GeoNet constellation deployment campaign.',
  'Núcleo nuevo en campaña de aceptación. Todavía no registra vuelos orbitales.':
    'New core in its acceptance campaign. It has not logged any orbital flights yet.',

  /* Sesión / perfil propios de esta página */
  'Nombre visible': 'Display name',
  'Nueva contraseña': 'New password',
  'Nombre actualizado.': 'Name updated.',
  'Contraseña actualizada.': 'Password updated.',
  'La contraseña debe tener al menos 6 caracteres.': 'The password must be at least 6 characters long.',
  'Ese propulsor ya no existe en el registro.': 'That booster no longer exists in the registry.',
  'Este núcleo es parte del catálogo de referencia. Publicá el catálogo inicial antes de editarlo.':
    'This core is part of the reference catalog. Publish the initial catalog before editing it.',
  'No hay boosters Astro-3 en el registro.': 'There are no Astro-3 boosters in the registry.',
  'Boosters Astro-3 eliminados. La flota quedó solo con Tomcat.': 'Astro-3 boosters removed. The fleet is now Tomcat only.',
  'Catálogo publicado. Ya podés editar cada núcleo y asignarle lanzamientos.': 'Catalog published. You can now edit each core and assign launches to it.'
});
window.JSA_EN_RE.push(
  /* Estados con marca: "● EN SERVICIO" */
  [/^([●◐▲○✕]) (EN SERVICIO|EN PRUEBAS|MANTENIMIENTO|RETIRADO|PERDIDO)$/, function (m, mark, s) {
    return mark + ' ' + window.jsaT(s);
  }],
  /* Fechas: "05 NOV 2026", "5 nov 2026", con sufijo " · Z2001" */
  [/^(\d{1,2}) (ENE|FEB|MAR|ABR|MAY|JUN|JUL|AGO|SEP|OCT|NOV|DIC|ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic) (\d{4})( · (.+))?$/, function (m, d, mon, y, g, extra) {
    var M = { ene: 'Jan', feb: 'Feb', mar: 'Mar', abr: 'Apr', may: 'May', jun: 'Jun', jul: 'Jul', ago: 'Aug', sep: 'Sep', oct: 'Oct', nov: 'Nov', dic: 'Dec' };
    var en = M[mon.toLowerCase()];
    if (mon === mon.toUpperCase()) en = en.toUpperCase();
    return en + ' ' + d + ', ' + y + (extra ? ' · ' + extra : '');
  }],
  [/^Falta 1 para el récord de (.+)$/, '1 more to the record held by $1'],
  [/^Faltan (\d+) para el récord de (.+)$/, '$1 more to the record held by $2'],
  [/^Falta 1 para el récord$/, '1 more to the record'],
  [/^Faltan (\d+) para el récord$/, '$1 more to the record'],
  [/^(\d+) vuelo, récord de la flota$/, '$1 flight, fleet record'],
  [/^(\d+) vuelos, récord de la flota$/, '$1 flights, fleet record'],
  [/^(\d+) de (\d+) vuelos del núcleo con más vuelos$/, '$1 of $2 flights of the core with the most flights'],
  [/^Ver el historial de (.+)$/, 'View the history of $1'],
  [/^Editar (.+)$/, 'Edit $1'],
  [/^Quitar boosters Astro-3 \((\d+)\)$/, 'Remove Astro-3 boosters ($1)'],
  [/^Ya existe un propulsor llamado (.+)\.$/, 'A booster named $1 already exists.'],
  [/^No se pudo (guardar el propulsor|eliminar|limpiar|publicar el catálogo|actualizar|cambiar): (.*)$/, function (m, what, r) {
    var W = { 'guardar el propulsor': 'save the booster', 'eliminar': 'delete it', 'limpiar': 'clean up', 'publicar el catálogo': 'publish the catalog', 'actualizar': 'update', 'cambiar': 'change it' };
    return 'Could not ' + W[what] + ': ' + r;
  }],
  [/^¿Eliminar el propulsor (.+)\?( Sus (\d+) lanzamiento\(s\) quedarán sin propulsor asignado\.)?$/, function (m, n, g, c) {
    return 'Delete booster ' + n + '?' + (c ? ' Its ' + c + ' launch(es) will be left without an assigned booster.' : '');
  }],
  [/^Se van a crear (\d+) propulsores Tomcat en la base de datos\. Después podrás editarlos\. ¿Continuar\?$/, '$1 Tomcat boosters will be created in the database. You will be able to edit them afterwards. Continue?'],
  [/^Se eliminarán (\d+) boosters del Astro-3 y se liberarán sus lanzamientos\. ¿Continuar\?$/, '$1 Astro-3 boosters will be deleted and their launches released. Continue?'],
  [/^Error al conectar con Google: (.*)$/, 'Error connecting to Google: $1']
);
