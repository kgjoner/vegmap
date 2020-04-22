import React from 'react'
import api from '../services/api'
import "./restaurantCard.css"

function RestaurantCard({ restaurant, user, edit }) {
  function copyCoordinatesToClipboard(id) {
    if(!id) return
    const coordsEl = document.getElementById(`coords-${id}`)
    console.log(coordsEl, id)
    coordsEl.select();
    coordsEl.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert('Coordenadas Copiadas!')
  }

  function likeRestaurant() {
    if(!user || restaurant.likes.indexOf(user.userID) !== -1) return 
    const payload = {
      username: restaurant.username,
      author: user,
      action: 'like'
    }
    api.put('/restaurants', payload)
  }

  return (
    <li className={`restaurant-card ${restaurant.type}`}>
      <div className="restaurant-card__flags">
        { restaurant.option && restaurant.option.vegan ? 
          <div className="restaurant-card__flag restaurant-card__flag--vegan"></div> : null }
        { restaurant.option && restaurant.option.vegetarian ? 
          <div className="restaurant-card__flag restaurant-card__flag--vegetarian"></div> : null }
      </div>
      { user ? 
        <button className="restaurant-card__edit" onClick={e => edit(restaurant)}>
          <div className="icon icon--edit"></div>
        </button> : null
      }
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
            onClick={e => likeRestaurant()}>
            <div className={!user || (user && restaurant.likes.indexOf(user.userID) === -1) ? 
              'icon icon--chef' : 'icon icon--chef-filled'}></div>
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
          defaultValue={restaurant.location.coordinates.reverse().join(' ')}></input>
      </footer>
    </li>
  )
}

export default RestaurantCard