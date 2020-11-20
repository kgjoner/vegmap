import React from 'react'
import './notification.css'

function Notification({ message, type, action, actionText }) {
  return (
    <div className={`notification 
      ${type ? `notification--${type.toLowerCase()}` : 'notification--hidden'}`}
      data-testid="notification"
      role="alert">

      <div className="notification__message">
        {message}
      </div>
      
      { action 
        ? <button className="notification__btn"
            onClick={action}> 
            {actionText} 
          </button>
        : null
      }
    </div> 
  )
}

export default Notification