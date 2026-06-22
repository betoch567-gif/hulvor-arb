const CACHE = 'hulvor-arb-v1';
const ASSETS = [
  '/hulvor-arb/',
  '/hulvor-arb/index.html',
  '/hulvor-arb/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('api.the-odds-api.com') ||
      e.request.url.includes('clob.polymarket.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() =>
      caches.match('/hulvor-arb/index.html')
    ))
  );
});
