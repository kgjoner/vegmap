import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { changeMapMode } from '../../store/map/actions'
import { openPopup } from '../../store/popup/actions'
import { mapModes, popups } from '../../constants/systemTypes';

import LoginButton from '../../components/LoginButton'
import Button from '../../components/Button'

import logo from "../../assets/img/logo.svg"
import logotype from "../../assets/img/logotype.svg"
import "./presentation.css"


function Presentation() {
  const user = useSelector(state => state.user.user)
  const isConnected = useSelector(state => state.system.isConnected)
  const dispatch = useDispatch()

  function handleGoToMap() {
    if(isConnected) {
      dispatch(changeMapMode(mapModes.RESTAURANTS))
    } else {
      dispatch(openPopup(popups.MESSAGE_MODAL, (
        <p className="message-modal__text">
          Não é possível acessar o mapa no modo offline.
        </p>
      )))
    }
  }

  return (
    <aside className="presentation">
      <div className="logo">
        <img src={logo} className="logo__brand" alt="logo" width="80"/>
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
        <Button variant="primary"
          text="Cadastrar Restaurante"
          onClick={() => dispatch(openPopup(popups.SIGNUP))} />
        <p className="presentation__user">como <strong>{user.name}</strong></p>
      </div> :
      isConnected 
        ? <LoginButton />
        : null
      }

      <div className="presentation__btn-container">
        <Button
          text="Ir para o mapa"
          onClick={handleGoToMap} />
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