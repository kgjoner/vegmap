import React from 'react';
import { cleanup } from '@testing-library/react'
import { renderWithStore, getMockStore } from '../../utils/testStore'
import '@testing-library/jest-dom/extend-expect'

import SignupBox from './SignupBox'


let store = getMockStore()


describe('SignupBox Component', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render SignupBox component', () => {
    const { queryByText, queryByLabelText, queryAllByRole } = renderWithStore(<SignupBox />, store)
    
    expect(queryByText(/cadastro/i)).toBeTruthy()
    expect(queryByLabelText(/nome/i)).toBeTruthy()
    expect(queryByLabelText(/tipo/i)).toBeTruthy()
    expect(queryAllByRole('checkbox')).toBeTruthy()
    expect(queryByLabelText(/comidas/i)).toBeTruthy()
    expect(queryByLabelText(/endereço/i)).toBeTruthy()
    expect(queryByLabelText(/latitude/i)).toBeTruthy()
    expect(queryByLabelText(/longitude/i)).toBeTruthy()
    expect(queryByText(/mapa/i)).toBeTruthy()
    expect(queryByLabelText(/site/i)).toBeTruthy()
    expect(queryByLabelText(/facebook/i)).toBeTruthy()
    expect(queryByLabelText(/instagram/i)).toBeTruthy()
    expect(queryByText(/confirmar/i)).toBeTruthy()
    expect(queryByRole('alert')).toHaveClass('notification--hidden')
  })

})