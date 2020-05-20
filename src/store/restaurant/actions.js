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
  ADD_LIKE, 
  REMOVE_LIKE, 
  CHANGE_SELECTED_RESTAURANT
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

export const likeRestaurant = ({ restaurant, user }) => {
  const payloadOfIDs = {
    restaurantID: restaurant._id,
    userID: user.userID
  }

  return (dispatch) => {
    dispatch({
      type: ADD_LIKE,
      payload: payloadOfIDs
    })

    return api.incrementRestaurantLikes({ restaurant, user }).then(
      null,
      () => dispatch({
        type: REMOVE_LIKE,
        payload: payloadOfIDs
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