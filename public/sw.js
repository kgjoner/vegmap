const CACHE_NAME = 'vegmap-app';

const urlsToCache = [
  '/',
  '/favicon.ico',
  'https://fonts.googleapis.com/css?family=Atma|Roboto:400,700&display=swap'
]

/* ====================================
  Lifecycle Routines
======================================= */

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
      })
  )
})


self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]
  e.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(keyList.map(key => {
        if (!cacheWhitelist.includes(key)) {
          return caches.delete(key)
        }
      }))
    )
  )
})


self.addEventListener('fetch', e => {
  // const {method, url, body} = e.request;
  // const requestClone = e.request.clone()
  
  e.respondWith(
    caches.match(e.request)
    .then(response => {
      if(response) return response
      return fetch(e.request)
      
      // if(method === 'GET' && url.includes('restaurants')) {
      //   return getCachedApiResponse(e.request)
      // }

      // if(method === 'POST' && url.includes('restaurants')) {
      //   cacheApiResponse(body)
      // }

      // if((method === 'POST' || method === 'PUT')
      //   && url.includes('request')) {
      //     cacheApiRequest(requestClone);
      //     return new Response(JSON.stringify({
      //       message: 'POST request was cached'
      //     }));
      // }  
  

    })

  )
})


// self.addEventListener('sync', e => {
//   e.waitUntil(retryApiCalls())
// });


/* ====================================
  IndexedDB Methods
======================================= */

// function openIndexedDB(onSuccess, onError = e => console.log('onerror', e.target.error)) {
//   const request = self.IndexedDB.open('VEGMAP_DB', 1)

//   request.onupgradeneeded = e => {
//     const db = e.target.result //e.target === request
//     const store = db.createObjectStore('restaurants', { keyPath: '_id' })

//     store.createIndex('restaurants_unique_id', '_id', { unique: true })
//   }

//   request.onsuccess = onSuccess
//   request.onerror = onError
// }


// function cacheApiResponse(response) {
//   console.log('cacheando', response)

//   return new Promise((res, rej) => {
//     openIndexedDB(e => {
//       const db = e.target.result
//       const transaction = db.transaction('restaurants', 'readwrite') //readonly, readwrite, versionchange
//       const restaurantsStore = transaction.objectStore('restaurants')
      
//       response.forEach(restaurant => {
//         restaurantsStore.put(restaurant)
//       })
    
//       transaction.onsuccess = () => res(true)
//       transaction.onerror = e => rej(e.target.error)
//     })
//   })
// }


// function getCachedApiResponse(request) {
//   if(!request.url.includes('/search')) return

//   // const { latitude, longitude, foods, vegan, vegetarian } = request.query
//   return new Promise((res, rej) => {
//     openIndexedDB(e => {
//       const db = e.target.result
//       const transaction = db.transaction('restaurants', 'readonly')
//       const restaurantsStore = transaction.objectStore('restaurants')
//       const operation = restaurantsStore.getAll()

//       operation.onsuccess = e => res(e.target.result)
//       operation.onerror = e => rej(e.target.error)
//     })
//   })
// }


// function cacheApiRequest(request) {

// }