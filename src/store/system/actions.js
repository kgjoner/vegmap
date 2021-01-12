import * as storage from '../../services/localStorage'
import { notify } from '../notification/action'
import { getUserLocation, setCenterMapLocation } from '../map/actions'
import { openPopup } from '../popup/actions'
import { infoMessages } from '../../constants/systemMessages'
import { defaultLocation, notificationTypes, popups } from '../../constants/systemTypes'
import {
  SET_CONNECTION_STATE, 
  SET_SW_EXISTENCE,
  SET_LOCATION_PERMISSION,
  SET_WINDOW_WIDTH, 
} from '../../constants/actionTypes'


function dispatchNotifyIfNecessary(dispatch, isConnected, previousState) {
  if ( (isConnected && previousState.isConnected === false)
    || (!isConnected && previousState.isConnected) ) {
      const message = isConnected ? infoMessages.ONLINE : infoMessages.OFFLINE
      dispatch(notify(notificationTypes.INFO, message, 10000))
    }
}

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

    if(permission || permission === false) {
      dispatch(setPermission(permission, false))
    } else {
      dispatch(openPopup(popups.ASK_FOR_LOCATION))
    }
  }
}


export const setPermission = (permission, shouldPersist = true) => {
  return (dispatch) => {
    if(shouldPersist) {
      storage.persistPermission(permission)
    }

    if(permission) {
      dispatch(getUserLocation())
    } else if(permission === false) {
      dispatch(setCenterMapLocation(defaultLocation))
    }

    dispatch({
      type: SET_LOCATION_PERMISSION,
      payload: permission
    })
  }
}

export const updateWindowWidth = () => {
  return {
    type: SET_WINDOW_WIDTH,
    payload: window.innerWidth
  }
}
