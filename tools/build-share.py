#!/usr/bin/env python3
"""Genera páginas de vista previa (Open Graph) para el manifiesto de J.S. Aerospace.

Discord, WhatsApp, Telegram y el resto de los clientes no ejecutan JavaScript:
leen las etiquetas <meta> del HTML que baja el servidor. mision.html y
booster.html arman esos datos en el navegador, así que un enlace a
"mision.html?id=..." siempre muestra la tarjeta genérica del sitio.

Este script recorre la base de datos y escribe una copia de cada ficha en la
raíz del sitio (m-<clave>.html / p-<nombre>.html) con las etiquetas ya
completas. La copia es la página real, así que además abre con su contenido.

Uso:
    python3 tools/build-share.py            # escribe las páginas
    python3 tools/build-share.py --check    # valida sin escribir

Variables de entorno opcionales:
    JSA_DB_URL     URL de Realtime Database (por defecto la de producción)
    JSA_SITE_BASE  URL pública del sitio (por defecto GitHub Pages)
"""

import html
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_URL = os.environ.get('JSA_DB_URL', 'https://j-saerospace-default-rtdb.firebaseio.com').rstrip('/')
SITE_BASE = os.environ.get('JSA_SITE_BASE', 'https://jsaerospace.github.io/GeoNet-JSAerospace/')
if not SITE_BASE.endswith('/'):
    SITE_BASE += '/'

MARKER = '<!-- jsa:share-preview -->'
MISSION_TEMPLATE = 'mision.html'
BOOSTER_TEMPLATE = 'booster.html'
MISSION_FALLBACK_IMG = 'Imagenes/Tomcat 4.png'
BOOSTER_FALLBACK_IMG = 'Imagenes/Tomcat-Booster.png'

MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
STATUS_LABEL = {
    'success': 'Lanzamiento exitoso',
    'failed': 'Lanzamiento fallido',
    'failure': 'Lanzamiento fallido',
    'in_flight': 'En vuelo',
    'upcoming': 'Programado',
}


# ----------------------------------------------------------------------------- utilidades

def fetch(node, tries=3):
    """Lee un nodo de Realtime Database (lectura pública)."""
    url = '%s/%s.json' % (DB_URL, node)
    last = None
    for _ in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'jsa-build-share/1.0'})
            with urllib.request.urlopen(req, timeout=30) as res:
                raw = res.read().decode('utf-8')
            data = json.loads(raw) if raw.strip() else None
            return data or {}
        except (urllib.error.URLError, urllib.error.HTTPError, ValueError) as err:
            last = err
    raise RuntimeError('No pudimos leer "%s" (%s): %s' % (node, url, last))


def as_list(value):
    if not value:
        return []
    if isinstance(value, str):
        return [value]
    if isinstance(value, dict):
        value = list(value.values())
    return [v for v in value if isinstance(v, str) and v.strip()]


def resolve_img(path):
    """Misma resolución que mision.html: sin "/" se busca dentro de Imagenes/."""
    path = str(path or '').strip()
    if not path:
        return ''
    if path.startswith('http'):
        return path
    if '/' in path:
        return path
    return 'Imagenes/' + path


def abs_url(path):
    if not path:
        return ''
    if path.startswith('http'):
        return path
    return SITE_BASE + urllib.parse.quote(path.lstrip('/'), safe='/()!$\'*,;=:@')


def esc(value):
    return html.escape(str(value or ''), quote=True)


def one_line(text, limit=280):
    text = re.sub(r'\s+', ' ', str(text or '')).strip()
    if len(text) <= limit:
        return text
    cut = text[:limit].rsplit(' ', 1)[0]
    return cut + '…'


def slug(value):
    """Nombre de archivo seguro y estable (mismo criterio que share.js)."""
    return re.sub(r'[^A-Za-z0-9._-]', '-', str(value or '')).lstrip('-') or 'sin-id'


def date_parts(raw):
    raw = str(raw or '').strip()
    m = re.match(r'^(\d{4})-(\d{2})-(\d{2})', raw)
    if m:
        return int(m.group(1)), int(m.group(2)), int(m.group(3))
    m = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4})', raw)
    if m:
        return int(m.group(3)), int(m.group(2)), int(m.group(1))
    return None


