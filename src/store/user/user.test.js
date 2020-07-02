import {
  SET_USER
} from '../../constants/actionTypes'
import * as actions from './actions'
import { initialState, user } from './reducer'
import { mockUser } from '../../mocks'


describe('User Store', () => {

  it('should return the initial state', () => {
    expect(user(undefined, {})).toEqual(initialState)
  })

  it('should create an action to set the user', () => {
    const payload = {...mockUser}
    const expectedAction = {
      type: SET_USER,
      payload
    }

    expect(actions.setUser(payload)).toEqual(expectedAction)
  })

  it('should return the desired user', () => {
    const action = {
      type: SET_USER,
      payload: {...mockUser}
    }
    const expectedUser = {...mockUser}
    
    expect(user(undefined, action).user).toEqual(expectedUser)
  })
})