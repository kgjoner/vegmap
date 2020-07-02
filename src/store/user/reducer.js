import {
  SET_USER
} from '../../constants/actionTypes'


export const initialState = {
  user: null
}

export const user = (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_USER:
      return Object.assign({}, state, {
        user: payload
      })
    default:
      return state
  }
}



