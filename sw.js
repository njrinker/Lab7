// sw.js - Service Worker

// You will need 3 event listeners:
//   - One for installation
//   - One for activation ( check out MDN's clients.claim() for this step )
//   - One for fetch requests

// Register a service worker

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  'https://cse110lab6.herokuapp.com/entries'
];

//Install a service worker
self.addEventListener('install', function(event) {
// Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

//Cache and return service worker requests
self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            console.log('Serving a cached page!');
            return response;
          }
  
          return fetch(event.request)
          .then(function(response) {
              console.log("Page wasn't cached, made a network call");
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                console.log("network call failed for some reason!");
                return response;
              }
  
              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              var responseToCache = response.clone();
              console.log("Cloning response");
  
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  console.log('Writing cloned response to cache');
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });
