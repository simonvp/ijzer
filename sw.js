/* ============================================================
   sw.js — app shell caching for offline use
   ============================================================ */

const CACHE_NAME = 'ijzer-cache-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/utils.js',
  './js/db.js',
  './js/seed.js',
  './js/store.js',
  './js/app-core.js',
  './js/app-onboarding.js',
  './js/app-dashboard.js',
  './js/app-workout.js',
  './js/app-kettlebell.js',
  './js/app-calendar.js',
  './js/app-progress.js',
  './js/app-body.js',
  './js/app-photos.js',
  './js/app-settings.js',
  './js/app-boot.js',
  './js/vendor/chart.umd.min.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && req.url.startsWith(self.location.origin)) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => {
          if (req.mode === 'navigate') return caches.match('./index.html');
          return new Response('', { status: 408, statusText: 'Offline' });
        });
    })
  );
});
