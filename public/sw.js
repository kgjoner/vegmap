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
})

self.addEventListener('fetch', e => {
  const { method, url } = e.request
  const requestClone = e.request.clone()

  if(url.includes(`${self.location.host}/api`)) {
    e.respondWith(  
      fetchApi(method, url, requestClone)
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

async function fetchApi(method, url, request) {
  const apiBaseUrl =
  'https://vegmap-backend.herokuapp.com'
  // 'http://localhost:3030'
  const fetchUrl = apiBaseUrl + url.split('/api')[1]
  
  let fetchOptions = { method }
  if(method !== 'GET') {
    const body = await request.json()
    fetchOptions.body = body
  }

  return fetch(fetchUrl, fetchOptions)
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
  const coords = { 
    latitude: request.url.match(/latitude=([^&]+)?/)[1],
    longitude: request.url.match(/longitude=([^&]+)?/)[1]
  }

  let foods = request.url.match(/foods=([^&]+)?/)[1] || ''
  foods = foods
    .split(',')
    .map(food => decodeURIComponent(food))

  const vegan = request.url.match(/vegan=([^&]+)?/)[1]
  const vegetarian = request.url.match(/vegetarian=([^&]+)?/)[1]
  const option = {
    vegan: vegan == 'false' && vegetarian == 'true' ? false : true,
    vegetarian: vegetarian == 'false' && vegan == 'true' ? false : true
  }

  return new Promise((res, rej) => {
    openIndexedDB(e => {
      const db = e.target.result
      const transaction = db.transaction('restaurants', 'readonly')
      const restaurantsStore = transaction.objectStore('restaurants')
      const operation = restaurantsStore.getAll()

      operation.onsuccess = e => {
        const restaurants = e.target.result
        const data = restaurants.filter(restaurant => {
          const centerCoords = {
            latitude: restaurant.location.coordinates[1],
            longitude: restaurant.location.coordinates[0]
          }
          return ( calculateDistance(centerCoords, coords) < 5
              || true ) //distance filter is disabled for now
            && ( !foods[0] 
              || restaurant.foods.some(food => foods.includes(food)) )
            && ( (restaurant.option.vegan && option.vegan) 
              || (restaurant.option.vegetarian && option.vegetarian) )
          
        })
        res(data)
      }
      operation.onerror = e => rej(e.target.error)
    })
  })
}


// function cacheApiRequest(request) {

// }


/* ====================================
  Utils
======================================= */

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function calculateDistance(
  centerCoordinates,
  pointCoordinates
) {
  const radius = 6371;

  const { latitude: lat1, longitude: lon1 } = centerCoordinates;
  const { latitude: lat2, longitude: lon2 } = pointCoordinates;

  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const center = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = radius * center;

  return distance;
};