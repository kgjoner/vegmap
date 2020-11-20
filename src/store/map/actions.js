import { defaultLocation, notificationTypes } from '../../constants/systemTypes'
import { getRestaurants } from '../restaurant/actions'
import { notify } from '../notification/action'
import {
  SET_CENTER_MAP_LOCATION,
  SET_PIN_LOCATION,
  CHANGE_MAP_MODE,
  GET_USER_LOCATION_STARTED,
  GET_USER_LOCATION_SUCCESS,
  GET_USER_LOCATION_FAILURE,
} from '../../constants/actionTypes'



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
        dispatch({ type: GET_USER_LOCATION_FAILURE })
        dispatch(notify(notificationTypes.ERROR, err.message, null, err.name))
        dispatch(setCenterMapLocation(defaultLocation))
      },
      {
        timeout: 10000,
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
