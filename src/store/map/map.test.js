import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import runActionsOnReducer from '../../utils/runActions'
import {
  SET_CENTER_MAP_LOCATION,
  SET_PIN_LOCATION,
  CHANGE_MAP_MODE,
  GET_USER_LOCATION_STARTED,
  GET_USER_LOCATION_SUCCESS,
  GET_USER_LOCATION_FAILURE,
  mapModes,
  DISMISS_MAP_ERROR
} from './actionTypes'
import * as actions from './actions'
import { initialState, mapReducer } from './reducer'
import { mockCoords, mockError } from '../../mocks'

const mockStore = configureMockStore([thunk])
const mockGeolocation = {
  getCurrentPosition: jest.fn()
    .mockImplementation(success => Promise.resolve(success({
      coords: mockCoords
    })))
}
global.navigator.geolocation = mockGeolocation;


describe('Map Store', () => {

  it('should return the initial state', () => {
    expect(mapReducer(undefined, {})).toEqual(initialState)
  })


/* ========================================================================================
  Set Center Map Location
  ========================================================================================= */ 

  it('should create an action to set the center map location', () => {
    const payload = mockCoords
    const expectedAction = {
      type: SET_CENTER_MAP_LOCATION,
      payload
    }

    expect(actions.setCenterMapLocation(payload)).toEqual(expectedAction)
  })

  it('should set the center map location', () => {
    const action = {
      type: SET_CENTER_MAP_LOCATION,
      payload: mockCoords
    }
    const expectedLocation = mockCoords
    
    expect(mapReducer(undefined, action).centerMapLocation).toEqual(expectedLocation)
  })


/* ========================================================================================
  Set Pin Location
  ========================================================================================= */

  it('should create an action to set the pin location', () => {
    const payload = mockCoords
    const expectedAction = {
      type: SET_PIN_LOCATION,
      payload
    }

    expect(actions.setPinLocation(payload)).toEqual(expectedAction)
  })

  it('should set the pin location', () => {
    const action = {
      type: SET_PIN_LOCATION,
      payload: mockCoords
    }
    const expectedLocation = mockCoords
    
    expect(mapReducer(undefined, action).pinLocation).toEqual(expectedLocation)
  })


/* ========================================================================================
  Change Map Mode
  ========================================================================================= */

  it('should create an action to change the map mode', () => {
    const payload = mapModes.RESTAURANTS
    const expectedAction = {
      type: CHANGE_MAP_MODE,
      payload
    }

    expect(actions.changeMapMode(payload)).toEqual(expectedAction)
  })

  it('should change the map mode', () => {
    const action = {
      type: CHANGE_MAP_MODE,
      payload: mapModes.RESTAURANTS
    }
    const expectedMode = mapModes.RESTAURANTS
    
    expect(mapReducer(undefined, action).mapMode).toEqual(expectedMode)
  })

let store;


/* ========================================================================================
  Get User Location
  ========================================================================================= */ 

  describe('Get User Location', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      store = mockStore(initialState)
    })

    it('should dispatch the action to announce it started getting the user location', () => {
      const expectedAction = { type: GET_USER_LOCATION_STARTED }

      store.dispatch(actions.getUserLocation())
      expect(store.getActions()).toContainEqual(expectedAction)  
    })


    it('should call getCurrentPosition and then set the center map location', () => {
      const expectedAction = { 
        type: GET_USER_LOCATION_SUCCESS,
        payload: mockCoords
      }

      const expectedState = {
        ...initialState,
        centerMapLocation: mockCoords
      }

      store.dispatch(actions.getUserLocation()).then(() => {
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1)
        expect(store.getActions()).toContainEqual(expectedAction)
        const state = runActionsOnReducer(store.getActions(), mapReducer)
        expect(state).toEqual(expectedState)
      })
    })


    it('should set the error if user location could not be gotten', () => {
      mockGeolocation.getCurrentPosition = jest.fn()
        .mockImplementation((success, failure) => Promise.reject(failure(mockError)))

      const expectedAction = { 
        type: GET_USER_LOCATION_FAILURE,
        payload: mockError
      }

      const expectedState = {
        ...initialState,
        error: mockError
      }

      store.dispatch(actions.getUserLocation()).then(() => {
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1)
        expect(store.getActions()).toContainEqual(expectedAction)
        const state = runActionsOnReducer(store.getActions(), mapReducer)
        expect(state).toEqual(expectedState)
      })
    })
  })


/* ========================================================================================
  Dismiss Map Error
  ========================================================================================= */ 

  describe('Dismiss Map Error', () => {

    it('should create an action to dismiss the map error', () => {
      const expectedAction = { type: DISMISS_MAP_ERROR }

      expect(actions.dismissMapError()).toEqual(expectedAction)
    })


    it('should dismiss the error', () => {
      const errorState = {
        ...initialState,
        error: mockError
      }
      const action = { type: DISMISS_MAP_ERROR }

      expect(mapReducer(errorState, action)).toEqual(initialState)
    })
  })
})