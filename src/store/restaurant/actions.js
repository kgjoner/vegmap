import * as api from '../../services/api'
import { closePopup } from '../popup/actions'
import { notify } from '../notification/action'
import { notificationTypes } from '../../constants/systemTypes'
import { successMessages } from '../../constants/systemMessages'
import { connect, disconnect, subscribeToNewRestaurant, subscribeToUpdateRestaurant } from '../../services/socket'
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
  DENOUNCE_RESTAURANT_STARTED,
  DENOUNCE_RESTAURANT_SUCCESS,
  DENOUNCE_RESTAURANT_FAILURE
} from '../../constants/actionTypes'


export const getRestaurants = (payload) => {
  return (dispatch, getState) => {
    const location = getState().map.centerMapLocation
    if(!Object.keys(location).length) {
      return dispatch({ type: 'NO_TYPE' })
    }

    const params = payload || getState().restaurant.lastParams

    dispatch({
      type: GET_RESTAURANTS_STARTED
    })

    return api.getRestaurants({...params, ...location}).then(
      (data) => {
        dispatch({
          type: GET_RESTAURANTS_SUCCESS,
          payload: {
            data,
            params
          }
        })
        disconnect()
        connect({...params, ...location})
        subscribeToNewRestaurant(restaurant => {
          dispatch(addRestaurant({ restaurant, receivedViaSocket: true }))
        })
        subscribeToUpdateRestaurant(restaurant => {
          dispatch(updateRestaurant({ restaurant, receivedViaSocket: true }))
        })
      },
      (err) => {
        dispatch({ type: GET_RESTAURANTS_FAILURE })
        dispatch(notify(notificationTypes.ERROR, err.message, null, err.name))
      }
    )
  }
}


export const addRestaurant = ({ restaurant, user, receivedViaSocket }) => {
  if(receivedViaSocket) {
    return {
      type: ADD_RESTAURANT_SUCCESS,
      payload: {
        data: restaurant
      }
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
          payload: { data }
        })
        dispatch(closePopup())
        dispatch(changeSelectedRestaurant(null))
        dispatch(notify(notificationTypes.SUCCESS, successMessages.ADD_RESTAURANT))
      },
      (err) => {
        dispatch({ type: ADD_RESTAURANT_FAILURE })
        dispatch(notify(notificationTypes.ERROR, err.message, null, err.name))
      }
    )
  }
}


export const updateRestaurant = ({ restaurant, user, receivedViaSocket }) => {
  if(receivedViaSocket) {
    return {
      type: UPDATE_RESTAURANT_SUCCESS,
      payload: {
        data: restaurant
      }
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
          payload: {
            data
          }
        })
        dispatch(closePopup())
        dispatch(changeSelectedRestaurant(null))
        dispatch(notify(notificationTypes.SUCCESS, successMessages.UPDATE_RESTAURANT))
      },
      (err) => {
        dispatch({ type: UPDATE_RESTAURANT_FAILURE })
        dispatch(notify(notificationTypes.ERROR, err.message, null, err.name))
      }
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
      () => {
        dispatch({ type: DENOUNCE_RESTAURANT_SUCCESS })
        dispatch(notify(notificationTypes.SUCCESS, successMessages.DENUNCIATION))
      },
      err => {
        dispatch({ type: DENOUNCE_RESTAURANT_FAILURE })
        dispatch(notify(notificationTypes.ERROR, err.message, null, err.name))
      }
    )
  }
}

export const changeSelectedRestaurant = (payload) => {
  return {
    type: CHANGE_SELECTED_RESTAURANT,
    payload
  }
}