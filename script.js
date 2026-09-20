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
 const main=document.querySelector('main'),welcome=document.querySelector('.qq-hello'),status=document.querySelector('#qq-status'),count=document.querySelector('#qq-treat-count'),motion=document.querySelector('#qq-motion'),dog=document.querySelector('#qq-dog');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches,treats=0,x=0,y=0,target=null,routeIndex=0,last=0,restUntil=0,busyUntil=0,arrivalAction=null;
 try{treats=Math.max(0,Math.min(5,Number(sessionStorage.getItem('qq-treats-v2'))||0));}catch{}
 const showCount=()=>count.textContent=`Treats this visit: ${treats}`;showCount();
 function homePoint(){const a=welcome.getBoundingClientRect(),b=main.getBoundingClientRect();return{x:Math.max(0,a.left-b.left+4),y:a.top-b.top+10};}
 function route(){const b=main.getBoundingClientRect(),w=rover.offsetWidth,h=rover.offsetHeight;const min=Math.max(-b.left+8,-100),max=Math.min(innerWidth-b.left-w-8,b.width-w+100);const bio=document.querySelector('.intro'),recruit=document.querySelector('.recruitment'),news=document.querySelector('.news');const top=homePoint();return[top,{x:max,y:top.y},{x:max,y:bio.offsetTop+Math.min(260,bio.offsetHeight)},{x:max,y:recruit.offsetTop-40},{x:max,y:Math.min(main.offsetHeight-h,news.offsetTop+60)},{x:min,y:Math.min(main.offsetHeight-h,news.offsetTop+60)},{x:min,y:recruit.offsetTop-30},{x:min,y:bio.offsetTop+100},top];}
 function paint(){rover.style.transform=`translate(${x}px,${y}px)`;}
 function setState(state){rover.dataset.state=state;}
 function applyMotion(){rover.classList.toggle('motion-paused',paused);motion.textContent=paused?'Resume motion':'Pause motion';motion.setAttribute('aria-pressed',String(paused));if(paused){target=null;setState('idle');}last=0;}
 motion.addEventListener('click',()=>{paused=!paused;applyMotion();});reduced.addEventListener('change',e=>{paused=e.matches;applyMotion();});applyMotion();
 function hearts(symbol){if(paused)return;for(let i=0;i<3;i++){const heart=document.createElement('span');heart.className='qq-effect';heart.textContent=symbol;heart.style.setProperty('--drift',`${(i-1)*30}px`);heart.style.animationDelay=`${i*.14}s`;rover.querySelector('.qq-effects').append(heart);setTimeout(()=>heart.remove(),2000);}}
 function perform(action){target=null;arrivalAction=null;busyUntil=performance.now()+2300;restUntil=busyUntil+3500;
  if(action==='feed'&&treats>=5){status.textContent='My tummy is full! More cuddles would be lovely. ♡';setState('pet');hearts('♡');return;}
  if(action==='feed'){treats++;showCount();try{sessionStorage.setItem('qq-treats-v2',String(treats));}catch{}setState('eat');status.textContent='Nom, nom… thank you for the treat!';}
  else if(action==='greet'){setState('greet');status.textContent='Woof! A little paw wave, just for you. Welcome!';hearts('♥');}
  else if(action==='pet'){setState('pet');status.textContent='That’s the spot! QQ closes her eyes for a head scratch. ♡';hearts('♡');}
  else{setState('greet');status.textContent='Here I am! Would you like to say hello?';}
 }
 function interact(action){if(performance.now()<busyUntil)return;const home=homePoint();if(action==='come'||Math.hypot(x-home.x,y-home.y)>220){if(paused){x=home.x;y=home.y;paint();perform(action);}else{target=home;arrivalAction=action;status.textContent='Coming! QQ is trotting back to say hello.';}}else perform(action);}
 document.querySelectorAll('[data-qq-action]').forEach(b=>b.addEventListener('click',()=>interact(b.dataset.qqAction)));dog.addEventListener('click',()=>perform('pet'));
 const start=homePoint();x=start.x;y=start.y;paint();restUntil=performance.now()+4500;
 function frame(now){const dt=last?Math.min((now-last)/1000,.045):0;last=now;
  if(!paused){if(now<busyUntil){}else if(target){const dx=target.x-x,dy=target.y-y,d=Math.hypot(dx,dy),step=dt*(arrivalAction?155:58);if(d<=Math.max(step,1)){x=target.x;y=target.y;target=null;setState('idle');restUntil=now+2800;if(arrivalAction)perform(arrivalAction);}else{x+=dx/d*step;y+=dy/d*step;if(Math.abs(dx)>2)rover.classList.toggle('faces-left',dx<0);setState('walk');}paint();}else{setState('idle');if(now>=restUntil){const points=route();routeIndex=(routeIndex+1)%points.length;target=points[routeIndex];}}}
  requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);
 addEventListener('resize',()=>{target=null;arrivalAction=null;const p=homePoint();x=p.x;y=p.y;paint();restUntil=performance.now()+3000;});
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
