import * as storage from '../../services/localStorage'
import { notify } from '../notification/action'
import { getUserLocation } from '../map/actions'
import { getRestaurants } from '../restaurant/actions'
import { openPopup } from '../popup/actions'
import { infoMessages } from '../../constants/systemMessages'
import { notificationTypes, popups } from '../../constants/systemTypes'
import {
  SET_CONNECTION_STATE, 
  SET_SW_EXISTENCE,
  SET_LOCATION_PERMISSION, 
} from '../../constants/actionTypes'


export const verifyConnection = () => {
  let isConnected
  if(navigator.onLine) {
    isConnected = true
  } else {
    isConnected = false
  }

  return (dispatch, getState) => {
    dispatchNotifyIfNecessary(dispatch, isConnected, getState().system)
    dispatch({
      type: SET_CONNECTION_STATE,
      payload: isConnected
    })

  }
}


export const setConnection = (payload) => {
  return (dispatch, getState) => {
    dispatchNotifyIfNecessary(dispatch, payload, getState().system)
    dispatch({
      type: SET_CONNECTION_STATE,
      payload
    })
  }
}


export const verifyServiceWorker = () => {
  const hasIt = !!navigator.serviceWorker.controller
  return {
    type: SET_SW_EXISTENCE,
    payload: hasIt
  }
}


export const getPermission = () => {
  return (dispatch) => {
    const permission = storage.getPermission()
    const actionObject = {
      type: SET_LOCATION_PERMISSION,
      payload: permission
    }

    if(permission) {
      dispatch(getUserLocation())
      dispatch(actionObject)
    } else if(permission === false) {
      dispatch(getRestaurants())
      dispatch(actionObject)
    } else {
      dispatch(openPopup(popups.ASK_FOR_LOCATION))
    }
  }
}


export const setPermission = (payload) => {
  return (dispatch) => {
    storage.persistPermission(payload)
    dispatch({
      type: SET_LOCATION_PERMISSION,
      payload
    })
  }
}


function dispatchNotifyIfNecessary(dispatch, isConnected, previousState) {
  if ( (isConnected && previousState.isConnected === false)
    || (!isConnected && previousState.isConnected) ) {
      const message = isConnected ? infoMessages.ONLINE : infoMessages.OFFLINE
      dispatch(notify(notificationTypes.INFO, message, 10000))
    }
}
