var CACHE_NAME = '2020-12-11 23:10';
var urlsToCache = [
  '/touch-50on/',
  '/touch-50on/index.js',
  '/touch-50on/drill.js',
  '/touch-50on/drill/',
  '/touch-50on/svg/eraser.svg',
  '/touch-50on/svg/sound.svg',
  '/touch-50on/mp3/correct1.mp3',
  '/touch-50on/mp3/correct3.mp3',
  '/touch-50on/mp3/incorrect1.mp3',
  '/touch-50on/mp3/stupid5.mp3',
  'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap.min.css',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches
    .open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
