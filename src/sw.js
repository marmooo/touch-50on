const CACHE_NAME = "2024-05-20 01:29";
const urlsToCache = [
  "/touch-50on/",
  "/touch-50on/index.js",
  "/touch-50on/drill.js",
  "/touch-50on/drill/",
  "/touch-50on/mp3/correct1.mp3",
  "/touch-50on/mp3/correct3.mp3",
  "/touch-50on/mp3/incorrect1.mp3",
  "/touch-50on/mp3/stupid5.mp3",
  "/touch-50on/favicon/favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});
