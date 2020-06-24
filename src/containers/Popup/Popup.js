import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { closePopup } from '../../store/popup/actions'
import { changeSelectedRestaurant } from '../../store/restaurant/actions'
import { popups } from '../../store/popup/actionTypes'

import SignupBox from '../SignupBox'
import AskForLogging from '../../components/AskForLogging'
import DenunciationForm from '../DenunciationForm'
import './popup.css'


function Popup() {
  const popup = useSelector(state => state.popup.popup)
  const dispatch = useDispatch()
  const container = useRef()

  const selectorsOfFocusableEls = `
    a[href]:not([disabled]), 
    button:not([disabled]), 
    textarea:not([disabled]), 
    input:not([disabled]):not([type="hidden"]), 
    select:not([disabled])
  `

  useEffect(() => {
    if(popup === popups.NONE) return

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

  function close(e) {
    if(!e || e.target === container.current) {
      if(popup === popups.SIGNUP || popup === popups.DENUNCIATION_FORM) {
        dispatch(changeSelectedRestaurant(null))
      }
      dispatch(closePopup())
    }
  }

  return (
    <section className={`popup ${popup === popups.NONE ? 'popup--hidden' : ''}`}>
      <div className="popup__bg" 
        onMouseDown={e => close(e)}
        ref={container}
        role="presentation">

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

          { popup !== popups.NONE ?
            <button className="popup__close-btn"
              onClick={() => close()}>
              <div className="icon icon--cross icon--text"></div>
            </button> : null
          }
        </div>
        
      </div>
    </section>
  )
}

export default Popup