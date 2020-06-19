import React from 'react';
import { cleanup, fireEvent, waitForElementToBeRemoved, waitFor } from '@testing-library/react'
import { renderWithStore, rerenderWithStore, getMockStore } from '../../utils/testStore'
import * as actions from '../../store/restaurant/actions'
import { mockError } from '../../mocks'
import '@testing-library/jest-dom/extend-expect'

import Toaster from './Toaster'


let store = getMockStore()
const mockDismissError = jest.spyOn(actions, 'dismissRestaurantError') 
const mockDismissSuccess = jest.spyOn(actions, 'dismissRestaurantSuccess') 


describe('Toaster Component', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render an empty Toaster component in the initial state', () => {
    const { queryByRole } = renderWithStore(<Toaster />, store)
    
    expect(queryByRole('presentation')).toBeEmpty()
    expect(queryByRole('presentation')).not.toHaveClass('toaster__container--toast')
  })


  it('should toast an alert if there is an error', () => {
    store = getMockStore({ 
      restaurant: { error: mockError }
    })
    const { queryByRole, queryByText } = renderWithStore(<Toaster />, store)
    
    expect(queryByRole('presentation')).toHaveClass('toaster__container--toast')
    expect(queryByRole('presentation')).toContainElement(queryByText(mockError.message))
  })


  it('should dismiss an error alert when the user click to do it', async () => { 
    const { rerender, queryByRole, queryByText } = renderWithStore(<Toaster />, store)
    
    fireEvent.click(queryByText(/fechar/i))

    expect(mockDismissError).toHaveBeenCalledTimes(1)

    store = getMockStore({ 
      restaurant: { error: null }
    })
    rerenderWithStore(rerender, <Toaster />, store)

    expect(queryByRole('presentation')).toContainElement(queryByText(mockError.message))
    expect(queryByRole('presentation')).not.toHaveClass('toaster__container--toast')

    await waitForElementToBeRemoved(() => queryByRole('alert'))
  })


  it('should toast an alert if there is a success message and dissmis it after 2s', async () => {
    const success = 'Produto adicionado!'
    store = getMockStore({ restaurant: { success }})
    const { queryByRole, queryByText } = renderWithStore(<Toaster />, store)
    
    expect(queryByRole('presentation')).toHaveClass('toaster__container--toast')
    expect(queryByRole('presentation')).toContainElement(queryByText(success))
    
    await waitFor(() => {
        expect(mockDismissSuccess).toHaveBeenCalledTimes(1)
      }, { timeout: 2500 })
  })

})