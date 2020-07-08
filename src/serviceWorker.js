
export function register() {
  if (process.env.NODE_ENV === 'production'
    && 'serviceWorker' in navigator) {
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
      if (publicUrl.origin !== window.location.origin) {
        // Our service worker won't work if PUBLIC_URL is on a different origin
        // from what our page is served on. This might happen if a CDN is used to
        // serve assets; see https://github.com/facebook/create-react-app/issues/2374
        return;
      }

      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js')
        .then(function (registration) {
          // const data = {
          //   type: 'CACHE_URLS',
          //   payload: [
          //     ...performance.getEntriesByType('resource').map((r) => r.name)
          //   ]
          // }
          // registration.installing.postMessage(data);
        })
        .catch(function (err) {
          // registration failed :(
        });
      });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}