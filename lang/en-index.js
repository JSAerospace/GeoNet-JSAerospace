/* Diccionario ES -> EN : index.html */
window.JSA_EN = window.JSA_EN || {};
window.JSA_EN_RE = window.JSA_EN_RE || [];
Object.assign(window.JSA_EN, {
  /* <head> */
  'J.S. Aerospace | Inicio': 'J.S. Aerospace | Home',
  'Programa espacial de J.S. Aerospace en Kerbal Space Program: lanzadores reutilizables Tomcat, misiones orbitales, GeoNet y manifiesto de vuelos.':
    "J.S. Aerospace's space program in Kerbal Space Program: reusable Tomcat launch vehicles, orbital missions, GeoNet and the flight manifest.",
  'J.S. Aerospace · Lanzadores reutilizables y conectividad orbital': 'J.S. Aerospace · Reusable launch vehicles and orbital connectivity',
  'J.S. Aerospace · lanzador Tomcat en plataforma': 'J.S. Aerospace · Tomcat launch vehicle on the pad',

  /* Navegación */
  'Logo J.S. Aerospace': 'J.S. Aerospace logo',
  'Navegación de secciones': 'Section navigation',

  /* Portada: Tomcat */
  'PRÓXIMA MISIÓN': 'NEXT MISSION',
  'TOMCAT / COHETE INSIGNIA': 'TOMCAT / FLAGSHIP ROCKET',
  'REVOLUCIONANDO EL VUELO': 'REVOLUTIONIZING FLIGHT',
  'El carguero pesado y sistema reutilizable definitivo de J.S. Aerospace. Con 60 t de capacidad a órbita baja, diseñado para aterrizaje de alta precisión en barcaza o Landing Zone, alta cadencia y exploración espacial.':
    "J.S. Aerospace's ultimate heavy freighter and reusable system. With 60 t of capacity to low Earth orbit, it is designed for high-precision landings on a droneship or Landing Zone, a high flight cadence and space exploration.",
  'DESCUBRIR TOMCAT': 'DISCOVER TOMCAT',
  'Tomcat en plataforma': 'Tomcat on the pad',
  'Tomcat en ascenso': 'Tomcat ascending',
  'Tomcat sobre la costa': 'Tomcat over the coast',
  'Tomcat despegando': 'Tomcat lifting off',
  '+ MÁS FOTOS →': '+ MORE PHOTOS →',

  /* Portada: GeoNet */
  'CONSTELACIÓN GEONET': 'GEONET CONSTELLATION',
  'CONECTIVIDAD INTERPLANETARIA': 'INTERPLANETARY CONNECTIVITY',
  'La red satelital de datos y telemetría orbital definitiva. Enlace continuo de alta velocidad y monitoreo en tiempo real en todo el sistema planetario.':
    'The ultimate satellite data and orbital telemetry network. Continuous high-speed link and real-time monitoring across the entire planetary system.',
  'ACCEDER A GEONET': 'ACCESS GEONET',

  /* Portada: YouTube */
  'Últimas misiones publicadas': 'Latest published missions',
  'EXPLORA NUESTRAS': 'EXPLORE OUR',
  'MISIONES': 'MISSIONS',
  'Revive cada lanzamiento, prueba de motor y aterrizaje autónomo en nuestro canal oficial.':
    'Relive every launch, engine test and autonomous landing on our official channel.',
  'SUSCRIBIRSE': 'SUBSCRIBE',
  'VER TODOS LOS VÍDEOS': 'VIEW ALL VIDEOS',
  'Cargando vídeos...': 'Loading videos...',
  'No hay vídeos disponibles.': 'No videos available.',
  'REPRODUCIENDO': 'NOW PLAYING',
  'DESTACADO': 'FEATURED',
  'MÁS VÍDEOS DEL CANAL': 'MORE VIDEOS FROM THE CHANNEL',
  'Aterrizaje en Barcaza': 'Droneship Landing',
  'Vuelo y telemetría': 'Flight and telemetry',
  'Presentación Oficial': 'Official Presentation',
  'Aterrizaje del Booster': 'Booster Landing',

  /* Pie de página */
  'J.S. Aerospace – Todos los derechos reservados': 'J.S. Aerospace – All rights reserved',

  /* Ticker de próxima misión y chat */
  'A DEFINIR': 'TBD',
  'MISIÓN': 'MISSION',
  'No Earlier Than: la fecha puede moverse': 'No Earlier Than: the date may change',
  'Escribe tu mensaje...': 'Type your message...'
});
window.JSA_EN_RE.push(
  [/^Ver: (.+)$/, 'Watch: $1'],
  /* "Jun 2026 · Aterrizaje en Barcaza"  /  "Jun 2026" */
  [/^(Ene|Feb|Mar|Abr|May|Jun|Jul|Ago|Sep|Oct|Nov|Dic) (\d{4})( · (.+))?$/, function (m, mon, y, g, tag) {
    var M = { Ene: 'Jan', Abr: 'Apr', Ago: 'Aug', Dic: 'Dec' };
    return (M[mon] || mon) + ' ' + y + (tag ? ' · ' + window.jsaT(tag) : '');
  }]
);
