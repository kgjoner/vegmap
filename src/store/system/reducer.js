import {
  SET_CONNECTION_STATE, 
  SET_SW_EXISTENCE,
  SET_LOCATION_PERMISSION,
  SET_WINDOW_WIDTH, 
} from '../../constants/actionTypes'


export const initialState = {
  isConnected: null,
  hasServiceWorker: null,
  locationPermission: null,
  windowWidth: window.innerWidth
}

export const system = (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_CONNECTION_STATE:
      return Object.assign({}, state, {
        isConnected: payload
      })

    case SET_SW_EXISTENCE:
      return Object.assign({}, state, {
        hasServiceWorker: payload
      })

    case SET_LOCATION_PERMISSION:
      return Object.assign({}, state, {
        locationPermission: payload
      })

    case SET_WINDOW_WIDTH:
      return Object.assign({}, state, {
        windowWidth: payload
      })
    
    default:
      return state
  }
}



