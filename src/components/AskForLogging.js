import React from 'react'
import LoginButton from './utils/LoginButton'
import './askForLogging.css'


function AskForLogging() {
  return (
    <div className="ask-for-logging">
      <div className="ask-for-logging__symbol">
        <div className="icon icon--star-filled icon--light icon--jump"></div>
        <div className="icon icon--star-filled icon--light icon--bigger icon--jump-delay1"></div>
        <div className="icon icon--star-filled icon--light icon--jump-delay2"></div>
      </div>
      <p className="ask-for-logging__message">
        Para favoritar seus restaurantes preferidos, faça login com o Facebook!
      </p>
      <LoginButton variant="full-width" />
    </div>
  )
}

export default AskForLogging