import {
  SET_USER
} from './actionTypes'


export const setUser = (payload) => {
  return {
    type: SET_USER,
    payload
  }
}
