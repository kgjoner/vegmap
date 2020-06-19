import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

import Select from './Select'

let value;
const setValue = jest.fn().mockImplementation(newValue => props.value = newValue)
const props = {
  id: 'opções',
  label: 'Opções',
  value,
  setValue,
  options: [
    { value: 'Opção 1' }, 
    { value: 'Opção 2' }
  ]
}


describe('Select Component', () => {
  afterEach(() => {
    cleanup()
  })


  it('should render Select component', () => {
    const { getByText, getByLabelText } = render(<Select {...props}/>)
    
    expect(getByText(props.label)).toHaveAttribute('for', props.id)
    expect(getByLabelText(props.label).value).toBeFalsy()
    expect(getByLabelText(props.label).children.length).toEqual(1 + props.options.length)
  });


  it('should change the selected option', () => {
    const { getByLabelText } = render(<Select {...props}/>)
    const select = getByLabelText(props.label)

    props.options.map((opt, index) => {
      fireEvent.change(select, { target: { value: opt.value } })
      expect(props.setValue).toHaveBeenCalledTimes(1 + index)
      expect(props.value).toEqual(opt.value)
      expect(select).toHaveValue(props.value)
    })

  });

})