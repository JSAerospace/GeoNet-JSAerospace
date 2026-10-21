// J.S. Aerospace — Panel y listado de propulsores
// El historial de cada núcleo sale del campo `booster` de las misiones.
//
// Se carga como script clásico con el SDK compat de Firebase para que la página
// funcione también abriendo boosters.html directo desde el disco (file://), donde
// el navegador bloquea los módulos ES.
(function () {
'use strict';

// Sin SDK (sin conexión o CDN bloqueado) la grilla no puede leer el registro.
if (typeof firebase === 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        var grid = document.getElementById('boosters-grid');
        if (grid) grid.innerHTML = '<div class="b-empty" style="grid-column:1/-1;"><h3>No se pudo cargar Firebase</h3><p>Revisá la conexión a internet y recargá la página.</p></div>';
    });
    return;
}

const firebaseConfig = {
    apiKey: "AIzaSyC6eDNK7CLl_aXEYkwFV97k-2A1axzRAKg",
    authDomain: "j-saerospace.firebaseapp.com",
    projectId: "j-saerospace",
    storageBucket: "j-saerospace.firebasestorage.app",
    messagingSenderId: "496032189875",
    appId: "1:496032189875:web:69c591002b8131ed1c0fc6",
    measurementId: "G-YXWPQWVGDZ",
    databaseURL: "https://j-saerospace-default-rtdb.firebaseio.com"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Adaptadores con la misma forma que usaba el SDK modular, para no tocar el resto.
const ref = (db, path) => db.ref(path);
const set = (r, value) => r.set(value);
const get = (r) => r.get();
const update = (r, value) => r.update(value);
const push = (r, value) => r.push(value);
const remove = (r) => r.remove();
const onValue = (r, cb, onError) => r.on('value', cb, onError);
const onAuthStateChanged = (a, cb) => a.onAuthStateChanged(cb);
const signInWithEmailAndPassword = (a, email, password) => a.signInWithEmailAndPassword(email, password);
const createUserWithEmailAndPassword = (a, email, password) => a.createUserWithEmailAndPassword(email, password);
const signInWithPopup = (a, provider) => a.signInWithPopup(provider);
const signOut = (a) => a.signOut();
const updateProfile = (user, data) => user.updateProfile(data);
const updatePassword = (user, password) => user.updatePassword(password);

const B = window.JSBoosters;
const ADMIN_EMAIL = 'olanoagus@gmail.com';
const safeGet = (id) => document.getElementById(id);
const esc = (v) => String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

let currentUser = null;
let isAdmin = false;
let isLoginMode = true;
let allBoosters = [];
let missions = [];
let rawBoosters = {};
let astroCount = 0;
let usingSeeds = false;
let filterStatus = 'all';
let sortMode = 'flights';
let pendingEdit = '';
let saving = false;
let dataReady = false;

function statusPill(status) {
    const meta = B.statusMeta(status);
    return '<span class="pill ' + meta.cls + '">' + meta.mark + ' ' + meta.label + '</span>';
}

function boosterUrl(b) {
    return 'booster.html?b=' + encodeURIComponent(b.name);
}

function sortBoosters(list) {
    return list.slice().sort((a, b) => {
        if (sortMode === 'recent') {
            const da = B.parseDate(a.lastFlight);
            const db = B.parseDate(b.lastFlight);
            return (db ? db.getTime() : 0) - (da ? da.getTime() : 0);
        }
        if (b.stats.total !== a.stats.total) return b.stats.total - a.stats.total;
        return a.name.localeCompare(b.name);
    });
}

function renderStats(list) {
    const cores = list.length;
    const flights = list.reduce((n, b) => n + b.stats.total, 0);
    const landings = list.reduce((n, b) => n + b.stats.landings, 0);
    safeGet('stat-cores').textContent = cores;
    safeGet('stat-flights').textContent = flights;
    safeGet('stat-landings').textContent = landings;
    const rate = flights ? Math.round((landings / flights) * 100) : 0;
    safeGet('stat-recovery').innerHTML = rate + '<small>%</small>';
}

function tomcatMissions() {
    return missions
        .filter(m => String(m.vehicle || '').trim().toLowerCase() === 'tomcat')
        .sort((a, b) => {
            const da = B.parseDate(a.date);
            const db = B.parseDate(b.date);
            return (db ? db.getTime() : 0) - (da ? da.getTime() : 0);
        });
}

function render() {
    const grid = safeGet('boosters-grid');
    if (!grid) return;

    const search = (safeGet('filter-search')?.value || '').toLowerCase().trim();

    const filtered = allBoosters.filter(b => {
        if (filterStatus !== 'all' && b.status !== filterStatus) return false;
        if (search) {
            const hay = [b.name, b.block, b.description, b.stats.flights.map(f => f.mission).join(' ')].join(' ').toLowerCase();
            if (!hay.includes(search)) return false;
        }
        return true;
    });

    renderStats(allBoosters);

    // Récord de la flota: la barra de cada tarjeta se mide contra el núcleo
    // con más vuelos, así se ve cuánto le falta a cada uno para alcanzarlo.
    const record = allBoosters.reduce((n, b) => Math.max(n, b.stats.total), 0);
    const recordHolders = allBoosters.filter(b => record > 0 && b.stats.total === record);
    const recordName = recordHolders.length ? recordHolders[0].name : '';
    const recordIsShared = recordHolders.length > 1;

    // Antes del primer snapshot de Firebase no hay datos: no es "sin resultados".
    if (!dataReady && !allBoosters.length) {
        grid.innerHTML = '<div class="b-empty" style="grid-column:1/-1;"><h3>Sincronizando propulsores</h3><p>Leyendo el registro de vuelos…</p></div>';
        return;
    }

    if (!filtered.length) {
        grid.innerHTML = '<div class="b-empty" style="grid-column:1/-1;"><h3>Sin resultados</h3><p>No hay propulsores que coincidan con los filtros.</p></div>';
        return;
    }

    grid.innerHTML = sortBoosters(filtered).map(b => {
        const img = encodeURI(B.resolveImg(B.imageList(b)[0] || b.image));
        const last = b.stats.last;
        const total = b.stats.total;
        const isRecord = record > 0 && total === record;
        const gap = record - total;
        const segments = Math.max(5, Math.min(12, record || 5));
        const filled = record
            ? (total ? Math.max(1, Math.round((total / record) * segments)) : 0)
            : 0;
        let meter = '';
        for (let i = 0; i < segments; i++) meter += '<i class="' + (i < filled ? 'on' : '') + '"></i>';

        const meterNote = !record
            ? 'Sin vuelos registrados'
            : isRecord
            ? (recordIsShared ? 'Récord compartido' : 'Récord de la flota')
            : (gap === 1
                ? (recordIsShared ? 'Falta 1 para el récord' : 'Falta 1 para el récord de ' + esc(recordName))
                : (recordIsShared ? 'Faltan ' + gap + ' para el récord' : 'Faltan ' + gap + ' para el récord de ' + esc(recordName)));
        const meterAria = !record
            ? 'Sin vuelos registrados'
            : (isRecord
                ? total + (total === 1 ? ' vuelo, récord de la flota' : ' vuelos, récord de la flota')
                : total + ' de ' + record + ' vuelos del núcleo con más vuelos');

        const editable = isAdmin && !b.seed;
        const topAdmin = editable ? `
            <div class="bc-admin">
                <button type="button" onclick="event.stopPropagation(); window.openBoosterEditor('${esc(b.id)}')" title="Editar"><i class="fas fa-pen"></i></button>
                <button type="button" onclick="event.stopPropagation(); window.deleteBooster('${esc(b.id)}')" title="Eliminar"><i class="fas fa-trash"></i></button>
            </div>` : '';

        const footerAdmin = editable ? `
            <div class="bc-admin-actions">
                <button type="button" onclick="event.stopPropagation(); window.openBoosterEditor('${esc(b.id)}')">Editar</button>
                <button type="button" class="danger" onclick="event.stopPropagation(); window.deleteBooster('${esc(b.id)}')">Eliminar</button>
            </div>` : '';

        return `
            <article class="booster-card${isRecord ? ' is-record' : ''}" tabindex="0" role="link"
                aria-label="Ver el historial de ${esc(b.name)}" data-open="${esc(b.name)}">
                ${isRecord ? '<div class="bc-record"><i class="fas fa-trophy"></i>' + (recordIsShared ? 'Récord compartido' : 'Récord de vuelos') + '</div>' : ''}
                ${topAdmin}
                <div class="bc-figure"><img src="${img}" alt="" loading="lazy" onerror="this.remove()"></div>
                <div class="bc-top">
                    <div class="bc-tally"><b>${String(b.stats.total).padStart(2, '0')}</b><span>Vuelos</span></div>
                    ${statusPill(b.status)}
                </div>
                <div class="bc-body">
                    <h2 class="bc-name">${esc(b.name)}</h2>
                    <p class="bc-vehicle"><b>Tomcat</b>${b.block ? ' · ' + esc(b.block) : ''}</p>
                    <div class="bc-meter" role="img" aria-label="${esc(meterAria)}">${meter}</div>
                    <div class="bc-meter-label"><span>Vuelos</span><span>${record ? total + ' / ' + record : '—'}</span></div>
                    <div class="bc-meter-note${isRecord ? ' is-record' : ''}">${meterNote}</div>
                    <div class="bc-rows">
                        <div class="bc-row"><span class="l">Último vuelo</span><span class="r">${last ? esc(B.fmtShort(last.date)) : 'Sin vuelos'}</span></div>
                        <div class="bc-row"><span class="l">Aterrizajes</span><span class="r">${b.stats.landings} / ${b.stats.total || 0}</span></div>
                        <div class="bc-row"><span class="l">Base</span><span class="r">${esc(b.base || '—')}</span></div>
                    </div>
                    <div class="bc-cta"><span>Ver historial</span><i class="fas fa-arrow-right"></i></div>
                    ${footerAdmin}
                </div>
            </article>`;
    }).join('');

    grid.querySelectorAll('[data-open]').forEach(card => {
        const go = () => { window.location.href = boosterUrl({ name: card.getAttribute('data-open') }); };
        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            go();
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
        });
    });
}

