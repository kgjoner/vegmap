
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as api  from '../../services/api'
import runActionsOnReducer from '../../utils/runActions'
import {
  GET_RESTAURANTS_STARTED, 
  GET_RESTAURANTS_SUCCESS, 
  GET_RESTAURANTS_FAILURE,
  ADD_RESTAURANT_STARTED, 
  ADD_RESTAURANT_SUCCESS, 
  ADD_RESTAURANT_FAILURE,
  UPDATE_RESTAURANT_STARTED,
  UPDATE_RESTAURANT_SUCCESS,
  UPDATE_RESTAURANT_FAILURE,
  ADD_LIKE, 
  REMOVE_LIKE, 
  CHANGE_SELECTED_RESTAURANT
} from './actionTypes'
import * as actions from './actions'
import { initialState, restaurant } from './reducer'
import { 
  mockRestaurant,
  mockRestaurantLiked, 
  mockRestaurants,
  mockError,
  mockUser,
  mockRestaurantInputData
} from '../../mocks'


const mockStore = configureMockStore([thunk])
const getMock = jest.spyOn(api, 'getRestaurants')
const saveMock = jest.spyOn(api, 'saveRestaurant')
const likeMock = jest.spyOn(api, 'incrementRestaurantLikes')



describe('Restaurant Store', () => {

  it('should return the initial state', () => {
    expect(restaurant(undefined, {})).toEqual(initialState)
  })

  let store;


/* ========================================================================================
  Get Restaurants
  ========================================================================================= */ 

  describe('Get Restaurants', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      store = mockStore(initialState)
    })

    it('should dispatch the action to announce it started getting the restaurants', () => {
      getMock.mockResolvedValue()
      const expectedActions = [
        { type: GET_RESTAURANTS_STARTED }
      ]

      store.dispatch(actions.getRestaurants())
      expect(store.getActions()).toEqual(expectedActions)  
    })

  
    it('should make an api call and then set the restaurants', () => {
      getMock.mockResolvedValueOnce(mockRestaurants)
      const expectedActions = [
        { type: GET_RESTAURANTS_STARTED },
        {
          type: GET_RESTAURANTS_SUCCESS,
          payload: mockRestaurants
        }
      ]
      const expectedState = {
        ...initialState,
        restaurants: [...mockRestaurants]
      }

      return store.dispatch(actions.getRestaurants()).then(() => {
        expect(getMock).toHaveBeenCalledTimes(1)
        expect(store.getActions()).toEqual(expectedActions)
        const state = runActionsOnReducer(store.getActions(), restaurant)
        expect(state).toEqual(expectedState)
      })
    })


    it('should set the error if restaurants could not be gotten via api', () => {
      getMock.mockRejectedValueOnce(mockError)
      const expectedActions = [
        { type: GET_RESTAURANTS_STARTED },
        {
          type: GET_RESTAURANTS_FAILURE,
          payload: mockError
        }
      ]
      const expectedState = {
        ...initialState,
        error: mockError
      }
  
      return store.dispatch(actions.getRestaurants()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
        const state = runActionsOnReducer(store.getActions(), restaurant)
        expect(state).toEqual(expectedState)  
      })
    })

  })


/* ========================================================================================
  Add Restaurant
  ========================================================================================= */ 

  describe('Add Restaurant', () => {
    const payload = {
      restaurant: mockRestaurantInputData,
      user: mockUser
    }

    beforeEach(() => {
      jest.clearAllMocks();
      store = mockStore(initialState)
    })

    it('should dispatch the action to announce it is adding a restaurant', () => {
      saveMock.mockResolvedValue()
      const expectedActions = [
        { type: ADD_RESTAURANT_STARTED }
      ]

      store.dispatch(actions.addRestaurant(payload))
      expect(store.getActions()).toEqual(expectedActions)
    })

  
    it('should make an api call and then add the restaurant', () => {
      saveMock.mockResolvedValue(mockRestaurant)
      const expectedAction = {
        type: ADD_RESTAURANT_SUCCESS,
        payload: mockRestaurant
      }
      const expectedState = {
        ...initialState,
        restaurants: [mockRestaurant]
      }

      return store.dispatch(actions.addRestaurant(payload)).then(() => {
        expect(saveMock).toHaveBeenCalledTimes(1)
        expect(store.getActions()).toContainEqual(expectedAction)
        const state = runActionsOnReducer(store.getActions(), restaurant)
        expect(state).toEqual(expectedState)
      })
    })


    it('should set the error if the restaurant could not be added via api', () => {
      saveMock.mockRejectedValue(mockError)
      const expectedAction = {
        type: ADD_RESTAURANT_FAILURE,
        payload: mockError
      }
      const expectedState = {
        ...initialState,
        error: mockError
      }
  
      return store.dispatch(actions.addRestaurant(payload)).then(() => {
        expect(saveMock).toHaveBeenCalledTimes(1)
        expect(store.getActions()).toContainEqual(expectedAction)
        const state = runActionsOnReducer(store.getActions(), restaurant)
        expect(state).toEqual(expectedState)
      })
    })

    it('should add the restaurant ignoring the api call if data was received via socket', () => {
      const payloadViaSocket = {
        receivedViaSocket: true,
        restaurant: mockRestaurant,
        user: mockUser
      }
      const expectedAction = {
        type: ADD_RESTAURANT_SUCCESS,
        payload: mockRestaurant
      }
      
      expect(actions.addRestaurant(payloadViaSocket)).toEqual(expectedAction)
      expect(saveMock).not.toHaveBeenCalled() 
    })
  })


