import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { dismissRestaurantError } from '../store/restaurant/actions'
import { dismissMapError } from '../store/map/actions'
import { popups } from '../store/popup/actionTypes'

import './errorToaster.css'


function ErrorToaster() {
  const error = useSelector(state => state.restaurant.error || state.map.error)
  const wasAlreadyManaged = useSelector(state => {
    return state.popup.popup === popups.SIGNUP && state.restaurant.error
  })
  const dispatch = useDispatch()

  function closeToaster() {
    dispatch(dismissRestaurantError())
    dispatch(dismissMapError())
  }

  return (
    <div className={`error-toaster ${!error || wasAlreadyManaged ? 'error-toaster--hidden' : ''}`}>
      <div className={`error-toaster__container ${error ? 'error-toaster__container--toast' : ''}`}>
        <div className="error-toaster__message">
          { error ? error.message : ''}
        </div>
        <button className="error-toaster__btn"
          onClick={closeToaster}> 
          fechar 
        </button>
      </div> 
    </div>
  )
}

export default ErrorToaster