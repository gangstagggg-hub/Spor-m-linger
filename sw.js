const CACHE_NAVN = "gedo-tralle-v7";
const APP_SKALL = ["./", "./index.html", "./manifest.json", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAVN).then((cache) => cache.addAll(APP_SKALL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((navn) =>
      Promise.all(navn.filter((n) => n !== CACHE_NAVN).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Nettverk først, cache som reserve (alt lagres nå lokalt på enheten, ikke via server)
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const kopi = res.clone();
        caches.open(CACHE_NAVN).then((cache) => cache.put(event.request, kopi));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
