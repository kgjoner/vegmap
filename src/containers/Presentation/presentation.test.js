import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react'
import { renderWithStore, getMockStore } from '../../utils/testStore'
import * as mapActions from '../../store/map/actions'
import * as popupActions from '../../store/popup/actions'
import { mockUser } from '../../mocks'
import { popups } from '../../store/popup/actionTypes';
import { mapModes } from '../../store/map/actionTypes';
import '@testing-library/jest-dom/extend-expect'

import Presentation from './Presentation'


let store = getMockStore()
const mockOpen = jest.spyOn(popupActions, 'openPopup')
const mockMapMode = jest.spyOn(mapActions, 'changeMapMode')

//Correct the requirement for a parentNode in FacebookLogin
const fbScript = document.createElement('script')
fbScript.id = 'facebook-jssdk'
document.body.appendChild(fbScript)


describe('Presentation Component', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render Presentation component', () => {
    const { queryByAltText, queryByText } = renderWithStore(<Presentation />, store)
    
    expect(queryByAltText('logo')).toBeTruthy()
    expect(queryByAltText('logotype')).toBeTruthy()
    expect(queryByText(/vegano/i)).toBeTruthy()
    expect(queryByText(/vegetariano/i)).toBeTruthy()
    expect(queryByText(/login/i)).toBeTruthy()
    expect(queryByText(/mapa/i)).toBeTruthy()
    expect(queryByText(/©/)).toBeTruthy()
    expect(queryByText(/cadastrar/i)).toBeNull()
  })


  it('should display the add restaurant button if user is logged in', () => {
    store = getMockStore({
      user: { user: mockUser }
    })
    const { queryByText } = renderWithStore(<Presentation />, store)
    
    expect(queryByText(/cadastrar/i)).toBeTruthy()
    expect(queryByText(mockUser.name)).toBeTruthy()
    expect(queryByText(/login/i)).toBeNull()
  })


  it('should dispatch the open popup action when the respective button is clicked', () => {
    const { queryByText } = renderWithStore(<Presentation />, store)
    fireEvent.click(queryByText(/cadastrar/i))

    expect(mockOpen).toHaveBeenCalledWith(popups.SIGNUP)
  })


  it('should dispatch the change map mode action when the respective button is clicked', () => {
    const { queryByText } = renderWithStore(<Presentation />, store)
    fireEvent.click(queryByText(/mapa/i))

    expect(mockMapMode).toHaveBeenCalledWith(mapModes.RESTAURANTS)
  })

})