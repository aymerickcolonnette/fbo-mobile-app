const CACHE='fbo-smc-v7';
const ASSETS=['./','./index.html','./manifest.webmanifest','./service-worker.js','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));

// Handle notification clicks
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{
    if(cs.length>0){cs[0].focus();return}
    return clients.openWindow('./');
  }));
});

// Handle messages from main thread (scheduled notifications)
self.addEventListener('message', e => {
  if(e.data && e.data.type === 'NOTIFY'){
    self.registration.showNotification(e.data.title, {
      body: e.data.body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: e.data.tag || 'fbo-session',
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: './' }
    });
  }
});
