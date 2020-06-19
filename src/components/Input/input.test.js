import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

import Input from './Input'

let value;
const setValue = jest.fn().mockImplementation(newValue => props.value = newValue)
const props = {
  id: 'name',
  label: 'Name',
  value,
  setValue
}


describe('Input Component', () => {
  afterEach(() => {
    cleanup()
  })


  it('should render Input component', () => {
    const { getByText, getByLabelText } = render(<Input {...props}/>)
    
    expect(getByText(props.label)).toHaveAttribute('for', props.id)
    expect(getByLabelText(props.label)).toHaveAttribute('type', 'text')
    expect(getByLabelText(props.label).nextSibling).toBeNull()
  });


  it('should change the value variable when typing', () => {
    const { getByLabelText } = render(<Input {...props}/>)
    const input = getByLabelText(props.label)
    fireEvent.change(input, { target: { value: 'João' } })

    expect(props.setValue).toHaveBeenCalledTimes(1)
    expect(props.value).toEqual('João')
    expect(input).toHaveValue('João')
  });


  it('should have a prepend element when specified', () => {
    const { getByLabelText } = render(<Input {...props} prepend="@"/>)

    expect(getByLabelText(props.label).nextSibling).toHaveTextContent('@')
  })

})