import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setPermission } from '../../store/system/actions'
import { setDietOption } from '../../store/restaurant/actions';
import { openPopup } from '../../store/popup/actions'
import { popups } from '../../constants/systemTypes';

import LoginButton from '../../components/LoginButton'
import Button from '../../components/Button'
import Toggler from '../../components/Toggler/Toggler';

import logo from "../../assets/img/logo.svg"
import "./presentation.css"


function Presentation() {
  const [isDropdownActive, setIsDropdownActive] = useState(null)
  const [hidingDropDown, setHidingDropDown] = useState(false)
  const user = useSelector(state => state.user.user)
  const isConnected = useSelector(state => state.system.isConnected)
  const isLocationOn = useSelector(state => state.system.locationPermission)
  const dietOption = useSelector(state => state.restaurant.dietOption)
  const windowWidth = useSelector(state => state.system.windowWidth)
  const dispatch = useDispatch()

  function toggleDropDown() {
    if(isDropdownActive) {
      setHidingDropDown(true)
      setTimeout(() => {
        setHidingDropDown(false)
        setIsDropdownActive(false)
      }, 600)
    } else {
      setIsDropdownActive(true)
    }
  }

  function handleRadio(target) {
    target.blur()
    const newOption = {
      vegan: target.value !== 'vegetarian',
      vegetarian: target.value !== 'vegan'
    }
    dispatch(setDietOption(newOption))
  }

  return (
    <aside className={
      'presentation' +
      (user && windowWidth > 1000 ? ' presentation--compact' : '')
    }>
      <div className="logo">
        <img src={logo} className="logo__brand" alt="logo" width="80"/>
        <h1 className="logo__logotype">Vegmap</h1>
      </div>
      
      { windowWidth <= 1000 
        ? <button 
            className="presentation__drop-btn"
            onClick={toggleDropDown}  
          >
            <div className="icon icon--options"></div>
          </button>
        : null
      }

      <div className={
        'presentation__dropdown' +
        (isDropdownActive ? ' presentation__dropdown--active' : '') +
        (hidingDropDown ? ' presentation__dropdown--hiding' : '')
      }>
        <div className="presentation__config presentation__config--row">
          <p className="presentation__config-name">Permitir Localização</p>
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
                checked={dietOption.vegetarian && !dietOption.vegan}
                onChange={e => handleRadio(e.target)}/>
              <span className="presentation__checkmark"></span>
            </label>
            <label className="presentation__option">
              vegana
              <input className="presentation__radio" type="radio" name="option" 
                value="vegan"
                checked={dietOption.vegan && !dietOption.vegetarian}
                onChange={e => handleRadio(e.target)}/>
              <span className="presentation__checkmark"></span>
            </label>
            <label className="presentation__option">
              ambas
              <input className="presentation__radio" type="radio" name="option" 
                value="both"
                checked={dietOption.vegan && dietOption.vegetarian}
                onChange={e => handleRadio(e.target)} />
              <span className="presentation__checkmark"></span>
            </label>
          </div>
        </div>
      </div>
      
      { !user && isConnected
        ? <div className="presentation__btn-container">
            <LoginButton />
          </div>
        : user && isConnected && windowWidth <= 1000 
          ? <div className="presentation__btn-container">
              <Button
                  text="Cadastrar"
                  onClick={() => dispatch(openPopup(popups.SIGNUP))} 
                />
            </div>
          : null
      }

      { user  && windowWidth > 1000
        ? <div className="presentation__user">
          <p className="presentation__user-info">como <strong>{user.name}</strong></p>
            <Button variant="primary"
              text="Cadastrar Restaurante"
              onClick={() => dispatch(openPopup(popups.SIGNUP))} />
          </div>
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