import * as api from '../../services/api'
import { closePopup } from '../popup/actions'
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
  DENOUNCE_RESTAURANT_STARTED,
  DENOUNCE_RESTAURANT_SUCCESS,
  DENOUNCE_RESTAURANT_FAILURE,
  DISMISS_RESTAURANT_SUCCESS
} from './actionTypes'


export const getRestaurants = (payload) => {
  return (dispatch) => {
    dispatch({
      type: GET_RESTAURANTS_STARTED
    })

    return api.getRestaurants(payload).then(
      (data) => dispatch({
        type: GET_RESTAURANTS_SUCCESS,
        payload: data
      }),
      (err) => dispatch({
        type: GET_RESTAURANTS_FAILURE,
        payload: err
      })
    )
  }
}

export const addRestaurant = ({ restaurant, user, receivedViaSocket }) => {
  if(receivedViaSocket) {
    return {
      type: ADD_RESTAURANT_SUCCESS,
      payload: restaurant
    }
  }
  
  return (dispatch) => {
    dispatch({
      type: ADD_RESTAURANT_STARTED
    })

    return api.saveRestaurant({ method: 'post', restaurant, user }).then(
      (data) => {
        dispatch({
          type: ADD_RESTAURANT_SUCCESS,
          payload: data
        })
        dispatch(closePopup())
        dispatch(changeSelectedRestaurant(null))
      },
      (err) => dispatch({
        type: ADD_RESTAURANT_FAILURE,
        payload: err
      })
    )
  }
}

export const updateRestaurant = ({ restaurant, user, receivedViaSocket }) => {
  if(receivedViaSocket) {
    return {
      type: UPDATE_RESTAURANT_SUCCESS,
      payload: restaurant
    }
  }

  return (dispatch) => {
    dispatch({
      type: UPDATE_RESTAURANT_STARTED
    })

    return api.saveRestaurant({ method: 'put', restaurant, user }).then(
      (data) => {
        dispatch({
          type: UPDATE_RESTAURANT_SUCCESS,
          payload: data
        })
        dispatch(closePopup())
        dispatch(changeSelectedRestaurant(null))
      },
      (err) => dispatch({
        type: UPDATE_RESTAURANT_FAILURE,
        payload: err
      })
    )
  }
}

export const toggleRestaurantLike = ({ restaurant, user }) => {
  const payloadOfIDs = {
    restaurantID: restaurant._id,
    userID: user.userID
  }
  const shouldUnlike = restaurant.likes.includes(user.userID)

  return (dispatch) => {
    dispatch({ type: LIKING_STARTED })
    dispatch({
      type: shouldUnlike ? REMOVE_LIKE : ADD_LIKE,
      payload: payloadOfIDs
    })

    return api.manageRestaurantLikes({ restaurant, user, unlike: shouldUnlike }).then(
      null,
      () => dispatch({
        type: shouldUnlike ? ADD_LIKE : REMOVE_LIKE,
        payload: payloadOfIDs
      }))
      .finally(() => dispatch({ type: LIKING_FINISHED }))
  }
}

export const denounceRestaurant = (payload) => {
  return (dispatch) => {
    dispatch({ type: DENOUNCE_RESTAURANT_STARTED })

    return api.submitFormToNetlify(payload).then(
      () => dispatch({ type: DENOUNCE_RESTAURANT_SUCCESS }),
      err => dispatch({
        type: DENOUNCE_RESTAURANT_FAILURE,
        payload: err
      })
    )
  }
}

export const changeSelectedRestaurant = (payload) => {
  return {
    type: CHANGE_SELECTED_RESTAURANT,
    payload
  }
}

export const dismissRestaurantError = () => {
  return { type: DISMISS_RESTAURANT_ERROR }
}

export const dismissRestaurantSuccess = () => {
  return { type: DISMISS_RESTAURANT_SUCCESS }
}