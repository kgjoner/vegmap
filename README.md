
# Vegmap Frontend

> A web app for mapping vegan restaurants nearby the user. Made with React.

![Images of how the pages look like on desktop and mobile](/src/assets/img/git-presentation.png)


## Packages

* React
* Redux
* Redux Thunk
* React Facebook Login
* Google Map React
* Socket.io Client


## Overview

It displays vegan and vegetarian restaurants nearby the user. They may be filtered by the food offered, like burger or pasta, or by their specialization level (whether vegan/vegetarian is an option or the only kind of food offered).

The data is gotten from a mongo database, stored by other users. To register a new restaurant, the user must log in with their Facebook account. This also allows them voting in their favorite restaurants.

The results may be viewed in a list of cards or in a real world map, over their addresses. The map is built consuming the Google Map API.

The users can also update the informations of an existing restaurant, like their foods, address, social links or coordinates.

At last, every alteration in a restaurant is communicated in realtime via websockets to all the users who are seeing it in their results list.

### Important

> All the restaurants are in Florianópolis or its metropolitan region. Other locations cannot be added. **If you are far from there and would like to see the results**, you should block the geolocation, so the app will consider your start position as it was in the center of the city. 


## Routes

* `/` : unique page; the api calls and the map view are managed by javascript.


## API

It consumes a backend API hosted in Heroku. The repository is here: [vegmap-backend](https://github.com/kgjoner/vegmap-backend)

It also consumes the Netlify forms API to gather possible denounces of irregular restaurants.

All the calls are found in `/src/services/api.js`.


## PWA

It was one of the last additions to the app. It allows the user install it with the based minified files added to cache. 

However, the app does not work offline yet. It will still be added new functions to the service worker for managing the cache properly. The idea is storing both past results and update requests. The last ones will be cleared as soon as they be sent to the server.


## Folder Structure

```
 /public
 |   /icons (site icon in the required formats)
 |   |   /...
 |   favicon.ico
 |   index.html
 |   manifest.json
 |   robots.txt
 |   sw.js
 /src
 |   /assets
 |   |   /css
 |   |   |   /...
 |   |   /img
 |   |   |   /...
 |   /components
 |   |   /ComponentName
 |   |   |   /ComponentName.css
 |   |   |   /ComponentName.js
 |   |   |   /ComponentName.test.js
 |   |   |   /Index.js
 |   |   /...
 |   /constants
 |   |   actionTypes.js
 |   |   controlOptions.js (possible values of system variables)
 |   |   index.js
 |   |   presentation.js (default messages for the user)
 |   /containers
 |   |   /ComponentName
 |   |   |   /ComponentName.css
 |   |   |   /ComponentName.js
 |   |   |   /ComponentName.test.js
 |   |   |   /Index.js
 |   |   /...
 |   /hooks
 |   |   /useHookName.js
 |   |   /...
 |   /services
 |   |   /api.js
 |   |   /api.test.js
 |   |   /socket.js
 |   /store
 |   |   index.js
 |   |   /EntityName
 |   |   |   /actions.js
 |   |   |   /EntityName.test.js
 |   |   |   /reducer.js
 |   |   /...
 |   /utils
 |   |   /...
 |   App.css
 |   App.js
 |   index.js
 |   mocks.js
 |   serviceWorker.js
```


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm start
```

### Compiles and generates static pages for production
```
npm run build
```


## Tests
```
npm test
```

The following modules were used:

* Jest
* Jest Dom
* React Testing Library
* Redux Mock Store
* Jest Environment Jsdom Sixteen
