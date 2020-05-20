import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { connect, disconnect } from '../services/socket'
import { getRestaurants } from '../store/restaurant/actions'
import { mapModes } from '../store/map/actionTypes'

import FoodInput from './utils/FoodInput'
import './searchBar.css'


function SearchBar() {
  const [query, setQuery] = useState([])
  const [option, setOption] = useState({ vegan: true, vegetarian: true })

  const location = useSelector(state => state.map.centerMapLocation)
  const isOnMap = useSelector(state => state.map.mapMode === mapModes.RESTAURANTS)
  const dispatch = useDispatch()

  useEffect(() => {
    document.getElementById('both').checked = true
  }, [])

  useEffect(() => {
    submitQuery()
  }, [option, location])

  function submitQuery() {
    if(!location || !location.latitude) return
    const params = {
      ...location,
      foods: query.join(','), 
      ...option
    }
    dispatch(getRestaurants(params))
    setupWebsocket(params)
  }

  function setupWebsocket(params) {
    disconnect()
    connect(params)
  }

  function handleRadio(value, target) {
    if(!value) return
    const newOption = {
      vegan: target !== 'vegetarian',
      vegetarian: target !== 'vegan'
    }
    setOption(newOption)
  }

  return (
    <div className={`search-bar ${isOnMap? 'search-bar--map' : ''}`}>
      <div className="search-bar__container">
        <FoodInput variant="search"
          foods={query}
          setFoods={setQuery}
          error={null}
          onEnter={submitQuery}
        />

        <div className="search-bar__options">
          <label className="search-bar__option">
            Todos
            <input className="search-bar__radio" type="radio" name="option" id="both"
              onChange={e => handleRadio(e.target.checked, 'both')} />
            <span className="search-bar__checkmark"></span>
          </label>
          <label className="search-bar__option">
            Vegano
            <input className="search-bar__radio" type="radio" name="option" id="vegan-radio"
              onChange={e => handleRadio(e.target.checked, 'vegan')}/>
            <span className="search-bar__checkmark"></span>
          </label>
          <label className="search-bar__option">
            Vegetariano
            <input className="search-bar__radio" type="radio" name="option" id="vegetarian-radio"
              onChange={e => handleRadio(e.target.checked, 'vegetarian')}/>
            <span className="search-bar__checkmark"></span>
          </label>
        </div>
      </div>

      <button className="search-bar__btn"
        onClick={submitQuery}>
        Buscar
      </button>
    </div>
  )
}

export default  SearchBar;