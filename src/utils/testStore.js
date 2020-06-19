import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react';
import { mockInitialState } from '../mocks'

const mockStore = configureStore([thunk]);


export function getMockStore(getState = {}) {
  if(typeof getState === 'function') {
    return mockStore(getState)
  } else {
    const { restaurant = {}, map = {}, user = {}, popup = {} } = getState
    return mockStore({
      restaurant: {
        ...mockInitialState.restaurant,
        ...restaurant
      },
      map: {
        ...mockInitialState.map,
        ...map
      },
      user: {
        ...mockInitialState.user,
        ...user
      },
      popup: {
        ...mockInitialState.popup,
        ...popup
      },
    })
  }  
}

export function runActionsOnReducer(actions, reducer, state) {
  actions.forEach(action => {
    state = reducer(state, action)
  })
  return state
}

export function renderWithStore(component, store) {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  )
}

export function rerenderWithStore(rerender, component, store) {
  return rerender(
    <Provider store={store}>
      {component}
    </Provider>
  )
}