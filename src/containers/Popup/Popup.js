import React from 'react'
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

  function close(e) {
    if(!e || e.target === document.querySelector('.popup__bg')) {
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
        role="presentation">

        { popup === popups.SIGNUP ?
          <SignupBox /> : null
        }
        { popup === popups.ASK_FOR_LOGGING ?
          <AskForLogging /> : null
        }
        { popup === popups.DENUNCIATION_FORM ?
          <DenunciationForm /> : null
        }
        
      </div>
    </section>
  )
}

export default Popup