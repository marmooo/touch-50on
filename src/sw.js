const cacheName = "2025-12-12 00:00";
const urlsToCache = [
  "/touch-50on/index.js",
  "/touch-50on/drill.js",
  "/touch-50on/mp3/correct1.mp3",
  "/touch-50on/mp3/correct3.mp3",
  "/touch-50on/mp3/incorrect1.mp3",
  "/touch-50on/mp3/stupid5.mp3",
  "/touch-50on/favicon/favicon.svg",
];

async function preCache() {
  const cache = await caches.open(cacheName);
  await Promise.all(
    urlsToCache.map((url) =>
      cache.add(url).catch((err) => console.warn("Failed to cache", url, err))
    ),
  );
  self.skipWaiting();
}

async function handleFetch(event) {
  const cached = await caches.match(event.request);
  return cached || fetch(event.request);
}

async function cleanOldCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map((name) => name !== cacheName ? caches.delete(name) : null),
  );
  self.clients.claim();
}

self.addEventListener("install", (event) => {
  event.waitUntil(preCache());
});
self.addEventListener("fetch", (event) => {
  event.respondWith(handleFetch(event));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(cleanOldCaches());
});
