import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { openPopup } from '../../store/popup/actions'
import { setPermission } from '../../store/system/actions'
import { popups } from '../../constants/systemTypes';

import LoginButton from '../../components/LoginButton'
import Button from '../../components/Button'

import logo from "../../assets/img/logo.svg"
import "./presentation.css"
import Toggler from '../../components/Toggler/Toggler';


function Presentation() {
  const [option, setOption] = useState({ vegan: true, vegetarian: true })

  const user = useSelector(state => state.user.user)
  const isConnected = useSelector(state => state.system.isConnected)
  const isLocationOn = useSelector(state => state.system.locationPermission)
  const dispatch = useDispatch()

  function handleRadio(target) {
    target.blur()
    const newOption = {
      vegan: target.value !== 'vegetarian',
      vegetarian: target.value !== 'vegan'
    }
    setOption(newOption)
  }

  return (
    <aside className="presentation">
      <div className="logo">
        <img src={logo} className="logo__brand" alt="logo" width="80"/>
        {/* <img src={logotype} className="logo__logotype" alt="logotype"/> */}
        <h1 className="logo__logotype">Vegmap</h1>
      </div>
      
      <div className="presentation__config presentation__config--row">
        <p className="presentation__config-name">Localização</p>
        <Toggler 
          on={isLocationOn} 
          handleToggler={value => dispatch(setPermission(value))} 
        />
      </div>

      <div className="presentation__config">
        <p className="presentation__config-name">Opção</p>
        <div className="presentation__options">
          <label className="presentation__option">
            vegetariana
            <input className="presentation__radio" type="radio" name="option" 
              value="vegetarian"
              checked={option.vegetarian && !option.vegan}
              onChange={e => handleRadio(e.target)}/>
            <span className="presentation__checkmark"></span>
          </label>
          <label className="presentation__option">
            vegana
            <input className="presentation__radio" type="radio" name="option" 
              value="vegan"
              checked={option.vegan && !option.vegetarian}
              onChange={e => handleRadio(e.target)}/>
            <span className="presentation__checkmark"></span>
          </label>
          <label className="presentation__option">
            ambas
            <input className="presentation__radio" type="radio" name="option" 
              value="both"
              checked={option.vegan && option.vegetarian}
              onChange={e => handleRadio(e.target)} />
            <span className="presentation__checkmark"></span>
          </label>
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
      
      {/* <div className="presentation__footer">
        ©2020 | Feito com
        <div className="icon icon--heart"></div>
        em Floripa
      </div> */}
    </aside>
  )
}

export default Presentation