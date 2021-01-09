import React from 'react'
import { useDispatch } from 'react-redux'
import Button from '../../components/Button'
import { getUserLocation } from '../../store/map/actions'
import { setPermission } from '../../store/system/actions'
import './askForLocation.css'


function AskForLocation({ close }) {
  const dispatch = useDispatch()

  function handlePermission(permission) {
    if(permission) dispatch(getUserLocation())
    dispatch(setPermission(permission))
    close(null, true)
  }

  return (
    <div className="ask-for-location" data-testid="ask-for-location">
      <p className="ask-for-location__message">
        Para mostrar os restaurantes perto de você, 
        permita acesso à sua localização.
      </p>
      <div className="ask-for-location__actions">
        <Button 
          text="Permitir"
          onClick={() => handlePermission(true)}
          fullWidth
        />
        <Button 
          text="Negar"
          fullWidth
          onClick={() => handlePermission(false)}
        />
      </div>
    </div>
  )
}

export default AskForLocation