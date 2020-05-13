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



self.addEventListener('fetch', event => {
// event.respondWith(
//     fetch(event.request)
//         .catch(() => {
//           return caches.open(CACHE_NAME)
//               .then((cache) => {
//                 return cache.match('offline.html');
//               });
//         })
// );
event.respondWith(async function() {
    // Try to get the response from a cache.
    const cachedResponse = await caches.match("/estino/views/offline.html");
    // Return it if we found one.
    if (cachedResponse) return cachedResponse;
    // If we didn't find a match in the cache, use the network.
    return fetch(event.request);
  }());
});

