(()=>{
 'use strict';
 const $=id=>document.getElementById(id);let cards=[],selected,opener;
 const money=n=>'₹'+Number(n).toLocaleString('en-IN');
 const loaded=fetch('/catalogue/designs.json').then(r=>{if(!r.ok)throw Error();return r.json()});loaded.catch(()=>{});
 function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 function cardMarkup(d){
   const img=d.images&&d.images[0]?d.images[0]:{};
   const rate=d.pricePerSqIn?money(d.pricePerSqIn)+' / sq in':'Price on quote';
   const detail=d.productionNotes||d.description;
   return '<article class="design-card" id="design-'+esc(d.id)+'" data-design-category="'+esc(d.category)+'" data-design-search="'+esc((d.name+' '+d.category+' '+(d.collection||'')+' '+d.description+' '+(d.productionNotes||'')).toLowerCase())+'"><button type="button" class="design-picture" data-design-open="'+esc(d.id)+'" aria-label="Choose '+esc(d.name)+'"><img src="'+esc(img.src)+'" width="'+esc(img.width||1200)+'" height="'+esc(img.height||1200)+'" alt="'+esc(d.name)+' — '+esc(d.description)+'" loading="lazy"></button><div><p class="eyebrow">'+esc(d.category)+' · '+esc(d.id)+'</p><h3>'+esc(d.name)+'</h3><p>'+esc(detail)+'</p><p class="design-quote"><strong>'+esc(rate)+'</strong> · Personalised to order</p><button class="button primary" data-design-open="'+esc(d.id)+'" type="button">See it with my name →</button></div></article>';
 }
 function bindCard(card){card.querySelectorAll('[data-design-open]').forEach(b=>b.onclick=()=>open(b.dataset.designOpen,b));}
 async function build(){
   const data=await loaded,grid=document.querySelector('.design-grid');if(!grid)return;
   grid.innerHTML=data.map(cardMarkup).join('');
   cards=[...grid.querySelectorAll('.design-card')];cards.forEach(bindCard);
   $('design-count').textContent=data.length+' designs · '+data.reduce((n,d)=>n+(d.images?.length||0),0)+' images';
   filter();linked();
 }
 function filter(){const q=$('design-search').value.toLowerCase().trim(),cat=$('design-category').value;let count=0;cards.forEach(c=>{c.hidden=!!((q&&!c.dataset.designSearch.includes(q))||(cat&&c.dataset.designCategory!==cat));if(!c.hidden)count++});$('design-count').textContent=count+' designs shown';$('design-empty').hidden=!!count}
 ['design-search','design-category'].forEach(id=>$(id).addEventListener('input',filter));
 function view(i){const im=selected.images[i];$('design-image').src=im.src;$('design-image').alt=selected.name+' — image '+(i+1);[...$('design-views').children].forEach((b,n)=>b.setAttribute('aria-pressed',String(i===n)))}
 async function open(id,b){try{selected=(await loaded).find(d=>d.id===id);if(!selected)return;opener=b;$('design-form').reset();$('design-ready').hidden=true;$('design-title').textContent=selected.name;$('design-code').textContent=selected.category+' · '+selected.id;$('design-description').textContent=selected.description;$('design-production').innerHTML='<strong>'+money(selected.pricePerSqIn)+' / sq in</strong><br>'+esc(selected.productionNotes||'Final material, finish and lighting confirmed with your quote.');$('design-views').replaceChildren();selected.images.forEach((im,i)=>{if(selected.images.length===1)return;const button=document.createElement('button');button.type='button';button.textContent='View '+(i+1);button.onclick=()=>view(i);$('design-views').append(button)});view(0);$('design-dialog').showModal()}catch{$('design-count').textContent='Unable to load design details. Please reload or contact info@nameitstudio.in.'}}
 $('design-close').onclick=()=>$('design-dialog').close();$('design-dialog').addEventListener('close',()=>opener?.focus());$('design-form').addEventListener('input',()=>$('design-ready').hidden=true);
 $('design-form').onsubmit=e=>{e.preventDefault();const lines=['Hello Name It Studio, I would like a quote for '+selected.name+' ('+selected.id+').','Design: https://nameitstudio.in/catalogue/#design-'+selected.id,'Reference image: https://nameitstudio.in'+selected.images[0].src,'Category: '+selected.category,'Rate: '+money(selected.pricePerSqIn)+' per sq in','Build: '+selected.productionNotes,'My text: '+($('design-text').value.trim()||'Please help me finalise it.'),'Preferred size: '+($('design-size').value.trim()||'Please advise.'),'Lighting: '+$('design-lighting').value,'Changes: '+($('design-notes').value.trim()||'None specified.'),'Please prepare 4 artwork options based on this design and my details, then confirm the final dimensions and total price.','Payment: 10% after design finalisation, remaining 90% on delivery. Delivery within 3–5 working days from order confirmation.'];const link=$('design-whatsapp');link.href='https://wa.me/919082405720?text='+encodeURIComponent(lines.join('\n\n'));$('design-ready').hidden=false;link.click()};
 function linked(){const match=location.hash.match(/^#design-((?:D|P)\d{2})$/);if(match)open(match[1],document.querySelector('[data-design-open="'+match[1]+'"]'))}
 window.addEventListener('hashchange',linked);build();
})();