function applyData() {
    const rows = Object.entries(rawBoosters || {}).map(([id, raw]) => B.normalize(raw, id));
    const tomcatRows = rows.filter(B.isTomcat);
    const astros = rows.filter(r => String(r.vehicle || '').trim().toLowerCase() === 'astro-3');
    astroCount = astros.length;

    usingSeeds = tomcatRows.length === 0;
    const base = usingSeeds ? B.seedCatalog(missions) : tomcatRows;
    allBoosters = base
        .map(b => B.withMissions(b, missions))
        .sort((a, b) => (b.stats.total - a.stats.total) || a.name.localeCompare(b.name));

    render();
    updateAdminUI();
    updateSeedNotice();
    resolvePendingEdit();
}

function updateAdminUI() {
    const bar = safeGet('adminBar');
    if (bar) bar.hidden = !isAdmin;
    const cleanup = safeGet('cleanupAstroBtn');
    if (cleanup) {
        cleanup.hidden = !isAdmin || astroCount === 0;
        cleanup.textContent = 'Quitar boosters Astro-3 (' + astroCount + ')';
    }
}

function updateSeedNotice() {
    const notice = safeGet('seedNotice');
    if (!notice) return;
    notice.classList.toggle('show', usingSeeds && isAdmin);
}

function loadData() {
    onValue(ref(database, 'missions'), (snap) => {
        const data = snap.val() || {};
        missions = Object.entries(data).map(([id, m]) => Object.assign({ id }, m));
        dataReady = true;
        applyData();
    }, (err) => console.warn('No se pudieron leer las misiones:', err.message));

    onValue(ref(database, 'boosters'), (snap) => {
        rawBoosters = snap.val() || {};
        dataReady = true;
        applyData();
    }, (err) => {
        console.warn('No se pudieron leer los propulsores:', err.message);
        rawBoosters = {};
        dataReady = true;
        applyData();
    });
}

