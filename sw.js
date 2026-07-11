self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

const RUNTIME_CACHE = 'budget-pro-runtime';

self.addEventListener('fetch', function(event){
  var req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req).then(function(res){
      if (res && res.status === 200){
        var copy = res.clone();
        caches.open(RUNTIME_CACHE).then(function(cache){ cache.put(req, copy); });
      }
      return res;
    }).catch(function(){
      return caches.match(req);
    })
  );
});
