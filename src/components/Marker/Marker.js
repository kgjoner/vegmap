import React from 'react'
import './marker.css'

function Marker({ restaurant, handleMarkerClick }) {
  return (
    <div className={`marker marker--${restaurant.type}`} data-testid="marker"
      onClick={() => handleMarkerClick(restaurant)}>
      { restaurant.pictureURL ?
      <img src={restaurant.pictureURL} className="marker__picture" alt="foto"/> :
      <div className="marker__picture marker__picture--icon">
        <div className="icon icon--leaf"></div>
      </div>
      }
    </div>
  )

}

export default Marker