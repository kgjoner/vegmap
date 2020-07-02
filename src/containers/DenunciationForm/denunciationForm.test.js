import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react'
import { getMockStore, renderWithStore, rerenderWithStore } from '../../utils/testStore'
import * as popupActions from '../../store/popup/actions'
import * as restaurantActions from '../../store/restaurant/actions'
import { denunciationReasons } from '../../constants/presentation'
import { mockError, mockUser, mockRestaurant } from '../../mocks'
import '@testing-library/jest-dom/extend-expect'

import DenunciationForm from './DenunciationForm'


let store = getMockStore()
const mockDenounce = jest.spyOn(restaurantActions, 'denounceRestaurant')
const mockClose = jest.spyOn(popupActions, 'closePopup')

describe('DenunciationForm Component', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })


  it('should render DenunciationForm component', () => {
    const { queryByLabelText, queryByText } = renderWithStore(<DenunciationForm />, store)
    
    expect(queryByLabelText(/motivo/i)).toBeTruthy()
    expect(queryByLabelText(/motivo/i).children.length).toBe(denunciationReasons.length + 1)
    expect(queryByLabelText(/comentário/i)).toBeTruthy()
    expect(queryByText(/confirmar/i)).toBeTruthy()
    expect(queryByText(/ok/i)).toBeNull()
  })


  it('should change the input fields and dispatch the denounce action', () => {
    store = getMockStore({
      user: { user: mockUser },
      restaurant: { selectedRestaurant: mockRestaurant }
    })
    const { queryByLabelText, queryByText } = renderWithStore(<DenunciationForm />, store)

    const select = queryByLabelText(/motivo/i)
    const textarea = queryByLabelText(/comentário/i)

    const reason = denunciationReasons[0]
    const comment = 'Comentário de exemplo'
    fireEvent.change(select, {target: { value: reason }})
    fireEvent.change(textarea, {target: { value: comment }})

    expect(select).toHaveValue(reason)
    expect(textarea).toHaveValue(comment)

    fireEvent.click(queryByText(/confirmar/i))

    expect(mockDenounce).toHaveBeenCalledWith({ 
      reason,
      comment,
      user: mockUser, 
      restaurant: mockRestaurant
    })
  })


  it('should present the "done" message if form is sent and no error appears', () => {
    const { queryByText, queryByLabelText } = renderWithStore(<DenunciationForm />, store)
    fireEvent.click(queryByText(/confirmar/i))

    expect(queryByText(/ok/i)).toBeTruthy()
    expect(queryByLabelText(/motivo/i)).toBeNull()
    expect(queryByLabelText(/comentário/i)).toBeNull()
    expect(queryByText(/confirmar/i)).toBeNull()
  })


  it('should not present the "done" message if form is sent and an error appears, event after it is dismissed', () => {
    const { queryByText, queryByLabelText, rerender } = renderWithStore(<DenunciationForm />, store)
    fireEvent.click(queryByText(/confirmar/i))

    store = getMockStore({
      restaurant: { error: mockError }
    })
    rerenderWithStore(rerender, <DenunciationForm />, store)

    expect(queryByText(/ok/i)).toBeNull()
    expect(queryByLabelText(/motivo/i)).toBeTruthy()
    expect(queryByLabelText(/comentário/i)).toBeTruthy()
    expect(queryByText(/confirmar/i)).toBeTruthy()

    store = getMockStore()
    rerenderWithStore(rerender, <DenunciationForm />, store)

    expect(queryByText(/ok/i)).toBeNull()
    expect(queryByLabelText(/motivo/i)).toBeTruthy()
    expect(queryByLabelText(/comentário/i)).toBeTruthy()
    expect(queryByText(/confirmar/i)).toBeTruthy()
  })


  it('should dispatch close popup action when clicked on "ok" after form being sent', () => {
    const { queryByText } = renderWithStore(<DenunciationForm />, store)
    fireEvent.click(queryByText(/confirmar/i))
    fireEvent.click(queryByText(/ok/i))

    expect(mockClose).toHaveBeenCalledTimes(1)
  })

})