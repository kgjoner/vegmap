import React, { useState, useEffect } from 'react';
import Presentation from './components/Presentation'
import SignupBox from './components/SignupBox'
import SearchBar from './components/SearchBar'
import RestaurantCard from './components/RestaurantCard'
import Maps from './components/Map'

import './assets/css/global.css'
import './assets/css/icon.css'
import './App.css'
import api from './services/api';

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [user, setUser] = useState(null)
  const [userLocation, setUserLocation] = useState({latitude: null, longitude: null})
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    api.get('/restaurants')
      .then(resp => {
        setRestaurants(resp.data)
      })

    getCoords()
  }, [])

  function getCoords() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ latitude, longitude })
      },
      (err) => {
        console.log(err)
      },
      {
        timeout: 30000,
      }
    )
  }

  function addRestaurant(newRestaurant) {
    setRestaurants([...restaurants, newRestaurant])
  }

  function closePopup(e) {
    if(!e || e.target === document.querySelector('.popup-bg')) {
      setShowPopup(false)
      if(selectedRestaurant) setSelectedRestaurant(null)
    }
  }

  function editRestaurant(restaurant) {
    setSelectedRestaurant(restaurant)
    setShowPopup(true)
  }

  return (
    <div id="app">
      { showMap && userLocation.latitude ? 
        <Maps  center={{lat: Number(userLocation.latitude.toFixed(2)), lng: Number(userLocation.longitude.toFixed(2))}} 
          restaurants={restaurants} 
          setRestaurants={setRestaurants}
          setShowMap={setShowMap}  
        /> :

        <div className={`container ${showMap ? 'container--frontOf' : ''}`}>
          { showPopup ?
            <div className="popup-bg" onClick={e => closePopup(e)}>
              <SignupBox addRestaurant={addRestaurant} 
                closePopup={closePopup}
                selectedRestaurant={selectedRestaurant}
                user={user}
                userLocation={userLocation} />
            </div> 
            : null
          }
          <Presentation setShowPopup={setShowPopup} 
            user={user} 
            setUser={setUser}
            setShowMap={setShowMap} />
          <main>
            <SearchBar userLocation={userLocation}
              setRestaurants={setRestaurants}/>
            <ul>
              {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant._id} 
                  restaurant={ restaurant }
                  user={user} 
                  edit={editRestaurant}/>
              ))}
            </ul>
          </main>
        </div>
      }
    </div>
  )
}

export default App;