/* ========================================================================================
  Update Restaurant
  ========================================================================================= */ 

  describe('Update Restaurant', () => {
    const modifiedMockRestaurant = {
      ...mockRestaurant,
      name: 'Il Sorveteria',
      foods: [
        'sorvete',
        'açaí',
        'bolo'
      ]
    }
    const payload = {
      restaurant: {
        ...mockRestaurantInputData,
        name: 'Il Sorveteria',
        foods: [
          'sorvete',
          'açaí',
          'bolo'
        ],
        username: mockRestaurant.username
      },
      user: mockUser
    }

    beforeEach(() => {
      jest.clearAllMocks();
      store = mockStore({
        ...initialState,
        restaurants: [...mockRestaurants, mockRestaurant]
      })
    })

    it('should dispatch the action to announce it is updating a restaurant', () => {
      saveMock.mockResolvedValue()
      const expectedActions = [
        { type: UPDATE_RESTAURANT_STARTED }
      ]

      store.dispatch(actions.updateRestaurant(payload))
      expect(store.getActions()).toEqual(expectedActions)  
    })

  
    it('should maken an api call and then update the restaurant', () => {
      saveMock.mockResolvedValue(modifiedMockRestaurant)
      const expectedAction = {
        type: UPDATE_RESTAURANT_SUCCESS,
        payload: modifiedMockRestaurant
      }
      const expectedState = {
        ...initialState,
        restaurants: [...mockRestaurants, modifiedMockRestaurant]
      }

      return store.dispatch(actions.updateRestaurant(payload)).then(() => {
        expect(saveMock).toHaveBeenCalledTimes(1)
        expect(store.getActions()).toContainEqual(expectedAction)
        const state = runActionsOnReducer(store.getActions(), restaurant, store.getState())
        expect(state).toEqual(expectedState)
      })
    })


    it('should set the error if the restaurant could not be updated', () => {
      saveMock.mockRejectedValue(mockError)
      const expectedAction = {
        type: UPDATE_RESTAURANT_FAILURE,
        payload: mockError
      }
      const expectedState = {
        ...store.getState(),
        error: mockError
      }
  
      return store.dispatch(actions.updateRestaurant(payload)).then(() => {
        expect(store.getActions()).toContainEqual(expectedAction)
        const state = runActionsOnReducer(store.getActions(), restaurant, store.getState())
        expect(state).toEqual(expectedState)  
      })
    })


    it('should update the restaurant ignoring the api call if data was received via socket', () => {
      const payloadViaSocket = {
        receivedViaSocket: true,
        restaurant: modifiedMockRestaurant,
        user: mockUser
      }
      const expectedAction = {
        type: UPDATE_RESTAURANT_SUCCESS,
        payload: modifiedMockRestaurant
      }
      
      expect(actions.updateRestaurant(payloadViaSocket)).toEqual(expectedAction)
      expect(saveMock).not.toHaveBeenCalled() 
    })
  })


/* ========================================================================================
  Like Restaurant
  ========================================================================================= */ 

  describe('Like Restaurant', () => {
    let payload, actionPayload
    beforeEach(() => {
      store = mockStore({
        ...initialState,
        restaurants: [mockRestaurant]
      })
      payload = {
        restaurant: mockRestaurant,
        user: mockUser
      }
      actionPayload = {
        restaurantID: mockRestaurant._id,
        userID: mockUser.userID
      }
    })

    it('should increment the restaurant likes', () => {
      likeMock.mockResolvedValueOnce(true)
      const expectedActions = [
        {
          type: ADD_LIKE,
          payload: actionPayload
        }
      ]
      const expectedState = {
        ...initialState,
        restaurants: [mockRestaurantLiked]
      }

      return store.dispatch(actions.likeRestaurant(payload)).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
        const state = runActionsOnReducer(store.getActions(), restaurant, store.getState())
        expect(state).toEqual(expectedState)  
      })
    })


    it('should take the like back if the api return an error', () => {
      likeMock.mockRejectedValueOnce(mockError)
      const expectedActions = [
        {
          type: ADD_LIKE,
          payload: actionPayload
        }, {
          type: REMOVE_LIKE,
          payload: actionPayload
        }
      ]
      const expectedState = {
        ...initialState,
        restaurants: [mockRestaurant]
      }
  
      return store.dispatch(actions.likeRestaurant(payload)).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
        const state = runActionsOnReducer(store.getActions(), restaurant, store.getState())
        expect(state).toEqual(expectedState)
      })
    })
  })


/* ========================================================================================
  Select a Restaurant
  ========================================================================================= */ 

  describe('Select a Restaurant', () => {
    const payload = mockRestaurant

    it('should create an action to change the selected restaurant', () => {
      const expectedAction = {
        type: CHANGE_SELECTED_RESTAURANT,
        payload
      }
      expect(actions.changeSelectedRestaurant(payload)).toEqual(expectedAction)
    })


    it('should change the selected restaurant', () => {
      const action = {
        type: CHANGE_SELECTED_RESTAURANT,
        payload
      }
      const expectedState = {
        ...initialState,
        selectedRestaurant: mockRestaurant
      }
      expect(restaurant(undefined, action)).toEqual(expectedState)
    })
  })
})
