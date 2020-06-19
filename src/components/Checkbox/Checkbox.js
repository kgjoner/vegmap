import React from 'react'
import './checkbox.css'

function Checkbox({ options, id, label, error }) {
  return (
    <div className={`checkbox 
      ${error && error.name === id ? 'checkbox--error' : ''}`}>
      <label className="checkbox__label">
        {label}
      </label>
      {options.map((option, index) => (
        <div className="checkbox__option" key={index}>
          <input id={option.id}
            className="checkbox__field"
            type="checkbox" 
            disabled={option.disabled}
            checked={option.value}
            onChange={e => option.setValue(e.target.checked)}/>
          <label htmlFor={option.id}
            className="checkbox__label checkbox__label--option">
            {option.label}
          </label>
        </div>
      ))}
    </div>
  )
}

export default Checkbox