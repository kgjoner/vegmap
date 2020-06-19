import React from 'react';
import { renderWithStore } from '../../utils/testStore'
import configureStore from 'redux-mock-store'
import '@testing-library/jest-dom/extend-expect'

import AskForLogging from './AskForLogging'

const mockStore = configureStore([]);
const store = mockStore({})

//Correct the requirement for a parentNode in FacebookLogin
const fbScript = document.createElement('script')
fbScript.id = 'facebook-jssdk'
document.body.appendChild(fbScript)



describe('AskForLogging Component', () => {

  it('should render AskForLogging component', () => {
    const { getByTestId, getByRole } = renderWithStore(<AskForLogging />, store)
    const container = getByTestId('ask-for-logging')

    expect(container.children.length).toEqual(3)
    expect(container.children[1].textContent).toBeTruthy()
    expect(container).toContainElement(getByRole('button'))
  })
})