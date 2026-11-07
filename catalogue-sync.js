(() => {
  'use strict';
  const money = n => '₹' + Number(n).toLocaleString('en-IN');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const material = d => d.category === 'Engraved Mandala' ? 'Charcoal & engraved' : d.category;
  function size(d) {
    const configured = d.sizeOptions?.[0]?.split('x').map(Number);
    const width = Number(d.standardWidth || configured?.[0] || (d.minDimension ? 14 : 12));
    const height = Number(d.standardHeight || configured?.[1] || width);
    return {width, height, configured: !!(d.standardWidth || configured), price: Math.round(width * height * d.pricePerSqIn + Number(d.priceExtra || 0))};
  }
  function card(d, quick = false) {
    const s = size(d), image = d.images[0], url = escape(d.productUrl), name = escape(d.name);
    return '<article class="design-card current-card" id="design-'+escape(d.id)+'" data-current-design="'+escape(d.id)+'"><a class="design-picture current-card-image" href="'+url+'"><img src="'+escape(image.src)+'" width="'+(image.width||1200)+'" height="'+(image.height||1200)+'" alt="'+escape(image.alt||d.name)+'" loading="lazy"></a><div class="design-card-body current-card-info"><p class="card-material">'+escape(material(d))+' · '+escape(d.lighting||'Lighting on enquiry')+'</p><h3><a href="'+url+'">'+name+'</a></h3><p class="card-size">'+(s.configured?'Shown size':'Example size')+' '+s.width+' × '+s.height+' in</p><div class="card-bottom"><strong>'+money(s.price)+'</strong><span class="card-rate">'+money(d.pricePerSqIn)+'/sq in · +'+money(d.shippingCharge??150)+' delivery</span><a class="button primary" href="'+url+'">View & customise</a>'+(quick?'<button class="design-quick" type="button" data-design-open="'+escape(d.id)+'">Quick quote</button>':'')+'</div></div></article>';
  }
  const data = fetch('/catalogue/designs.json?v=20261107', {cache:'no-store'}).then(r => {if(!r.ok)throw Error('Catalogue unavailable');return r.json();});
  window.nisCatalogue = {data, money, escape, material, size, card};
  data.then(items => {
    const byId = new Map(items.map(d => [d.id,d]));
    document.querySelectorAll('[data-current-design]').forEach(el => {
      const d=byId.get(el.dataset.currentDesign);
      if(!d){el.remove();return;}
      el.outerHTML=card(d);
    });
    const home=document.querySelector('[data-home-latest]');
    if(home)home.innerHTML=items.slice(0,6).map(d=>card(d)).join('');
    const root=document.querySelector('[data-product-page]');
    if(root&&!byId.has(root.dataset.productId))location.replace('/catalogue/');
    const d=root&&byId.get(root.dataset.productId),gallery=root?.querySelector('.product-gallery');
    if(d&&gallery&&!gallery.querySelector('[data-product-view]')&&d.images.length>1){
      const image=gallery.querySelector('img'),controls=document.createElement('div');
      controls.className='size-chips';controls.setAttribute('aria-label','Product views');
      d.images.forEach((im,i)=>{
        const button=document.createElement('button');button.type='button';button.className='size-chip';
        button.textContent=/LED off/i.test(im.alt||im.src)?'LED off':/details/i.test(im.alt||im.src)?'Product details':'View '+(i+1);
        button.setAttribute('aria-pressed',String(i===0));
        button.onclick=()=>{image.src=im.src;image.alt=im.alt||d.name;controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));};
        controls.append(button);
      });gallery.append(controls);
    }
  }).catch(()=>{/* Retain server-rendered content when a catalogue request fails. */});
})();
