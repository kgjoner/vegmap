import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleRestaurantLike, changeSelectedRestaurant } from '../store/restaurant/actions'
import { openPopup } from '../store/popup/actions'
import { popups } from '../store/popup/actionTypes'
import { mapModes } from '../store/map/actionTypes'

import "./restaurantCard.css"

function RestaurantCard({ restaurant, variant }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const user = useSelector(state => state.user.user)
  const isWaiting = useSelector(state => state.restaurant.liking)
  const isOnMap = useSelector(state => state.map.mapMode !== mapModes.HIDDEN)
  const dispatch = useDispatch()

  useEffect(() => {
    if(showMenu) {
      window.addEventListener('click', hideMenu)
    }
  }, [showMenu])

  function hideMenu(e) {
    if(e.target !== document.querySelector('.restaurant-card__menu')) {
      window.removeEventListener('click', hideMenu)
      setShowMenu(false)
    }
  }

  function copyCoordinatesToClipboard(id) {
    if(!id) return
    const coordsEl = document.getElementById(`coords-${id}`)
    coordsEl.select();
    coordsEl.setSelectionRange(0, 99999);
    document.execCommand("copy");
    setShowAlert(true)
    setTimeout(() => {
      setShowAlert(false)
    }, 1000)
  }

  function like() {
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

  return (
    <li className={`restaurant-card ${restaurant.type} ${variant ? `restaurant-card--${variant}` : ''}`}>
      <div className="restaurant-card__flags">
        { restaurant.option.vegan ? 
          <div className="restaurant-card__flag restaurant-card__flag--vegan"></div> : null }
        { restaurant.option.vegetarian ? 
          <div className="restaurant-card__flag restaurant-card__flag--vegetarian"></div> : null }
      </div>
      { user && !isOnMap ? 
        <button className="restaurant-card__config" onClick={() => setShowMenu(true)}>
          <div className="icon icon--elipsis"></div>
        </button> : null
      }
      <ul className={`restaurant-card__menu ${showMenu ? 'restaurant-card__menu--visible' : ''}`}>
          <li className="restaurant-card__menu-item" 
            onClick={e => editRestaurant()}>
              editar
          </li>
          <li className="restaurant-card__menu-item">denunciar</li>
      </ul>
      <header className="restaurant-card__header">
      { restaurant.pictureURL ?
          <img src={restaurant.pictureURL} className="restaurant-card__picture" alt="foto"/> :
          <div className="restaurant-card__picture restaurant-card__picture--icon">
            <div className="icon icon--leaf"></div>
          </div>
        }
        <div>
          <strong className="restaurant-card__name">
            {restaurant.name || restaurant.username}
          </strong>
          <span className="restaurant-card__foods">
            {restaurant.foods.length <= 3 ? restaurant.foods.join(', ')
            : restaurant.foods.slice(0, 3).join(', ') + '…'}
          </span>
        </div>
      </header>
      <div className="restaurant-card__body">
        <div className="restaurant-card__links">
          { restaurant.website ? <a href={`http://${restaurant.website}`} target="_blank"
            className="restaurant-card__link" rel="noopener noreferrer">
              <div className="icon icon--home"></div>
          </a> : null }
          { restaurant.facebookUsername ? <a href={`https://facebook.com/${restaurant.facebookUsername}`} target="_blank"
            className="restaurant-card__link" rel="noopener noreferrer">
              <div className="icon icon--facebook"></div>
          </a> : null }
          { restaurant.instagramUsername ? <a href={`https://instagram.com/${restaurant.instagramUsername}`} target="_blank"
            className="restaurant-card__link" rel="noopener noreferrer">
              <div className="icon icon--instagram"></div>
          </a> : null }
        </div>
        <div className="restaurant-card__like-info">
          { restaurant.likes.length }
          <button className="restaurant-card__like-btn"
            onClick={() => like()}>
            <div className={!user || (user && restaurant.likes.indexOf(user.userID) === -1) ? 
              'icon icon--star' : 'icon icon--star-filled'}></div>
          </button>
        </div>
      </div>
      <footer className="restaurant-card__footer">
        <p className="restaurant-card__address">{restaurant.address}</p>
        <button className="restaurant-card__coords" 
          onClick={e => copyCoordinatesToClipboard(restaurant._id)}>
          <div className="restaurant-card__btn-container">
            Copiar Coordenadas
            <div className="icon icon--pin"></div>
          </div>
        </button>
        <input id={`coords-${restaurant._id}`} style={{opacity: 0, position: 'absolute'}} 
          defaultValue={[...restaurant.location.coordinates].reverse().join(', ')}></input>
      </footer>
      <div className={`restaurant-card__alert ${showAlert ? 'restaurant-card__alert--appear' : ''}`}>
        copiadas!
      </div>
    </li>
  )
}

export default RestaurantCard