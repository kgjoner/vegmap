import React from 'react'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import "./presentation.css"
import logo from "../assets/img/logo.svg"
import logotype from "../assets/img/logotype.svg"

function Presentation({ setShowPopup, user, setUser }) {

  function responseFacebook(response) {
    setUser(response)
  }

  return (
    <aside className="presentation">
      <div className="logo">
        <img src={logo} alt="logo" width="80"/>
        <img src={logotype} className="logo__logotype" alt="logotype"/>
      </div>
      
      <div className="presentation__legend">
        <div className="presentation__item presentation__item--vegan">
          <div className="icon-box icon-box--vegan">
            <div className="icon icon--leaf"></div>
          </div>
          Vegano
        </div>
        <div className="presentation__item presentation__item--vegetarian">
          <div className="icon-box icon-box--vegetarian">
            <div className="icon icon--leaf"></div>
          </div>
          Vegetariano
        </div>
      </div>
      
      { user ? 
      <div>
        <button className="presentation__btn" 
          onClick={e => setShowPopup(true)}>
          Cadastrar Restaurante
        </button> 
        <p className="presentation__user">como <strong>{user.name}</strong></p>
      </div> :
      <FacebookLogin
        appId="837570083385264"
        autoLoad
        fields="name,email,picture"
        callback={responseFacebook} 
        render={renderProps => (
          <button className="presentation__btn presentation__btn--facebook"
            onClick={renderProps.onClick}>
            Login com Facebook
          </button>
        )}/>
      }
      <div className="presentation__footer">
        ©2020 | Feito com
        <div className="icon icon--heart"></div>
        em Floripa
      </div>
    </aside>
  )
}

export default Presentation