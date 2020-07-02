import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react'
import { renderWithStore, getMockStore, rerenderWithStore } from '../../utils/testStore'
import * as actions from '../../store/restaurant/actions';
import { mapModes } from '../../constants/controlOptions';
import '@testing-library/jest-dom/extend-expect'

import Maps from './Maps'
import { mockCoords, mockRestaurants } from '../../mocks';


let store = getMockStore()
const mockSelect = jest.spyOn(actions, 'changeSelectedRestaurant')


describe('Maps Component', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render a hidden Map component', () => {
    const { queryByRole } = renderWithStore(<Maps />, store)
    
    expect(queryByRole('region')).toHaveClass('map--hidden')
  })


  it('should render the entire Map component in mode Restaurant', () => {
    store = getMockStore({
      restaurant: { restaurants: mockRestaurants },
      map: { 
        centerMapLocation: mockCoords,
        mapMode: mapModes.RESTAURANTS
      }
    })
    const { queryAllByTestId, queryByTestId, queryByRole, queryByText } = renderWithStore(<Maps />, store)

    expect(queryAllByTestId('marker').length).toEqual(mockRestaurants.length)
    expect(queryByText(/voltar/i)).toBeTruthy()
    expect(queryByTestId('pin')).toBeNull()
    expect(queryByRole('listitem')).toBeNull()
  })


  it('should change the selected restaurant and open a card when a marker is clicked', () => {
    const { rerender, queryAllByTestId, queryAllByRole, queryByText } = renderWithStore(<Maps />, store)
    const marker = queryAllByTestId('marker')[0]

    fireEvent.click(marker)
    expect(mockSelect).toHaveBeenCalledTimes(1)

    store = getMockStore({
      restaurant: {
        restaurants: mockRestaurants,
        selectedRestaurant: mockRestaurants[0]
      },
      map: { 
        centerMapLocation: mockCoords,
        mapMode: mapModes.RESTAURANTS
      }
    })

    rerenderWithStore(rerender, <Maps />, store)

    expect(queryAllByRole('listitem')[0]).toContainElement(queryByText(mockRestaurants[0].name))
  })

})