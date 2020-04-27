import React, { useEffect } from 'react'
import './pin.css'

function Pin({ location }) {
  useEffect(() => {
    setTimeout(() => {
      document.querySelector('.pin').classList.add('pin--fall')
    }, 100)
  }, [location])

  return (
    <div className="pin pin--fall">
      <div className="icon icon--pin"></div>
    </div>
  )
}

export default Pin