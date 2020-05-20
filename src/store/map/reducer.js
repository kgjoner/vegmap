import {
  SET_CENTER_MAP_LOCATION,
  SET_PIN_LOCATION,
  CHANGE_MAP_MODE,
  GET_USER_LOCATION_STARTED,
  GET_USER_LOCATION_SUCCESS,
  GET_USER_LOCATION_FAILURE,
  mapModes,
  DISMISS_MAP_ERROR
} from './actionTypes'


export const initialState = {
  centerMapLocation: [],
  pinLocation: [],
  mapMode: mapModes.HIDDEN,
  gettingUserLocation: false,
  error: null
}

export const mapReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_CENTER_MAP_LOCATION:
      return Object.assign({}, state, {
        centerMapLocation: payload
      })

    case GET_USER_LOCATION_STARTED:
      return Object.assign({}, state, {
        gettingUserLocation: true
      })
    case GET_USER_LOCATION_SUCCESS:
      return Object.assign({}, state, {
        centerMapLocation: payload,
        gettingUserLocation: false
      })
    case GET_USER_LOCATION_FAILURE:
      return Object.assign({}, state, {
        error: payload,
        gettingUserLocation: false
      })

    case SET_PIN_LOCATION:
      return Object.assign({}, state, {
        pinLocation: payload
      })

    case CHANGE_MAP_MODE:
      return Object.assign({}, state, {
        mapMode: payload
      })

    case DISMISS_MAP_ERROR:
      return Object.assign({}, state, {
        error: initialState.error
      })

    default:
      return state
  }
}