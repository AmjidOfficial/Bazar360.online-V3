const CACHE_NAME = 'bazar360-v5';

// Install event: immediately activate without waiting
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event: delete all old stale caches across previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: passthrough for all app assets, scripts, and API calls to prevent any white screen chunk caching issues
self.addEventListener('fetch', (event) => {
  // Pass through all requests directly to the network
  return;
});
