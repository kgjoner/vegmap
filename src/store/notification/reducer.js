import { 
  SET_NOTIFICATION,
  DISMISS_NOTIFICATION
} from "../../constants/actionTypes"


export const initialState = {
  type: null,
  message: null,
  timeout: null,
  name: null,
  action: null
}

export const notification = (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_NOTIFICATION:
      const { type, message, timeout = null, name = null, action = null } = payload
      return Object.assign({}, state, {
        type,
        message,
        timeout,
        name,
        action
      })

    case DISMISS_NOTIFICATION:
      return { ...initialState }

    default:
      return state
  }
}