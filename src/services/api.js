import axios from 'axios'
import { checkWhetherRestaurantInputDataExist } from '../utils/existOrError'
import { baseApiUrls, errorNames } from '../constants/systemTypes'
import { errorMessages } from '../constants/systemMessages'

export const api = axios.create({
  baseURL: navigator.serviceWorker.controller
    ? baseApiUrls.WITH_SW
    : baseApiUrls.NO_SW
})


export const getRestaurants = (params) => {
  return new Promise((resolve, reject) => {
    api.get('/search', { params })
      .then(resp => resolve(resp.data))
      .catch(err => reject(handleAxiosError(err)))
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
      .catch(err => reject(handleAxiosError(err)))
  })
}


export const manageRestaurantLikes = ({ restaurant, user, unlike }) => {
  const body = {
    tagname: restaurant.tagname,
    author: user,
    action: unlike ? 'unlike' : 'like'
  }
  return new Promise((resolve, reject) => {
    api.put('/restaurants', body)
      .then(resp => resolve(resp.data))
      .catch(err => reject(handleAxiosError(err)))
  })
}


export const submitFormToNetlify = ({reason, comment, restaurant, user}) => {
  if(!reason) {
    return Promise.reject({
      name: errorNames.EMPTY_FIELD.REASON, 
      message: errorMessages.EMPTY_FIELD.REASON
    })
  }
  
  return new Promise((resolve, reject) => {
    const axiosConfig = {
      header: { "Content-Type": "application/x-www-form-urlencoded" }
    }
    axios.post("/", encode({
        "form-name": "denounce",
        reason,
        restaurant: `nome: ${restaurant.name}, tag: ${restaurant.tagname}`,
        user: `nome: ${user.name}, email: ${user.email}, id: ${user.userID}`,
        comment,
        }),
        axiosConfig)
      .then(resp => resolve(resp))
      .catch(err => reject(handleAxiosError(err)))
  })
  
  function encode(data) {
    return Object.keys(data).map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
    }).join("&");
  }
}

const handleAxiosError = (err) => {
  if(err.response) {
    const { status, data } = err.response
    return { 
      name: errorNames.RESPONSE, 
      message: data, 
      status 
    }
  } else if(err.request) {
    return { 
      name: errorNames.REQUEST, 
      message: err.message 
    }
  } else {
    return { 
      name: errorNames.UNEXPECTED, 
      message: err.message 
    }
  }
}