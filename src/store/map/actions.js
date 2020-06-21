import { getRestaurants } from '../restaurant/actions'
import {
  SET_CENTER_MAP_LOCATION,
  SET_PIN_LOCATION,
  CHANGE_MAP_MODE,
  GET_USER_LOCATION_STARTED,
  GET_USER_LOCATION_SUCCESS,
  GET_USER_LOCATION_FAILURE,
  DISMISS_MAP_ERROR
} from './actionTypes'



export const getUserLocation = () => {
  return dispatch => {
    dispatch({
      type: GET_USER_LOCATION_STARTED
    })

    return navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        dispatch({
          type: GET_USER_LOCATION_SUCCESS,
          payload: { latitude, longitude }
        })
        dispatch(getRestaurants())
      },
      (err) => {
        dispatch({
          type: GET_USER_LOCATION_FAILURE,
          payload: err
        })
      },
      {
        timeout: 30000,
      }
    )
  }
}

export const setCenterMapLocation = (payload) => {
  return dispatch => {
    dispatch({
      type: SET_CENTER_MAP_LOCATION,
      payload
    })
    dispatch(getRestaurants())
  }
}

export const setPinLocation = (payload) => {
  return {
    type: SET_PIN_LOCATION,
    payload
  }
}

export const changeMapMode = (payload) => {
  return {
    type: CHANGE_MAP_MODE,
    payload
  }
}

export const dismissMapError = () => {
  return { type: DISMISS_MAP_ERROR }
}