def date_label(mission):
    parts = date_parts(mission.get('date'))
    net = bool(mission.get('net'))
    precision = str(mission.get('netPrecision') or 'day').lower()
    if not parts:
        return ''
    year, month, day = parts
    month_name = MONTHS_ES[month - 1].upper() if 1 <= month <= 12 else ''
    if net and precision == 'year':
        return 'NET %d' % year
    if net and precision == 'month':
        return 'NET %s %d' % (month_name, year)
    prefix = 'NET ' if net else ''
    return '%s%d %s %d' % (prefix, day, month_name, year)


# ----------------------------------------------------------------------------- HTML

def build_head(*, title, description, url, image, image_alt, canonical_extra=''):
    tags = [
        '<title>%s</title>' % esc(title),
        '<meta name="description" content="%s">' % esc(description),
        '<link rel="canonical" href="%s">' % esc(url),
        '<meta property="og:site_name" content="J.S. Aerospace">',
        '<meta property="og:type" content="article">',
        '<meta property="og:url" content="%s">' % esc(url),
        '<meta property="og:title" content="%s">' % esc(title),
        '<meta property="og:description" content="%s">' % esc(description),
        '<meta property="og:image" content="%s">' % esc(image),
        '<meta property="og:image:alt" content="%s">' % esc(image_alt),
        '<meta property="og:locale" content="es_AR">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:title" content="%s">' % esc(title),
        '<meta name="twitter:description" content="%s">' % esc(description),
        '<meta name="twitter:image" content="%s">' % esc(image),
    ]
    if canonical_extra:
        tags.append(canonical_extra)
    tags.append(MARKER)
    return '\n    '.join(tags)


def render_page(template, head_block, marker_script):
    """Inserta el bloque social en la plantilla y deja una sola copia de cada meta."""
    text = template
    text = re.sub(r'[ \t]*<title>.*?</title>[ \t]*\r?\n?', '', text, count=1, flags=re.S)
    text = re.sub(r'[ \t]*<meta\s+(?:property="og:[^"]*"|name="twitter:[^"]*"|name="description")[^>]*>\r?\n?', '', text)
    text = re.sub(r'[ \t]*<link\s+rel="canonical"[^>]*>\r?\n?', '', text)
    if '</head>' not in text:
        raise RuntimeError('La plantilla no tiene </head>')
    block = '    ' + head_block + '\n    ' + marker_script + '\n'
    # Lo más arriba posible: después del viewport, para que sea fácil de revisar
    viewport = re.search(r'[ \t]*<meta name="viewport"[^>]*>\r?\n', text)
    if viewport:
        cut = viewport.end()
        return text[:cut] + block + text[cut:]
    return text.replace('</head>', block + '</head>', 1)


def marker(kind, value, url):
    if kind == 'mission':
        assign = 'window.__MISSION_ID__ = %s;' % json.dumps(value)
    else:
        assign = 'window.__BOOSTER_NAME__ = %s;' % json.dumps(value)
    return (
        '<script>window.__SHARE_STATIC__ = true; ' + assign +
        ' window.__SHARE_URL__ = %s;</script>' % json.dumps(url)
    )


# ----------------------------------------------------------------------------- fichas

def mission_page(key, mission, template):
    title = str(mission.get('title') or mission.get('mission') or mission.get('name') or 'Misión').strip()
    vehicle = str(mission.get('vehicle') or 'Tomcat').strip()
    site = str(mission.get('location') or mission.get('site') or 'J.S. Aerospace Pad').strip()
    destination = str(mission.get('destination') or mission.get('orbit') or 'No especificada').strip()
    payload = str(mission.get('payload') or 'No especificada').strip()
    status = STATUS_LABEL.get(str(mission.get('status') or '').lower(), '')
    when = date_label(mission)

    images = as_list(mission.get('images')) or as_list(mission.get('image'))
    image_path = resolve_img(images[0]) if images else MISSION_FALLBACK_IMG

    description = one_line(mission.get('description'), 280)
    if not description:
        description = one_line(
            '%s es una misión de J.S. Aerospace lanzada a bordo del %s desde %s, '
            'con %s como carga útil y destino %s.' % (title, vehicle, site, payload, destination)
        )

    headline = ' · '.join([p for p in (title, vehicle, when if when else '') if p])
    filename = 'm-%s.html' % slug(key)
    url = SITE_BASE + filename

    head = build_head(
        title=headline + ' · J.S. Aerospace',
        description=description,
        url=url,
        image=abs_url(image_path),
        image_alt='%s · %s%s' % (title, vehicle, (' · ' + status) if status else ''),
    )
    return filename, render_page(template, head, marker('mission', key, url))