// ===== AUTH =====
onAuthStateChanged(auth, (user) => {
    const authBtn = safeGet('authBtn');
    const addBtn = safeGet('addBoosterBtn');
    if (user) {
        currentUser = user;
        isAdmin = (user.email === ADMIN_EMAIL);
        update(ref(database, 'users/' + user.uid), {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Usuario'),
            photoURL: user.photoURL || null,
            lastLogin: new Date().toISOString(),
            provider: user.providerData && user.providerData[0] ? user.providerData[0].providerId : 'password'
        });
        if (authBtn) {
            authBtn.classList.add('logged-in');
            authBtn.innerHTML = `<img src="${user.photoURL || 'https://via.placeholder.com/32'}" class="user-avatar" alt="Avatar"><span>${user.displayName || user.email.split('@')[0]}</span>`;
            authBtn.onclick = () => openProfile();
        }
        if (addBtn) addBtn.style.display = isAdmin ? 'flex' : 'none';
    } else {
        currentUser = null;
        isAdmin = false;
        if (authBtn) {
            authBtn.classList.remove('logged-in');
            authBtn.innerHTML = '<i class="fas fa-user"></i><span id="authBtnText">Iniciar Sesión</span>';
            authBtn.onclick = () => safeGet('loginModal').classList.add('active');
        }
        if (addBtn) addBtn.style.display = 'none';
        if (pendingEdit) safeGet('loginModal').classList.add('active');
    }
    updateAdminUI();
    render();
    resolvePendingEdit();
});

