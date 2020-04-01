import React from 'react'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import "./loginBox.css"

function LoginBox({ setShowPopup, user, setUser }) {

  function responseFacebook(response) {
    setUser(response)
  }

  return (
    <aside>
      <h1>Veg<span>Map</span></h1>
      
      <div className="legend">
        <div className="icon-info">
          <div className="icon-box">
            <div className="leaf-icon"></div>
          </div>
          exclusivamente vegano
        </div>
        <div className="icon-info ovolacto">
          <div className="icon-box">
            <div className="leaf-icon"></div>
          </div>
          ovolacto com opção vegana
        </div>
        <div className="icon-info opção-vegana">
          <div className="icon-box">
            <div className="leaf-icon"></div>
          </div>
          opção vegana
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
      </div>
    </aside>
  )
}

export default LoginBox