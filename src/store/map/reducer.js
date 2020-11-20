import { mapModes, defaultLocation } from '../../constants/systemTypes'
import {
  SET_CENTER_MAP_LOCATION,
  SET_PIN_LOCATION,
  CHANGE_MAP_MODE,
  GET_USER_LOCATION_STARTED,
  GET_USER_LOCATION_SUCCESS,
  GET_USER_LOCATION_FAILURE,
} from '../../constants/actionTypes'


export const initialState = {
  centerMapLocation: { ...defaultLocation },
  pinLocation: {},
  mapMode: mapModes.HIDDEN,
  gettingUserLocation: false,
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

    default:
      return state
  }
}