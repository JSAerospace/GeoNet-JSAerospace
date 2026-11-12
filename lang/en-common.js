/* Diccionario ES -> EN : elementos comunes a todas las páginas (navegación, sesión, perfil, contacto, visor 3D) */
window.JSA_EN = window.JSA_EN || {};
window.JSA_EN_RE = window.JSA_EN_RE || [];
Object.assign(window.JSA_EN, {
  /* Navegación */
  'Inicio': 'Home',
  'Misiones': 'Missions',
  'Cohetes': 'Rockets',
  'BOOSTERS': 'BOOSTERS',
  'CALENDARIO': 'CALENDAR',
  'GEONET': 'GEONET',
  'CLIENTES': 'CLIENTS',
  'Contacto': 'Contact',
  'Iniciar Sesión': 'Log In',
  'Abrir Menú': 'Open menu',

  /* Inicio de sesión / registro */
  'Accede a tu cuenta de J.S.Aerospace': 'Sign in to your J.S.Aerospace account',
  'Nombre': 'Name',
  'Tu nombre': 'Your name',
  'tu@email.com': 'you@email.com',
  'Contraseña': 'Password',
  'Entrar': 'Sign In',
  'o continuar con': 'or continue with',
  '¿No tienes cuenta?': "Don't have an account?",
  'Regístrate': 'Sign up',
  'Registrarse': 'Sign Up',
  'Únete a la nueva era espacial': 'Join the new space era',
  'Crear Cuenta': 'Create Account',
  '¿Ya tienes cuenta?': 'Already have an account?',
  'Inicia Sesión': 'Log in',

  /* Perfil */
  'Tu Perfil': 'Your Profile',
  'Gestiona tu cuenta': 'Manage your account',
  'Datos Personales': 'Personal Details',
  'Nombre Visible': 'Display Name',
  'Actualizar Nombre': 'Update Name',
  'Seguridad': 'Security',
  'Nueva Contraseña': 'New Password',
  'Cambiar Contraseña': 'Change Password',
  'Cerrar Sesión': 'Log Out',

  /* Contacto / chat */
  'CEO de J.S. Aerospace': 'CEO of J.S. Aerospace',
  'Volver': 'Back',
  'Inicia sesión para chatear': 'Log in to chat',
  'Conversaciones': 'Conversations',
  'Chat con J.S.Aerospace': 'Chat with J.S.Aerospace',
  'Escribe un mensaje...': 'Type a message...',
  'No hay mensajes.': 'No messages.',

  /* Visor 3D del Tomcat */
  'Cargando modelo 3D…': 'Loading 3D model…',
  'Error cargando el modelo 3D (¿abriste la página con servidor local?)': 'Error loading the 3D model (did you open the page from a local server?)',
  'No se pudo cargar el visor 3D (abrí la página con un servidor local)': 'Could not load the 3D viewer (open the page from a local server)'
});
window.JSA_EN_RE.push(
  [/^Cargando modelo 3D… (\d+)%$/, 'Loading 3D model… $1%'],
  [/^No se encontró el \.mtl en (.+)$/, 'The .mtl file was not found at $1']
);
