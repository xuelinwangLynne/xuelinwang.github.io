'use strict';
// Each major section lives in its own document; retain old inbound anchor links.
const legacyRoutes={research:'research.html',publications:'publications.html',cv:'cv.html',team:'team.html',contact:'contact.html'};
if(document.body.dataset.page==='home'&&legacyRoutes[location.hash.slice(1)])location.replace(legacyRoutes[location.hash.slice(1)]);
const search=document.querySelector('#publication-search');
if(search){
 const filters=[...document.querySelectorAll('[data-filter]')],groups=[...document.querySelectorAll('.publication-group')];let category='all';
 function filterPublications(){let total=0;const query=search.value.trim().toLowerCase();groups.forEach(group=>{let count=0;group.querySelectorAll('.publication').forEach(paper=>{const show=(category==='all'||category===group.dataset.category)&&paper.textContent.toLowerCase().includes(query);paper.hidden=!show;if(show)count++;});group.hidden=count===0;total+=count;});document.querySelector('#result-count').textContent=`${total} publication${total===1?'':'s'}`;document.querySelector('#no-results').hidden=total!==0;}
 filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filterPublications();}));search.addEventListener('input',filterPublications);
}
const rover=document.querySelector('#qq-rover');
if(rover){
 const main=document.querySelector('main'),welcome=document.querySelector('.qq-hello'),status=document.querySelector('#qq-status'),count=document.querySelector('#qq-treat-count'),motion=document.querySelector('#qq-motion'),dog=document.querySelector('#qq-dog'),sprite=rover.querySelector('.qq-sprite'),butterfly=document.querySelector('#qq-butterfly');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches,treats=0,x=0,y=0,target=null,routeIndex=0,last=0,restUntil=0,busyUntil=0,arrivalAction=null,state='idle',stateStart=0,travel='walk',nextPlay=0;
 try{treats=Math.max(0,Math.min(5,Number(sessionStorage.getItem('qq-treats-v2'))||0));}catch{}
 const showCount=()=>count.textContent=`Treats this visit: ${treats}`;showCount();
 function homePoint(){const a=welcome.getBoundingClientRect(),b=main.getBoundingClientRect();return{x:Math.max(0,a.left-b.left),y:a.top-b.top+6};}
 function bounds(){const b=main.getBoundingClientRect(),w=rover.offsetWidth,h=rover.offsetHeight;return{left:Math.max(-b.left+8,-120),right:Math.min(innerWidth-b.left-w-8,b.width-w+100),bottom:main.offsetHeight-h};}
 function route(){const z=bounds(),top=homePoint(),bio=document.querySelector('.intro'),recruit=document.querySelector('.recruitment'),news=document.querySelector('.news');return[top,{x:z.right,y:top.y},{x:z.right,y:bio.offsetTop+120},{x:z.right,y:recruit.offsetTop-35},{x:z.right,y:Math.min(z.bottom,news.offsetTop+45)},{x:z.left,y:Math.min(z.bottom,news.offsetTop+45)},{x:z.left,y:recruit.offsetTop-25},{x:z.left,y:bio.offsetTop+75},top];}
 function paint(){rover.style.transform=`translate(${x}px,${y}px)`;}
 function pose(now){const frames={idle:[0,0,180],walk:[0,4,185],run:[1,4,110],chase:[1,4,120],scratch:[2,4,155],jump:[3,4,200],greet:[3,4,230],eat:[4,4,280],pet:[2,4,350]};const [row,n,speed]=frames[state]||frames.idle;const col=paused||!n?0:Math.floor((now-stateStart)/speed)%n;sprite.style.backgroundPosition=`${col*100/3}% ${row*25}%`;sprite.dataset.frame=`${row}:${col}`;}
 function setState(next,now=performance.now()){if(state!==next){state=next;stateStart=now;rover.dataset.state=next;}pose(now);}
 function applyMotion(){rover.classList.toggle('motion-paused',paused);butterfly.hidden=true;motion.textContent=paused?'Resume motion':'Pause motion';motion.setAttribute('aria-pressed',String(paused));if(paused){target=null;arrivalAction=null;busyUntil=0;setState('idle');}last=0;}
 motion.addEventListener('click',()=>{paused=!paused;applyMotion();});reduced.addEventListener('change',e=>{paused=e.matches;applyMotion();});applyMotion();
 function hearts(symbol){if(paused)return;for(let i=0;i<3;i++){const h=document.createElement('span');h.className='qq-effect';h.textContent=symbol;h.style.setProperty('--drift',`${(i-1)*32}px`);h.style.animationDelay=`${i*.14}s`;rover.querySelector('.qq-effects').append(h);setTimeout(()=>h.remove(),2000);}}
 function perform(action){const now=performance.now();target=null;arrivalAction=null;butterfly.hidden=true;busyUntil=now+2400;restUntil=busyUntil+2700;
  if(action==='feed'&&treats>=5){status.textContent='My tummy is full! More cuddles would be lovely. ♡';setState('pet');hearts('♡');return;}
  if(action==='feed'){treats++;showCount();try{sessionStorage.setItem('qq-treats-v2',String(treats));}catch{}setState('eat');status.textContent='A tiny treat, held in my paws… nom, nom. Thank you!';}
  else if(action==='greet'){setState('greet');status.textContent='A happy little hop to say hello! I’m QQ. ♡';hearts('♥');}
  else if(action==='pet'){setState('pet');status.textContent='Head tilted, eyes closed… that’s the spot! ♡';hearts('♡');}
  else if(action==='scratch'){setState('scratch');status.textContent='Just a moment… one fluffy ear needs a scratch!';}
  else if(action==='jump'){setState('jump');busyUntil=now+1600;status.textContent='Ready, crouch… hop! Four little paws in the air.';}
  else if(action==='run'||action==='chase'){const z=bounds();travel=action;target={x:x<(z.left+z.right)/2?z.right:z.left,y:Math.max(homePoint().y,Math.min(y,z.bottom))};busyUntil=0;setState(action);status.textContent=action==='chase'?'A butterfly! Catch me if you can, little friend. 🦋':'Zoomies! Watch those little paws go.';}
  else{setState('idle');status.textContent='Here I am! A little hello before the research?';}
 }
 function interact(action){const home=homePoint();if(action==='come'||Math.hypot(x-home.x,y-home.y)>230){if(paused){x=home.x;y=home.y;paint();perform(action);}else{busyUntil=0;target=home;arrivalAction=action;travel='run';butterfly.hidden=true;status.textContent='Coming! QQ is trotting back to say hello.';}}else perform(action);}
 document.querySelectorAll('[data-qq-action]').forEach(b=>b.addEventListener('click',()=>interact(b.dataset.qqAction)));dog.addEventListener('click',()=>perform('pet'));
 const start=homePoint();x=start.x;y=start.y;paint();restUntil=performance.now()+5000;nextPlay=performance.now()+12500;
 function moveButterfly(now){if(state!=='chase'||paused){butterfly.hidden=true;return;}const z=bounds(),left=rover.classList.contains('faces-left');butterfly.hidden=false;const bx=Math.max(z.left,Math.min(z.right+rover.offsetWidth-35,x+(left?-35:rover.offsetWidth)+Math.sin(now/300)*12));const by=Math.max(0,y+35+Math.sin(now/220)*22);butterfly.style.transform=`translate(${bx}px,${by}px) rotate(${Math.sin(now/260)*15}deg)`;}
 function frame(now){const dt=last?Math.min((now-last)/1000,.045):0;last=now;
  if(!paused){if(now<busyUntil){}else if(target){const dx=target.x-x,dy=target.y-y,d=Math.hypot(dx,dy),speed=travel==='walk'?55:travel==='chase'?125:150,step=dt*speed;if(d<=Math.max(step,1)){x=target.x;y=target.y;target=null;setState('idle',now);restUntil=now+2400;if(arrivalAction)perform(arrivalAction);}else{x+=dx/d*step;y+=dy/d*step;if(Math.abs(dx)>2)rover.classList.toggle('faces-left',dx<0);setState(travel,now);}paint();}else if(now>=restUntil){if(now>=nextPlay){const acts=['scratch','jump','chase','run'];perform(acts[Math.floor(Math.random()*acts.length)]);nextPlay=now+14000+Math.random()*7000;}else{const points=route();routeIndex=(routeIndex+1)%points.length;target=points[routeIndex];travel='walk';}}else setState('idle',now);pose(now);moveButterfly(now);}
  requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);
 addEventListener('resize',()=>{target=null;arrivalAction=null;butterfly.hidden=true;const p=homePoint();x=p.x;y=p.y;paint();restUntil=performance.now()+3000;});
}

// Server-backed site-wide UV count. Never manufacture a number from local storage.
const visitorStatus=document.querySelector('#visitor-status'),visitorNumber=document.querySelector('#visitor-number'),value=document.querySelector('#busuanzi_value_site_uv');
if(visitorStatus&&visitorNumber&&value){
 if(location.hostname==='localhost'||location.hostname==='127.0.0.1'||location.protocol==='file:')visitorStatus.textContent='Visitor counting starts on the live website.';
 else{
  const observer=new MutationObserver(()=>{const n=value.textContent.trim();if(/^\d+$/.test(n)&&Number(n)>0){value.textContent=Number(n).toLocaleString('en-US');observer.disconnect();visitorStatus.hidden=true;visitorNumber.hidden=false;}});
  observer.observe(value,{childList:true,subtree:true,characterData:true});
  const script=document.createElement('script');script.src='https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';script.async=true;
  script.onerror=()=>{visitorStatus.textContent='Visitor counter temporarily unavailable.';};
  setTimeout(()=>{if(visitorNumber.hidden)visitorStatus.textContent='Visitor counter temporarily unavailable.';},10000);
  document.head.appendChild(script);
 }
}
