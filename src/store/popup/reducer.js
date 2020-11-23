import { popups } from '../../constants/systemTypes'
import { 
  OPEN_POPUP,
  CLOSE_POPUP
} from '../../constants/actionTypes'


export const initialState = {
  popup: popups.NONE,
  content: null
}

export const popup = (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case OPEN_POPUP:
      const { popup, content } = payload
      return Object.assign({}, state, {
        popup,
        content
      })
    
    case CLOSE_POPUP:
      return Object.assign({}, state, {
        popup: popups.NONE
      })

    default:
      return state
  }
}