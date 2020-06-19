import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

import Marker from './Marker'
import { mockRestaurant } from '../../mocks'

const props = {
  restaurant: mockRestaurant,
  handleMarkerClick: jest.fn()
}
const pictureURL = "https://picsum.photos/100"


describe('Marker Component', () => {
  afterEach(() => {
    cleanup()
  })


  it('should render Marker component with an icon', () => {
    const { getByTestId } = render(<Marker {...props}/>)
    
    expect(getByTestId('marker')).toHaveClass(`marker--${mockRestaurant.type}`)
    expect(getByTestId('marker').children.length).toBe(1)
    expect(getByTestId('marker').firstChild).toHaveClass('marker__picture--icon')
  });


  it('should render Marker component with an image if there is a picture URL info', () => {
    props.restaurant.pictureURL = pictureURL
    const { getByTestId } = render(<Marker {...props}/>)
    
    expect(getByTestId('marker').children.length).toBe(1)
    expect(getByTestId('marker').firstChild).toHaveAttribute('src', pictureURL)
  });

  
  it('should run the function passed as prop on click event', () => {
    const { getByTestId } = render(<Marker {...props}/>)
    const container = getByTestId('marker')
    fireEvent.click(container)

    expect(props.handleMarkerClick).toHaveBeenCalledTimes(1)
  })
})