function openProfile() {
    if (!currentUser) return;
    safeGet('profileName').textContent = currentUser.displayName || currentUser.email.split('@')[0];
    safeGet('profileEmail').textContent = currentUser.email || '';
    safeGet('newDisplayName').value = currentUser.displayName || '';
    safeGet('profileModal').classList.add('active');
}

safeGet('closeProfileModal').onclick = () => safeGet('profileModal').classList.remove('active');
safeGet('closeModal').onclick = () => safeGet('loginModal').classList.remove('active');
safeGet('closeBoosterModal').onclick = () => safeGet('boosterModal').classList.remove('active');

const toggleLink = safeGet('toggleLink');
toggleLink.onclick = (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    safeGet('modalTitle').textContent = isLoginMode ? 'Iniciar Sesión' : 'Registrarse';
    safeGet('submitBtn').textContent = isLoginMode ? 'Entrar' : 'Crear Cuenta';
    safeGet('toggleText').textContent = isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?';
    safeGet('toggleLink').textContent = isLoginMode ? 'Regístrate' : 'Inicia Sesión';
    safeGet('nameGroup').style.display = isLoginMode ? 'none' : 'block';
};

safeGet('authForm').onsubmit = async (e) => {
    e.preventDefault();
    const email = safeGet('userEmail').value;
    const password = safeGet('userPassword').value;
    const name = safeGet('userName').value;
    const msg = safeGet('authMessage');
    msg.style.display = 'none';
    try {
        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(cred.user, { displayName: name });
        }
        safeGet('loginModal').classList.remove('active');
    } catch (err) {
        msg.textContent = err.message;
        msg.style.display = 'block';
    }
};

safeGet('googleLogin').onclick = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
        safeGet('loginModal').classList.remove('active');
    } catch (err) {
        alert('Error al conectar con Google: ' + err.message);
    }
};

safeGet('updateNameBtn').onclick = async () => {
    if (!currentUser) return;
    const name = safeGet('newDisplayName').value.trim();
    if (!name) return;
    try {
        await updateProfile(currentUser, { displayName: name });
        await update(ref(database, 'users/' + currentUser.uid), { displayName: name });
        alert('Nombre actualizado.');
        openProfile();
    } catch (err) { alert('No se pudo actualizar: ' + err.message); }
};

safeGet('updatePassBtn').onclick = async () => {
    if (!currentUser) return;
    const pass = safeGet('newPassword').value;
    if (pass.length < 6) { alert('La contraseña debe tener al menos 6 caracteres.'); return; }
    try {
        await updatePassword(currentUser, pass);
        alert('Contraseña actualizada.');
        safeGet('newPassword').value = '';
    } catch (err) { alert('No se pudo cambiar: ' + err.message); }
};

safeGet('logoutBtn').onclick = () => {
    signOut(auth);
    safeGet('profileModal').classList.remove('active');
};

