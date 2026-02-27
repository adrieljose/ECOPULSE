const CACHE_NAME = 'ecopulse-v1';
const ASSETS_TO_CACHE = [
    '/css/style.css',
    '/css/all.min.css',
    '/js/script.js',
    '/js/map.js',
    '/img/ecopulse_logo_final.png',
    '/img/map-placeholder.jpg',
    '/img/login_bg.webp'
];

// Install Event: Cache essential static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event: Serve from network first, fallback to cache
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Optionally cache the updated response here if needed for dynamic pages
                return networkResponse;
            })
            .catch(() => {
                // If network fails (offline), try the cache
                return caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Fallback logic here if needed (e.g. offline.html)
                });
            })
    );
});
