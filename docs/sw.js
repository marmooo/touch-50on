const CACHE_NAME="2024-06-16 09:37",urlsToCache=["/touch-50on/","/touch-50on/index.js","/touch-50on/drill.js","/touch-50on/drill/","/touch-50on/mp3/correct1.mp3","/touch-50on/mp3/correct3.mp3","/touch-50on/mp3/incorrect1.mp3","/touch-50on/mp3/stupid5.mp3","/touch-50on/favicon/favicon.svg"];self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==CACHE_NAME).map(e=>caches.delete(e)))))})