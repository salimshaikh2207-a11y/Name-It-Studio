(()=>{'use strict';
const params=new URLSearchParams(location.search);
if(params.has('design')){location.replace('/customize/'+location.search+location.hash);return;}
const banner=document.querySelector('.social-banner');
if(!banner)return;
const slides=[...banner.querySelectorAll('[data-banner-slide]')];
const buttons=[...banner.querySelectorAll('[data-banner-index]')];
function select(index){
 if(!Number.isInteger(index)||index<0||index>=slides.length)return;
 slides.forEach((slide,i)=>{slide.hidden=i!==index;});
 buttons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.bannerIndex)===index)));
}
buttons.forEach(button=>button.addEventListener('click',()=>select(Number(button.dataset.bannerIndex))));
})();
