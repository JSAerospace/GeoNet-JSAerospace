/* Diccionario ES -> EN : calendario.html */
window.JSA_EN = window.JSA_EN || {};
window.JSA_EN_RE = window.JSA_EN_RE || [];
Object.assign(window.JSA_EN, {
  /* <head> */
  'J.S.Aerospace | Calendario': 'J.S.Aerospace | Calendar',
  'Calendario de lanzamientos de J.S. Aerospace: próximas ventanas, fechas NET y estado de cada misión.':
    "J.S. Aerospace launch calendar: upcoming windows, NET dates and the status of each mission.",
  'Calendario de lanzamientos · J.S. Aerospace': 'Launch Calendar · J.S. Aerospace',
  'Próximas ventanas de lanzamiento, fechas NET y estado de cada misión de J.S. Aerospace.':
    "Upcoming launch windows, NET dates and the status of every J.S. Aerospace mission.",
  'J.S. Aerospace · calendario de lanzamientos': 'J.S. Aerospace · launch calendar',

  /* Navegación extra */
  'Calendario': 'Calendar',
  'Clientes': 'Clients',
  'J.S.Aerospace Logo': 'J.S.Aerospace Logo',
  'CARGANDO CALENDARIO': 'LOADING CALENDAR',

  /* Barra lateral y cuadrícula */
  'Próximos': 'Upcoming',
  'Lun': 'Mon', 'Mar': 'Tue', 'Mié': 'Wed', 'Jue': 'Thu', 'Vie': 'Fri', 'Sáb': 'Sat', 'Dom': 'Sun',
  'A DEFINIR': 'TBD',
  'PRÓXIMA': 'UPCOMING',
  'Misión Programada': 'Scheduled Mission',
  'Vehículo J.S.A.': 'J.S.A. Vehicle',
  'No Earlier Than: la fecha puede moverse': 'No Earlier Than: the date may change',
  'Zona NET (no antes de)': 'NET window (no earlier than)',
  'Hora por confirmar': 'Time to be confirmed',
  'Fecha a definir': 'Date to be defined',

  /* Detalle del día */
  'Detalles del Día': 'Day Details',
  'Eventos y misiones programadas': 'Scheduled events and missions',
  'Descripción': 'Description',
  'Información de Carga': 'Payload Information',
  'CARGA ÚTIL': 'PAYLOAD',
  'DESTINO': 'DESTINATION',
  'Tripulación': 'Crew',
  'FECHA Y HORA': 'DATE AND TIME',
  'VEHÍCULO': 'VEHICLE',
  'PROVEEDOR': 'PROVIDER',
  'LUGAR DE LANZAMIENTO': 'LAUNCH SITE',
  'ATERRIZAJE': 'LANDING',
  'Lanzamiento orbital contratado operado por J.S. Aerospace.': 'Contracted orbital launch operated by J.S. Aerospace.',

  /* Sesión, perfil, chat (comunes a todas las páginas) */
  'Email': 'Email',
  'Google': 'Google',
  'Mi Perfil': 'My Profile',
  'Gestiona tu cuenta y seguridad': 'Manage your account and security',
  'Información Personal': 'Personal Information',
  'Nombre Público': 'Public Name',
  'Mínimo 6 caracteres': 'Minimum 6 characters',
  'Agus': 'Agus'
});
window.JSA_EN_RE.push(
  [/^Enero (\d{4})$/, 'January $1'],
  [/^Febrero (\d{4})$/, 'February $1'],
  [/^Marzo (\d{4})$/, 'March $1'],
  [/^Abril (\d{4})$/, 'April $1'],
  [/^Mayo (\d{4})$/, 'May $1'],
  [/^Junio (\d{4})$/, 'June $1'],
  [/^Julio (\d{4})$/, 'July $1'],
  [/^Agosto (\d{4})$/, 'August $1'],
  [/^Septiembre (\d{4})$/, 'September $1'],
  [/^Octubre (\d{4})$/, 'October $1'],
  [/^Noviembre (\d{4})$/, 'November $1'],
  [/^Diciembre (\d{4})$/, 'December $1'],
  [/^Fecha: (.+)$/, 'Date: $1'],
  [/^NET (ENE|FEB|MAR|ABR|MAY|JUN|JUL|AGO|SEP|OCT|NOV|DIC) (\d{4})$/, function (m, mon, y) {
    var M = { ENE: 'JAN', ABR: 'APR', AGO: 'AUG', DIC: 'DEC' };
    return 'NET ' + (M[mon] || mon) + ' ' + y;
  }]
);
