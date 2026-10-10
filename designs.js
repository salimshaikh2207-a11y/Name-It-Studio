(()=>{
 'use strict';
 const $=id=>document.getElementById(id);let cards=[],selected,opener,collections=new Set();
 const money=n=>'₹'+Number(n).toLocaleString('en-IN');
 const loaded=fetch('/catalogue/designs.json?v=20261008-prices',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()});loaded.catch(()=>{});
 function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 function cardMarkup(d){
   const img=d.images&&d.images[0]?d.images[0]:{};
   const rate=d.pricePerSqIn?money(d.pricePerSqIn)+' / sq in':'Price on quote';
   const detail=d.productionNotes||d.description;
   const productUrl=d.productUrl||'#design-'+encodeURIComponent(d.id);
   return '<article class="design-card" id="design-'+esc(d.id)+'" data-design-category="'+esc(d.category)+'" data-design-collection="'+esc(d.collection||'')+'" data-design-search="'+esc((d.name+' '+d.category+' '+(d.collection||'')+' '+d.description+' '+(d.productionNotes||'')).toLowerCase())+'"><a class="design-picture" href="'+productUrl+'" aria-label="View '+esc(d.name)+'"><img src="'+esc(img.src)+'" width="'+esc(img.width||1200)+'" height="'+esc(img.height||1200)+'" alt="'+esc(d.name)+' — '+esc(d.description)+'" loading="lazy"><span class="design-view-pill">View product</span></a><div class="design-card-body"><div class="design-card-topline"><span>'+esc(d.category)+'</span><strong>'+esc(rate)+'</strong></div><h3><a href="'+productUrl+'">'+esc(d.name)+'</a></h3><p class="design-description">'+esc(detail)+'</p><div class="design-card-proof"><span>4 artwork options</span><span>Made to order</span></div><div class="design-card-actions"><a class="button primary" href="'+productUrl+'">View & customize →</a><button class="design-quick" data-design-open="'+esc(d.id)+'" type="button">Quick quote</button></div></div></article>';
 }
 function bindCard(card){card.querySelectorAll('[data-design-open]').forEach(b=>b.onclick=()=>open(b.dataset.designOpen,b));}
 async function build(){
   const data=await loaded;collections=new Set(data.map(d=>d.collection));const grid=document.querySelector('.design-grid');if(!grid)return;
   grid.innerHTML=data.map(cardMarkup).join('');
   cards=[...grid.querySelectorAll('.design-card')];cards.forEach(bindCard);
   $('design-count').textContent=data.length+' designs · '+data.reduce((n,d)=>n+(d.images?.length||0),0)+' images';
   const params=new URLSearchParams(location.search),requested=params.get('material');
   if(requested&&['Acrylic','Glass','Engraved Mandala'].includes(requested))$('design-category').value=requested;filter();linked();
 }
 function filter(){const q=$('design-search').value.toLowerCase().trim(),cat=$('design-category').value,collection=new URLSearchParams(location.search).get('category');let count=0;cards.forEach(c=>{c.hidden=!!((q&&!c.dataset.designSearch.includes(q))||(cat&&c.dataset.designCategory!==cat)||(collections.has(collection)&&c.dataset.designCollection!==collection));if(!c.hidden)count++});$('design-count').textContent=count+' designs shown';$('design-empty').hidden=!!count}
 ['design-search','design-category'].forEach(id=>$(id).addEventListener('input',filter));
 let lastEstimateKey='';
 function estimate(track=false){
   if(!selected)return;
   const w=Number($('design-width')?.value||0),h=Number($('design-height')?.value||0),out=$('design-estimate');
   if(!out)return;
   if(w>0&&h>0){
     const area=w*h,total=Math.round(area*Number(selected.pricePerSqIn||0));
     out.innerHTML='<strong>Estimated price: '+money(total)+'</strong><span>'+w+' × '+h+' in = '+area.toFixed(2)+' sq in × '+money(selected.pricePerSqIn)+'</span><small>Estimate only. Final price is confirmed after artwork, shape, lighting and production details are approved.</small>';
     out.dataset.estimate=String(total);out.dataset.area=area.toFixed(2);out.dataset.rate=String(selected.pricePerSqIn);
     const key=selected.id+'|'+w+'|'+h;
     if(track&&key!==lastEstimateKey){lastEstimateKey=key;window.nis_track_event?.('price_estimate',{design_id:selected.id,material:selected.category,width_in:w,height_in:h,area_sq_in:Number(area.toFixed(2)),rate_per_sq_in:selected.pricePerSqIn,estimated_price:total});}
   }else{
     out.innerHTML='<strong>Enter width and height to estimate the price.</strong><small>For round designs, enter the diameter in both fields.</small>';
     delete out.dataset.estimate;delete out.dataset.area;delete out.dataset.rate;lastEstimateKey='';
   }
 }
 function view(i){const im=selected.images[i];$('design-image').src=im.src;$('design-image').alt=selected.name+' — image '+(i+1);[...$('design-views').children].forEach((b,n)=>b.setAttribute('aria-pressed',String(i===n)))}
 async function open(id,b){try{selected=(await loaded).find(d=>d.id===id);if(!selected){$('design-count').textContent='This design is no longer listed. Please choose another design or contact us for a custom order.';return;}opener=b;$('design-form').reset();lastEstimateKey='';$('design-ready').hidden=true;$('design-title').textContent=selected.name;$('design-code').textContent=selected.category+' · '+selected.id;$('design-description').textContent=selected.description;$('design-production').innerHTML='<strong>'+money(selected.pricePerSqIn)+' / sq in</strong><br>'+esc(selected.productionNotes||'Final material, finish and lighting confirmed with your quote.')+'<br><small>Includes 4 artwork options before production · final total confirmed before you pay.</small>';$('design-views').replaceChildren();selected.images.forEach((im,i)=>{if(selected.images.length===1)return;const button=document.createElement('button');button.type='button';button.textContent='View '+(i+1);button.onclick=()=>view(i);$('design-views').append(button)});view(0);estimate(false);window.nis_track_event?.('design_view',{design_id:selected.id,material:selected.category,source:'catalogue_dialog'});$('design-dialog').showModal()}catch{$('design-count').textContent='Unable to load design details. Please reload or contact info@nameitstudio.in.'}}
 $('design-close').onclick=()=>$('design-dialog').close();$('design-dialog').addEventListener('close',()=>opener?.focus());$('design-form').addEventListener('input',()=>{$('design-ready').hidden=true;estimate(false);});$('design-width')?.addEventListener('change',()=>estimate(true));$('design-height')?.addEventListener('change',()=>estimate(true));$('design-category')?.addEventListener('change',()=>window.nis_track_event?.('material_select',{material:$('design-category').value||'all',source:'catalogue_filter'}));
 $('design-form').onsubmit=e=>{e.preventDefault();const w=$('design-width').value.trim(),h=$('design-height').value.trim(),est=$('design-estimate');const lines=['Hello Name It Studio, I would like a quote for '+selected.name+' ('+selected.id+').','Design: https://nameitstudio.in/catalogue/#design-'+selected.id,'Reference image: https://nameitstudio.in'+selected.images[0].src,'Category: '+selected.category,'Rate: '+money(selected.pricePerSqIn)+' per sq in','Build: '+selected.productionNotes,'My text: '+($('design-text').value.trim()||'Please help me finalise it.'),'Preferred size: '+(w&&h?w+' × '+h+' inches':'Please advise.'),'Estimated price: '+(est.dataset.estimate?money(Number(est.dataset.estimate))+' ('+est.dataset.area+' sq in × '+money(Number(est.dataset.rate))+'/sq in)':'Not calculated'),'Lighting: '+$('design-lighting').value,'Changes: '+($('design-notes').value.trim()||'None specified.'),'Please prepare 4 artwork options based on this design and my details, then confirm the final dimensions and total price.','Payment: 30% after design finalisation, remaining 70% on delivery. Delivery within 3–5 working days from order confirmation.'];const payload={method:'catalogue_design',lead_type:'design_quote',design_id:selected.id,material:selected.category,estimated_price:Number(est.dataset.estimate||0)};window.nis_track_event?.('whatsapp_quote_click',payload);window.nis_track_event?.('generate_lead',payload);const link=$('design-whatsapp');link.href='https://wa.me/919082405720?text='+encodeURIComponent(lines.join('\n\n'));$('design-ready').hidden=false;link.click()};
 function linked(){const match=location.hash.match(/^#design-((?:D|P)\d{2})$/);if(match)open(match[1],document.querySelector('[data-design-open="'+match[1]+'"]'))}
 document.querySelector('.design-grid')?.addEventListener('click',e=>{const a=e.target.closest('a[href^="#design-"]');if(a&&a.hash===location.hash){e.preventDefault();linked();}});
 window.addEventListener('hashchange',linked);build().catch(()=>{$('design-count').textContent='Unable to load designs. Please reload or contact info@nameitstudio.in.';});
})();
