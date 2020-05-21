import React from 'react'
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/user/actions';

import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import './loginButton.css'


function LoginButton({ variant }) {
  const dispatch = useDispatch()

  function responseFacebook(response) {
    if(response.name) {
      dispatch(setUser(response))
    }
  }

  return (
    <div className="login-btn">
      <FacebookLogin
        appId={process.env.REACT_APP_FacebookAppID}
        autoLoad
        fields="name,email,picture"
        callback={responseFacebook} 
        render={renderProps => (
          <button className={`login-btn__btn ${variant ? `login-btn__btn--${variant}` : ''}`}
            onClick={renderProps.onClick}>
            Login com Facebook
          </button>
        )}/>
    </div>
  )
}

export default LoginButton