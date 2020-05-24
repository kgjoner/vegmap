import {
  OPEN_POPUP,
  CLOSE_POPUP,
  popups
} from './actionTypes'
import * as actions from './actions'
import { initialState, popup } from './reducer'


describe('Popup Store', () => {

  it('should return the initial state', () => {
    expect(popup(undefined, {})).toEqual(initialState)
  })
  

/* ========================================================================================
  Open Popup
  ========================================================================================= */ 

  it('should create an action to open a popup', () => {
    const payload = popups.SIGNUP
    const expectedAction = {
      type: OPEN_POPUP,
      payload
    }

    expect(actions.openPopup(payload)).toEqual(expectedAction)
  })

  it('should set the popup', () => {
    const action = {
      type: OPEN_POPUP,
      payload: popups.SIGNUP
    }
    const expectedPopup = popups.SIGNUP
    
    expect(popup(undefined, action).popup).toEqual(expectedPopup)
  })


/* ========================================================================================
  Close Popup
  ========================================================================================= */ 

  it('should create an action to close the popup', () => {
    const expectedAction = { type: CLOSE_POPUP }

    expect(actions.closePopup()).toEqual(expectedAction)
  })

  it('should set the popup to NONE', () => {
    const action = { type: CLOSE_POPUP }
    const expectedPopup = popups.NONE
    
    expect(popup(undefined, action).popup).toEqual(expectedPopup)
  })
})