import { popups } from '../../constants/controlOptions'
import { 
  OPEN_POPUP,
  CLOSE_POPUP
} from '../../constants/actionTypes'


export const initialState = {
  popup: popups.NONE
}

export const popup = (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case OPEN_POPUP:
      return Object.assign({}, state, {
        popup: payload
      })
    
    case CLOSE_POPUP:
      return Object.assign({}, state, {
        popup: popups.NONE
      })

    default:
      return state
  }
}