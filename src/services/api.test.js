import * as api from './api'
import {
  mockRestaurantInputData,
  mockRestaurant,
  mockRestaurantLiked,
  mockRestaurants,
  mockError,
  mockSearchParams,
  mockUser,
} from '../mocks'

const getMock = jest.spyOn(api.api, 'get')
const postMock = jest.spyOn(api.api, 'post')
const putMock = jest.spyOn(api.api, 'put')

describe('Api Calls', () => {

  describe('Get Restaurants', () => {
    it('should return an array of restaurants', () => {
      getMock.mockResolvedValueOnce({
        data: mockRestaurants
      })
  
      return expect(api.getRestaurants(mockSearchParams)).resolves.toEqual(mockRestaurants)
    })

    it('should return the error message if data could not be gotten', () => {
      getMock.mockImplementation(() => new Promise(() => {
        throw mockError
      }))
  
      return expect(api.getRestaurants(mockSearchParams)).rejects.toEqual(mockError)
    })
  })


  describe('Save Restaurant', () => {
    const payload = {
      method: 'post',
      restaurant: mockRestaurantInputData,
      user: mockUser
    }

    it('should format the payload to send it as the HTTP body and return the restaurant added', () => {
      postMock.mockResolvedValueOnce({
        data: mockRestaurant
      })
      
      const expectedBody = {
        ...mockRestaurantInputData,
        author: mockUser
      }
  
      return api.saveRestaurant(payload).then(data => {
        expect(postMock).toHaveBeenCalledWith('/restaurants', expectedBody)
        expect(data).toEqual(mockRestaurant)
      })
    })


    it('should return the error message if restaurant could not be added', () => {
      postMock.mockImplementation(() => new Promise(() => {
        throw mockError
      }))
  
      return expect(api.saveRestaurant(payload)).rejects.toEqual(mockError)
    })
  })


  describe('Increment Restaurant Likes', () => {
    const payload = {
      restaurant: mockRestaurant,
      user: mockUser
    }

    it('should format the payload to send it as the HTTP body and return the restaurant liked', () => {
      putMock.mockResolvedValueOnce({
        data: mockRestaurantLiked
      })
      
      const expectedBody = {
        username: mockRestaurant.username,
        author: mockUser,
        action: 'like'
      }
  
      return api.incrementRestaurantLikes(payload).then(data => {
        expect(putMock).toHaveBeenCalledWith('/restaurants', expectedBody)
        expect(data).toEqual(mockRestaurantLiked)
      })
    })


    it('should return the error message if restaurant could not be liked', () => {
      putMock.mockImplementation(() => new Promise(() => {
        throw mockError
      }))
  
      return expect(api.incrementRestaurantLikes(payload)).rejects.toEqual(mockError)
    })
  })

})