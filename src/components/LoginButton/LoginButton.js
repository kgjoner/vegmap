import React from 'react'
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/user/actions';

import Button from '../Button'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import './loginButton.css'


function LoginButton({ fullWidth }) {
  const dispatch = useDispatch()

  function responseFacebook(response) {
    if(response.name) {
      dispatch(setUser(response))
    }
  }

  return (
    <div className="login-btn" data-testid="login-btn">
      <FacebookLogin
        appId={process.env.REACT_APP_FacebookAppID}
        autoLoad
        fields="name,email,picture"
        callback={responseFacebook} 
        render={renderProps => (
          <Button variant="login"
            text="Login com Facebook"
            onClick={renderProps.onClick}
            fullWidth={fullWidth} />
        )}/>
    </div>
  )
}

export default LoginButton