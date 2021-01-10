import React from 'react'
import LoginButton from '../LoginButton'
import './askForLogging.css'


function AskForLogging() {
  return (
    <div className="ask-for-logging" data-testid="ask-for-logging">
      <div className="ask-for-logging__symbol" role="presentation">
        <div className="icon icon--star-filled icon--text icon--jump"></div>
        <div className="icon icon--star-filled icon--text icon--bigger icon--jump-delay1"></div>
        <div className="icon icon--star-filled icon--text icon--jump-delay2"></div>
      </div>
      <p className="ask-for-logging__message">
        Para favoritar seus restaurantes preferidos, faça login com o Facebook!
      </p>
      <LoginButton fullWidth />
    </div>
  )
}

export default AskForLogging