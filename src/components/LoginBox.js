import React from 'react'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import "./loginBox.css"
import logo from "../assets/img/logo.svg"

function LoginBox({ setShowPopup, user, setUser }) {

  function responseFacebook(response) {
    setUser(response)
  }

  return (
    <aside>
      <div className="logo">
        <img src={logo} alt="logo" width="80"/>
        <h1>Veg<span>Map</span></h1>
      </div>
      
      <div className="legend">
        <div className="icon-info vegan">
          <div className="icon-box">
            <div className="leaf-icon"></div>
          </div>
          Vegano
        </div>
        <div className="icon-info vegetarian">
          <div className="icon-box">
            <div className="leaf-icon"></div>
          </div>
          Vegetariano
        </div>
      </div>
      
      { user ? 
      <div>
        <button onClick={e => setShowPopup(true)}>Cadastrar Restaurante</button> 
        <p>como <strong>{user.name}</strong></p>
      </div> :
      <FacebookLogin
        appId="837570083385264"
        autoLoad
        fields="name,email,picture"
        callback={responseFacebook} 
        render={renderProps => (
          <button onClick={renderProps.onClick} className="login-btn">Login com Facebook</button>
        )}/>
      }
      <div className="foot-message">
        ©2020 | Feito com
        <div className="heart-icon"></div>
        em Floripa
      </div>
    </aside>
  )
}

export default LoginBox