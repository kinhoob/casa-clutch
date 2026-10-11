const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motion = document.getElementById('motion');
let paused = false, cleanup = () => {};
const heroVideo=document.getElementById('hero-video');
const heroMotion=document.getElementById('hero-motion');
// Preencha com os arquivos aprovados quando o reel estiver disponível.
const heroVideos={desktop:'',mobile:''};
const mobileVideo=matchMedia('(max-width:700px)');
function syncVideo(){
 const source=mobileVideo.matches ? (heroVideos.mobile||heroVideos.desktop) : heroVideos.desktop;
 if(source && heroVideo.getAttribute('src')!==source){heroVideo.src=source;heroVideo.load();}
 if(!source || paused || reduced.matches){heroVideo.pause();return;}
 heroVideo.play().catch(()=>{});
}
heroVideo.addEventListener('playing',()=>document.body.classList.add('video-ready'));
heroVideo.addEventListener('error',()=>document.body.classList.remove('video-ready'));
mobileVideo.addEventListener('change',syncVideo);
const header=document.querySelector('header');
const hero=document.querySelector('.hero');
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
 heroMotion.disabled=reduced.matches;
 heroMotion.setAttribute('aria-pressed',String(disabled));
 heroMotion.textContent=paused?'Reproduzir vídeo':'Pausar vídeo';
 if(disabled || !window.gsap || !window.ScrollTrigger) return;
 gsap.registerPlugin(ScrollTrigger);
 const lenis = window.Lenis ? new Lenis({duration:1.05,anchors:false}) : null;
 const tick=t=>lenis?.raf(t*1000);
 if(lenis){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(tick);}
 const context=gsap.context(()=>{
  gsap.from('.hero h1',{y:30,opacity:0,duration:.9,ease:'power3.out'});
  document.querySelectorAll('[data-reveal]').forEach(el=>gsap.from(el,{y:40,duration:.8,scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
 });
 cleanup=()=>{context.revert();gsap.ticker.remove(tick);lenis?.destroy();};
}
motion.addEventListener('click',()=>{paused=!paused;setupMotion();});
heroMotion.addEventListener('click',()=>{paused=!paused;setupMotion();});
reduced.addEventListener('change',setupMotion);
setupMotion();
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
