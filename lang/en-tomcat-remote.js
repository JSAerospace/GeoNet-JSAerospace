/* Diccionario ES -> EN : tomcat-remote.html (panel de telemetría) */
window.JSA_EN = window.JSA_EN || {};
window.JSA_EN_RE = window.JSA_EN_RE || [];
Object.assign(window.JSA_EN, {
  /* <head> */
  'Panel de control remoto del Tomcat de J.S. Aerospace: telemetría y estado del lanzador en tiempo real.':
    "Remote control panel for J.S. Aerospace's Tomcat: real-time launch vehicle telemetry and status.",
  'Telemetría y estado del lanzador Tomcat en tiempo real.': 'Real-time telemetry and status of the Tomcat launch vehicle.',
  'J.S. Aerospace · panel de control Tomcat': 'J.S. Aerospace · Tomcat control panel',

  /* Cabecera y estado de conexión */
  'CONECTANDO...': 'CONNECTING...',
  'ONLINE (NUBE)': 'ONLINE (CLOUD)',

  /* Cámara */
  'SIN SEÑAL': 'NO SIGNAL',
  'PANTALLA COMPLETA': 'FULLSCREEN',
  'SALIR PANTALLA COMPLETA': 'EXIT FULLSCREEN',
  'EN VIVO': 'LIVE',
  'TOMCAT / TELEMETRÍA NUBE': 'TOMCAT / CLOUD TELEMETRY',
  'DIST BARCA: --- m': 'DRONESHIP DIST: --- m',

  /* Overlay de telemetría */
  'ALTITUD': 'ALTITUDE',
  'VEL. SUP.': 'SURF. SPD',
  'V. VERT.': 'V. SPEED',
  'DIST. BARCA': 'DRONESHIP DIST.',
  'COMBUSTIBLE': 'FUEL',
  'ESTADO': 'STATUS',
  'VELOCIDAD': 'SPEED',

  /* Paneles */
  'Altitud': 'Altitude',
  'Velocidad Superficie': 'Surface Speed',
  'V. Vertical': 'Vertical Speed',
  'Dist. Barca': 'Droneship Dist.',
  'COMBUSTIBLE RESTANTE': 'FUEL REMAINING',
  'EMPUJE (THROTTLE)': 'THRUST (THROTTLE)',
  'Velocidad': 'Speed',
  'Relación TWR': 'TWR Ratio',

  /* Barra inferior */
  'CÁMARA: ESPERANDO...': 'CAMERA: WAITING...',
  'CÁMARA: CONECTADA': 'CAMERA: CONNECTED',
  'CÁMARA: SIN SEÑAL': 'CAMERA: NO SIGNAL'
});
window.JSA_EN_RE.push(
  [/^DIST BARCA: (.+)$/, 'DRONESHIP DIST: $1']
);
