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