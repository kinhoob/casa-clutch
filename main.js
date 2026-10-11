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
const hero=document.querySelector('.hero');
const scenes=[...document.querySelectorAll('main > .section')];
function fitScenes(){
 scenes.forEach(scene=>scene.classList.remove('scene-fit'));
 if(innerWidth<1000 || reduced.matches || paused)return;
 scenes.forEach(scene=>{if(scene.scrollHeight<=innerHeight-94)scene.classList.add('scene-fit');});
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
 const nav=header.querySelector('nav');
 nav.inert=!show;
 nav.setAttribute('aria-hidden',String(!show));
 motion.inert=!show;
}
addEventListener('scroll',syncHeader,{passive:true});
addEventListener('resize',syncHeader);
syncHeader();
function setupMotion(){
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
 const lenis = window.Lenis ? new Lenis({duration:1.05,anchors:false}) : null;
 const tick=t=>lenis?.raf(t*1000);
 if(lenis){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(tick);}
 const context=gsap.context(()=>{
  gsap.from('.hero h1',{y:30,opacity:0,duration:.9,ease:'power3.out'});
  scenes.forEach(scene=>{
   const content=[...scene.children];
   gsap.from(content,{y:65,opacity:0,stagger:.06,duration:.85,ease:'power3.out',
    scrollTrigger:{trigger:scene,start:'top 78%',toggleActions:'play none none reverse'}});
  });
  gsap.to('.hero-content',{y:-70,opacity:0,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom 35%',scrub:true}});
 });
 cleanup=()=>{context.revert();gsap.ticker.remove(tick);lenis?.destroy();};
}
motion.addEventListener('click',()=>{paused=!paused;setupMotion();});
reduced.addEventListener('change',setupMotion);
setupMotion();
const intro=document.querySelector('.logo-intro');
if(window.gsap && !reduced.matches && scrollY<100 && !location.hash){
 const mark=intro.querySelector('.logo-crop'),brand=document.querySelector('.brand');
 intro.style.display='flex';
 const from=mark.getBoundingClientRect(),to=brand.getBoundingClientRect();
 const introTimeline=gsap.timeline({onComplete:()=>{intro.remove();gsap.set(brand,{clearProps:'opacity'});}});
 gsap.set(brand,{opacity:0});
 introTimeline.from(mark,{opacity:0,scale:2,duration:.5,ease:'power2.out'})
  .to(intro,{backgroundColor:'rgba(5,5,5,0)',duration:.5},'+=.15')
  .to(mark,{x:to.left+to.width/2-(from.left+from.width/2),y:to.top+to.height/2-(from.top+from.height/2),scale:innerWidth<700?.78:1,duration:.9,ease:'power3.inOut'},'<')
  .set(brand,{opacity:1});
 addEventListener('resize',()=>{introTimeline.progress(1);},{once:true});
 reduced.addEventListener('change',()=>{if(reduced.matches)introTimeline.progress(1);});
}else{intro.remove();}
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
