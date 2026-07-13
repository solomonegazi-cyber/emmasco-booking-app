const CACHE_NAME = 'emmasco-cache-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event - Precache the core shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate Event - Clean up any old caches from previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event - Handle network requests and local cache fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Handle API requests
  if (url.pathname.startsWith('/api/')) {
    // Specifically cache the booking list API (GET /api/bookings) so user's bookings are viewable offline
    if (event.request.method === 'GET' && url.pathname === '/api/bookings') {
      event.respondWith(
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            return caches.match(event.request);
          })
      );
      return;
    }
    // Bypass service worker for all other API calls (auth, post bookings, documents, etc.)
    return;
  }

  // 2. Determine if the request is for allowed local or external static assets (like blog images)
  const isImageOrStaticAsset = 
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|otf|css|js)$/i) ||
    url.hostname === 'picsum.photos' ||
    url.hostname === 'images.unsplash.com' ||
    url.hostname === 'emmascoreinigungsteam.de';

  // Bypass service worker for external domains unless they are explicitly allowed static assets
  if (url.hostname !== self.location.hostname && !isImageOrStaticAsset) {
    return;
  }

  // 3. Handle SPA Navigation Requests (e.g. page refreshes on sub-routes)
  // Try network first, and fall back to the cached SPA shell index.html if offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put('/', responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match('/');
        })
    );
    return;
  }

  // 4. Stale-While-Revalidate Strategy for local static assets and allowed external images
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update to keep cache fresh
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Ignore background sync errors when offline
          });
        return cachedResponse;
      }

      // Cache miss: retrieve from network and cache it dynamically
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        // Cache successful local (basic) and CORS requests (like external blog images)
        if (networkResponse.type === 'basic' || networkResponse.type === 'cors') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }

        return networkResponse;
      });
    })
  );
});

// ==========================================
// PWA BACKGROUND SYNC & OFFLINE QUEUE ENGINE
// ==========================================

const DB_NAME = 'emmasco-pwa-db';
const STORE_NAME = 'failed-bookings';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

function getFailedBookings(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function deleteFailedBooking(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function syncBookings() {
  try {
    const db = await openDB();
    const bookings = await getFailedBookings(db);
    if (bookings.length === 0) {
      console.log('[SW Sync] No pending offline bookings found.');
      return;
    }

    console.log(`[SW Sync] Found ${bookings.length} offline bookings to synchronize.`);

    for (const booking of bookings) {
      try {
        // Strip the status field if it exists, or submit as standard booking
        const bookingCopy = { ...booking };
        delete bookingCopy.status;

        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingCopy)
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            await deleteFailedBooking(db, booking.id);
            console.log(`[SW Sync] Successfully synchronized offline booking ${booking.id}`);

            // Notify all clients of success so they can live refresh the list
            const clients = await self.clients.matchAll();
            clients.forEach((client) => {
              client.postMessage({
                type: 'BOOKING_SYNC_SUCCESS',
                bookingId: booking.id,
                actualId: result.bookingId
              });
            });
          } else {
            console.warn(`[SW Sync] Backend rejected booking ${booking.id}:`, result.error);
          }
        } else {
          console.error(`[SW Sync] HTTP error ${response.status} syncing booking ${booking.id}`);
        }
      } catch (err) {
        console.error(`[SW Sync] Failed connection retry for booking ${booking.id}:`, err);
      }
    }
  } catch (err) {
    console.error('[SW Sync] Error opening IndexedDB or processing sync:', err);
  }
}

// Background Sync Listener
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bookings') {
    console.log('[SW Sync] Background Sync event triggered.');
    event.waitUntil(syncBookings());
  }
});

// Message Listener for explicit sync attempts or manual connection restore triggers
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRY_SYNC') {
    console.log('[SW Message] TRY_SYNC message received.');
    event.waitUntil(syncBookings());
  }
});
