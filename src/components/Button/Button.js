import React from 'react'
import './button.css'

function Button({ text, onClick, isLoading, type = 'button', variant, fullWidth, thick }) {
  return (
    <button type={type}
      className={`button 
        ${variant ? `button--${variant}` : ''}
        ${fullWidth ? 'button--full-width': ''}
        ${thick ? 'button--thick' : ''}`}
      onClick={e => {
        e.target.blur()
        if(onClick) onClick()
      }}>
      { isLoading
        ? <div className="icon icon--loading"></div>
        : text
      }
    </button>
  )
}

export default Button