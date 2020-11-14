const CACHE_NAME = 'vegmap-app'

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
  // return self.clients.claim()
})

self.addEventListener('fetch', e => {
  const { method, url, body } = e.request;
  // const requestClone = e.request.clone() 

  if(url.includes(`${self.location.host}/api`)) {
    e.respondWith(  
      fetchApi(e.request)
      .then(response => response)
      .catch(() => {
        if(method === 'GET' && url.includes('search')) {
          return getCachedApiResponse(e.request)
            .then(data => {
              return new Response(JSON.stringify(data), {
                status: 200
              })
            })
        }    
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
  } else {
    e.respondWith(
      caches.match(e.request)
      .then(response => {
        if(response) return response

        return fetch(e.request) 
      })
    )
  }
})

function fetchApi(request) {
  const apiBaseUrl =
  'https://vegmap-backend.herokuapp.com'
  // 'http://localhost:3030'
  const fetchUrl = apiBaseUrl + request.url.split('/api')[1]

  return fetch(fetchUrl)
    .then(response => {
      if(response) {
        response.clone().json().then(data => {
          cacheApiResponse(data)
        })
      }
      return response
    })
}

// self.addEventListener('sync', e => {
//   e.waitUntil(retryApiCalls())
// });

// if(workbox) console.log('tem!!!!')

// workbox.setConfig({
//   debug: true
// });

// workbox.routing.registerRoute(
//   ({url, request, event}) => {
//     console.log('matching!', url, request, event)
//     return url.href.includes('/search')
//   },
//   ({url, event, params}) => {
//     console.log('interceptou!', url, event, params)
//     cacheApiResponse([{rest: 1, rest: 2}])
//   }
// )

// workbox.routing.registerRoute(
//   /\//,
//   ({url}) => {
//     console.log(url)
//   }
// )


/* ====================================
  IndexedDB Methods
======================================= */

function openIndexedDB(onSuccess, onError = e => console.log('onerror', e.target.error)) {
  const request = indexedDB.open('VEGMAP_DB', 1)

  request.onupgradeneeded = e => {
    const db = e.target.result //e.target === request
    const store = db.createObjectStore('restaurants', { keyPath: '_id' })

    store.createIndex('restaurants_unique_id', '_id', { unique: true })
  }

  request.onsuccess = onSuccess
  request.onerror = onError
}


function cacheApiResponse(response) {
  console.log('cacheando', response)

  return new Promise((res, rej) => {
    openIndexedDB(e => {
      const db = e.target.result
      const transaction = db.transaction('restaurants', 'readwrite') //readonly, readwrite, versionchange
      const restaurantsStore = transaction.objectStore('restaurants')
      
      response.forEach(restaurant => {
        restaurantsStore.put(restaurant)
      })
    
      transaction.onsuccess = () => res(true)
      transaction.onerror = e => rej(e.target.error)
    })
  })
}


function getCachedApiResponse(request) {
  // const { latitude, longitude, foods, vegan, vegetarian } = request.query
  return new Promise((res, rej) => {
    openIndexedDB(e => {
      const db = e.target.result
      const transaction = db.transaction('restaurants', 'readonly')
      const restaurantsStore = transaction.objectStore('restaurants')
      const operation = restaurantsStore.getAll()

      operation.onsuccess = e => res(e.target.result)
      operation.onerror = e => rej(e.target.error)
    })
  })
}


function cacheApiRequest(request) {

}