import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

import Notification from './Notification'

const props = {
  message: 'Alerta!',
  type: "error",
  action: jest.fn(),
  actionText: 'fechar'
}


describe('Notification Component', () => {
  afterEach(() => {
    cleanup()
  })


  it('should render Notification component but keep it hidden', () => {
    const { getByTestId } = render(<Notification message={props.message}/>)
    
    expect(getByTestId('notification')).toHaveClass('notification--hidden')
  });

  
  it('should show Notification component without an action', () => {
    const { getByTestId } = render(<Notification message={props.message} type={props.type}/>)
    const container = getByTestId('notification')
    
    expect(container).toBeVisible()
    expect(container).toHaveClass(`notification--${props.type}`)
    expect(container.firstChild).toHaveTextContent(props.message)
  })

  
  it('should show Notification component with an action and trigger it when clicked', () => {
    const { getByTestId, getByRole } = render(<Notification {...props}/>)
    const button = getByRole('button')
    fireEvent.click(button)
    
    expect(getByTestId('notification').children.length).toBe(2)
    expect(button).toHaveTextContent(props.actionText)
    expect(props.action).toHaveBeenCalledTimes(1)
  })
  
})