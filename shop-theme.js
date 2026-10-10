(()=>{'use strict';
function nis_track_event(name,params={}){if(typeof window.gtag==='function'){const eventParams={...params,page_path:location.pathname+location.hash};if(name==='generate_lead')eventParams.send_to=['G-KH9G59TVN1','AW-73938513860'];window.gtag('event',name,eventParams);}} window.nis_track_event=nis_track_event;
if(typeof window.gtag==='function'&&!window.__nisAdsTagConfigured){window.gtag('config','AW-73938513860');window.__nisAdsTagConfigured=true;}
document.addEventListener('click',e=>{
 const el=e.target.closest('a,button'); if(!el)return;
 const href=(el.getAttribute('href')||'').trim();
 if(href.includes('wa.me/')){
  const path=location.pathname, lead_type=path.includes('/business-office-signs/')||path.includes('/custom-logo-signs/')?'business_signage':path.includes('/bulk-orders-resellers/')?'bulk_trade':el.hasAttribute('data-design-options')?'design_options':'whatsapp_contact';
  const payload={method:'whatsapp',lead_type,link_text:(el.textContent||'').trim().slice(0,80),destination:href.split('?')[0],page_path:location.pathname+location.hash};
  nis_track_event('whatsapp_click',payload);
  if(el.hasAttribute('data-design-options')) nis_track_event('design_options_click',{link_text:payload.link_text,lead_type});
 }
 if(href.startsWith('tel:')){const payload={method:'phone',lead_type:'phone_call',link_text:(el.textContent||'').trim().slice(0,80),destination:href.split('?')[0],page_path:location.pathname+location.hash};nis_track_event('phone_click',payload);}
 if(href==='#studio'||href==='/#studio'||href.includes('#project-request')||el.hasAttribute('data-start')||el.hasAttribute('data-project')) nis_track_event('customize_click',{link_text:(el.textContent||'').trim().slice(0,80)});
 if(el.hasAttribute('data-catalogue-open')) nis_track_event('product_select',{product_id:'NIS-'+el.getAttribute('data-catalogue-open'),product_type:'priced_product'});
 if(el.hasAttribute('data-design-open')){const id=el.getAttribute('data-design-open');nis_track_event('product_select',{product_id:id,product_type:'design'});}
 if(href.includes('/how-to-order/')) nis_track_event('order_guide_click',{link_text:(el.textContent||'').trim().slice(0,80)});
 if(el.hasAttribute('data-proof-link')) nis_track_event('trust_proof_click',{proof_type:el.getAttribute('data-proof-link'),link_text:(el.textContent||'').trim().slice(0,80),destination:href.split('?')[0]});
 if(el.hasAttribute('data-review-link')) nis_track_event('review_cta_click',{review_action:el.getAttribute('data-review-link'),link_text:(el.textContent||'').trim().slice(0,80),destination:href.split('?')[0]});
},true);
const more=document.getElementById('more-options');function reveal(target){if(more&&target&&more.contains(target))more.open=true}function linked(){let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)))}catch{}reveal(target);if(target&&more?.contains(target))requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));if(document.getElementById('priced-products')){if(location.hash.startsWith('#product-')||location.hash==='#catalogue-grid'||location.hash==='#priced-products')tab('priced-products');else if(location.hash.startsWith('#design-')||location.hash==='#designs')tab('designs')}}document.addEventListener('click',e=>{const b=e.target.closest('[data-start],[data-project]');if(b&&more)more.open=true;const a=e.target.closest('a[href^="#"]');if(a)reveal(document.getElementById(a.getAttribute('href').slice(1)))},true);function tab(id){for(const name of['designs','priced-products']){const n=document.getElementById(name);if(n)n.hidden=name!==id}document.querySelectorAll('[data-shop-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.shopTab===id)))}document.querySelectorAll('[data-shop-tab]').forEach(b=>b.onclick=()=>tab(b.dataset.shopTab));const params=new URLSearchParams(location.search),search=document.getElementById('design-search'),category=document.getElementById('design-category');if(search&&params.has('q')){search.value=params.get('q');search.dispatchEvent(new Event('input'));const old=document.getElementById('catalogue-search');if(old){old.value=params.get('q');old.dispatchEvent(new Event('input'))}}if(category&&[...category.options].some(o=>o.value===params.get('category'))){category.value=params.get('category');category.dispatchEvent(new Event('input'))}document.querySelectorAll('.shop-header nav a').forEach(a=>{if(a.getAttribute('href')===location.pathname)a.setAttribute('aria-current','page')});
function setupNavigation(){
 const header=document.querySelector('.shop-header'),nav=header?.querySelector('nav');if(!header||!nav)return;
 nav.classList.add('nis-nav');
 nav.innerHTML='<a href="/">Home</a><a href="/catalogue/">Shop</a><a href="/#project-request">Custom order</a><a href="/how-to-order/">How it works</a><a href="/#real-work">Real work</a><a href="/bulk-orders-resellers/">Bulk / Reseller</a><a href="/#contact">Contact</a>';
 const menu=document.createElement('button');menu.type='button';menu.className='nav-toggle';menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open site menu');menu.innerHTML='<span>Menu</span><span aria-hidden="true">☰</span>';nav.before(menu);
 const setOpen=open=>{header.classList.toggle('nav-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close site menu':'Open site menu');menu.lastElementChild.textContent=open?'×':'☰'};
 menu.addEventListener('click',()=>setOpen(!header.classList.contains('nav-open')));nav.addEventListener('click',e=>{if(e.target.closest('a'))setOpen(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
 const path=location.pathname;nav.querySelectorAll('a').forEach(a=>{const href=a.getAttribute('href');if((href==='/'&&path==='/')||(href==='/catalogue/'&&path.startsWith('/catalogue'))||(href==='/how-to-order/'&&path.startsWith('/how-to-order')))a.setAttribute('aria-current','page')});
 if(!document.querySelector('.mobile-quick-nav')){const dock=document.createElement('div');dock.className='mobile-quick-nav';dock.setAttribute('role','navigation');dock.setAttribute('aria-label','Quick actions');dock.innerHTML='<a href="/catalogue/"><span aria-hidden="true">⌕</span>Shop</a><a href="/#quick-enquiry"><span aria-hidden="true">✦</span>Get 4 Designs</a><a class="quick-call" href="tel:+919082405720"><span aria-hidden="true">☎</span>Call Us</a><a class="quick-whatsapp" href="https://wa.me/919082405720" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↗</span>WhatsApp</a>';document.body.append(dock)}
}
function setupSocialLinks(){
 const footer=document.querySelector('.footer-contact');
 if(footer&&!footer.querySelector('.social-links-inline')){
  const social=document.createElement('div');social.className='social-links-inline';social.setAttribute('aria-label','Name It Studio social media');
  social.innerHTML='<a href="https://www.instagram.com/nameitstudio.in/" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">◎</span> Instagram</a><a href="https://www.facebook.com/profile.php?id=1320468437817367" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">f</span> Facebook</a><a href="https://share.google/3INrXMV6OXjq8HobA" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">G</span> Google</a>';
  footer.append(social);
 }
}
function setupCallOption(){
 const phone='+91 90824 05720',tel='tel:+919082405720';
 document.querySelectorAll('.footer-contact').forEach(footer=>{
  if(footer.querySelector('.footer-call'))return;
  const a=document.createElement('a');a.className='footer-call';a.href=tel;a.innerHTML='<small>CALL US</small>'+phone+' ↗';
  const social=footer.querySelector('.social-links-inline');if(social)footer.insertBefore(a,social);else footer.append(a);
 });
 if(!document.querySelector('.site-call-cta')){
  const a=document.createElement('a');a.className='site-call-cta';a.href=tel;a.setAttribute('aria-label','Call Name It Studio at '+phone);
  a.innerHTML='<span aria-hidden="true">☎</span><strong>Call us</strong><small>'+phone+'</small>';document.body.append(a);
 }
}
function setupVisitorLeadForm(){
 const form=document.getElementById('visitor-lead-form');if(!form)return;
 const material=document.getElementById('lead-material'),design=document.getElementById('lead-design'),width=document.getElementById('lead-width'),height=document.getElementById('lead-height'),estimate=document.getElementById('lead-price-estimate');
 let catalogue=[],started=false,lastEstimateKey='';
 const money=n=>'₹'+Number(n).toLocaleString('en-IN');
 const load=fetch('/catalogue/designs.json?v=20261008-prices',{cache:'no-store'}).then(r=>r.ok?r.json():[]).then(d=>catalogue=d).catch(()=>[]);
 function selectedDesign(){return catalogue.find(d=>d.id===design?.value);}
 function populateDesigns(){
  if(!design)return;
  const mat=material?.value||'';
  if(!mat||mat==='Not sure'){design.innerHTML='<option value="">Not sure — recommend a design</option>';design.disabled=true;renderEstimate();return;}
  const items=catalogue.filter(d=>d.category===mat);
  design.disabled=false;
  design.innerHTML='<option value="">Choose a design</option>'+items.map(d=>'<option value="'+d.id+'">'+d.id+' · '+d.name+' · ₹'+d.pricePerSqIn+'/sq in</option>').join('');
  renderEstimate();
 }
 function renderEstimate(){
  if(!estimate)return;
  const d=selectedDesign(),w=Number(width?.value||0),h=Number(height?.value||0);
  if(d&&w>0&&h>0){
   const area=w*h,total=Math.round(area*Number(d.pricePerSqIn||0));
   estimate.innerHTML='<strong>Estimated price: '+money(total)+'</strong><span>'+w+' × '+h+' in = '+area.toFixed(2)+' sq in × '+money(d.pricePerSqIn)+'</span><small>Estimate only. Final total is confirmed after artwork and production details are approved.</small>';
   estimate.dataset.estimate=String(total);estimate.dataset.area=area.toFixed(2);estimate.dataset.rate=String(d.pricePerSqIn);
   const key=d.id+'|'+w+'|'+h;
   if(key!==lastEstimateKey){lastEstimateKey=key;nis_track_event('price_estimate',{design_id:d.id,material:d.category,width_in:w,height_in:h,area_sq_in:Number(area.toFixed(2)),rate_per_sq_in:d.pricePerSqIn,estimated_price:total});}
  }else{
   estimate.innerHTML='<strong>Choose a design and size to estimate the price.</strong><small>For round designs, use the diameter for both width and height.</small>';
   delete estimate.dataset.estimate;delete estimate.dataset.area;delete estimate.dataset.rate;lastEstimateKey='';
  }
 }
 load.then(populateDesigns);
 material?.addEventListener('change',()=>{nis_track_event('material_select',{material:material.value||'not_selected',source:'quick_enquiry'});populateDesigns();});
 design?.addEventListener('change',()=>{const d=selectedDesign();if(d)nis_track_event('design_view',{design_id:d.id,material:d.category,source:'quick_enquiry'});renderEstimate();});
 width?.addEventListener('change',renderEstimate);height?.addEventListener('change',renderEstimate);
 form.addEventListener('input',()=>{if(started)return;started=true;nis_track_event('lead_form_start',{form_name:'quick_enquiry'});},{once:true});
 form.addEventListener('submit',e=>{
  e.preventDefault();if(!form.reportValidity())return;
  const data=new FormData(form),d=selectedDesign();
  const name=(data.get('name')||'').trim(),phone=(data.get('phone')||'').trim(),mat=(data.get('material')||'').trim(),plate=(data.get('plate_text')||'').trim(),area=(data.get('area')||'').trim(),w=(data.get('width')||'').trim(),h=(data.get('height')||'').trim();
  const lines=['Hi Name It Studio, I would like 4 personalised design options.','','Material: '+(mat||'Please recommend'),'Design: '+(d?d.name+' ('+d.id+')':'Please recommend'),'Name / House Number: '+(plate||'I will share'),'Size: '+(w&&h?w+' × '+h+' inches':'Please recommend')];
  if(estimate?.dataset.estimate)lines.push('Estimated price: '+money(Number(estimate.dataset.estimate))+' ('+estimate.dataset.area+' sq in × '+money(Number(estimate.dataset.rate))+'/sq in)');
  lines.push('','My name: '+name,'WhatsApp / Phone: '+phone);if(area)lines.push('Area / City: '+area);
  lines.push('','Please prepare 4 artwork options and confirm the final size, construction and total before production.');
  const payload={method:'website_form',lead_type:'quick_enquiry',material:mat||'not_sure',design_id:d?.id||'not_selected',estimated_price:Number(estimate?.dataset.estimate||0)};
  nis_track_event('whatsapp_quote_click',payload);nis_track_event('generate_lead',payload);nis_track_event('lead_form_submit',{form_name:'quick_enquiry',...payload});
  window.open('https://wa.me/919082405720?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener,noreferrer');
 });
}
setupNavigation();setupSocialLinks();setupCallOption();setupVisitorLeadForm();window.addEventListener('hashchange',linked);linked()})();
