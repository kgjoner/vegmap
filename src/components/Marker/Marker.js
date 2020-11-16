import React, { useState } from 'react'
import './marker.css'

function Marker({ restaurant, handleMarkerClick }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className={`marker marker--${restaurant.type}`} data-testid="marker"
      onClick={() => handleMarkerClick(restaurant)}>
      { restaurant.pictureURL && !imgError 
        ? <img src={restaurant.pictureURL} 
            className="marker__picture" 
            alt="foto"
            onError={() => setImgError(true)}
          />
        : <div className="marker__picture marker__picture--icon">
            <div className="icon icon--leaf"></div>
          </div>
      }
    </div>
  )

}

export default Marker