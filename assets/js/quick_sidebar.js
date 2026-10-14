(()=>{const b=document.getElementById('sideSlideToggle'),p=document.getElementById('sideSlidePanel'),o=document.getElementById('sideSlideOverlay');
const close=()=>{p.classList.remove('open');o.classList.remove('open');b.textContent='☰';b.setAttribute('aria-label','Buka sidebar')};
const open=()=>{p.classList.add('open');o.classList.remove('open');b.textContent='✕';b.setAttribute('aria-label','Tutup sidebar')};
open();
b.addEventListener('click',e=>{e.stopPropagation();p.classList.contains('open')?close():open()});o.addEventListener('click',close);
document.querySelectorAll('[data-slide-view]').forEach(x=>x.addEventListener('click',()=>{if(typeof app!=='undefined'&&app&&typeof app.renderOpsPanel==='function'){app.renderOpsPanel(x.dataset.slideView)} close();}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});})();
