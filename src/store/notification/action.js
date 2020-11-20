import { notificationTypes } from "../../constants/systemTypes"
import { 
  SET_NOTIFICATION, 
  DISMISS_NOTIFICATION
} from "../../constants/actionTypes"


export const notify = (type, message, timeout = null, name = null, action = null) => {
  if(type === notificationTypes.SUCCESS && timeout === null) {
    timeout = 3000
  }

  return {
    type: SET_NOTIFICATION,
    payload: {
      type,
      message,
      timeout,
      name,
      action
    }
  }
}

export const dismissNotification = () => {
  return { type: DISMISS_NOTIFICATION }
}