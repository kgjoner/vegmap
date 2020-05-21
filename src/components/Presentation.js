import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { changeMapMode } from '../store/map/actions'
import { openPopup } from '../store/popup/actions'
import { mapModes } from '../store/map/actionTypes';
import { popups } from '../store/popup/actionTypes'

import LoginButton from './utils/LoginButton'

import logo from "../assets/img/logo.svg"
import logotype from "../assets/img/logotype.svg"
import "./presentation.css"


function Presentation() {
  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()

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
          onClick={e => dispatch(openPopup(popups.SIGNUP))}>
          Cadastrar Restaurante
        </button> 
        <p className="presentation__user">como <strong>{user.name}</strong></p>
      </div> :
      <LoginButton />
      }
      <div className="map-btn__container">
        <button className="map-btn" 
          onClick={() => dispatch(changeMapMode(mapModes.RESTAURANTS))}>
            Ir para o mapa
        </button>
      </div>
      <div className="presentation__footer">
        ©2020 | Feito com
        <div className="icon icon--heart"></div>
        em Floripa
      </div>
    </aside>
  )
}

export default Presentation