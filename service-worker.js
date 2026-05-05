const CACHE='fbo-smc-v8-logo-notifs';
const ASSETS=['./','./index.html','./manifest.webmanifest','./service-worker.js','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./logo-header.png','./logo-clochette.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));

self.addEventListener('message',event=>{
  const d=event.data||{};
  if(d.type==='NOTIFY'){
    event.waitUntil(self.registration.showNotification(d.title||'FBO',{body:d.body||'',icon:'./icon-192.png',badge:'./icon-192.png',tag:d.tag||'fbo-session'}));
  }
});
