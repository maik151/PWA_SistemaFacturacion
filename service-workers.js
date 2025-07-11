
const CACHE_NAME = "admin-app-cache-v2";
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  "./public/styles/css/bootstrap.min.css",
  "./public/styles/js/bootstrap.min.js",
  "./public/javascript/components/asideBarComponent.js",
  "./public/styles/css/clientesComponent.css",
  "./public/styles/css/facturasComponent.css",
  "./public/styles/css/productosComponent.css",
  "./public/icons/1x/icon1.png",
  "./public/icons/1x/icon2.png",
  "./private/api.js",
  "./private/modulos/clientes.js",
  "./private/modulos/clientes.js",
  "./private/modulos/clientes.js",
  "./private/modulos/facturas.js",
  "./private/modulos/productos.js"
];

// Instalación y caché de archivos estáticos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      const cachePromises = ASSETS_TO_CACHE.map(async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`${url} devolvió ${response.status}`);
          await cache.put(url, response.clone());
        } catch (err) {
          console.warn("No se pudo cachear:", url, err.message);
        }
      });

      return Promise.all(cachePromises);
    })
  );
  self.skipWaiting();
});

// Activación y limpieza de caches viejos
self.addEventListener("activate", event => {
  const whiteList = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (!whiteList.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
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
