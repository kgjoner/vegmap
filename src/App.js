import React, { useState, useEffect } from 'react';
import Presentation from './components/Presentation'
import SignupBox from './components/SignupBox'
import RestaurantCard from './components/RestaurantCard'

import './assets/css/global.css'
import './assets/css/icon.css'
import './App.css'
import api from './services/api';

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    api.get('/restaurants')
      .then(resp => {
        setRestaurants(resp.data)
      })
  }, [])

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
      <div className="container">
        { showPopup ?
          <div className="popup-bg" onClick={e => closePopup(e)}>
            <SignupBox addRestaurant={addRestaurant} 
              closePopup={closePopup}
              selectedRestaurant={selectedRestaurant}
              user={user} />
          </div> 
          : null
        }
        <Presentation setShowPopup={setShowPopup} 
          user={user} 
          setUser={setUser} />
        <main>
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
    </div>
  )
}

export default App;
