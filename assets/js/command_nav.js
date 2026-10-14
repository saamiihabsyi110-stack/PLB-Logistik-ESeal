// Navigation Dropdown & Accordion Logic
window.addEventListener('load',()=>{
  const nav=document.getElementById('plb-command-nav');
  const input=document.getElementById('sidebarSearch');
  const count=document.getElementById('sidebarSearchCount');
  if(!nav)return;

  // Remove every previous trigger listener by replacing the trigger nodes.
  const groups=[...nav.querySelectorAll('.command-group')];
  groups.forEach(group=>{
    const oldTrigger=group.querySelector(':scope > .command-trigger');
    if(!oldTrigger)return;
    const trigger=oldTrigger.cloneNode(true);
    oldTrigger.replaceWith(trigger);
    trigger.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      const isOpen=group.classList.contains('open');
      groups.forEach(g=>g.classList.remove('open'));
      if(!isOpen) group.classList.add('open');
    });
  });

  const closeAll=()=>groups.forEach(g=>g.classList.remove('open'));
  document.addEventListener('click',e=>{
    if(!e.target.closest('#plb-command-nav')) closeAll();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll();});

  // Search: only matching module/group remains visible.
  if(input){
    const oldInput=input;
    const newInput=oldInput.cloneNode(true);
    oldInput.replaceWith(newInput);
    const runSearch=()=>{
      const q=newInput.value.trim().toLowerCase();
      let shown=0;
      groups.forEach(g=>{
        const triggerText=g.querySelector('.command-trigger')?.innerText.toLowerCase()||'';
        const menuText=g.querySelector('.command-menu')?.innerText.toLowerCase()||'';
        const match=!q || triggerText.includes(q) || menuText.includes(q);
        g.style.display=match?'block':'none';
        if(match){
          shown++;
          if(q) g.classList.add('open'); else g.classList.remove('open');
        }else g.classList.remove('open');
      });
      if(count) count.textContent=q ? `${shown} MODULE / GROUP DITEMUKAN` : 'SEMUA MODULE';
    };
    newInput.addEventListener('input',runSearch);
    newInput.addEventListener('keydown',e=>{
      if(e.key==='Escape'){newInput.value='';runSearch();newInput.blur();}
    });
  }
});


        (() => {
            const groups = [...document.querySelectorAll('#plb-command-nav .command-group')];
            const closeAll = (except = null) => groups.forEach(g => {
                if (g !== except) {
                    g.classList.remove('open');
                    const m = g.querySelector('.command-menu');
                    if (m) { m.style.top=''; m.style.left=''; m.style.maxHeight=''; m.style.width=''; }
                }
            });
            const place = (group) => {
                const trigger = group.querySelector('.command-trigger');
                const menu = group.querySelector('.command-menu');
                if (!trigger || !menu) return;
                const r = trigger.getBoundingClientRect();
                const width = Math.min(620, Math.max(280, window.innerWidth - 305));
                let left = r.right + 8;
                if (left + width > window.innerWidth - 12) left = Math.max(12, window.innerWidth - width - 12);
                const top = Math.max(8, Math.min(r.top, window.innerHeight - 180));
                menu.style.width = width + 'px';
                menu.style.left = left + 'px';
                menu.style.top = top + 'px';
                menu.style.maxHeight = Math.max(180, window.innerHeight - top - 12) + 'px';
            };
            groups.forEach(group => {
                const trigger = group.querySelector('.command-trigger');
                if (!trigger) return;
                trigger.addEventListener('click', e => {
                    e.preventDefault(); e.stopPropagation();
                    const open = !group.classList.contains('open');
                    closeAll(group);
                    if (open) { group.classList.add('open'); requestAnimationFrame(() => place(group)); }
                });
            });
            document.addEventListener('click', e => { if (!e.target.closest('#plb-command-nav') && !e.target.closest('.command-menu')) closeAll(); });
            document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
            window.addEventListener('resize', () => { const g=groups.find(x=>x.classList.contains('open')); if(g) place(g); });
            window.addEventListener('scroll', () => { const g=groups.find(x=>x.classList.contains('open')); if(g) place(g); }, true);
        })();

        (()=>{
            const input=document.getElementById('sidebarSearch');
            const nav=document.getElementById('plb-command-nav');
            const count=document.getElementById('sidebarSearchCount');
            if(!input||!nav)return;
            const groups=[...nav.querySelectorAll('.command-group')];
            const run=()=>{
                const q=input.value.trim().toLowerCase(); let shown=0;
                groups.forEach(g=>{
                    const text=g.innerText.toLowerCase(); const ok=!q||text.includes(q);
                    g.style.display=ok?'block':'none'; if(ok)shown++;
                    if(q&&ok) g.classList.add('open'); else if(!q) g.classList.remove('open');
                });
                count.textContent=q?`${shown} MODULE / GROUP DITEMUKAN`:'SEMUA MODULE';
            };
            input.addEventListener('input',run);
            input.addEventListener('keydown',e=>{if(e.key==='Escape'){input.value='';run();input.blur();}});
        })();

