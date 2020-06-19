import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

import FoodInput from './FoodInput'

const changeHandler = jest.fn().mockImplementation(newValue => props.foodOnTyping = newValue)
const props = {
  label: 'Foods',
  savedFoods: [],
  foodOnTyping: 'c',
  foodHint: '',
  handlers: {
    change: changeHandler,
    keyInput: jest.fn(),
    blur: jest.fn()
  }
}


describe('FoodInput Component', () => {
  afterEach(() => {
    cleanup()
  })


  it('should render FoodInput component', () => {
    const { getByText, getByLabelText } = render(<FoodInput {...props}/>)
    
    expect(getByText(props.label)).toHaveAttribute('for', 'foods')
    expect(getByLabelText(props.label)).toHaveValue(props.foodOnTyping)
  });


  it('should show savedFoods and foodHint when they exist', () => {
    props.savedFoods = ['búrguer', 'drinks']
    props.foodHint = 'café'
    const { getByText } = render(<FoodInput {...props}/>)

    props.savedFoods.forEach(food => {
      expect(getByText(food)).toBeVisible()
    })
    expect(getByText(props.foodHint)).toBeVisible()
  });


  it('should call the change handler  on change', () => {
    const { getByLabelText } = render(<FoodInput {...props}/>)
    const input = getByLabelText(props.label)

    fireEvent.change(input, { target: { value: 'ca' } })

    expect(props.handlers.change).toHaveBeenCalledWith('ca')
  });


  it('should call the keyInput handler on keyDown', () => {
    const { getByLabelText } = render(<FoodInput {...props}/>)
    const input = getByLabelText(props.label)

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(props.handlers.keyInput).toHaveBeenCalledTimes(1)
  });


  it('should call the blur handler on blur', () => {
    const { getByLabelText } = render(<FoodInput {...props}/>)
    const input = getByLabelText(props.label)

    fireEvent.blur(input)

    expect(props.handlers.blur).toHaveBeenCalledTimes(1)
  });

})