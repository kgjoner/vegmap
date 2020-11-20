import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import { restaurant } from './restaurant/reducer'
import { user } from './user/reducer'
import { mapReducer } from './map/reducer'
import { notification } from './notification/reducer'
import { popup } from './popup/reducer'
import { system } from './system/reducer'

export const reducers = combineReducers({
  restaurant,
  user,
  map: mapReducer,
  notification,
  popup,
  system,
})

export const store = createStore(reducers, applyMiddleware(thunk))