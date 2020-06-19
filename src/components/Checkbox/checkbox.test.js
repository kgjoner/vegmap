import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

import Checkbox from './Checkbox'


const props = {
  id: 'opções',
  label: 'Opções',
  options: [
    {
      id: 'opção1',
      label: 'Opção1',
      value: true,
      setValue: jest.fn().mockImplementation(function(){ this.value = !this.value })
    }, {
      id: 'opção2',
      label: 'Opção2',
      value: false,
      setValue: jest.fn().mockImplementation(function(){ this.value = !this.value })
    }
  ]
}


describe('Checkbox Component', () => {
  afterEach(() => {
    cleanup()
  })


  it('should render Checkbox component', () => {
    const { getByText, getByLabelText } = render(<Checkbox {...props}/>)
    
    expect(getByText(props.label)).toBeTruthy()
    expect(getByText(props.label).parentNode.children.length).toEqual(1 + props.options.length)
    props.options.forEach(opt => {
      expect(getByLabelText(opt.label).checked).toEqual(opt.value)
    })
  });


  it('should change Checkbox checked value', () => {
    const { getByLabelText } = render(<Checkbox {...props}/>);
    
    props.options.forEach(opt => {
      const expectedValue = !opt.value
      const input = getByLabelText(opt.label)
      fireEvent.click(input)
      expect(opt.setValue).toHaveBeenCalledTimes(1)
      expect(opt.value).toEqual(expectedValue)
      // expect(input.checked).toEqual(expectedValue)
    })
  });

})