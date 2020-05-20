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
  LIKING_STARTED,
  ADD_LIKE, 
  REMOVE_LIKE, 
  LIKING_FINISHED,
  CHANGE_SELECTED_RESTAURANT,
  DISMISS_RESTAURANT_ERROR,
} from './actionTypes'


export const initialState = {
  restaurants: [],
  selectedRestaurant: {},
  getting: false,
  saving: false,
  liking: false,
  error: null
}

export const restaurant = (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case GET_RESTAURANTS_STARTED:
      return Object.assign({}, state, {
        getting: true,
        error: null
      })
    case GET_RESTAURANTS_SUCCESS:
      return Object.assign({}, state, {
        restaurants: [...payload],
        getting: false
      })
    case GET_RESTAURANTS_FAILURE:
      return Object.assign({}, state, {
        error: payload,
        getting: false
      })

    case ADD_RESTAURANT_STARTED:
    case UPDATE_RESTAURANT_STARTED:
      return Object.assign({}, state, {
        saving: true,
        error: null
      })
    case ADD_RESTAURANT_SUCCESS:
      return Object.assign({}, state, {
        restaurants: [
          ...state.restaurants,
          payload
        ],
        saving: false
      })
    case ADD_RESTAURANT_FAILURE:
    case UPDATE_RESTAURANT_FAILURE:
      return Object.assign({}, state, {
        saving: false,
        error: payload
      })

    case UPDATE_RESTAURANT_SUCCESS:
      return Object.assign({}, state, {
        restaurants: state.restaurants.map(restaurant => {
          if(restaurant._id === payload._id) {
            return payload
          }
          return restaurant
        }),
        saving: false
      })

    case LIKING_STARTED:
      return Object.assign({}, state, {
        liking: true
      })
    case ADD_LIKE: {
      const { restaurantID, userID } = payload
      return Object.assign({}, state, {
        restaurants: state.restaurants.map(restaurant => {
          if(restaurant._id === restaurantID) {
            return Object.assign({}, restaurant, {
              likes: [
                ...restaurant.likes,
                userID
              ]
            })
          }
          return restaurant
        })
      })
    }
    case REMOVE_LIKE: {
      let { restaurantID, userID } = payload
      return Object.assign({}, state, {
        restaurants: state.restaurants.map(restaurant => {
          if(restaurant._id === restaurantID) {
            return Object.assign({}, restaurant, {
              likes: restaurant.likes.filter(id => id !== userID)
            })
          }
          return restaurant
        })
      }) 
    }
    case LIKING_FINISHED:
      return Object.assign({}, state, {
        liking: false
      })

    case CHANGE_SELECTED_RESTAURANT:
      return Object.assign({}, state, {
        selectedRestaurant: {...payload}
      })

    case DISMISS_RESTAURANT_ERROR:
      return Object.assign({}, state, {
        error: initialState.error
      })

    default:
      return state
  }
}
