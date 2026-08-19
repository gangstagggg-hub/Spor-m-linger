const CACHE_NAVN = "gedo-tralle-v1";
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

// Nettverk først for appens egne filer, cache som reserve.
// Kall til den delte lagringsfunksjonen (Netlify) rører vi ikke - de skal alltid
// gå direkte til nettverket, uten caching, slik at alle ser ferske data.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin || event.request.method !== "GET") {
    return; // la nettleseren håndtere dette som vanlig, ingen SW-innblanding
  }

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
