import axios from 'axios'
import { checkWhetherRestaurantInputDataExist } from '../utils/existOrError'

export const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 
    'http://localhost:3030' : 'https://vegmap-backend.herokuapp.com'
})


export const getRestaurants = (params) => {
  return new Promise((resolve, reject) => {
    api.get('/search', { params })
      .then(resp => resolve(resp.data))
      .catch(err => reject(err))
  })
}

export const saveRestaurant = ({ method, restaurant, user }) => {
  try {
    checkWhetherRestaurantInputDataExist(restaurant)
  } catch(err) {
    return Promise.reject(err)
  }
  
  const body = {
    ...restaurant, 
    author: user
  }
  return new Promise((resolve, reject) => {
    api[method]('/restaurants', body)
      .then(resp => resolve(resp.data))
      .catch(err => reject(err))
  })
}

export const manageRestaurantLikes = ({ restaurant, user, unlike }) => {
  const body = {
    username: restaurant.username,
    author: user,
    action: unlike ? 'unlike' : 'like'
  }
  return new Promise((resolve, reject) => {
    api.put('/restaurants', body)
      .then(resp => resolve(resp.data))
      .catch(err => reject(err))
  })
}