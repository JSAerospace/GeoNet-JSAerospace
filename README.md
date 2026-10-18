# J.S. Aerospace — GeoNet

Sitio web estático (HTML/CSS/JS, sin build) de **J.S. Aerospace**: presentación de los cohetes Tomcat, el calendario y las misiones, el visor 3D de la constelación **GeoNet**, el portal de clientes y el canal de YouTube.

## Páginas

| Archivo | Contenido |
| --- | --- |
| `index.html` | Inicio: hero del Tomcat, GeoNet y vídeos destacados de YouTube |
| `misiones.html` | Historial y detalle de misiones |
| `cohetes.html` | Familia de cohetes y galería |
| `calendario.html` | Próximos lanzamientos con cuenta atrás |
| `geonet.html` | Visor 3D de la constelación (Three.js + `geonet.glb`) |
| `clientes.html` | Portal de clientes |
| `tomcat-remote.html` | Telemetría remota del Tomcat (proyecto Firebase propio) |

Recursos compartidos: `style.css`, `nav-mobile.js` y los medios en `Imagenes/` y `assets/`.

## Cómo verlo localmente

Al usar módulos de ES y cargar modelos 3D, hay que servirlo por HTTP (no abrir el archivo directamente):

```bash
python3 -m http.server 8000 --bind 127.0.0.1
# o
npx http-server . -p 8000
```

Luego abrir <http://127.0.0.1:8000/index.html>.

## Despliegue (GitHub Pages)

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publica automáticamente el sitio en **GitHub Pages** en cada push a `main` (o manualmente desde la pestaña *Actions*).

1. En **Settings → Pages → Build and deployment → Source**, seleccionar **GitHub Actions**.
2. Hacer push a `main`. El sitio queda en `https://jsaerospace.github.io/GeoNet-JSAerospace/`.

El workflow copia la raíz del repositorio a `_site` (excluyendo `.git`, `.github` y `.freebuff`) y la publica con las acciones oficiales `configure-pages`, `upload-pages-artifact` y `deploy-pages`. Si se usa un dominio propio, añadir un archivo `CNAME` en la raíz.

## Fechas NET (No Earlier Than)

Los lanzamientos admiten la marca **NET** (*no antes de*): la fecha es una estimación que puede deslizarse. Cada misión guarda `net: true`, la precisión publicada `netPrecision` y, opcionalmente, `netNote` con el motivo.

`netPrecision` admite tres valores:

| Valor | Se publica como | Ejemplo |
| --- | --- | --- |
| `year` | Solo el año | `NET 2027` |
| `month` | Año y mes | `NET MAR 2027` |
| `day` | Año, mes y día | `27 OCT 2026` |

- Solo el administrador puede marcarla: en **Misiones**, el botón `NET` de cada tarjeta alterna la marca al instante, y el formulario de edición permite elegir la **precisión** y añadir una nota.
- En una misión NET la **hora es opcional**: si se deja vacía, las tarjetas, el detalle, el calendario y el contador muestran «Hora por confirmar» en lugar de una hora inventada.
- Las cuentas atrás (T-MINUS del héroe, contador de portada y lista del calendario) muestran **«A DEFINIR»** en las misiones NET, porque una fecha aproximada no permite un T- real.
- La fecha guardada se usa para ordenar, pero la web solo muestra hasta la precisión elegida. Las fechas sin día confirmado no se pintan en la cuadrícula del calendario (aparecen en la lista lateral con su ventana NET) y el contador de la portada muestra la ventana en lugar de una cuenta atrás exacta.
- La insignia ámbar **NET** aparece en las tarjetas y el héroe de Misiones, en el calendario (barra lateral y detalle) y en el contador de próxima misión de la portada.

## Autenticación y datos

Las páginas usan **Firebase Auth + Realtime Database** mediante importaciones ESM desde el CDN de Firebase. La configuración del cliente (`apiKey`, `databaseURL`) es pública por diseño: la seguridad real depende de las **reglas de Realtime Database**, que deben exigir `auth != null` y validar la propiedad de cada nodo. El chat de contacto y el portal de clientes escriben en la base de datos, así que conviene revisar dichas reglas antes de exponer el sitio.

## Contacto

Para cambios o despliegues personalizados, abre un issue en este repositorio.
