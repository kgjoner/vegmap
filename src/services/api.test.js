import * as api from './api'
import axios from 'axios'
import { errorNames } from '../constants/controlOptions'
import { errorMessages } from '../constants/presentation'
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
const submitMock = jest.spyOn(axios, 'post')
const expectedError = {
  name: errorNames.UNEXPECTED,
  message: mockError.message
}

describe('Api Calls', () => {

/* ========================================================================================
  Get Restaurants
  ========================================================================================= */ 

  describe('Get Restaurants', () => {
    it('should return an array of restaurants', () => {
      getMock.mockResolvedValue({
        data: mockRestaurants
      })
  
      return expect(api.getRestaurants(mockSearchParams)).resolves.toEqual(mockRestaurants)
    })

    it('should return the error message if data could not be gotten', () => {
      getMock.mockImplementation(() => new Promise(() => {
        throw mockError
      }))
  
      return expect(api.getRestaurants(mockSearchParams)).rejects.toEqual(expectedError)
    })
  })


/* ========================================================================================
  Save Restaurant
  ========================================================================================= */ 

  describe('Save Restaurant', () => {
    const payload = {
      method: 'post',
      restaurant: mockRestaurantInputData,
      user: mockUser
    }

    it('should format the payload to send it as the HTTP body and return the restaurant added', () => {
      postMock.mockResolvedValue({
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
  
      return expect(api.saveRestaurant(payload)).rejects.toEqual(expectedError)
    })
  })


/* ========================================================================================
  Manage Restaurant Likes
  ========================================================================================= */ 

  describe('Manage Restaurant Likes', () => {
    const payload = {
      restaurant: mockRestaurant,
      user: mockUser,
    }

    it('should format the payload to send it as the HTTP body and return the restaurant liked', () => {
      putMock.mockResolvedValue({
        data: mockRestaurantLiked
      })
      
      const expectedBody = {
        tagname: mockRestaurant.tagname,
        author: mockUser,
        action: 'like'
      }
  
      return api.manageRestaurantLikes(payload).then(data => {
        expect(putMock).toHaveBeenCalledWith('/restaurants', expectedBody)
        expect(data).toEqual(mockRestaurantLiked)
      })
    })


    it('should return the error message if restaurant could not be liked', () => {
      putMock.mockImplementation(() => new Promise(() => {
        throw mockError
      }))
  
      return expect(api.manageRestaurantLikes(payload)).rejects.toEqual(expectedError)
    })
  })


/* ========================================================================================
  Submit Form to Netlify
  ========================================================================================= */ 

  describe('Submit Form to Netlify', () => {
    const payload = {
      reason: 'restaurant does not exist',
      comment: 'test',
      restaurant: mockRestaurant,
      user: mockUser
    }

    it('should sent the message', () => {
      submitMock.mockResolvedValue(true)
  
      return expect(api.submitFormToNetlify(payload)).resolves.toEqual(true)
    })
    

    it('should return the error message if message could not be sent', () => {
      submitMock.mockImplementation(() => new Promise(() => {
        throw mockError
      }))
  
      return expect(api.submitFormToNetlify(payload)).rejects.toEqual(expectedError)
    })


    it('should return an error if no reason was passed as payload', () => {
      payload.reason = null
      const expectedError = {
        name: errorNames.EMPTY_FIELD.REASON,
        message: errorMessages.EMPTY_FIELD.REASON
      }

      return expect(api.submitFormToNetlify(payload)).rejects.toEqual(expectedError)
    })
  })

})