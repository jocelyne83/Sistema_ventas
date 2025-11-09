
// console.log("Service Worker registrado");


// Nombre del caché 
const CACHE_NAME = "pwa-cache-v3";

// Archivos que se guardan en el caché
const archivosCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/matte.png",
  "/icons/cars.png"
];

//  INSTALL
self.addEventListener("install", (event) => {
  console.log("Service Worker Instalando y cacheando archivos");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Archivos cacheados:");
      return cache.addAll(archivosCache);
    })
  );
});

//  Limpia  cachés viejos
self.addEventListener("activate", (event) => {
  console.log("Service Worker Activado");
  event.waitUntil(
    caches.keys().then((nombresCaches) => {
      return Promise.all(
        nombresCaches.map((nombre) => {
          if (nombre !== CACHE_NAME) {
            console.log("Borrando caché antigua:", nombre);
            return caches.delete(nombre);
          }
        })
      );
    })
  );
});

//  FETCH 
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((respuestaCache) => {
      // Si está en caché, se devuelve
      if (respuestaCache) {
        console.log("Service Worker Cargando desde caché:", event.request.url);
        return respuestaCache;
      }
      // Si no está, se pide a la red y se guarda
      console.log("Service Worker Descargando de la red:", event.request.url);
      return fetch(event.request).then((respuestaRed) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, respuestaRed.clone());
          return respuestaRed;
        });
      });
    })
  );
});

