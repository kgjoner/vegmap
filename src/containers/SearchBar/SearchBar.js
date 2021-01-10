import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getRestaurants } from '../../store/restaurant/actions'
import { mapModes } from '../../constants/systemTypes'
import useFood from '../../hooks/useFood'

import FoodInput from '../../components/FoodInput'
import './searchBar.css'


function SearchBar() {
  const [query, foodOnTyping, foodHint, handlers] = useFood([])

  const isOnMap = useSelector(state => state.map.mapMode === mapModes.RESTAURANTS)
  const dispatch = useDispatch()

  function submitQuery(e) {
    if(e) e.preventDefault()
    const foodsString = query.join(',')
    dispatch(getRestaurants(foodsString))
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
        <button className="search-bar__btn"
          type="submit">
          Buscar
        </button>
      </div>


    </form>
  )
}

export default  SearchBar;