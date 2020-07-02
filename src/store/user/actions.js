import {
  SET_USER
} from '../../constants/actionTypes'


export const setUser = (payload) => {
  return {
    type: SET_USER,
    payload
  }
}
