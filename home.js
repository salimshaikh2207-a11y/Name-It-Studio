(()=>{'use strict';
const params=new URLSearchParams(location.search);
if(params.has('design')){location.replace('/customize/'+location.search+location.hash);return;}
const banner=document.querySelector('.social-banner');if(!banner)return;
const slides=[...banner.querySelectorAll('[data-banner-slide]')],buttons=[...banner.querySelectorAll('[data-banner-index]')],pause=banner.querySelector('[data-banner-pause]'),motion=matchMedia('(prefers-reduced-motion: reduce)');
let current=0,paused=motion.matches,timer;
function select(index){current=(index+slides.length)%slides.length;slides.forEach((slide,i)=>slide.hidden=i!==current);buttons.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.bannerIndex)===current)));}
function schedule(){clearInterval(timer);if(pause)pause.textContent=paused?'Play':'Pause';if(!paused&&!document.hidden&&!banner.matches(':hover')&&!banner.contains(document.activeElement))timer=setInterval(()=>select(current+1),5000);}
buttons.forEach(b=>b.addEventListener('click',()=>{select(Number(b.dataset.bannerIndex));schedule();}));
banner.querySelector('[data-banner-prev]')?.addEventListener('click',()=>{select(current-1);schedule();});
banner.querySelector('[data-banner-next]')?.addEventListener('click',()=>{select(current+1);schedule();});
pause?.addEventListener('click',()=>{paused=!paused;schedule();});
banner.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();select(current+(e.key==='ArrowLeft'?-1:1));schedule();}});
['mouseenter','mouseleave','focusin'].forEach(name=>banner.addEventListener(name,schedule));banner.addEventListener('focusout',()=>setTimeout(schedule,0));document.addEventListener('visibilitychange',schedule);motion.addEventListener('change',()=>{paused=motion.matches;schedule();});select(0);schedule();
})();
