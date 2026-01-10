// Cargar y renderizar boosters
const stateLabel = {operational:'Operativo', prototype:'Prototipo', retired:'Retirado'};

async function loadBoosters(){
  try{
    const res = await fetch('data/boosters.json');
    const data = await res.json();
    window._boosters = data;
    renderGrid(data);
  }catch(e){
    console.error('Error cargando boosters', e);
    document.getElementById('grid').innerHTML = '<p>Error al cargar datos.</p>';
  }
}

function renderGrid(list){
  const grid = document.getElementById('grid');
  grid.innerHTML='';
  list.forEach(b=>{
    const div = document.createElement('div');
    div.className='booster-card';
    div.innerHTML = `
      <img src="${b.image}" alt="${b.name}">
      <strong>${b.name}</strong>
      <div class="booster-meta">Thrust: ${b.thrust || '-'} • ${b.missions?.length || 0} misiones</div>
      <div>
        <span class="badge ${b.state}">${stateLabel[b.state] || b.state}</span>
      </div>
      <div class="booster-actions">
        <button data-id="${b.id}" class="open">Ver detalle</button>
      </div>
    `;
    grid.appendChild(div);
  });
  // attach events
  document.querySelectorAll('button.open').forEach(btn=>btn.addEventListener('click', e=>{
    const id = e.currentTarget.getAttribute('data-id');
    openModal(id);
  }));
}

function openModal(id){
  const b = window._boosters.find(x=>x.id===id);
  if(!b) return;
  document.getElementById('modalTitle').textContent = b.name;
  document.getElementById('modalImage').src = b.image;
  document.getElementById('modalState').textContent = 'Estado: ' + (stateLabel[b.state] || b.state);
  document.getElementById('modalDesc').textContent = b.description || '';
  const list = document.getElementById('modalMissions');
  list.innerHTML = '';
  (b.missions||[]).forEach(m=>{
    const li = document.createElement('li');
    li.textContent = `${m.name} — ${m.date}`;
    list.appendChild(li);
  });
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal(){
  document.getElementById('modal').classList.add('hidden');
}

// Filtros
function applyFilters(){
  const q = (document.getElementById('search').value || '').toLowerCase();
  const state = document.getElementById('stateFilter').value;
  let list = window._boosters || [];
  if(state!=='all') list = list.filter(b=>b.state===state);
  if(q) list = list.filter(b=>b.name.toLowerCase().includes(q) || (b.description||'').toLowerCase().includes(q));
  renderGrid(list);
}

// Eventos
document.addEventListener('DOMContentLoaded', ()=>{
  loadBoosters();
  document.getElementById('search').addEventListener('input', applyFilters);
  document.getElementById('stateFilter').addEventListener('change', applyFilters);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', (e)=>{ if(e.target === e.currentTarget) closeModal(); });
});