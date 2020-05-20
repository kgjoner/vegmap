import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import { restaurant } from './restaurant/reducer'
import { user } from './user/reducer'
import { mapReducer } from './map/reducer'
import { popup } from './popup/reducer'

const reducers = combineReducers({
  restaurant,
  user,
  map: mapReducer,
  popup
})

export const store = createStore(reducers, applyMiddleware(thunk))