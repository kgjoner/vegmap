import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { verifyConnection, setConnection, verifyServiceWorker, getPermission } from './store/system/actions'
import { mapModes } from './constants/systemTypes'

import Maps from './containers/Maps'
import Presentation from './containers/Presentation'
import RestaurantCard from './containers/RestaurantCard'
import SearchBar from './containers/SearchBar'
import Popup from './containers/Popup'
import Toaster from './containers/Toaster/Toaster'

import './assets/css/global.css'
import './assets/css/icon.css'
import './App.css'


function App() {
  const restaurants = useSelector(state => state.restaurant.restaurants)
  const isLoading = useSelector(state => state.restaurant.getting)
  const mapMode = useSelector(state => state.map.mapMode)
  const [userAskedForMapOnce, setUserAskedForMapOnce] = useState(false)
  const dispatch = useDispatch()

  
  useEffect(() => {
    dispatch(verifyConnection())
    dispatch(verifyServiceWorker())
    dispatch(getPermission())

    window.addEventListener('offline', () => dispatch(setConnection(false)))
    window.addEventListener('online', () => dispatch(setConnection(true)))

    return () => {
      window.removeEventListener('offline', () => dispatch(setConnection(false)))
      window.removeEventListener('online', () => dispatch(setConnection(true)))
    }
  }, [dispatch])


  useEffect(() => {
    if(userAskedForMapOnce) return
    if(mapMode !== mapModes.HIDDEN) {
      setUserAskedForMapOnce(true)
    }
  }, [mapMode, userAskedForMapOnce])
  

  return (
    <div id="app">
      {userAskedForMapOnce ?
        <Maps />  : null
      }
      <SearchBar />
      { mapMode === mapModes.HIDDEN ? 
        <div className="container">
          <Presentation />
          <main>
            {isLoading ?
              <div className="app__loading">
                <div className="icon icon--loading icon--light icon--bigger"></div>
              </div> :
              restaurants.length
                ? <ul className="app__card-list">
                    {restaurants.map(restaurant => (
                      <RestaurantCard key={restaurant._id} 
                        restaurant={restaurant} />
                    ))}
                  </ul>
                : <p className="app__message">Nenhum restaurante encontrado.</p>
            }
          </main>
        </div> : null
      }
      <Popup />
      <Toaster />
    </div>
  )
}

export default App;
