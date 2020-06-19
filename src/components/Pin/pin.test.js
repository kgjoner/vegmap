import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

import Pin from './Pin'


describe('Pin Component', () => {
  afterEach(() => {
    cleanup()
  })


  it('should render Pin component', () => {
    const { getByTestId } = render(<Pin />)
    
    expect(getByTestId('pin').firstChild).toHaveClass('icon')
    expect(getByTestId('pin')).not.toHaveClass('pin--fall')
  });


  it('should add fall modifier if the correspondent prop were true', () => {
    const { getByTestId } = render(<Pin fall/>)
    
    expect(getByTestId('pin')).toHaveClass('pin--fall')
  });

})