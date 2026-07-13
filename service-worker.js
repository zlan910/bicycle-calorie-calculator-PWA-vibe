importScripts("./version.js");
const CACHE_NAME = `bike-calories-v${APP_VERSION}`;
const APP_FILES = ["./", "./index.html", "./styles.css", "./app.js", "./calculator.js", "./version.js", "./manifest.webmanifest", "./icons/bicycle_cals.svg", "./icons/bicycle_cals_192.png", "./icons/bicycle_cals_512.png"];
self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES))));
self.addEventListener("activate", (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))));
self.addEventListener("fetch", (event) => event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request))));
