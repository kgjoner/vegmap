import React, { useState, useEffect } from 'react'
import FoodInput from './utils/FoodInput'
import api from '../services/api'
import './searchBar.css'

function SearchBar({ userLocation, setRestaurants, isOnMap }) {
  const [query, setQuery] = useState([])
  const [option, setOption] = useState({ vegan: true, vegetarian: true })

  useEffect(() => {
    document.getElementById('both').checked = true
  }, [])

  useEffect(() => {
    submitQuery()
  }, [option])

  function submitQuery() {
    api.get('/search', { params: { 
      ...userLocation,
      foods: query.join(','), 
      ...option,
    }}).then(resp => {
      setRestaurants(resp.data)
    })
  }

  function handleCheckbox(value, target) {
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
          error={{msg: null}}
        />

        <div className="search-bar__options">
          <label className="search-bar__option">
            Todos
            <input className="search-bar__radio" type="radio" name="option" id="both"
              onChange={e => handleCheckbox(e.target.checked, 'both')} />
            <span className="search-bar__checkmark"></span>
          </label>
          <label className="search-bar__option">
            Vegano
            <input className="search-bar__radio" type="radio" name="option" id="vegan-option"
              onChange={e => handleCheckbox(e.target.checked, 'vegan')}/>
            <span className="search-bar__checkmark"></span>
          </label>
          <label className="search-bar__option">
            Vegetariano
            <input className="search-bar__radio" type="radio" name="option" id="vegetarian-option"
              onChange={e => handleCheckbox(e.target.checked, 'vegetarian')}/>
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

export default SearchBar