// Visor 3D del Tomcat Tesserakt - J.S. Aerospace (prueba local)
// Se carga bajo demanda desde cohetes.html la primera vez que se pulsa "3D".
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

const FILES = {
  mtl: 'Tomcat_Tesserakt_texturizado.mtl',
  s1: 'Tomcat_Tesserakt_primera_etapa_corregida.obj',
  s2: 'Tomcat_Tesserakt_segunda_etapa_corregida.obj',
};
const MM = 0.01; // 1 unidad de escena = 1 cm (los OBJ están en mm)

export function createTomcatViewer(container, { base = './modelos3d/', onStatus = () => {} } = {}) {
  const W = () => container.clientWidth || 1;
  const H = () => container.clientHeight || 1;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, W() / H(), 0.5, 5000);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;
  controls.enablePan = false;
  renderer.domElement.addEventListener('pointerdown', () => (controls.autoRotate = false));

  scene.add(new THREE.HemisphereLight(0xcfe4ff, 0x20242b, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(60, 80, 90); scene.add(key);
  const rim = new THREE.DirectionalLight(0x00f3ff, 1.4); rim.position.set(-80, 20, -60); scene.add(rim);

  const root = new THREE.Group();   // eje Z del modelo -> eje Y (arriba) de Three
  root.rotation.x = -Math.PI / 2;
  root.scale.setScalar(MM);
  scene.add(root);
  const stage = { s1: null, s2: null };
  let ready = false, want = 'both', running = false;

  // Zona prohibida para la cámara: cilindro vertical alrededor del cohete visible (+ margen)
  const MARGIN = 4;                       // cm de separación mínima
  let bounds = null;                      // { cx, cz, R, ymin, ymax }
  function clampCamera() {
    if (!bounds) return;
    const p = camera.position;
    const dx = p.x - bounds.cx, dz = p.z - bounds.cz;
    const r = Math.hypot(dx, dz);
    const Rm = bounds.R + MARGIN;
    const yLo = bounds.ymin - MARGIN, yHi = bounds.ymax + MARGIN;
    if (r >= Rm || p.y <= yLo || p.y >= yHi) return;   // fuera del cilindro: nada que hacer
    const outRadial = Rm - r;
    const outUp = yHi - p.y, outDown = p.y - yLo;
    const outVert = Math.min(outUp, outDown);
    if (outRadial <= outVert) {            // salir por el costado
      const nx = r > 1e-6 ? dx / r : 1, nz = r > 1e-6 ? dz / r : 0;
      p.x = bounds.cx + nx * Rm; p.z = bounds.cz + nz * Rm;
    } else {                               // salir por arriba o por abajo
      p.y = outUp < outDown ? yHi : yLo;
    }
    camera.lookAt(controls.target);
  }

  function applyStage() {
    if (!ready) return;
    stage.s1.visible = want === 'both' || want === 's1';
    stage.s2.visible = want === 'both' || want === 's2';
    root.updateMatrixWorld(true);
    const box = new THREE.Box3();
    for (const k of ['s1', 's2']) if (stage[k].visible) box.expandByObject(stage[k]);
    const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const dV = (s.y / 2) / t;
    const dH = (Math.max(s.x, s.z) / 2) / t / camera.aspect;
    const d = Math.max(dV, dH) * 1.25 + Math.max(s.x, s.z) / 2;
    bounds = { cx: c.x, cz: c.z, R: Math.max(s.x, s.z) / 2, ymin: box.min.y, ymax: box.max.y };
    controls.target.copy(c);
    camera.position.set(c.x + d * 0.45, c.y + s.y * 0.05, c.z + d * 0.9);
    camera.near = 1; camera.far = d * 20; camera.updateProjectionMatrix();
    controls.maxDistance = d * 3;
    controls.update();
  }

  const progress = { s1: 0, s2: 0 };
  const onProg = (k) => (e) => {
    if (e.lengthComputable) progress[k] = e.loaded / e.total;
    onStatus(`Cargando modelo 3D… ${Math.round((progress.s1 + progress.s2) * 50)}%`);
  };
  onStatus('Cargando modelo 3D…');

  new MTLLoader().setPath(base).load(FILES.mtl, (mats) => {
    mats.preload();
    for (const m of Object.values(mats.materials)) m.side = THREE.DoubleSide;
    const loadObj = (k) => new Promise((res, rej) => {
      new OBJLoader().setMaterials(mats).setPath(base).load(FILES[k], (obj) => {
        obj.traverse((o) => {
          if (!o.isMesh) return;
          if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
          const ms = Array.isArray(o.material) ? o.material : [o.material];
          ms.forEach((m) => m.map && (m.map.anisotropy = renderer.capabilities.getMaxAnisotropy()));
        });
        stage[k] = obj; root.add(obj); res();
      }, onProg(k), rej);
    });
    Promise.all([loadObj('s1'), loadObj('s2')]).then(() => {
      ready = true; onStatus(''); applyStage();
    }).catch((e) => {
      onStatus('Error cargando el modelo 3D (¿abriste la página con servidor local?)');
      console.error(e);
    });
  }, undefined, (e) => { onStatus('No se encontró el .mtl en ' + base); console.error(e); });

  const ro = new ResizeObserver(() => {
    if (!container.clientWidth) return;
    renderer.setSize(W(), H());
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
    applyStage();
  });
  ro.observe(container);

  return {
    setStage(name) { want = name; applyStage(); },
    start() {
      if (running) return; running = true;
      renderer.setAnimationLoop(() => { controls.update(); clampCamera(); renderer.render(scene, camera); });
    },
    stop() { running = false; renderer.setAnimationLoop(null); },
  };
}
