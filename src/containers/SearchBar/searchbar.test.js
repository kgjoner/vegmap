import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react'
import { renderWithStore, getMockStore } from '../../utils/testStore'
import * as actions from '../../store/restaurant/actions';
import '@testing-library/jest-dom/extend-expect'

import SearchBar from './SearchBar'
import { mockCoords } from '../../mocks';


let store = getMockStore()
const mockGet = jest.spyOn(actions, 'getRestaurants')


describe('SearchBar Component', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render SearchBar component', () => {
    const { 
      queryByRole, 
      queryByPlaceholderText, 
      queryByLabelText,
      queryByText
    } = renderWithStore(<SearchBar />, store)
    
    expect(queryByRole('search')).toBeTruthy()
    expect(queryByPlaceholderText(/pesquise/i)).toBeTruthy()
    expect(queryByLabelText(/todos/i)).toBeChecked()
    expect(queryByLabelText(/vegano/i)).not.toBeChecked()
    expect(queryByLabelText(/vegetariano/i)).not.toBeChecked()
    expect(queryByText(/buscar/i)).toBeTruthy()
    expect(mockGet).not.toHaveBeenCalled()
  })

  it('should dispatch an action automatically if there is a location', () => {
    store = getMockStore({
      map: { centerMapLocation: mockCoords }
    })
    renderWithStore(<SearchBar />, store)

    const expectedPayload = {
      latitude: mockCoords.latitude,
      longitude: mockCoords.longitude,
      foods: '',
      vegan: true,
      vegetarian: true
    }
    expect(mockGet).toHaveBeenCalledWith(expectedPayload)
  })


  it('should dispatch an action every time options change (if there is already a location)', () => {
    const { queryByLabelText } = renderWithStore(<SearchBar />, store)
    const veganRadio = queryByLabelText(/vegano/i)
    const expectedPayload = {
      latitude: mockCoords.latitude,
      longitude: mockCoords.longitude,
      foods: '',
      vegan: true,
      vegetarian: false
    }

    fireEvent.click(veganRadio)

    expect(veganRadio).toBeChecked()
    expect(queryByLabelText(/todos/i)).not.toBeChecked()
    expect(mockGet).toHaveBeenLastCalledWith(expectedPayload)
  })


  it('should dispatch an action when button is clicked', () => {
    const { queryByText } = renderWithStore(<SearchBar />, store)

    fireEvent.click(queryByText(/buscar/i))

    const expectedPayload = {
      latitude: mockCoords.latitude,
      longitude: mockCoords.longitude,
      foods: '',
      vegan: true,
      vegetarian: true
    }

    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenLastCalledWith(expectedPayload)
  })
})