const VERSION='egw-v17';
const SHELL='egw-shell-'+VERSION;
const DATA='egw-data-1';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png','./data/books.json?v=3'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>/^egw-shell-/.test(k)&&k!==SHELL).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url); if(u.origin!==location.origin)return;
  if(u.pathname.includes('/data/')){
    e.respondWith(caches.open(DATA).then(c=>c.match(r).then(h=>h||fetch(r).then(n=>{if(n.ok)c.put(r,n.clone());return n;}))));return;
  }
  e.respondWith(fetch(r).then(n=>{if(n.ok){const cp=n.clone();caches.open(SHELL).then(c=>c.put(r,cp));}return n;}).catch(()=>caches.match(r,{ignoreSearch:false}).then(h=>h||caches.match('./index.html'))));
});
