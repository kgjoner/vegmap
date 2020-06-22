import React from 'react'

import './input.css'


function Input({ value, setValue, type = 'text', id, label, error, prepend }) {
  return (
    <div className="input">
      <label htmlFor={id}
        className="input__label">
        {label}
      </label>
      <div className="input__container">
        <input id={id}
          className={`input__field ${error ? 'input__field--error' : ''}`}
          type={type} 
          name={id} 
          value={value}
          onChange={e => setValue(e.target.value)}>
        </input>
        {prepend && 
          <div className="input__prepend">
            {prepend}
          </div>
        }
      </div>
    </div>
  )
}

export default Input