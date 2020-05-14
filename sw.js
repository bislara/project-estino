const dynamicCacheName = 'site-dynamic-v1';
var CACHE_NAME = 'my-cache-v1';
var urlsToCache = [
  'views/offline.html',
  // '/styles/main.css',
  // '/script/main.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// event.waitUntil(
//     caches.keys().then((keyList) => {
//       return Promise.all(keyList.map((key) => {
//         if (key !== CACHE_NAME) {
//           console.log('[ServiceWorker] Removing old cache', key);
//           return caches.delete(key);
//         }
//       }));
//     })
// );
});




// self.addEventListener('fetch', event => {
// // event.respondWith(
// //     fetch(event.request)
// //         .catch(() => {
// //           return caches.open(CACHE_NAME)
// //               .then((cache) => {
// //                 return cache.match('offline.html');
// //               });
// //         })
// // );
// event.respondWith(async function() {
//     // Try to get the response from a cache.
//     const cachedResponse = await caches.match("/views/offline.html");
//     // Return it if we found one.
//     if (cachedResponse) return cachedResponse;
//     // If we didn't find a match in the cache, use the network.
//     return fetch(event.request);
//   }());
// });

self.addEventListener('fetch', evt => {
//   console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(() => {
      if(evt.request.url.indexOf('.html') > -1){
        return caches.match('/views/offline.html');
      } 
    })
  );
});

