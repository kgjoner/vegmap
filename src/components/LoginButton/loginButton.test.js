import React from 'react';
import { Provider } from 'react-redux'
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store'
import '@testing-library/jest-dom/extend-expect'

import LoginButton from './LoginButton'

const mockStore = configureStore([]);
const store = mockStore({})

//Correct the requirement for a parentNode in FacebookLogin
const fbScript = document.createElement('script')
fbScript.id = 'facebook-jssdk'
document.body.appendChild(fbScript)


describe('LoginButton Component', () => {

  it('should render LoginButton component', () => {
    const { getByTestId, getByRole } = render(
      <Provider store={store}>
        <LoginButton />
      </Provider>
    )
    const container = getByTestId('login-btn')
    
    expect(container).toBeTruthy()
    expect(container).toContainElement(getByRole('button'))
  })
})