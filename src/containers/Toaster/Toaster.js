import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { dismissNotification } from '../../store/notification/action'

import Notification from '../../components/Notification'
import './toaster.css'
import { notificationTypes, popups } from '../../constants/systemTypes'


function Toaster() {
  const [notification, setNotification] = useState(null)
  const [toast, setToast] = useState(false)
  const timeoutRef = useRef(null)

  const { type, message, timeout } = 
    useSelector(state => state.notification)
  const popup = useSelector(state => state.popup.popup)
  const dispatch = useDispatch()

  const dontToast = type === notificationTypes.ERROR && popup === popups.SIGNUP

  const closeToaster = useCallback(() => {
    dispatch(dismissNotification())
  }, [dispatch])

  useEffect(() => {
    if(dontToast) return
    if(message) {
      clearTimeout(timeoutRef.current)
      setNotification({
        type,
        message,
      })
      setToast(true)
    } else {
      setToast(false)
      timeoutRef.current = setTimeout(() => {
        setNotification(null)
      }, 600)
    }

    if(timeout) {
      setTimeout(() => closeToaster(), timeout)
    }
  }, [message, type, timeout, dontToast, closeToaster])

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