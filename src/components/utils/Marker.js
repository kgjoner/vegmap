import React, {useEffect} from 'react'
import './marker.css'

function Marker({ restaurant }) {

  useEffect(() => {
    console.log(restaurant)
  }, [])

  return (
    <div className={`marker marker--${restaurant.type}`}>
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