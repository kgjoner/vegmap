import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { dismissRestaurantError, dismissRestaurantSuccess } from '../../store/restaurant/actions'
import { dismissMapError } from '../../store/map/actions'
import { popups } from '../../store/popup/actionTypes'

import Notification from '../../components/Notification'
import './toaster.css'
import { useCallback } from 'react'


function Toaster() {
  const [notification, setNotification] = useState(null)
  const [toast, setToast] = useState(false)
  const timeout = useRef(null)

  const success = useSelector(state => state.restaurant.success)
  const error = useSelector(state => state.restaurant.error || state.map.error)
  const wasAlreadyManaged = useSelector(state => {
    return state.popup.popup === popups.SIGNUP && state.restaurant.error
  })
  const dispatch = useDispatch()

  const closeToaster = useCallback(() => {
    dispatch(dismissRestaurantError())
    dispatch(dismissMapError())
    dispatch(dismissRestaurantSuccess())
  }, [dispatch])

  useEffect(() => {
    if(error && wasAlreadyManaged) return
    if(success || error) {
      clearTimeout(timeout.current)
      setNotification({
        type: success ? 'success' : 'error',
        message: success || error?.message
      })
      setToast(true)
    } else {
      setToast(false)
      timeout.current = setTimeout(() => {
        setNotification(null)
      }, 600)
    }

    if(success) {
      setTimeout(() => closeToaster(), 2000)
    }
  }, [success, error, wasAlreadyManaged, closeToaster])

  return (
    <section className={`toaster ${!notification ? 'toaster--hidden' : ''}`}>
      <div className={`toaster__container 
      ${toast ? 'toaster__container--toast' : ''}`}
      role="presentation">

      {notification &&
        <Notification type={notification.type}
          message={notification.message}
          action={closeToaster}
          actionText="fechar"
        />
      }

      </div> 
    </section>
  )
}

export default Toaster