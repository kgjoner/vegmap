import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react'
import { renderWithStore, getMockStore } from '../../utils/testStore'
import * as restaurantActions from '../../store/restaurant/actions'
import * as popupActions from '../../store/popup/actions'
import {
  mockRestaurant,
  mockUser
} from '../../mocks'
import '@testing-library/jest-dom/extend-expect'

import RestaurantCard from './RestaurantCard'


let store = getMockStore()
const toggleRestaurantLike = jest.spyOn(restaurantActions, 'toggleRestaurantLike')
const changeSelectedRestaurant = jest.spyOn(restaurantActions, 'changeSelectedRestaurant')
const openPopup  = jest.spyOn(popupActions, 'openPopup')


describe('RestaurantCard Component', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render RestaurantCard component', () => {
    const { queryAllByRole, queryByRole, queryByText } = renderWithStore(<RestaurantCard restaurant={mockRestaurant}/>, store)
    const container = queryAllByRole('listitem')[0]
    const expectedFlags = Object.values(mockRestaurant.option)
      .reduce((flags, opt) => opt ? flags + 1 : flags, 0)
    const expectedLinks = [
      !!mockRestaurant.website, 
      !!mockRestaurant.facebookUsername, 
      !!mockRestaurant.instagramUsername
    ].reduce((links, link) => link ? links + 1 : links, 0)
    const expectedFoods = mockRestaurant.foods.slice(0, 3).join(', ')

    expect(container).toHaveClass(mockRestaurant.type)
    expect(queryByText(mockRestaurant.name)).toBeTruthy()
    expect(queryByRole('figure')).toBeTruthy()
    expect(queryByText(expectedFoods)).toBeTruthy()
    expect(queryAllByRole('listitem').length).toBe(expectedFlags + 1)
    expect(queryByRole('menu')).toBeNull()
    expect(queryAllByRole('button').length).toEqual(2)
    expect(queryAllByRole('link').length).toBe(expectedLinks)
    expect(queryByText(mockRestaurant.likes.length.toString())).toBeTruthy()
    expect(queryByText(mockRestaurant.address)).toBeTruthy()
    expect(queryByText(/copiar/i)).toBeTruthy()
  })


  it('should display the official image if there is an pictureURL', () => {
    const prop = {
      ...mockRestaurant,
      pictureURL: 'https://picsum.photos/300'
    }
    const { getByAltText } = renderWithStore(<RestaurantCard restaurant={prop}/>, store)

    expect(getByAltText(/marca de/i)).toHaveAttribute('src', prop.pictureURL)
  })


  it('should display the button to open the config menu, open it when clicked, and dispatch the respective actions', () => {
    store = getMockStore({
      user: { user: mockUser }
    })
    const { queryByRole, queryAllByRole, queryByLabelText } = renderWithStore(<RestaurantCard restaurant={mockRestaurant}/>, store)
    const configButton = queryByLabelText(/configurações/i)

    expect(configButton).toBeTruthy()
    fireEvent.click(configButton)

    expect(queryByRole('menu')).toBeVisible()
    expect(queryAllByRole('menuitem').length).toEqual(2)

    queryAllByRole('menuitem').forEach(item => {
      fireEvent.click(item)
    })
    expect(changeSelectedRestaurant).toHaveBeenCalledTimes(2)
    expect(openPopup).toHaveBeenCalledTimes(2)
  })


  it('should dispatch the like action when like button is clicked if there is a user', () => {
    store = getMockStore({
      user: { user: mockUser }
    })

    const { queryByLabelText } = renderWithStore(<RestaurantCard restaurant={mockRestaurant}/>, store)
    const likeButton = queryByLabelText(/favoritar/i)
    fireEvent.click(likeButton)

    expect(toggleRestaurantLike).toHaveBeenCalledTimes(1)
  })


  it('should open a popup when like button is clicked if there is no user', () => {
    store = getMockStore()
    const { queryByLabelText } = renderWithStore(<RestaurantCard restaurant={mockRestaurant}/>, store)
    const likeButton = queryByLabelText(/favoritar/i)
    fireEvent.click(likeButton)

    expect(openPopup).toHaveBeenCalledTimes(1)
  })


  it('should copy coordinates to clipboard and announce it', () => {
    document.execCommand = jest.fn()

    const { queryByLabelText, queryByRole } = renderWithStore(<RestaurantCard restaurant={mockRestaurant}/>, store)
    const copyButton = queryByLabelText(/copiar/i)
    fireEvent.click(copyButton)

    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(queryByRole('alert')).toBeVisible()

  })
})