// ===== EDITOR =====
function toDateInput(raw) {
    const d = B.parseDate(raw);
    if (!d) return '';
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function renderMissionPicker(boosterName) {
    const box = safeGet('missionPicker');
    if (!box) return;
    const list = tomcatMissions();
    if (!list.length) {
        box.innerHTML = '<p class="mp-empty">No hay misiones del Tomcat en el manifiesto. Creá una desde Misiones y volvé a intentar.</p>';
        return;
    }
    const mine = String(boosterName || '').trim().toUpperCase();
    box.innerHTML = list.map(m => {
        const assigned = String(m.booster || '').trim();
        const isMine = !!mine && assigned.toUpperCase() === mine;
        const other = assigned && !isMine ? ' · ' + assigned : '';
        return `<label class="mp-item${other ? ' is-other' : ''}">
            <input type="checkbox" data-mid="${esc(m.id)}"${isMine ? ' checked' : ''}>
            <span class="mp-name">${esc(m.title || m.mission || 'Misión')}</span>
            <span class="mp-meta">${esc(B.fmtShort(m.date))}${esc(other)}</span>
        </label>`;
    }).join('');
}

function openEditor(id) {
    if (!isAdmin) {
        pendingEdit = id || '__new__';
        safeGet('loginModal').classList.add('active');
        return;
    }
    const b = allBoosters.find(x => x.id === id);
    if (b && b.seed) {
        alert('Este núcleo es parte del catálogo de referencia. Publicá el catálogo inicial antes de editarlo.');
        return;
    }
    safeGet('boosterForm').reset();
    safeGet('editingBoosterId').value = b ? b.id : '';
    safeGet('boosterModalTitle').textContent = b ? 'Editar ' + b.name : 'Nuevo Propulsor';
    safeGet('bVehicle').value = 'Tomcat';

    if (b) {
        safeGet('bName').value = b.name;
        safeGet('bStatus').value = b.status || 'active';
        safeGet('bBlock').value = b.block || '';
        safeGet('bBase').value = b.base || '';
        safeGet('bImage').value = b.image || '';
        safeGet('bImages').value = B.imageList(b).join('\n');
        safeGet('bDescription').value = b.description || '';
        safeGet('bSpecRecovery').value = (b.specs && b.specs.recovery) || 'Barcaza autónoma';
        safeGet('bNotes').value = b.notes || '';
    }

    renderMissionPicker(b ? b.name : '');
    safeGet('boosterModal').classList.add('active');
}

async function syncMissionAssignments(name, oldName) {
    const box = safeGet('missionPicker');
    if (!box) return;
    const checked = new Set([...box.querySelectorAll('input[type="checkbox"]:checked')].map(i => i.getAttribute('data-mid')));
    const target = name.toUpperCase();
    const previous = String(oldName || '').toUpperCase();
    const writes = [];

    tomcatMissions().forEach(m => {
        const assigned = String(m.booster || '').trim().toUpperCase();
        const wants = checked.has(m.id);
        if (wants && assigned !== target) {
            writes.push(update(ref(database, 'missions/' + m.id), { booster: name }));
        } else if (!wants && (assigned === previous || assigned === target)) {
            writes.push(update(ref(database, 'missions/' + m.id), { booster: '' }));
        }
    });

    if (writes.length) await Promise.all(writes);
}

safeGet('addBoosterBtn').onclick = () => openEditor(null);
safeGet('newBoosterBtn').onclick = () => openEditor(null);

safeGet('boosterForm').onsubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || saving) return;
    const id = safeGet('editingBoosterId').value;
    const current = allBoosters.find(x => x.id === id);
    const name = safeGet('bName').value.trim().toUpperCase();
    if (!name) return;
    const duplicate = allBoosters.find(x => x.id !== id && x.name.toUpperCase() === name);
    if (duplicate) { alert('Ya existe un propulsor llamado ' + name + '.'); return; }

    const images = safeGet('bImages').value.split('\n').map(s => s.trim()).filter(Boolean);
    const primary = safeGet('bImage').value.trim();
    const data = {
        name: name,
        vehicle: 'Tomcat',
        status: safeGet('bStatus').value,
        block: safeGet('bBlock').value.trim(),
        base: safeGet('bBase').value.trim(),
        image: primary || images[0] || '',
        images: images,
        description: safeGet('bDescription').value.trim(),
        specs: {
            height: B.FIXED_SPECS.height,
            engines: B.FIXED_SPECS.engines,
            propellant: B.FIXED_SPECS.propellant,
            recovery: safeGet('bSpecRecovery').value
        },
        notes: safeGet('bNotes').value.trim(),
        updatedAt: new Date().toISOString()
    };

    saving = true;
    const btn = safeGet('saveBoosterBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Guardando…'; }
    try {
        let key = id;
        if (id) {
            await update(ref(database, 'boosters/' + id), data);
        } else {
            const created = await push(ref(database, 'boosters'), data);
            key = created.key;
        }
        await syncMissionAssignments(name, current ? current.name : '');
        safeGet('boosterModal').classList.remove('active');
    } catch (err) {
        alert('No se pudo guardar el propulsor: ' + err.message);
    } finally {
        saving = false;
        if (btn) { btn.disabled = false; btn.textContent = 'Guardar Propulsor'; }
    }
};

