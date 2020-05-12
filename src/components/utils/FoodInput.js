import React, { useState, useEffect } from 'react'
import normalizeFood from '../../utils/normalizeFood'
import { getAllFoods } from '../../utils/foodTable'
import "./foodInput.css"

function FoodInput({ foods, setFoods, error, variant, onEnter }) {
  const [foodHint, setFoodHint] = useState('')
  const [foodOnTyping, setFoodOnTyping] = useState('')
  const [allFoods, setAllFoods] = useState([])
  const [focus, setFocus] = useState(false)
  const [render, setRender] = useState(false)

  useEffect(() => {
    setAllFoods(getAllFoods())
  }, [])

  function normalizeString(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f ,;/\\|]/g, "")
  }

  function handleFoodOptions(food) {
    setFoodOnTyping(food.toLowerCase())
    if(food.length < 2) {
      setFoodHint('')
      return
    }
    let foodHint = allFoods.filter(f => !foods.includes(f))
      .filter(f => {
        const norm = new RegExp('^' + normalizeString(food))
        return normalizeString(f).match(norm)
      })[0] || ''
    
    setFoodHint(foodHint)
  }

  function handleKeyInput(e) {
    if (e.key === 'Tab' && foodHint) {
      e.preventDefault()
      addFoodToChain(foodHint)
    }

    const separatorKeys = [',', ';', '.', ' ', '/', '\\', '|']
    if(separatorKeys.indexOf(e.key) !== -1) {
      e.preventDefault()
      addFoodToChain(foodOnTyping)
    }

    if(e.key === 'Enter') {
      e.preventDefault()
      addFoodToChain(foodHint)
      if(onEnter) onEnter()
    }

    if(e.key === 'Backspace' && foodOnTyping.length === 0) {
      const newChain = foods
      newChain.pop()
      setFoods(newChain)
      setFoodHint('')
      setFoodOnTyping('')
      setRender(!render)
    }
  }

  function addFoodToChain(food) {
    food = normalizeFood(food)
    const newChain = foods
    if(food) {
      newChain.push(food)
    }
    setFoods(newChain)
    setFoodHint('')
    setFoodOnTyping('')
  }

  function goOutOfFocus() {
    setFocus(false)
    setFoodHint('')
    if(foodHint) {
      addFoodToChain(foodHint)
    } else {
      setFoodOnTyping('')
    }
  }

  return (
    <div className={`food-input 
      ${focus ? 'food-input--focused' : ''}
      ${error.target === 'food' ? 'error' : ''}
      ${variant? `food-input--${variant}` : ''}`}
    >  
      {foods.length > 0 ?
        foods.map((food, index) => (
          <span className="typed-food" key={index}>{food}</span>
        )) : null
      }
      <div className="typing-group">
        {foodHint ? <p className="food-hint">{foodHint}</p> : null}
        <input name="foods" id="foods" 
          placeholder={variant === 'search' && foods.length === 0 ? 'Pesquise por comidas...' : ''}
          value={foodOnTyping}
          onChange={e => handleFoodOptions(e.target.value)}
          onKeyDown={e => handleKeyInput(e)}
          onFocus={e => setFocus(true)}
          onBlur={goOutOfFocus}>
        </input>
      </div>
    </div>
  )
}

export default FoodInput