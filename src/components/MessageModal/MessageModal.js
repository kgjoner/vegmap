import React from 'react'
import Button from '../Button'
import './messageModal.css'


function MessageModal({ buttonText = 'Ok', close, children }) {
  return (
    <div className="message-modal" data-testid="message-modal">
      {children}
      <Button 
        text={buttonText}
        onClick={close}
      />
    </div>
  )
}

export default MessageModal