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


export const submitFormToNetlify = ({reason, comment, restaurant, user}) => {
  if(!reason) {
    return Promise.reject({name: 'reason', message: 'Informe o motivo.'})
  }
  
  return new Promise((resolve, reject) => {
    const axiosConfig = {
      header: { "Content-Type": "application/x-www-form-urlencoded" }
    }
    axios.post("/", encode({
        "form-name": "denounce",
        reason,
        restaurant: `nome: ${restaurant.name}, tag: ${restaurant.username}`,
        user: `nome: ${user.name}, email: ${user.email}, id: ${user.userID}`,
        comment,
        }),
        axiosConfig)
      .then(resp => {
        console.log(resp)
        resolve(resp)
      })
      .catch(err => reject(err))
  })
  
  function encode(data) {
    return Object.keys(data).map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
    }).join("&");
  }
}