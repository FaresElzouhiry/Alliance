/* Alliance Investment — service worker
 *
 * TO PUSH AN UPDATE TO EVERY VISITOR: change VERSION below (v1 → v2 → v3 …) and upload the site.
 * Browsers notice the change, download everything fresh and delete the old cache.
 *
 * Pages (HTML) always try the network first, so text changes show up right away.
 * Files (CSS, JS, images, fonts) load instantly from the cache and refresh quietly in the background.
 */
const VERSION = 'v5';
const CACHE = `alliance-${VERSION}`;

// Downloaded on install so the site also opens offline
const CORE = [
  './',
  './about-us/',
  './business-model/',
  './privacy-policy/',
  './ar/',
  './ar/about-us/',
  './ar/business-model/',
  './ar/privacy-policy/',
  './404.html',
  './data/team.json',
  './assets/css/styles.css',
  './assets/js/main.js',
  './assets/js/team.js',
  './assets/js/globe.js',
  './assets/fonts/montserrat-latin.woff2',
  './assets/fonts/cairo-latin.woff2',
  './assets/fonts/cairo-arabic.woff2',
  './assets/img/icons.svg',
  './assets/img/logo.webp',
  './assets/img/logo-light.webp',
  './assets/img/emblem.webp',
  './assets/img/hero-poster.webp',
  './assets/img/hero-poster-sm.webp',
  './assets/img/page-hero.webp',
  './assets/img/page-hero-sm.webp',
  './assets/img/page-hero-business.webp',
  './assets/img/page-hero-business-sm.webp',
  './assets/img/page-hero-privacy.webp',
  './assets/img/page-hero-privacy-sm.webp',
  './assets/img/favicon-32.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('alliance-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // analytics and other sites go straight to the network

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, url));
  } else {
    event.respondWith(staleWhileRevalidate(event, request));
  }
});

async function networkFirst(request, url) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.status === 200) cache.put(request, response.clone());
    return response;
  } catch {
    // offline: the cached copy of this page, or the home page in the same language
    const lang = (url.pathname.match(/\/(ar|es|ja|zh|ko)\//) || [])[1];
    const home = new URL(lang ? `./${lang}/` : './', self.registration.scope);
    return (await cache.match(request, { ignoreSearch: true })) || (await cache.match(home.href)) || Response.error();
  }
}

async function staleWhileRevalidate(event, request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const refresh = fetch(request, { cache: 'no-cache' })
    .then((response) => {
      if (response.status === 200) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached || Response.error());
  if (cached) {
    event.waitUntil(refresh);
    return cached;
  }
  return refresh;
}
