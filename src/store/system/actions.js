import {
  DISMISS_SYSTEM_MESSAGE,
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

  return {
    type: SET_CONNECTION_STATE,
    payload: isConnected
  }
}

export const setConnection = (payload) => {
  return {
    type: SET_CONNECTION_STATE,
    payload
  }
}

export const verifyServiceWorker = () => {
  const hasIt = !!navigator.serviceWorker.controller
  return {
    type: SET_SW_EXISTENCE,
    payload: hasIt
  }
}

export const dismissSystemMessage = () => {
  return {
    type: DISMISS_SYSTEM_MESSAGE
  }
}
