import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

import Button from './Button'

const props = {
  text: "Click Here",
  onClick: jest.fn()
}

describe('Button Component', () => {
  afterEach(() => {
    cleanup()
  })


  it('should render Button component only with the desired text', () => {
    const { queryByRole } = render(<Button {...props}/>)
    
    expect(queryByRole('button').textContent).toBe(props.text)
    expect(queryByRole('button').children.length).toBe(0)
  });

  
  it('should run the function passed as prop on click event', () => {
    const { queryByRole } = render(<Button {...props}/>)
    const container = queryByRole('button')
    fireEvent.click(container)

    expect(props.onClick).toHaveBeenCalledTimes(1)
  })


  it('should display loading icon if isLoading prop is true', () => {
    const { queryByRole } = render(<Button {...props} isLoading={true}/>)
    
    expect(queryByRole('button').textContent).toBeFalsy()
    expect(queryByRole('button').children.length).toBe(1)    
    expect(queryByRole('button').firstChild).toHaveClass('icon')   
  })


  it('should add class modifiers if variant, full-width and thick props were passed', () => {
    const { queryByRole } = render(<Button {...props} variant="primary" fullWidth thick/>)
    const container = queryByRole('button')

    expect(container).toHaveClass('button--primary')
    expect(container).toHaveClass('button--full-width')
    expect(container).toHaveClass('button--thick')

  })
})