const CACHE="laisiangtho-shell-v1";
const FILES=["./","./index.html","./manifest.webmanifest","./data/books.json",
"./assets/css/tokens.css","./assets/css/base.css","./assets/css/layout.css","./assets/css/components.css","./assets/css/reader.css","./assets/css/themes.css",
"./assets/js/app.js","./assets/js/core/config.js","./assets/js/core/storage.js","./assets/js/core/dom.js","./assets/js/core/state.js","./assets/js/data/repository.js",
"./assets/js/features/settings.js","./assets/js/features/navigation.js","./assets/js/features/reader.js","./assets/js/features/search.js","./assets/js/features/personal-data.js","./icons/favicon.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("laisiangtho-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("message",e=>{if(e.data?.type==="CACHE_URL"&&e.data.url)e.waitUntil(caches.open(CACHE).then(c=>c.add(new URL(e.data.url,self.location.href).href).catch(()=>{})));});
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;const u=new URL(e.request.url);if(u.origin!==self.location.origin)return;
 e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok&&(u.pathname.endsWith(".json")||u.pathname.endsWith(".js")||u.pathname.endsWith(".css")))caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r;}).catch(()=>{if(e.request.mode==="navigate")return caches.match("./index.html");throw new Error("Offline: resource has not been cached.");})));
});
