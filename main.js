const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motion = document.getElementById('motion');
let paused = false, cleanup = () => {};
const heroVideo=document.getElementById('hero-video');
const heroVideos={desktop:'./assets/hero-drone.mp4',mobile:'./assets/hero-drone-mobile.mp4'};
const mobileVideo=matchMedia('(max-width:700px)');
let heroVisible=true;
function syncVideo(){
 if(reduced.matches){heroVideo.pause();return;}
 const source=mobileVideo.matches ? (heroVideos.mobile||heroVideos.desktop) : heroVideos.desktop;
 if(source && heroVideo.getAttribute('src')!==source){heroVideo.src=source;heroVideo.load();}
 if(!source || paused || !heroVisible || document.hidden){heroVideo.pause();return;}
 heroVideo.play().catch(()=>{});
}
heroVideo.addEventListener('playing',()=>document.body.classList.add('video-ready'));
heroVideo.addEventListener('error',()=>document.body.classList.remove('video-ready'));
mobileVideo.addEventListener('change',syncVideo);
const header=document.querySelector('header');
let navReady=false;
function revealNav(){navReady=true;header.classList.remove('nav-pending');syncHeader();}
const hero=document.querySelector('.hero');
const scenes=[...document.querySelectorAll('main > .section')];
function fitScenes(){
 scenes.forEach(scene=>scene.classList.remove('scene-fit'));
 if(innerWidth<1000 || reduced.matches || paused)return;
 scenes.forEach(scene=>scene.classList.add('scene-fit'));
}
addEventListener('resize',fitScenes);
document.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{fitScenes();window.ScrollTrigger?.refresh();}));
fitScenes();
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{
 const target=document.getElementById(link.getAttribute('href').slice(1));
 if(target?.tagName==='DETAILS')target.open=true;
 let parent=target?.parentElement;
 while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}
 fitScenes();
}));
new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;syncVideo();}).observe(hero);
document.addEventListener('visibilitychange',syncVideo);
function syncHeader(){
 const show=hero.getBoundingClientRect().bottom<=header.offsetHeight+80;
 header.classList.toggle('is-scrolled',show);
 header.querySelectorAll('nav').forEach(nav=>{nav.inert=!navReady;nav.setAttribute('aria-hidden',String(!navReady));});
 motion.inert=!show;
}
addEventListener('scroll',syncHeader,{passive:true});
addEventListener('resize',syncHeader);
syncHeader();
new IntersectionObserver(entries=>{
 entries.forEach(entry=>{if(entry.isIntersecting)header.querySelectorAll('nav a').forEach(link=>{
  if(link.getAttribute('href')==='#'+entry.target.id)link.setAttribute('aria-current','location');
  else link.removeAttribute('aria-current');
 });});
},{rootMargin:'-15% 0px -55% 0px'}).observe(document.querySelector('#programas'));
const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)header.querySelectorAll('nav a').forEach(link=>{
 if(link.getAttribute('href')==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
});}),{rootMargin:'-15% 0px -55% 0px'});
['inicio','criadores','marcas','briefing'].forEach(id=>navObserver.observe(document.getElementById(id)));
document.querySelectorAll('.editorial-gallery').forEach(gallery=>{
 const originals=[...gallery.children],count=originals.length;
 const clone=card=>{const node=card.cloneNode(true);node.setAttribute('aria-hidden','true');node.inert=true;node.dataset.clone='true';return node;};
 originals.forEach(card=>gallery.append(clone(card)));
 const before=document.createDocumentFragment();originals.forEach(card=>before.append(clone(card)));gallery.prepend(before);
 const cards=[...gallery.children];
 gallery.setAttribute('aria-roledescription','carrossel');
 let settling,moving=false;
 const center=card=>card.offsetLeft-(gallery.clientWidth-card.offsetWidth)/2;
 const nearest=()=>cards.reduce((best,card)=>Math.abs(center(card)-gallery.scrollLeft)<Math.abs(center(best)-gallery.scrollLeft)?card:best,cards[0]);
 function highlight(){
  const current=nearest(),mid=gallery.scrollLeft+gallery.clientWidth/2;
  cards.forEach(card=>{
   card.classList.toggle('is-current',card===current);
   const distance=(card.offsetLeft+card.offsetWidth/2-mid)/gallery.clientWidth;
   card.style.setProperty('--tilt',Math.max(-8,Math.min(8,-distance*12))+'deg');
  });
 }
 function resetLoop(){
  if(moving)return;
  const index=cards.indexOf(nearest());
  if(index<count || index>=count*2){
   const original=cards[count+index%count];
   const delta=center(original)-center(cards[index]);
   gallery.scrollTo({left:gallery.scrollLeft+delta,behavior:'instant'});highlight();
  }
 }
 function move(direction){
  if(moving)return;
  const index=cards.indexOf(nearest());
  const next=cards[Math.max(0,Math.min(cards.length-1,index+direction))];
  moving=true;
  gallery.style.scrollSnapType='none';
  const complete=()=>{
   moving=false;highlight();resetLoop();
   requestAnimationFrame(()=>{gallery.style.scrollSnapType='';});
  };
  if(window.gsap && !reduced.matches && !paused){
   gsap.to(gallery,{scrollLeft:center(next),duration:.7,ease:'power2.inOut',onComplete:complete});
  }else{gallery.scrollTo({left:center(next),behavior:'instant'});complete();}
 }
 gallery.addEventListener('scroll',()=>{highlight();clearTimeout(settling);settling=setTimeout(resetLoop,180);},{passive:true});
 gallery.addEventListener('keydown',event=>{if(event.target!==gallery)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
 document.querySelectorAll('[data-gallery="'+gallery.id+'"]').forEach(button=>button.addEventListener('click',()=>move(Number(button.dataset.direction))));
 function initialize(){gallery.scrollTo({left:center(originals[0]),behavior:'instant'});highlight();}
 addEventListener('resize',initialize);
 requestAnimationFrame(initialize);
});function setupMotion(){
 cleanup(); cleanup=()=>{};
 const disabled = paused || reduced.matches;
 syncVideo();
 document.body.classList.toggle('motion-off',disabled);
 motion.disabled = reduced.matches;
 motion.setAttribute('aria-pressed',String(disabled));
 motion.textContent = reduced.matches ? 'Movimento reduzido' : paused ? 'Ativar movimento' : 'Pausar movimento';
 fitScenes();
 if(disabled || !window.gsap || !window.ScrollTrigger) return;
 gsap.registerPlugin(ScrollTrigger);
 const context=gsap.context(()=>{
  gsap.from('.hero h1',{y:30,opacity:0,duration:.9,ease:'power3.out'});
  scenes.forEach(scene=>{
   const content=[...scene.children];
   gsap.from(content,{y:24,opacity:0,stagger:.035,duration:.65,ease:'power2.out',
    scrollTrigger:{trigger:scene,start:'top 88%',once:true}});
  });
  gsap.to('.hero-content',{y:-25,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.3}});
 });
 cleanup=()=>context.revert();
}
motion.addEventListener('click',()=>{paused=!paused;setupMotion();});
reduced.addEventListener('change',setupMotion);
setupMotion();
const intro=document.querySelector('.logo-intro');
if(window.gsap && !reduced.matches && scrollY<100 && !location.hash){
 const mark=intro.querySelector('.logo-crop'),brand=document.querySelector('.brand');
 intro.style.display='flex';
 const from=mark.getBoundingClientRect(),to=brand.getBoundingClientRect();
 const introTimeline=gsap.timeline({onComplete:()=>{intro.remove();gsap.set(brand,{clearProps:'opacity'});revealNav();}});
 gsap.set(brand,{opacity:0});
 introTimeline.from(mark,{opacity:0,scale:2,duration:.5,ease:'power2.out'})
  .to(intro,{backgroundColor:'rgba(5,5,5,0)',duration:.7},'+=1.25')
  .to(mark,{x:to.left+to.width/2-(from.left+from.width/2),y:to.top+to.height/2-(from.top+from.height/2),scale:innerWidth<700?.64:1,duration:1.1,ease:'power3.inOut'},'<')
  .set(brand,{opacity:1});
 addEventListener('resize',()=>{introTimeline.progress(1);},{once:true});
 reduced.addEventListener('change',()=>{if(reduced.matches)introTimeline.progress(1);});
}else{intro.remove();revealNav();}
document.getElementById('brief-form').addEventListener('submit',event=>{
 event.preventDefault();
 const form=event.currentTarget;
 if(!form.reportValidity()) return;
 const data=new FormData(form);
 const text=`BRIEFING — CASA CLUTCH\n\nMarca ou nome: ${data.get('marca')}\nInteresse: ${data.get('interesse')}\n\nIdeia:\n${data.get('ideia')}\n\nEste briefing foi preparado localmente. Não foi enviado à Casa Clutch. O contato comercial e as condições de parceria ainda estão a confirmar.\n`;
 const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='briefing-casa-clutch.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 document.getElementById('form-status').textContent='Briefing preparado para download. Nenhuma informação foi enviada à Casa Clutch.';
});
