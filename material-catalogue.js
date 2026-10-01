(()=>{
'use strict';
const root=document.querySelector('[data-material-catalogue]');if(!root)return;
const material=root.dataset.material;
const grid=root.querySelector('[data-material-grid]');
const count=root.querySelector('[data-material-count]');
const money=n=>'₹'+Number(n).toLocaleString('en-IN');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
fetch('/catalogue/designs.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{
 const items=data.filter(d=>d.category===material);
 if(count)count.textContent=items.length+' selected '+material.toLowerCase()+' designs';
 grid.innerHTML=items.map(d=>{
  const im=d.images?.[0]||{};
  return '<article class="material-design-card"><a class="material-design-image" href="/catalogue/#design-'+esc(d.id)+'"><img src="'+esc(im.src)+'" alt="'+esc(d.name)+'" loading="lazy"></a><div><p class="eyebrow">'+esc(d.id)+' · '+esc(material)+'</p><h3>'+esc(d.name)+'</h3><p>'+esc(d.productionNotes||d.description)+'</p><p class="material-rate"><strong>'+money(d.pricePerSqIn)+' / sq in</strong></p><a class="button primary" href="/catalogue/#design-'+esc(d.id)+'">View & calculate →</a></div></article>';
 }).join('');
}).catch(()=>{if(count)count.textContent='Unable to load designs right now.'});
})();