def booster_page(key, booster, template):
    name = str(booster.get('name') or 'Núcleo').strip()
    vehicle = str(booster.get('vehicle') or 'Tomcat').strip()
    status = str(booster.get('status') or 'active').strip()
    specs = booster.get('specs') if isinstance(booster.get('specs'), dict) else {}

    images = as_list(booster.get('images')) or as_list(booster.get('image'))
    image_path = resolve_img(images[0]) if images else BOOSTER_FALLBACK_IMG

    description = one_line(booster.get('description'), 280)
    if not description:
        bits = [vehicle]
        if specs.get('height'):
            bits.append(str(specs['height']))
        if specs.get('engines'):
            bits.append(str(specs['engines']))
        if specs.get('propellant'):
            bits.append(str(specs['propellant']))
        description = one_line(
            'Núcleo de primera etapa %s de J.S. Aerospace%s. Historial de vuelos, '
            'recuperaciones y reutilización del propulsor.' % (
                name, (' (' + ' · '.join(bits) + ')') if bits else ''
            )
        )

    headline = ' · '.join([p for p in (name, vehicle + ' · Propulsor') if p])
    filename = 'p-%s.html' % slug(name)
    url = SITE_BASE + filename

    head = build_head(
        title=headline + ' · J.S. Aerospace',
        description=description,
        url=url,
        image=abs_url(image_path),
        image_alt='%s · núcleo %s' % (name, vehicle),
    )
    return filename, render_page(template, head, marker('booster', name, url))


# ----------------------------------------------------------------------------- main

def read_template(name):
    path = os.path.join(ROOT, name)
    with open(path, 'r', encoding='utf-8') as fh:
        return fh.read()


def clean_stale(keep):
    """Borra páginas generadas antes que ya no correspondan a ningún registro."""
    removed = []
    for name in os.listdir(ROOT):
        if not (name.startswith('m-') or name.startswith('p-')) or not name.endswith('.html'):
            continue
        if name in keep:
            continue
        path = os.path.join(ROOT, name)
        try:
            with open(path, 'r', encoding='utf-8') as fh:
                head = fh.read(4096)
        except OSError:
            continue
        if MARKER in head:
            os.remove(path)
            removed.append(name)
    return removed


def main():
    check_only = '--check' in sys.argv

    missions = fetch('missions')
    try:
        boosters = fetch('boosters')
    except RuntimeError as err:
        print('Aviso: %s — se generan solo las páginas de lanzamientos.' % err, file=sys.stderr)
        boosters = {}

    mission_tpl = read_template(MISSION_TEMPLATE)
    booster_tpl = read_template(BOOSTER_TEMPLATE)

    pages = {}
    for key, mission in missions.items():
        if not isinstance(mission, dict):
            continue
        name, body = mission_page(key, mission, mission_tpl)
        pages[name] = body
    for key, booster in boosters.items():
        if not isinstance(booster, dict):
            continue
        name, body = booster_page(key, booster, booster_tpl)
        pages[name] = body

    if check_only:
        problems = []
        for name, body in pages.items():
            for prop in ('og:title', 'og:description', 'og:image', 'og:url'):
                if 'property="%s"' % prop not in body:
                    problems.append('%s sin %s' % (name, prop))
            if body.count('<title>') != 1:
                problems.append('%s con %d etiquetas <title>' % (name, body.count('<title>')))
            if '__MISSION_ID__' not in body and '__BOOSTER_NAME__' not in body:
                problems.append('%s sin identificador embebido' % name)
        print('Páginas listas: %d lanzamientos · %d propulsores' % (len(missions), len(boosters)))
        if problems:
            print('\n'.join(problems), file=sys.stderr)
            return 1
        print('Verificación OK')
        return 0

    for name, body in pages.items():
        with open(os.path.join(ROOT, name), 'w', encoding='utf-8') as fh:
            fh.write(body)

    removed = clean_stale(set(pages))
    print('Páginas de vista previa: %d lanzamientos · %d propulsores' % (len(missions), len(boosters)))
    if removed:
        print('Eliminadas por quedar obsoletas: %s' % ', '.join(sorted(removed)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
