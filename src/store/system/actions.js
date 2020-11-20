import { notify } from '../notification/action'
import { infoMessages } from '../../constants/systemMessages'
import { notificationTypes } from '../../constants/systemTypes'
import {
  SET_CONNECTION_STATE, 
  SET_SW_EXISTENCE,
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

function dispatchNotifyIfNecessary(dispatch, isConnected, previousState) {
  if ( (isConnected && previousState.isConnected === false)
    || (!isConnected && previousState.isConnected) ) {
      const message = isConnected ? infoMessages.ONLINE : infoMessages.OFFLINE
      dispatch(notify(notificationTypes.INFO, message, 10000))
    }
}
