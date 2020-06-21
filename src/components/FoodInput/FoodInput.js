import React from 'react'
import "./foodInput.css"

function FoodInput({ savedFoods, foodOnTyping, foodHint, handlers, label, error, variant }) {
  return (
    <div className={`food-input
      ${variant? `food-input--${variant}` : ''}`} >

      <label htmlFor="foods"
        className="food-input__label">
        {label}
      </label>

      <div className={`food-input__container 
        ${error && error.name === 'foods' ? 'error' : ''}`}>  

        {savedFoods.length > 0 ?
          savedFoods.map((food, index) => (
            <span className="food-input__typed-food" key={index}>
              {food}
            </span>
          )) : null
        }

        <div className="food-input__typing-food">
          {foodHint &&
            <p className="food-input__hint">{foodHint}</p>
          }
          <input name="foods" id="foods"
            type={variant === 'search' ? 'search' : 'text'}
            className="food-input__field"
            placeholder={variant === 'search' && savedFoods.length === 0 ? 'Pesquise por comidas...' : ''}
            value={foodOnTyping}
            onChange={e => handlers.change(e.target.value)}
            onKeyDown={e => handlers.keyInput(e)}
            onBlur={handlers.blur}>
          </input>
        </div>
        
      </div>
    </div>

  )
}

export default FoodInput