import {
  OPEN_POPUP,
  CLOSE_POPUP
} from '../../constants/actionTypes'


export const openPopup = (payload) => {
  return {
    type: OPEN_POPUP,
    payload
  }
}

export const closePopup = () => {
  return { type: CLOSE_POPUP }
}