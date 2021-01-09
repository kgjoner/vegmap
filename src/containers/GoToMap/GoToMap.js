import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { mapModes, popups } from '../../constants/systemTypes'
import './goToMap.css'


const GoToMap = () => {
  const isConnected = useSelector(state => state.system.isConnected)
  const dispatch = useDispatch()

  function handleGoToMap() {
    if(isConnected) {
      dispatch(changeMapMode(mapModes.RESTAURANTS))
    } else {
      dispatch(openPopup(popups.MESSAGE_MODAL, (
        <p className="message-modal__text">
          Não é possível acessar o mapa no modo offline.
        </p>
      )))
    }
  }

  return (
    <div className="presentation__btn-container">
      <Button
        text="Ir para o mapa"
        onClick={handleGoToMap} />
    </div>
  )
}

export default GoToMap