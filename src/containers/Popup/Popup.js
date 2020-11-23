import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { closePopup } from '../../store/popup/actions'
import { changeSelectedRestaurant } from '../../store/restaurant/actions'
import { popups } from '../../constants/systemTypes'

import SignupBox from '../SignupBox'
import DenunciationForm from '../DenunciationForm'
import AskForLocation from '../AskForLocation/AskForLocation'
import MessageModal from '../../components/MessageModal'
import AskForLogging from '../../components/AskForLogging'
import './popup.css'


function Popup() {
  const [isAlertKind, setIsAlertKind] = useState(false)
  const popup = useSelector(state => state.popup.popup)
  const content = useSelector(state => state.popup.content)
  const dispatch = useDispatch()
  const container = useRef()

  const alertKinds = [
    popups.ASK_FOR_LOCATION
  ]

  const selectorsOfFocusableEls = `
    a[href]:not([disabled]),
    button:not([disabled]),
    textarea:not([disabled]),
    input:not([disabled]):not([type="hidden"]),
    select:not([disabled])
  `

  useEffect(() => {
    if(popup === popups.NONE) return

    if(alertKinds.includes(popup)) {
      setIsAlertKind(true)
    } else {
      setIsAlertKind(false)
    }

    const modalElement = container.current.firstElementChild
    const focusableElements = modalElement.querySelectorAll(selectorsOfFocusableEls)
    if(!focusableElements) return

    focusableElements[0].focus()
    modalElement.addEventListener('keydown', e => trapFocus(e, focusableElements[0]))

    return () => {
      modalElement.removeEventListener('keydown', e => trapFocus(e, focusableElements[0]))
    }
  }, [popup, container, selectorsOfFocusableEls])


  function trapFocus(e, firstElement) {
    if(e.key !== 'Tab') return
    
    const lastElement = document.querySelector('.popup__close-btn')
    if(document.activeElement === lastElement && !e.shiftKey) {
      e.preventDefault()
      firstElement.focus()
    } else if(document.activeElement === firstElement && e.shiftKey) {
      e.preventDefault()
      lastElement.focus()
    } 
  }

  function close(e, force) {
    if((!e || e.target === container.current) && (!isAlertKind || force)) {
      if(popup === popups.SIGNUP || popup === popups.DENUNCIATION_FORM) {
        dispatch(changeSelectedRestaurant(null))
      }
      dispatch(closePopup())
    }
  }

  return (
    <section className={`popup ${popup === popups.NONE ? 'popup--hidden' : ''}`}>
      <div 
        className={`
          popup__bg 
          ${isAlertKind ? 'popup__bg--transparent' : ''}
        `}
        onMouseDown={e => close(e)}
        ref={container}
        role="presentation"
      >

        <div className="popup__content">

          { popup === popups.SIGNUP ?
            <SignupBox /> : null
          }
          { popup === popups.ASK_FOR_LOGGING ?
            <AskForLogging /> : null
          }
          { popup === popups.DENUNCIATION_FORM ?
            <DenunciationForm /> : null
          }
          { popup === popups.ASK_FOR_LOCATION ?
            <AskForLocation close={close} /> : null
          }
          {
            popup === popups.MESSAGE_MODAL 
              ? <MessageModal close={close}>
                  {content}
                </MessageModal>
              : null
          }

          { popup !== popups.NONE 
            && popup !== popups.ASK_FOR_LOCATION 
              ? <button className="popup__close-btn"
                onClick={() => close()}>
                  <div className="icon icon--cross icon--text"></div>
                </button> 
              : null
          }
        </div>
        
      </div>
    </section>
  )
}

export default Popup