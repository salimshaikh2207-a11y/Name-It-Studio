'use strict';
const $ = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MATERIALS = {
  debossed:{label:'Debossed acrylic',hint:'Laser-cut main sheet over a contrasting backing sheet. Recessed lettering, with no LED.',group:'debossed'},
  embossed:{label:'Embossed acrylic',hint:'Raised acrylic lettering with a choice of standard finishes. LED is optional.',group:'embossed'},
  glass:{label:'Embossed / frosted glass',hint:'Black or white glass with raised acrylic or frosted lettering. LED is optional.',group:'embossed'},
  cast:{label:'Engraved clear cast acrylic',hint:'A decorative engraved border with embossed lettering on clear cast acrylic.',group:'engraved'},
  charcoal:{label:'Charcoal with engraved acrylic border',hint:'Charcoal centre, raised lettering, and an engraved acrylic border. Add LED for a glowing silhouette.',group:'engraved'}
};
const FONTS={English:['Montserrat','Poppins','DM Sans','Lato','Nunito Sans'],Hindi:['Noto Sans Devanagari','Mukta','Hind','Anek Devanagari','Khand'],Marathi:['Noto Sans Devanagari','Mukta','Hind','Anek Devanagari','Khand']};
const FONT_LABELS={English:['Modern','Premium','Minimal','Classic','Friendly'],Hindi:['Modern','Balanced','Minimal','Contemporary','Narrow'],Marathi:['Modern','Balanced','Minimal','Contemporary','Narrow']};
const DESIGNS={classic:{label:'Classic Border',shape:'Rectangle'},botanical:{label:'Botanical Corner',shape:'Rectangle'},panel:{label:'Decorative Panel',shape:'Rectangle'},luxe:{label:'Luxe LED',shape:'Rectangle'},mandala:{label:'Mandala Halo',shape:'Border contour'}};
const COLOURS={Black:'#202420',White:'#f0eee5','Matte Black':'#333631',Charcoal:'#4a443c',Clear:'#e5e7df',Gold:'#cdb17a',Silver:'#c7ccce','Rose Gold':'#cb9c86'};
const DEFAULT={material:'embossed',shape:'Rectangle',design:'botanical',designCode:'',size:'16x8',customWidth:'',customHeight:'',name:'The Shaikhs',number:'1603',language:'English',font:'Montserrat',plateColor:'Matte Black',letterColor:'Gold',letterType:'raised',diamond:'none',led:'warm',scene:'day'};
const MEANINGFUL_DESIGNS={
 'GAN-01':{material:'embossed',design:'panel'},'GAN-02':{material:'embossed',design:'botanical'},'GAN-03':{material:'cast',design:'classic'},
 'SHV-01':{material:'cast',design:'classic'},'SHV-02':{material:'embossed',design:'luxe'},'SHV-03':{material:'charcoal',design:'mandala'},
 'KRS-01':{material:'embossed',design:'botanical'},'KRS-02':{material:'glass',design:'panel'},'KRS-03':{material:'embossed',design:'luxe'},
 'RAM-01':{material:'charcoal',design:'mandala'},'RAM-02':{material:'embossed',design:'panel'},'RAM-03':{material:'cast',design:'classic'},
 'OM-01':{material:'glass',design:'panel'},'OM-02':{material:'cast',design:'classic'},'OM-03':{material:'embossed',design:'luxe'},
 'AMB-01':{material:'charcoal',design:'panel'},'AMB-02':{material:'charcoal',design:'classic'},'AMB-03':{material:'charcoal',design:'mandala'}
};
let state={...DEFAULT},step='style';
const isEngraved=()=>['cast','charcoal'].includes(state.material);
const isRound=()=>state.shape==='Round';
const dimensions=()=>state.size==='custom'?[Number(state.customWidth)||16,Number(state.customHeight)||8]:state.size.split('x').map(Number);
const sizeLabel=()=>state.size==='custom'?`${state.customWidth||'—'} × ${state.customHeight||'—'} in (custom enquiry)`:state.size.replace('x',' × ')+' in';
const ledLabel=()=>({none:'No LED',warm:'Warm white LED',cool:'Cool white LED',rgb:'RGB LED'})[state.led];
const plateColours=()=>state.material==='glass'?['Black','White']:state.material==='cast'?['Clear']:state.material==='charcoal'?['Charcoal']:['Black','White','Matte Black'];
const designKeys=()=>isEngraved()?Object.keys(DESIGNS):['classic','botanical','panel','luxe'];
function normalise(){
  if(!MATERIALS[state.material])state.material=DEFAULT.material;
  if(!FONTS[state.language])state.language='English';
  if(!FONTS[state.language].includes(state.font))state.font=FONTS[state.language][0];
  if(!designKeys().includes(state.design))state.design='classic';
  if(isEngraved())state.shape=DESIGNS[state.design].shape;
  else if(!['Rectangle','Round','Capsule'].includes(state.shape))state.shape='Rectangle';
  if(isRound()){state.size='custom';if(!state.customWidth)state.customWidth='12';if(!state.customHeight)state.customHeight='12';}
  const sizes=isEngraved()?['12x6','16x8','24x8','custom']:['8x6','12x6','16x8','24x8','custom'];
  if(!sizes.includes(state.size))state.size='16x8';
  if(!plateColours().includes(state.plateColor))state.plateColor=plateColours()[0];
  if(!['Gold','Silver','Rose Gold'].includes(state.letterColor))state.letterColor='Gold';
  if(state.material!=='glass'||!['raised','frosted'].includes(state.letterType))state.letterType='raised';
  if(state.material!=='glass'||state.letterType!=='frosted'||!['none','gold','silver'].includes(state.diamond))state.diamond='none';
  if(state.material==='debossed'||!['none','warm','cool','rgb'].includes(state.led))state.led='none';
  if(!['day','evening'].includes(state.scene))state.scene='day';
  state.name=String(state.name||'').slice(0,40);state.number=String(state.number||'').slice(0,16);
  state.customWidth=String(state.customWidth||'').slice(0,6);state.customHeight=String(state.customHeight||'').slice(0,6);
}
function fillOptions(el,items,value){el.innerHTML=items.map(([v,l])=>`<option value="${esc(v)}">${esc(l)}</option>`).join('');el.value=value;}
function renderControls(){
  normalise();$('material').value=state.material;$('material-hint').textContent=MATERIALS[state.material].hint;
  fillOptions($('shape'),(isEngraved()?[state.shape]:['Rectangle','Round','Capsule']).map(s=>[s,s]),state.shape);$('shape').disabled=isEngraved();
  fillOptions($('design'),designKeys().map(k=>[k,DESIGNS[k].label]),state.design);
  $('shape-hint').textContent=isEngraved()?'The outline follows this border design. Change the design to change the silhouette.':'Each design includes its own fixed border, adapted to the selected shape.';
  let sizes=isRound()?['custom']:isEngraved()?['12x6','16x8','24x8','custom']:['8x6','12x6','16x8','24x8','custom'];
  fillOptions($('size'),sizes.map(s=>[s,s==='custom'?'Custom size — enquire':s.replace('x',' × ')+' in']),state.size);
  $('custom-size-fields').hidden=state.size!=='custom';$('custom-width').value=state.customWidth;$('custom-height').value=state.customHeight;
  $('size-hint').textContent=isRound()?'Round designs need equal width and height. Custom dimensions are confirmed with your quote.':state.size==='custom'?'Custom dimensions are a request, subject to artwork and production review.':isEngraved()?'Available in 12 × 6, 16 × 8 and 24 × 8 inches. Larger custom dimensions by enquiry.':'Custom sizes and special colours can be requested in your design brief.';
  $('name').value=state.name;$('number').value=state.number;$('language').value=state.language;
  fillOptions($('font'),FONTS[state.language].map((f,i)=>[f,f+' — '+FONT_LABELS[state.language][i]]),state.font);
  $('letter-type-wrap').hidden=state.material!=='glass';$('letter-type').value=state.letterType;
  $('letter-colour-label').textContent=state.material==='debossed'?'Letter / backing colour':'Letter colour';
  $('letter-colours').hidden=state.letterType==='frosted';$('diamond-wrap').hidden=!(state.material==='glass'&&state.letterType==='frosted');$('diamond').value=state.diamond;
  renderSwatches('plate-swatches',plateColours(),'plateColor');renderSwatches('letter-swatches',['Gold','Silver','Rose Gold'],'letterColor');
  $('led').value=state.led;$('led').disabled=state.material==='debossed';
  $('led-hint').textContent=state.material==='debossed'?'Debossed acrylic is a two-layer, unlit design. LED is not available.':state.led==='rgb'?'Preview shows one illustrative RGB colour. Final lighting hardware is confirmed with your quote.':'Switch the preview to Evening to see the lighting effect.';
  renderPreview();
  const selectedFont=state.font;document.fonts.load(`600 50px "${selectedFont}"`).then(()=>{if(state.font===selectedFont)renderPreview();});
}
function renderSwatches(id,colours,key){
  $(id).innerHTML=colours.map(c=>`<button type="button" data-key="${key}" data-colour="${c}" aria-pressed="${state[key]===c}"><i style="background:${COLOURS[c]}" aria-hidden="true"></i>${c}</button>`).join('');
}
function shapeMarkup(x,y,w,h,inset=0){
  x+=inset;y+=inset;w-=2*inset;h-=2*inset;
  if(state.design==='mandala'&&isEngraved()){
    const points=[];for(let i=0;i<160;i++){const a=2*Math.PI*i/160,r=1+.09*Math.cos(8*a);points.push(`${x+w/2+Math.cos(a)*w/2*r},${y+h/2+Math.sin(a)*h/2*r}`);}return `<path d="M${points.join('L')}Z"`;
  }
  if(state.shape==='Round')return `<ellipse cx="${x+w/2}" cy="${y+h/2}" rx="${w/2}" ry="${h/2}"`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${state.shape==='Capsule'?h/2:state.design==='luxe'?18:5}"`;
}
function makeSVG(prefix='live'){
  const [inchW,inchH]=dimensions();const ratio=Math.max(.35,Math.min(4,inchW/inchH));
  const w=ratio>=1?560:560*ratio,h=ratio>=1?560/ratio:560,x=(680-w)/2,y=(600-h)/2;
  const light=state.led==='cool'?'#d0edff':state.led==='rgb'?'#cc97f5':'#ffe5a5';
  const col=state.letterType==='frosted'?'#f7f6e9':COLOURS[state.letterColor];const plate=COLOURS[state.plateColor];
  const shape=(i=0)=>shapeMarkup(x,y,w,h,i);
  const text=state.name.trim()||'Your name';const measure=document.createElement('canvas').getContext('2d');measure.font=`600 50px "${state.font}"`;
  const textWidth=measure.measureText(text).width||300;
  const reserved=state.design==='panel'?w*.64:state.design==='mandala'?w*.6:w*.76;
  const fs=Math.max(8,Math.min(h*.17,53,reserved/textWidth*50));
  const nameY=y+h*.56,numY=y+h*.32;
  const borderColour=state.material==='cast'||state.material==='charcoal'?'#f0e7ce':col;
  let decoration='';
  if(state.design==='botanical'){
    for(const side of [-1,1]){const bx=340+side*w*.39,by=y+h*.53;
      decoration+=`<g transform="translate(${bx} ${by}) scale(${side*.8} ${Math.min(1,h/250)})" fill="none" stroke="${borderColour}" stroke-width="1.6"><path d="M0 65 Q-25 10 10-65"/><path d="M-4 28 Q-44 13-28-8 Q-3-4-4 28 M-7 0 Q24-7 24-28 Q-3-28-7 0 M0-31 Q-21-45-10-63 Q9-59 0-31"/></g>`;
    }
  }
  if(state.design==='panel')decoration=`<path d="M${x+w*.2} ${y+h*.22}V${y+h*.78}" stroke="${col}" stroke-width="1"/><g transform="translate(${x+w*.12} ${y+h*.5})" fill="none" stroke="${col}" stroke-width="2"><path d="M-14 6 0-9 14 6 M-10 2V18H10V2 M-2 18V8H3V18"/></g>`;
  const diamond=state.diamond!=='none'?`<g fill="url(#${prefix}-diamond)" stroke="${state.diamond==='gold'?'#c6a666':'#bcc7cb'}" stroke-width="1.5">${shape(3)}/></g>`:'';
  const illuminated=state.led!=='none'?`<g fill="none" stroke="${light}" stroke-width="9" filter="url(#${prefix}-glow)">${shape(0)}/></g>`:'';
  const centerPanel=state.material==='charcoal'&&state.design==='mandala'?`<ellipse cx="340" cy="300" rx="${w*.37}" ry="${h*.36}" fill="url(#${prefix}-charcoal)" stroke="${col}" stroke-width="2"/>`:'';
  const backing=state.material==='charcoal'&&state.design==='mandala'?'#9b906d30':state.material==='cast'?'#d9e2d136':state.material==='charcoal'?`url(#${prefix}-charcoal)`:`url(#${prefix}-plate)`;
  const tx=state.design==='panel'?340+w*.08:340;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 600" role="img" aria-label="${esc(state.name||'Your name')} — ${esc(MATERIALS[state.material].label)}"><title>${esc(state.name||'Your name')} — concept preview</title><desc>Illustrative configuration, not a manufacturing or CNC file.</desc><defs><linearGradient id="${prefix}-plate" x2="1" y2="1"><stop stop-color="${plate}"/><stop offset=".45" stop-color="${plate}"/><stop offset=".47" stop-color="${state.plateColor==='White'?'#fff':state.plateColor==='Black'?'#373b36':plate}"/><stop offset="1" stop-color="${plate}"/></linearGradient><linearGradient id="${prefix}-charcoal" x2="1" y2="0"><stop stop-color="#403b32"/><stop offset=".5" stop-color="#61584b"/><stop offset="1" stop-color="#37352e"/></linearGradient><pattern id="${prefix}-diamond" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="${state.diamond==='gold'?'#b99b61':'#a5afb4'}"/><path d="M16 0 32 16 16 32 0 16Z" fill="${state.diamond==='gold'?'#dec78e':'#d5dcdf'}" stroke="#fff8" stroke-width=".6"/></pattern><filter id="${prefix}-shadow" x="-40%" y="-60%" width="180%" height="240%"><feDropShadow dx="3" dy="13" stdDeviation="11" flood-color="#211e14" flood-opacity=".35"/></filter><filter id="${prefix}-glow" x="-60%" y="-80%" width="220%" height="260%"><feGaussianBlur stdDeviation="13"/></filter></defs>${illuminated}<g filter="url(#${prefix}-shadow)">${shape()} fill="${backing}" stroke="${state.material==='cast'?'#f6f7ebaa':'#171d1944'}" stroke-width="2"/>${diamond}</g>${centerPanel}<g fill="none" stroke="${borderColour}" stroke-opacity=".78" stroke-width="1.4">${shape(Math.min(w,h)*.055)}/>${state.design==='classic'||isEngraved()?shape(Math.min(w,h)*.085)+'/>':''}</g>${decoration}<g text-anchor="middle" fill="${col}" font-family="${esc(state.font)}, sans-serif" font-weight="600" ${state.material!=='debossed'&&state.letterType!=='frosted'?'style="filter:drop-shadow(1px 2px 1px #0008)"':''}><text x="${tx}" y="${numY}" font-size="${Math.min(h*.09,24)}" letter-spacing="3">${esc(state.number)}</text><text x="${tx}" y="${nameY}" dominant-baseline="middle" font-size="${fs}">${esc(text)}</text></g><path d="M${tx-w*.1} ${y+h*.73}H${tx+w*.1}" stroke="${col}" stroke-width="1"/>${state.led!=='none'?`<g fill="none" stroke="${light}" stroke-width="1.8" opacity=".85">${shape(1)}/></g>`:''}</svg>`;
}
function renderPreview(){
  $('plate-preview').innerHTML=makeSVG();$('plate-preview').setAttribute('aria-label',`${state.name||'Your name'}, ${MATERIALS[state.material].label}, ${state.shape}, ${sizeLabel()}, ${ledLabel()}`);
  $('preview-dimensions').textContent=sizeLabel();$('preview-description').textContent=`${state.designCode?state.designCode+' · ':''}${DESIGNS[state.design].label} · ${state.material==='charcoal'?'Charcoal':state.material==='cast'?'Clear cast acrylic':state.plateColor}`;
  $('summary-short').textContent=`${MATERIALS[state.material].label} · ${sizeLabel()}`;
  $('name-count').textContent=Array.from(state.name).length+' / 40';
  $('preview-scene').classList.toggle('evening',state.scene==='evening');
  document.querySelectorAll('[data-scene]').forEach(b=>{const chosen=b.dataset.scene===state.scene;b.classList.toggle('active',chosen);b.setAttribute('aria-pressed',chosen);});
}
function setStep(next,focus=false){step=next;document.querySelectorAll('[data-step]').forEach(b=>{const on=b.dataset.step===step;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;});['style','personal','finish'].forEach(s=>$('panel-'+s).hidden=s!==step);if(focus)$('tab-'+step).focus();}
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3300);}
function chooseMaterial(value){state.material=value;state.design=value==='charcoal'?'mandala':value==='cast'?'classic':'botanical';state.size='16x8';state.shape='Rectangle';state.led=value==='debossed'?'none':'warm';renderControls();setStep('style');$('studio').scrollIntoView({behavior:'smooth'});}
function specs(){return [['Collection',MATERIALS[state.material].label],['Design',DESIGNS[state.design].label],...(state.designCode?[['Design code',state.designCode]]:[]),['Shape',state.shape],['Size',sizeLabel()],['Name',state.name],['House / flat no.',state.number||'None'],['Language / font',state.language+' · '+state.font],['Plate',state.plateColor],['Lettering',state.material==='debossed'?'Recessed · '+state.letterColor+' backing':state.letterType==='frosted'?'Frosted':'Raised acrylic · '+state.letterColor],['Diamond backdrop',state.diamond==='none'?'None':state.diamond==='gold'?'Gold diamond':'Silver diamond'],['Lighting',ledLabel()]];}
function brief(){return 'Hello Name It Studio, I would like a quote for this nameplate at your current material and LED square-inch rate.\n\n'+specs().map(([k,v])=>k+': '+v).join('\n')+($('enquiry-notes').value.trim()?'\n\nAdditional details: '+$('enquiry-notes').value.trim():'')+'\n\nPlease confirm the final dimensions, minimum 1-inch finished letter height, artwork, materials, lighting and price before production. I would like four artwork variants to choose from. Delivery within 3–5 working days from order confirmation. Payment: 30% after design finalisation, remaining 70% on delivery.';}
function updateEnquiry(){$('whatsapp-enquiry').href='https://wa.me/919082405720?text='+encodeURIComponent(brief());}
function validate(){
  if(state.size==='custom'){
    const w=Number(state.customWidth),h=Number(state.customHeight);
    if(!Number.isFinite(w)||!Number.isFinite(h)||w<1||h<1||w>96||h>96){setStep('style');toast('Enter a width and height between 1 and 96 inches for your enquiry.');$('custom-width').focus();return false;}
    if(isRound()&&w!==h){setStep('style');toast('A round nameplate needs equal width and height.');$('custom-height').focus();return false;}
  }
  if(!state.name.trim()){setStep('personal');toast('Add a name or main text to your design.');$('name').focus();return false;}
  return true;
}
function openReview(){if(!validate())return;$('review-mini').innerHTML=makeSVG('review');$('review-specs').innerHTML=specs().map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');updateEnquiry();$('review-dialog').showModal();}
function download(contents,type,name){const u=URL.createObjectURL(new Blob([contents],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),2000);}
document.querySelectorAll('[data-start]').forEach(b=>b.addEventListener('click',()=>chooseMaterial(b.dataset.start)));
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b);});let count=0;document.querySelectorAll('.collection-card').forEach(card=>{card.hidden=b.dataset.filter!=='all'&&card.dataset.category!==b.dataset.filter;if(!card.hidden)count++;});$('filter-status').textContent=`Showing ${count} collection${count===1?'':'s'}`;}));
document.querySelectorAll('[data-step]').forEach(b=>{b.addEventListener('click',()=>setStep(b.dataset.step));b.addEventListener('keydown',e=>{const list=['style','personal','finish'],i=list.indexOf(step);let dest;if(e.key==='ArrowRight')dest=list[(i+1)%3];if(e.key==='ArrowLeft')dest=list[(i+2)%3];if(e.key==='Home')dest=list[0];if(e.key==='End')dest=list[2];if(dest){e.preventDefault();setStep(dest,true);}});});
document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>setStep(b.dataset.next,true)));
const fields={material:'material',shape:'shape',design:'design',size:'size',language:'language',font:'font','letter-type':'letterType',diamond:'diamond',led:'led'};
for(const [id,key] of Object.entries(fields))$(id).addEventListener('change',e=>{state[key]=e.target.value;if(id==='material'){state.design=state.material==='charcoal'?'mandala':'classic';state.shape='Rectangle';if(state.size==='custom'&&!state.customWidth)state.size='16x8';}renderControls();});
for(const [id,key] of Object.entries({name:'name',number:'number','custom-width':'customWidth','custom-height':'customHeight'}))$(id).addEventListener('input',e=>{state[key]=e.target.value;renderPreview();});
for(const id of ['plate-swatches','letter-swatches'])$(id).addEventListener('click',e=>{const b=e.target.closest('button[data-colour]');if(!b)return;state[b.dataset.key]=b.dataset.colour;renderControls();const next=$(id).querySelector(`[data-colour="${b.dataset.colour}"]`);if(next)next.focus();});
document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>{state.scene=b.dataset.scene;renderPreview();}));
$('design-form').addEventListener('submit',e=>{e.preventDefault();openReview();});
// Validate every step ourselves so hidden controls can never block focus or submission.
$('design-form').noValidate=true;
$('save-design').addEventListener('click',()=>{try{localStorage.setItem('taf-showroom-design-v1',JSON.stringify(state));$('restore-design').hidden=false;toast('Design saved on this browser.');}catch{toast('Your browser could not save this design. Download a brief instead.');}});
$('restore-design').addEventListener('click',()=>{try{const s=JSON.parse(localStorage.getItem('taf-showroom-design-v1'));if(!s||typeof s!=='object')throw Error();state={...DEFAULT,...Object.fromEntries(Object.keys(DEFAULT).filter(k=>typeof s[k]==='string').map(k=>[k,s[k]]))};renderControls();setStep('style');toast('Your saved design is restored.');}catch{toast('No valid saved design was found.');}});
try{$('restore-design').hidden=!localStorage.getItem('taf-showroom-design-v1');}catch{}
$('download-preview').addEventListener('click',async()=>{let svg=makeSVG('export');try{const css=await fetch('/assets/fonts/fonts.css').then(r=>r.text());const faces=css.split('@font-face').slice(1).filter(block=>block.includes("'"+state.font+"'")||block.includes('"'+state.font+'"'));let fontCSS='';for(let block of faces){const urls=[...block.matchAll(/url\(([^)]+)\)/g)];for(const match of urls){const url=match[1].replace(/["']/g,'');const blob=await fetch(url).then(r=>r.blob());const data=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(blob);});block=block.replace(match[1],String(data));}fontCSS+='@font-face'+block;}svg=svg.replace('<defs>','<defs><style>'+fontCSS+'</style>');}catch{toast('Preview downloaded; fonts may differ on another device.');}download(svg,'image/svg+xml','Name-It-Studio-concept-preview.svg');});
for(const id of ['close-review','edit-design'])$(id).addEventListener('click',()=>$('review-dialog').close());
$('review-dialog').addEventListener('click',e=>{if(e.target===$('review-dialog')){const r=$('review-dialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('review-dialog').close();}});
$('enquiry-notes').addEventListener('input',updateEnquiry);
$('copy-brief').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(brief());toast('Design brief copied.');}catch{toast('Copy is unavailable here. Download the brief instead.');}});
$('download-brief').addEventListener('click',()=>download(brief(),'text/plain;charset=utf-8','Name-It-Studio-design-brief.txt'));
const pins=[['329185054037467929','The welcoming entrance','Sculptural lettering & warm light'],['1130685050262022244','A warm personal touch','Layered acrylic & botanical detail'],['1146729123897919894','The statement circle','Clear surfaces & gold accents'],['4591701421247447936','The luminous studio','An illuminated circular composition'],['1070871617674514827','Everyday, considered','Dark plate & a clear house number']];
$('reference-grid').innerHTML="<a href=\"/catalogue/#design-D04\"><img src=\"/assets/designs/design-04.webp\" alt=\"Aura Studio\" loading=\"lazy\">Aura Studio \u2197<span>Business signs \u00b7 Personalised to order</span></a><a href=\"/catalogue/#design-D09\"><img src=\"/assets/designs/design-09.webp\" alt=\"Noor Frame\" loading=\"lazy\">Noor Frame \u2197<span>Devotional d\u00e9cor \u00b7 Personalised to order</span></a><a href=\"/catalogue/#design-D22\"><img src=\"/assets/designs/design-25.webp\" alt=\"Ganesh Mandala\" loading=\"lazy\">Ganesh Mandala \u2197<span>Nameplates \u00b7 Personalised to order</span></a><a href=\"/catalogue/#design-D28\"><img src=\"/assets/designs/design-32.webp\" alt=\"Celebration Halo\" loading=\"lazy\">Celebration Halo \u2197<span>Gifts \u00b7 Personalised to order</span></a><a href=\"/catalogue/#design-D31\"><img src=\"/assets/designs/design-36.webp\" alt=\"Peacock Crest\" loading=\"lazy\">Peacock Crest \u2197<span>Nameplates \u00b7 Personalised to order</span></a>";
document.querySelector('a[href="#inspiration"]').addEventListener('click',()=>{$('inspiration').open=true;});
const requestedMeaningfulDesign=new URLSearchParams(location.search).get('design')?.toUpperCase();
if(requestedMeaningfulDesign&&MEANINGFUL_DESIGNS[requestedMeaningfulDesign]){state={...state,...MEANINGFUL_DESIGNS[requestedMeaningfulDesign],designCode:requestedMeaningfulDesign};}
renderControls();document.fonts.ready.then(renderPreview);

$('show-preview').addEventListener('click',()=>$('preview-scene').scrollIntoView({behavior:'smooth',block:'center'}));
$('return-controls').addEventListener('click',()=>document.querySelector('.control-panel').scrollIntoView({behavior:'smooth',block:'start'}));

// Homepage bestseller strip: use only configured catalogue prices and link each card to its product customizer.
const bestsellerSpecs={
  '01':{type:'Round acrylic · raised lettering',badge:'Bestseller'},
  '02':{type:'Clear acrylic · botanical detail'},
  '03':{type:'Engraved clear acrylic · charcoal centre',badge:'Premium'},
  '04':{type:'Layered acrylic · illuminated fort theme',badge:'New'},
  '05':{type:'Debossed acrylic · white plate'},
  '06':{type:'Debossed acrylic · charcoal plate'}
};
const bestsellerIds=['01','02','03','04','05','06'];
const bestsellerMoney=n=>typeof n==='number'?'Starting from ₹'+n.toLocaleString('en-IN'):'Get Price';
function renderBestsellers(products){
  const style=document.querySelector('.shop-by-style'),next=document.querySelector('.shop-categories');
  if(!style||!next)return;
  const items=bestsellerIds.map(id=>products.find(p=>p.id===id)).filter(Boolean);
  const section=document.createElement('section');section.className='bestsellers wrap';section.id='most-loved-designs';section.setAttribute('aria-labelledby','most-loved-title');
  section.innerHTML='<div class="bestseller-heading"><div><p class="eyebrow">MOST LOVED DESIGNS</p><h2 id="most-loved-title">Made once. Loved every day.</h2></div><a class="quiet-link" href="/catalogue/#priced-products">See all products ↗</a></div><div class="bestseller-grid">'+items.map(p=>{const s=bestsellerSpecs[p.id]||{},led=p.lighting&&/no led/i.test(p.lighting)?'LED: No':'LED: '+(p.lighting||'Confirm with quote');return '<article class="bestseller-card"><a class="bestseller-image" href="/catalogue/#product-'+p.id+'" aria-label="Customize '+p.name+'"><img src="'+p.image+'" alt="'+p.name+' — '+s.type+'" loading="lazy"><span class="bestseller-badges">'+(s.badge?'<b>'+s.badge+'</b>':'')+'</span></a><div class="bestseller-body"><p class="bestseller-kicker">'+p.category+'</p><h3>'+p.name+'</h3><p class="bestseller-type">'+s.type+'</p><p class="bestseller-led">'+led+'</p><p class="bestseller-price">'+bestsellerMoney(p.price)+'</p><a class="button primary" href="/catalogue/#product-'+p.id+'">Customize <span aria-hidden="true">→</span></a></div></article>';}).join('')+'</div>';
  style.insertAdjacentElement('afterend',section);
  const yours=document.createElement('section');yours.className='make-it-yours wrap';yours.id='make-it-yours';yours.setAttribute('aria-labelledby','make-it-yours-title');
  yours.innerHTML='<div class="make-yours-heading"><p class="eyebrow">MAKE IT YOURS</p><h2 id="make-it-yours-title">A nameplate that starts with you.</h2><p>Choose a look, make it personal and see the right options for the material you love. We’ll guide you from first idea to final artwork.</p></div><div class="make-yours-layout"><figure class="make-yours-preview"><img src="/assets/catalogue/03.png" alt="Mandala Prabha acrylic nameplate with engraved border and warm light" loading="lazy"><figcaption>Preview a style, then make it your own.</figcaption></figure><div class="make-yours-steps"><ol><li><b>1</b><span><strong>Choose Material</strong><small>Acrylic, glass or charcoal</small></span></li><li><b>2</b><span><strong>Pick Design</strong><small>Start with a look you love</small></span></li><li><b>3</b><span><strong>Select Size</strong><small>Choose a standard or custom size</small></span></li><li><b>4</b><span><strong>Add Name / House Number</strong><small>Make the text yours</small></span></li><li><b>5</b><span><strong>Choose Language &amp; Font</strong><small>English, Hindi or Marathi</small></span></li><li><b>6</b><span><strong>Choose Colours / Letter Type</strong><small>Pick the finish that suits your space</small></span></li><li><b>7</b><span><strong>Add LED / Diamond where applicable</strong><small>Only the options that suit your material appear</small></span></li></ol><div class="make-yours-actions"><a class="button primary" href="#studio">Start Customizing <span aria-hidden="true">→</span></a><a class="make-yours-whatsapp" href="https://wa.me/919082405720?text=Hi%20Name%20It%20Studio%2C%20I%20need%20help%20creating%20a%20custom%20nameplate." target="_blank" rel="noopener noreferrer">Need something different? Talk to us on WhatsApp ↗</a></div></div></div>';
  section.insertAdjacentElement('afterend',yours);
  const meaning=document.createElement('section');meaning.className='designs-meaning wrap';meaning.id='designs-with-meaning';meaning.setAttribute('aria-labelledby','meaning-title');
  const collections=[
   {slug:'ganesha',name:'Ganesha',copy:'Auspicious beginnings, beautifully made.',image:'/assets/designs/devotional-d37.webp',code:'GAN-01'},
   {slug:'mahadev',name:'Mahadev',copy:'Strength, stillness and devotion.',image:'/assets/designs/devotional-d39.webp',code:'SHV-01'},
   {slug:'krishna-radha-krishna',name:'Krishna & Radha Krishna',copy:'Love, grace and joyful colour.',image:'/assets/designs/devotional-d42.webp',code:'KRS-01'},
   {slug:'shree-ram-hanuman',name:'Shree Ram & Hanuman',copy:'Courage, faith and a welcoming home.',image:'/assets/designs/devotional-d45.webp',code:'RAM-01'},
   {slug:'om-spiritual',name:'Om & Spiritual',copy:'A calmer corner for everyday rituals.',image:'/assets/designs/devotional-d48.webp',code:'OM-01'},
   {slug:'ambedkar',name:'Dr. B. R. Ambedkar Collection',copy:'A distinct cultural collection honouring equality and progress.',image:'/assets/designs/ambedkar-d57.jpg',code:'AMB-01'}
  ];
  meaning.innerHTML='<div class="meaning-heading"><div><p class="eyebrow">DESIGNS WITH MEANING</p><h2 id="meaning-title">A nameplate that reflects what you believe in.</h2></div><p>Explore thoughtful Name It Studio designs inspired by faith, heritage and the ideas that shape your home.</p></div><div class="meaning-grid">'+collections.map(c=>'<a class="meaning-card" href="/collections/'+c.slug+'/" aria-label="Explore '+c.name+' collection"><img src="'+c.image+'" alt="'+c.name+' collection design" loading="lazy"><div><p class="meaning-code">'+c.code+' COLLECTION</p><h3>'+c.name+'</h3><p>'+c.copy+'</p><span>Explore collection <b aria-hidden="true">↗</b></span></div></a>').join('')+'</div><div class="meaning-footer"><a class="button primary" href="/catalogue/#designs">Explore All Designs ↗</a><a class="meaning-whatsapp" href="https://wa.me/919082405720?text=Hi%20Name%20It%20Studio%2C%20I%20would%20like%20to%20discuss%20a%20meaningful%20custom%20nameplate%20idea." target="_blank" rel="noopener noreferrer">Discuss Your Idea on WhatsApp ↗</a></div>';
  yours.insertAdjacentElement('afterend',meaning);
}
fetch('/catalogue/products.json?v=20261008-prices',{cache:'no-store'}).then(r=>r.ok?r.json():[]).then(renderBestsellers).catch(()=>renderBestsellers([]));
