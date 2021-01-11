import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleRestaurantLike, changeSelectedRestaurant } from '../../store/restaurant/actions'
import { openPopup } from '../../store/popup/actions'
import { notify } from '../../store/notification/action'
import { popups, mapModes, notificationTypes } from '../../constants/systemTypes'
import { successMessages } from '../../constants/systemMessages'

import "./restaurantCard.css"

function RestaurantCard({ restaurant, variant }) {
  const [showMenu, setShowMenu] = useState(false)
  const [imgError, setImgError] = useState(false)
  const canvasEl = useRef()

  const user = useSelector(state => state.user.user)
  const isWaiting = useSelector(state => state.restaurant.liking)
  const isOnMap = useSelector(state => state.map.mapMode !== mapModes.HIDDEN)
  const dispatch = useDispatch()

  const hideMenu = useCallback((e) => {
    if(e.target !== document.querySelector('.restaurant-card__menu')) {
      window.removeEventListener('click', hideMenu)
      setShowMenu(false)
    }
  }, [])

  useEffect(() => {
    if(showMenu) {
      window.addEventListener('click', hideMenu)
    }
  }, [showMenu, hideMenu])

  useEffect(() => {
    if(!canvasEl.current) return

    let canvas = canvasEl.current; 
    let context = canvas.getContext("2d")

    context.font = "16px Courgette"
    context.fillStyle = "#025700"
    context.textAlign = "center"

    let string = "exclusivo!"

    let angle = -Math.PI * 0.3
    let radius = 100

    context.translate(50, 0)
    context.rotate(-1 * angle / 2)

    for (let i = 0; i < string.length; i++) { 
        context.rotate(angle / string.length)
        context.save()
        context.translate(0, 1 * radius)
        context.fillText(string[i], 0, 0)
        context.restore()
    }
  }, [canvasEl.current])


  function copyCoordinatesToClipboard(coords) {
    if(!coords) return
    const textarea = document.createElement('textarea')
    textarea.style.position = 'fixed'
    textarea.value = [...coords].reverse().join(', ')
    document.body.appendChild(textarea)

    textarea.focus()
    textarea.select()
    textarea.setSelectionRange(0, 99999)
    document.execCommand('copy')
    document.body.removeChild(textarea)

    dispatch(notify(notificationTypes.SUCCESS, successMessages.COPY_COORDS))
  }


  function like() {
    document.querySelector('.restaurant-card__like-btn').blur()
    if(isWaiting) return
    if(!user) {
      dispatch(openPopup(popups.ASK_FOR_LOGGING))
      return
    }
    dispatch(toggleRestaurantLike({ restaurant, user }))
  }

  function editRestaurant() {
    dispatch(changeSelectedRestaurant(restaurant))
    dispatch(openPopup(popups.SIGNUP))
  }

  function denounce() {
    dispatch(changeSelectedRestaurant(restaurant))
    dispatch(openPopup(popups.DENUNCIATION_FORM))
  }

  return (
    <li className={`restaurant-card ${restaurant.type} 
      ${variant ? `restaurant-card--${variant}` : ''}`}>

      <div className={
        'restaurant-card__option' +
        (restaurant.option.vegetarian && restaurant.option.vegan
          ? ' restaurant-card__option--both'
          : restaurant.option.vegan 
            ? ' restaurant-card__option--vegan'
            : ' restaurant-card__option--vegetarian')
      }></div>

      { restaurant.type !== 'default'
        ? <canvas ref={canvasEl} className="restaurant-card__exclusive" width="100" height="100"></canvas> 
        // ? <p className="restaurant-card__exclusive">
        //     <span>e</span>
        //     <span>x</span>
        //     <span>c</span>
        //     <span>l</span>
        //     <span>u</span>
        //     <span>s</span>
        //     <span>i</span>
        //     <span>v</span>
        //     <span>o</span>
        //     <span>!</span>
        //   </p>
        : null
      }

      { user && !isOnMap ? 
        <button className="restaurant-card__config" 
          onClick={() => setShowMenu(true)}
          aria-label="Configurações deste restaurante">
          <div className="icon icon--elipsis"></div>
        </button> : null
      }

      <ul className={`restaurant-card__menu`}
        style={{ visibility: showMenu ? 'visible' : 'hidden' }}
        role="menu">
          <li className="restaurant-card__menu-item" 
            onClick={() => editRestaurant()}
            role="menuitem">
              editar
          </li>
          <li className="restaurant-card__menu-item"
            onClick={() => denounce()}
            role="menuitem">
              denunciar
          </li>
      </ul>
      
      <header className="restaurant-card__header">
        { restaurant.pictureURL && !imgError
          ? <img src={restaurant.pictureURL.replace('http:', 'https:')} 
              className="restaurant-card__picture" 
              alt={`Marca de ${restaurant.name}`}
              onError={() => setImgError(true)}
            /> 
          : <div className="restaurant-card__picture restaurant-card__picture--icon"
              role="figure">
              <div className="icon icon--leaf"></div>
            </div>
        }
        <div>
          <h3 className="restaurant-card__name">
            {restaurant.name || restaurant.tagname}
          </h3>
          <span className="restaurant-card__foods">
            {restaurant.foods.length <= 3 ? restaurant.foods.join(', ')
            : restaurant.foods.slice(0, 3).join(', ') + '…'}
          </span>
        </div>
      </header>

      <div className="restaurant-card__body">
        <div className="restaurant-card__links">
          { restaurant.website && 
            <a href={`${restaurant.website}`} target="_blank"
              className="restaurant-card__link" rel="noopener noreferrer">
              <div className="icon icon--home"></div>
            </a> }
          { restaurant.facebookUsername && 
            <a href={`https://facebook.com/${restaurant.facebookUsername}`} target="_blank"
              className="restaurant-card__link" rel="noopener noreferrer">
              <div className="icon icon--facebook"></div>
            </a> }
          { restaurant.instagramUsername && 
            <a href={`https://instagram.com/${restaurant.instagramUsername}`} target="_blank"
              className="restaurant-card__link" rel="noopener noreferrer">
              <div className="icon icon--instagram"></div>
            </a> }
        </div>
        <div className="restaurant-card__column">
          <div className="restaurant-card__action-info">
            <button className="restaurant-card__like-btn"
              onClick={e => like(e.target)}
              aria-label="Favoritar este restaurante">
              <div className={!user || (user && restaurant.likes.indexOf(user.userID) === -1) ? 
                'icon icon--star' : 'icon icon--star-filled'}></div>
            </button>
            { restaurant.likes.length }
          </div>
          <div className="restaurant-card__action-info">
            <button className="restaurant-card__like-btn" 
              onClick={() => copyCoordinatesToClipboard(restaurant.location.coordinates)}
              aria-label="Copiar coordenadas">
              <div className="icon icon--pin"></div>
            </button>
            { restaurant.address.split('- ')[1] }
          </div>
        </div>
      </div>

      {/* <footer className="restaurant-card__footer">
        <p className="restaurant-card__address">{restaurant.address}</p>
        <button className="restaurant-card__coords" 
          onClick={() => copyCoordinatesToClipboard(restaurant.location.coordinates)}
          aria-label="Copiar coordenadas">
          <div className="restaurant-card__btn-container">
            Copiar Coordenadas
            <div className="icon icon--pin"></div>
          </div>
        </button>
      </footer> */}
    </li>
  )
}

export default RestaurantCard