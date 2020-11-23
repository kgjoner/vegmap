import {
  OPEN_POPUP,
  CLOSE_POPUP
} from '../../constants/actionTypes'


export const openPopup = (popup, content = null) => {
  return {
    type: OPEN_POPUP,
    payload: {
      popup,
      content
    }
  }
}

export const closePopup = () => {
  return { type: CLOSE_POPUP }
}