(()=>{'use strict';
function nis_track_event(name,params={}){if(typeof window.gtag==='function'){window.gtag('event',name,{...params,page_path:location.pathname+location.hash});}}
document.addEventListener('click',e=>{
 const el=e.target.closest('a,button'); if(!el)return;
 const href=(el.getAttribute('href')||'').trim();
 if(href.includes('wa.me/')){
  const path=location.pathname, lead_type=path.includes('/business-office-signs/')||path.includes('/custom-logo-signs/')?'business_signage':path.includes('/bulk-orders-resellers/')?'bulk_trade':el.hasAttribute('data-design-options')?'design_options':'whatsapp_contact';
  const payload={method:'whatsapp',lead_type,link_text:(el.textContent||'').trim().slice(0,80),destination:href.split('?')[0],page_path:location.pathname+location.hash};
  nis_track_event('whatsapp_click',payload);
  nis_track_event('generate_lead',payload);
  if(el.hasAttribute('data-design-options')) nis_track_event('design_options_click',{link_text:payload.link_text,lead_type});
 }
 if(href.startsWith('tel:')) nis_track_event('phone_click',{link_text:(el.textContent||'').trim().slice(0,80)});
 if(href==='#studio'||href==='/#studio'||href.includes('#project-request')||el.hasAttribute('data-start')||el.hasAttribute('data-project')) nis_track_event('customize_click',{link_text:(el.textContent||'').trim().slice(0,80)});
 if(el.hasAttribute('data-catalogue-open')) nis_track_event('product_select',{product_id:'NIS-'+el.getAttribute('data-catalogue-open'),product_type:'priced_product'});
 if(el.hasAttribute('data-design-open')) nis_track_event('product_select',{product_id:el.getAttribute('data-design-open'),product_type:'design'});
 if(href.includes('/how-to-order/')) nis_track_event('order_guide_click',{link_text:(el.textContent||'').trim().slice(0,80)});
},true);
const more=document.getElementById('more-options');function reveal(target){if(more&&target&&more.contains(target))more.open=true}function linked(){let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)))}catch{}reveal(target);if(target&&more?.contains(target))requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));if(document.getElementById('priced-products')){if(location.hash.startsWith('#product-')||location.hash==='#catalogue-grid')tab('priced-products');else if(location.hash.startsWith('#design-'))tab('designs')}}document.addEventListener('click',e=>{const b=e.target.closest('[data-start],[data-project]');if(b&&more)more.open=true;const a=e.target.closest('a[href^="#"]');if(a)reveal(document.getElementById(a.getAttribute('href').slice(1)))},true);function tab(id){for(const name of['designs','priced-products']){const n=document.getElementById(name);if(n)n.hidden=name!==id}document.querySelectorAll('[data-shop-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.shopTab===id)))}document.querySelectorAll('[data-shop-tab]').forEach(b=>b.onclick=()=>tab(b.dataset.shopTab));const params=new URLSearchParams(location.search),search=document.getElementById('design-search'),category=document.getElementById('design-category');if(search&&params.has('q')){search.value=params.get('q');search.dispatchEvent(new Event('input'));const old=document.getElementById('catalogue-search');old.value=params.get('q');old.dispatchEvent(new Event('input'))}if(category&&[...category.options].some(o=>o.value===params.get('category'))){category.value=params.get('category');category.dispatchEvent(new Event('input'))}document.querySelectorAll('.shop-header nav a').forEach(a=>{if(a.getAttribute('href')===location.pathname)a.setAttribute('aria-current','page')});
function setupNavigation(){
 const header=document.querySelector('.shop-header'),nav=header?.querySelector('nav');if(!header||!nav)return;
 nav.classList.add('nis-nav');
 nav.innerHTML='<a href="/">Home</a><a href="/catalogue/">Shop</a><a href="/#project-request">Custom order</a><a href="/how-to-order/">How it works</a><a href="/#real-work">Real work</a><a href="/bulk-orders-resellers/">Bulk / Reseller</a><a href="/#contact">Contact</a>';
 const menu=document.createElement('button');menu.type='button';menu.className='nav-toggle';menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open site menu');menu.innerHTML='<span>Menu</span><span aria-hidden="true">☰</span>';nav.before(menu);
 const setOpen=open=>{header.classList.toggle('nav-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close site menu':'Open site menu');menu.lastElementChild.textContent=open?'×':'☰'};
 menu.addEventListener('click',()=>setOpen(!header.classList.contains('nav-open')));nav.addEventListener('click',e=>{if(e.target.closest('a'))setOpen(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
 const path=location.pathname;nav.querySelectorAll('a').forEach(a=>{const href=a.getAttribute('href');if((href==='/'&&path==='/')||(href==='/catalogue/'&&path.startsWith('/catalogue'))||(href==='/how-to-order/'&&path.startsWith('/how-to-order')))a.setAttribute('aria-current','page')});
 if(!document.querySelector('.mobile-quick-nav')){const dock=document.createElement('div');dock.className='mobile-quick-nav';dock.setAttribute('role','navigation');dock.setAttribute('aria-label','Quick actions');dock.innerHTML='<a href="/catalogue/"><span aria-hidden="true">⌕</span>Shop</a><a href="/#project-request"><span aria-hidden="true">✎</span>Custom</a><a class="quick-whatsapp" href="https://wa.me/919082405720" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↗</span>WhatsApp</a>';document.body.append(dock)}
}
function setupSocialLinks(){
 const footer=document.querySelector('.footer-contact');
 if(footer&&!footer.querySelector('.social-links-inline')){
  const social=document.createElement('div');social.className='social-links-inline';social.setAttribute('aria-label','Name It Studio social media');
  social.innerHTML='<a href="https://www.instagram.com/nameitstudio.in/" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">◎</span> Instagram</a><a href="https://www.facebook.com/profile.php?id=1320468437817367" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">f</span> Facebook</a><a href="https://share.google/3INrXMV6OXjq8HobA" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">G</span> Google</a>';
  footer.append(social);
 }
}
function setupVisitorLeadForm(){
 const form=document.getElementById('visitor-lead-form');if(!form)return;
 let started=false;
 form.addEventListener('input',()=>{if(started)return;started=true;nis_track_event('lead_form_start',{form_name:'quick_enquiry'});},{once:true});
 form.addEventListener('submit',e=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  const data=new FormData(form);
  const name=(data.get('name')||'').trim(),phone=(data.get('phone')||'').trim(),interest=(data.get('interest')||'').trim(),area=(data.get('area')||'').trim();
  const lines=['Hi Name It Studio, I would like help with a custom enquiry.','','Name: '+name,'WhatsApp / Phone: '+phone,'Interested in: '+interest];
  if(area)lines.push('Area / City: '+area);
  lines.push('','Please help me with 4 personalised design options.');
  nis_track_event('generate_lead',{method:'website_form',lead_type:'quick_enquiry',interest:interest,page_path:location.pathname});
  nis_track_event('lead_form_submit',{form_name:'quick_enquiry',interest:interest});
  window.open('https://wa.me/919082405720?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener,noreferrer');
 });
}
setupNavigation();setupSocialLinks();setupVisitorLeadForm();window.addEventListener('hashchange',linked);linked()})();
