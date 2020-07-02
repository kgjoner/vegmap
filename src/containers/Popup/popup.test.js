import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react'
import { renderWithStore, getMockStore } from '../../utils/testStore'
import * as actions from '../../store/popup/actions';
import { popups } from '../../constants/controlOptions';
import '@testing-library/jest-dom/extend-expect'

import Popup from './Popup'


let store = getMockStore()
const mockClose = jest.spyOn(actions, 'closePopup')

//Correct the requirement for a parentNode in FacebookLogin
const fbScript = document.createElement('script')
fbScript.id = 'facebook-jssdk'
document.body.appendChild(fbScript)


describe('Popup Component', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render an empty Popup component in the initial state', () => {
    const { queryByRole } = renderWithStore(<Popup />, store)
    
    expect(queryByRole('presentation')).toBeEmpty()
  })


  it('should display the Signup Box when state ask for', () => {
    store = getMockStore({
      popup: { popup: popups.SIGNUP }
    })

    const { queryByRole, queryByText } = renderWithStore(<Popup />, store)

    expect(queryByRole('presentation')).toBeTruthy()
    expect(queryByText(/cadastro/i)).toBeTruthy()
  })


  it('should display the Ask For Logging when state ask for', () => {
    store = getMockStore({
      popup: { popup: popups.ASK_FOR_LOGGING }
    })

    const { queryAllByText } = renderWithStore(<Popup />, store)

    expect(queryAllByText(/login/i)).not.toEqual([])
  })


  it('should display the Denunciation Form when state ask for', () => {
    store = getMockStore({
      popup: { popup: popups.DENUNCIATION_FORM }
    })

    const { queryByRole } = renderWithStore(<Popup />, store)

    expect(queryByRole('form')).toBeTruthy()
  })


  it('should dispatch close action when user click on the background', () => {
    const { queryByRole } = renderWithStore(<Popup />, store)
    fireEvent.mouseDown(queryByRole('presentation'))

    expect(mockClose).toHaveBeenCalledTimes(1)
  })
  
})