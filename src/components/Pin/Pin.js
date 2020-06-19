import React from 'react'
import './pin.css'

function Pin({ fall }) {
  return (
    <div className={`pin ${fall ? 'pin--fall' : ''}`} data-testid="pin">
      <div className="icon icon--pin"></div>
    </div>
  )
}

export default Pin