import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { subscribeToNewRestaurant, subscribeToUpdateRestaurant } from './services/socket'
import { addRestaurant, updateRestaurant } from './store/restaurant/actions'
import { getUserLocation } from './store/map/actions'
import { mapModes } from './store/map/actionTypes'

import Presentation from './components/Presentation'
import SearchBar from './components/SearchBar'
import RestaurantCard from './components/RestaurantCard'
import Maps from './components/Map'
import Popup from './components/Popup'

import './assets/css/global.css'
import './assets/css/icon.css'
import './App.css'


function App() {
  const restaurants = useSelector(state => state.restaurant.restaurants)
  const mapMode = useSelector(state => state.map.mapMode)
  const centerMapLocation = useSelector(state => state.map.centerMapLocation)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUserLocation())
  }, [])

  useEffect(() => {
    subscribeToNewRestaurant(restaurant => addRestaurant({ restaurant, receivedViaSocket: true }))
    subscribeToUpdateRestaurant(restaurant => updateRestaurant({ restaurant, receivedViaSocket: true }))
  }, [restaurants])
  

  return (
    <div id="app">
      {centerMapLocation.latitude ?
        <Maps />  : null
      }
      <SearchBar />
      { mapMode === mapModes.HIDDEN ? 
        <div className={`container`}>
          <Presentation />
          <main>
            <ul className="app__card-list">
              {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant._id} 
                  restaurant={restaurant} />
              ))}
            </ul>
          </main>
        </div> : null
      }
      <Popup />
    </div>
  )
}

export default App;
