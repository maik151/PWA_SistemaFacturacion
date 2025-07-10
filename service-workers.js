const CACHE_NAME = "admin-app-cache-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./styles.css",
  "../public/javascript/main.js",
  "../public/javascript/components/asideBarComponent.js",
  "../public/javascript/components/clientesComponent.js",
  "../public/javascript/components/facturasComponent.js",
  "../public/javascript/components/inicioComponent.js",
  "../public/javascript/components/productosComponent.js",
  // Añade aquí las rutas de tus assets estáticos, css, js, imágenes, fuentes, etc.
];

// Instalación y caché de archivos estáticos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación y limpieza de caches viejos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Interceptar requests y responder con cache o fetch
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse; // Retorna cache si existe
      }
      // Si no está en cache, busca en la red y cachea la respuesta
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          // No cacheamos requests cross-origin para evitar problemas
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      }).catch(() => {
        // Aquí puedes retornar una página offline genérica si quieres
        return new Response("Estás offline y el recurso no está en caché.", {
          status: 503,
          statusText: "Offline"
        });
      });
    })
  );
});
