import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { mapModes } from '../../store/map/actionTypes'
import './pin.css'

function Pin() {
  const pinLocation = useSelector(state => state.map.pinLocation)
  const mapMode = useSelector(state => state.map.mapMode)

  useEffect(() => {
    if(mapMode === mapModes.PICKING) {
      document.querySelector('.pin').classList.add('pin--fall')
    }
    // setTimeout(() => {
    //   document.querySelector('.pin').classList.remove('pin--fall')
    // }, 1000)
  }, [pinLocation])

  return (
    <div className="pin pin--fall">
      <div className="icon icon--pin"></div>
    </div>
  )
}

export default Pin