document.documentElement.classList.add('js');
const menu=document.querySelector('.menu-button');const nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.06});document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));}else{document.querySelectorAll('.reveal').forEach(element=>element.classList.add('is-visible'));}
const projects=[{src:'assets/concrete-pour.webp',title:'A solid start.',alt:'Fresh concrete surface beside a Queensland home'},{src:'assets/site-preparation.webp',title:'Before the finish.',alt:'Outdoor ground being prepared beside a Queensland home'},{src:'assets/outdoor-surface.webp',title:'Taking shape.',alt:'Outdoor concrete beside sloping ground'}];
const dialog=document.querySelector('#project-dialog');let active=0;
function setProject(index){active=(index+projects.length)%projects.length;const item=projects[active];document.querySelector('#project-title').textContent=item.title;const image=document.querySelector('#project-image');image.src=item.src;image.alt=item.alt;document.querySelector('#project-counter').textContent=`0${active+1} / 03`;}
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{setProject(Number(button.dataset.project));dialog.showModal();document.body.classList.add('modal-open');}));
document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}});
document.querySelector('#previous').addEventListener('click',()=>setProject(active-1));document.querySelector('#next').addEventListener('click',()=>setProject(active+1));
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();setProject(active+1);}if(event.key==='ArrowLeft'){event.preventDefault();setProject(active-1);}});
