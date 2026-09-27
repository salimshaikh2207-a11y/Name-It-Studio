(()=>{
 'use strict';
 const $=id=>document.getElementById(id), cards=[...document.querySelectorAll('.catalogue-card')];
 let products=null, selected=null, opener=null;
 const money=n=>'₹'+n.toLocaleString('en-IN');
 const request=fetch('/catalogue/products.json').then(r=>{if(!r.ok)throw Error('catalogue');return r.json();}).then(p=>products=p);
 request.catch(()=>{});
 function filter(){
  const q=$('catalogue-search').value.trim().toLowerCase(),cat=$('catalogue-category').value,lit=$('catalogue-light').value;
  let count=0;
  cards.forEach(c=>{c.hidden=!!((q&&!c.dataset.search.includes(q))||(cat&&c.dataset.category!==cat)||(lit&&c.dataset.lit!==lit));if(!c.hidden)count++;});
  $('catalogue-count').textContent=count+' '+(count===1?'design':'designs')+' shown';$('catalogue-empty').hidden=count!==0;
 }
 ['catalogue-search','catalogue-category','catalogue-light'].forEach(id=>$(id).addEventListener('input',filter));
 $('catalogue-reset').onclick=()=>{['catalogue-search','catalogue-category','catalogue-light'].forEach(id=>$(id).value='');filter();};
 function refresh(){
  $('catalogue-dialog-title').textContent=selected.name;
  $('catalogue-description').textContent=selected.description;
  $('catalogue-image-credit').textContent=selected.reference?'Reference image from '+new URL(selected.reference).hostname.replace('www.','')+'. Your final artwork and finish will be confirmed with you.':'Design reference · Personalised to order';
  $('catalogue-specs').textContent=selected.size+' · '+selected.lighting;
  $('catalogue-preview').hidden=!selected.image;
  if(selected.image){$('catalogue-preview').src=selected.image;$('catalogue-preview').alt=selected.name+' design reference';}
  else $('catalogue-preview').removeAttribute('src');
  const custom=$('catalogue-size-option').value==='custom';
  $('catalogue-custom-wrap').hidden=!custom;$('catalogue-custom-size').required=custom;
  $('catalogue-price-detail').textContent=custom?'Custom size: price confirmed by quotation.':money(selected.price)+' offer · Regular '+money(selected.regular)+' · Save ₹100';
  $('catalogue-text-label').textContent=selected.personal;
  $('catalogue-ready').hidden=true;
 }
 async function openProduct(id,b){
  opener=b||null;if(b)b.disabled=true;
  try{await request;selected=products.find(p=>p.id===id);if(!selected)throw Error('missing product');$('catalogue-form').reset();$('catalogue-colour-wrap').hidden=!['05','06'].includes(selected.id);$('catalogue-colour').value=selected.id==='06'?'06':'05';refresh();$('catalogue-dialog').showModal();}
  catch{$('catalogue-count').textContent='Product details could not load. Please reload or contact info@nameitstudio.in.';}
  finally{if(b)b.disabled=false;}
 }
 document.querySelectorAll('[data-catalogue-open]').forEach(b=>b.addEventListener('click',()=>openProduct(b.dataset.catalogueOpen,b)));
 function linkedProduct(){const m=location.hash.match(/^#product-(\d+)$/);if(m)openProduct(m[1],document.querySelector('[data-catalogue-open="'+m[1]+'"]'));}
 window.addEventListener('hashchange',linkedProduct);if(location.hash.startsWith('#product-'))requestAnimationFrame(linkedProduct);
 $('catalogue-colour').onchange=()=>{selected=products.find(p=>p.id===$('catalogue-colour').value);refresh();};
 $('catalogue-size-option').onchange=refresh;
 $('catalogue-form').addEventListener('input',()=>{$('catalogue-ready').hidden=true;});
 $('catalogue-close').onclick=()=>$('catalogue-dialog').close();
 $('catalogue-dialog').addEventListener('close',()=>opener?.focus());
 $('catalogue-form').onsubmit=e=>{
  e.preventDefault();if(!$('catalogue-form').reportValidity())return;
  const custom=$('catalogue-size-option').value==='custom', quantity=Number($('catalogue-quantity').value);
  const brief=['Hello Name It Studio, I would like to enquire about '+selected.name+' (NIS-'+selected.id+').',
   'Size: '+(custom?$('catalogue-custom-size').value.trim()+' — custom quote requested':selected.size),
   'Lighting: '+selected.lighting,'Quantity: '+quantity,
   custom?'Price: please quote this custom size with the limited-time ₹100 discount.':'Offer price per item: '+money(selected.price)+' (regular '+money(selected.regular)+', ₹100 off).',
   ...(!custom?['Product subtotal: '+money(selected.price*quantity)]:[]),
   'Personalisation: '+($('catalogue-text').value.trim()||'Please help me finalise the design.'),
   'Additional details: '+($('catalogue-notes').value.trim()||'None'),
   'Delivery: within 3–5 working days from order confirmation. Payment: 10% after design finalisation, remaining 90% on delivery.',
   'Please confirm the final artwork, total payable and order details. I will attach any photo, logo or QR code in this chat.'];
  $('catalogue-whatsapp').href='https://wa.me/919870539815?text='+encodeURIComponent(brief.join('\n\n'));
  $('catalogue-ready').hidden=false;$('catalogue-whatsapp').focus();
 };
})();
