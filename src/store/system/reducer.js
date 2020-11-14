import {
  DISMISS_SYSTEM_MESSAGE,
  SET_CONNECTION_STATE, 
  SET_SW_EXISTENCE,
} from '../../constants/actionTypes'
import { infoMessages } from '../../constants/presentation'


export const initialState = {
  isConnected: null,
  hasServiceWorker: null,
  message: null
}

export const system = (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_CONNECTION_STATE:
      const message = payload 
        ? state.isConnected === false
          ? infoMessages.ONLINE
          : state.message
        : state.isConnected
          ? infoMessages.OFFLINE
          : state.message
      return Object.assign({}, state, {
        isConnected: payload,
        message
      })

    case SET_SW_EXISTENCE:
      return Object.assign({}, state, {
        hasServiceWorker: payload
      })

    case DISMISS_SYSTEM_MESSAGE:
      return Object.assign({}, state, {
        message: null
      })
    
    default:
      return state
  }
}



