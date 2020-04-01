import React from 'react'
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

  return (
    <li className={`restaurant-card ${restaurant.type}`}>
      { !user ? 
        <button className="edit-box" onClick={e => edit(restaurant)}>
          <div className="edit-icon"></div>
        </button> : null
      }
      <header>
      { restaurant.pictureURL ?
          <img src={restaurant.pictureURL} alt="foto"/> :
          <div className="icon-box">
            <div className="leaf-icon"></div>
          </div>
        }
        <div className="user-info">
          <strong>{restaurant.name || restaurant.username}</strong>
          <span>{restaurant.foods.length <= 3 ? restaurant.foods.join(', ')
            : restaurant.foods.slice(0, 3).join(', ') + '…'}</span>
        </div>
      </header>
      <div className="body-info">
        <div className="external-links">
          { restaurant.website ? <a href={`http://${restaurant.website}`} target="_blank"
            rel="noopener noreferrer"><div className="site-icon"></div></a> : null }
          { restaurant.facebookUsername ? <a href={`https://facebook.com/${restaurant.facebookUsername}`} target="_blank"
            rel="noopener noreferrer"><div className="fb-icon"></div></a> : null }
          { restaurant.instagramUsername ? <a href={`https://instagram.com/${restaurant.instagramUsername}`} target="_blank"
            rel="noopener noreferrer"><div className="ig-icon"></div></a> : null }
        </div>
      </div>
      <footer>
        <p>{restaurant.address}</p>
        <button className="copy-coord" 
          onClick={e => copyCoordinatesToClipboard(restaurant._id)}>
          <div className="content-box">
            Copiar Coordenadas
            <div className="pin-icon"></div>
          </div>
        </button>
        <input id={`coords-${restaurant._id}`} style={{opacity: 0, position: 'absolute'}} 
          defaultValue={restaurant.location.coordinates.reverse().join(' ')}></input>
      </footer>
    </li>
  )
}

export default RestaurantCard