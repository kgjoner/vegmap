import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getRestaurants } from '../../store/restaurant/actions'
import { mapModes } from '../../constants/systemTypes'
import useFood from '../../hooks/useFood'

import FoodInput from '../../components/FoodInput'
import './searchBar.css'


function SearchBar() {
  const [query, foodOnTyping, foodHint, handlers] = useFood([])
  const [option, setOption] = useState({ vegan: true, vegetarian: true })

  const isOnMap = useSelector(state => state.map.mapMode === mapModes.RESTAURANTS)
  const dispatch = useDispatch()

  useEffect(() => {
    submitQuery()
  }, [option])

  function submitQuery(e) {
    if(e) e.preventDefault()
    const params = {
      foods: query.join(','), 
      ...option
    }
    dispatch(getRestaurants(params))
  }

  function handleRadio(target) {
    target.blur()
    const newOption = {
      vegan: target.value !== 'vegetarian',
      vegetarian: target.value !== 'vegan'
    }
    setOption(newOption)
  }

  return (
    <form className={`search-bar 
      ${isOnMap? 'search-bar--map' : ''}`}
      onSubmit={submitQuery}
      role="search">
        
      <div className="search-bar__container">
        <FoodInput variant="search"
          savedFoods={query}
          foodOnTyping={foodOnTyping}
          foodHint={foodHint}
          handlers={handlers}
          error={null}
        />

        <div className="search-bar__options">
          <label className="search-bar__option">
            Todos
            <input className="search-bar__radio" type="radio" name="option" 
              value="both"
              checked={option.vegan && option.vegetarian}
              onChange={e => handleRadio(e.target)} />
            <span className="search-bar__checkmark"></span>
          </label>
          <label className="search-bar__option">
            Vegano
            <input className="search-bar__radio" type="radio" name="option" 
              value="vegan"
              checked={option.vegan && !option.vegetarian}
              onChange={e => handleRadio(e.target)}/>
            <span className="search-bar__checkmark"></span>
          </label>
          <label className="search-bar__option">
            Vegetariano
            <input className="search-bar__radio" type="radio" name="option" 
              value="vegetarian"
              checked={option.vegetarian && !option.vegan}
              onChange={e => handleRadio(e.target)}/>
            <span className="search-bar__checkmark"></span>
          </label>
        </div>
      </div>

      <button className="search-bar__btn"
        type="submit">
        Buscar
      </button>

    </form>
  )
}

export default  SearchBar;