async function deleteBooster(id) {
    if (!isAdmin) { safeGet('loginModal').classList.add('active'); return; }
    const b = allBoosters.find(x => x.id === id);
    if (!b) return;
    const linked = missions.filter(m => String(m.booster || '').trim().toUpperCase() === b.name.toUpperCase());
    const extra = linked.length ? '\n\nSus ' + linked.length + ' lanzamiento(s) quedarán sin propulsor asignado.' : '';
    if (!confirm('¿Eliminar el propulsor ' + b.name + '?' + extra)) return;
    try {
        await Promise.all(linked.map(m => update(ref(database, 'missions/' + m.id), { booster: '' })));
        await remove(ref(database, 'boosters/' + id));
    } catch (err) {
        alert('No se pudo eliminar: ' + err.message);
    }
}

async function cleanupAstroBoosters() {
    if (!isAdmin) return;
    const entries = Object.entries(rawBoosters || {}).filter(([, r]) => String(r.vehicle || '').trim().toLowerCase() === 'astro-3');
    if (!entries.length) { alert('No hay boosters Astro-3 en el registro.'); return; }
    if (!confirm('Se eliminarán ' + entries.length + ' boosters del Astro-3 y se liberarán sus lanzamientos. ¿Continuar?')) return;
    const names = new Set(entries.map(([, r]) => String(r.name || '').trim().toUpperCase()));
    try {
        const linked = missions.filter(m => names.has(String(m.booster || '').trim().toUpperCase()));
        await Promise.all(linked.map(m => update(ref(database, 'missions/' + m.id), { booster: '' })));
        await Promise.all(entries.map(([id]) => remove(ref(database, 'boosters/' + id))));
        alert('Boosters Astro-3 eliminados. La flota quedó solo con Tomcat.');
    } catch (err) {
        alert('No se pudo limpiar: ' + err.message);
    }
}

safeGet('cleanupAstroBtn').onclick = cleanupAstroBoosters;

// Publicar el catálogo de referencia en Firebase (solo admin)
safeGet('publishSeedsBtn').onclick = async () => {
    if (!isAdmin || !usingSeeds) return;
    if (!confirm('Se van a crear ' + allBoosters.length + ' propulsores Tomcat en la base de datos. Después podrás editarlos. ¿Continuar?')) return;
    const btn = safeGet('publishSeedsBtn');
    btn.disabled = true;
    btn.textContent = 'Publicando…';
    try {
        for (const b of B.seedCatalog(missions)) {
            await push(ref(database, 'boosters'), {
                name: b.name,
                vehicle: 'Tomcat',
                status: b.status,
                block: b.block,
                base: b.base,
                image: b.image,
                images: b.images,
                description: b.description,
                specs: {
                    height: B.FIXED_SPECS.height,
                    engines: B.FIXED_SPECS.engines,
                    propellant: B.FIXED_SPECS.propellant,
                    recovery: (b.specs && b.specs.recovery) || 'Barcaza autónoma'
                },
                updatedAt: new Date().toISOString()
            });
        }
        alert('Catálogo publicado. Ya podés editar cada núcleo y asignarle lanzamientos.');
    } catch (err) {
        alert('No se pudo publicar el catálogo: ' + err.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Publicar catálogo inicial';
    }
};

function resolvePendingEdit() {
    if (!isAdmin || !pendingEdit) return;
    const id = pendingEdit;
    if (id !== '__new__' && !allBoosters.length) return;
    pendingEdit = '';
    const exists = id === '__new__' || allBoosters.some(b => b.id === id);
    if (!exists) {
        alert('Ese propulsor ya no existe en el registro.');
        return;
    }
    setTimeout(() => openEditor(id === '__new__' ? null : id), 120);
}

// ===== FILTROS =====
document.querySelectorAll('#status-pills .b-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        document.querySelectorAll('#status-pills .b-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filterStatus = pill.getAttribute('data-status');
        render();
    });
});
safeGet('filter-search').addEventListener('input', render);
safeGet('sort-toggle').addEventListener('click', () => {
    sortMode = (sortMode === 'flights') ? 'recent' : 'flights';
    safeGet('sort-toggle').textContent = sortMode === 'flights' ? '↓ Más vuelos' : '↓ Más reciente';
    render();
});

window.openBoosterEditor = openEditor;
window.deleteBooster = deleteBooster;

// Deep links: ?edit=ID | ?new=1
const params = new URLSearchParams(window.location.search);
pendingEdit = params.get('edit') || '';
if (params.get('new') === '1') pendingEdit = '__new__';

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    const yearEl = safeGet('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    resolvePendingEdit();
});
})();
