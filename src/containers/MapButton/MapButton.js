import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { mapModes, popups } from '../../constants/systemTypes'
import { changeMapMode } from '../../store/map/actions'
import { openPopup } from '../../store/popup/actions'
import './mapButton.css'

const MapButton = () => {
  const isMapHidden = useSelector(state => state.map.mapMode === mapModes.HIDDEN)
  const isConnected = useSelector(state => state.system.isConnected)
  const dispatch = useDispatch()

  function toggleMap() {
    if(!isConnected) {
      dispatch(openPopup(popups.MESSAGE_MODAL, (
        <p className="message-modal__text">
          Não é possível acessar o mapa no modo offline.
        </p>
      )))
      return
    }

    if(isMapHidden) {
      dispatch(changeMapMode(mapModes.RESTAURANTS))
    } else {
      dispatch(changeMapMode(mapModes.HIDDEN))
    }
  }

  return (
    <button 
      className="map-button"
      onClick={toggleMap}
    >
      <span className="map-button__label">
        {isMapHidden ? 'Mapa' : ''}
      </span>
      {isMapHidden
        ? <div className="icon icon--map"></div>
        : <div className="icon icon--cross"></div>
      }
    </button>
  )
}

export default MapButton