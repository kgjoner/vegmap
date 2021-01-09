import React from 'react'
import './toggler.css'

const Toggler = ({ on, handleToggler }) => {
  return (
    <button 
      className={
        'toggler' +
        (on ? ' toggler--on' : ' toggler--off')
      }
      onClick={() => handleToggler(!on)}
    >
      <div className="toggler__pin"></div>
    </button>
  )
}

export default Toggler

