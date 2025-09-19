// Service Worker for offline capabilities
const CACHE_NAME = 'smartcommute-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'bus-location-sync') {
    event.waitUntil(syncBusLocations());
  }
});

async function syncBusLocations() {
  try {
    const cache = await caches.open('bus-data');
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('/api/buses')) {
        await fetch(request.url);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}