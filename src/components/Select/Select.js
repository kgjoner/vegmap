import React from 'react'
import './select.css'

function Select({ value, setValue, options, id, label, error }) {
  return (
    <div className="select">
      <label htmlFor={id}
        className="select__label">
        {label}
      </label>
      <select name={id} id={id}
        className={`select__field ${error ? 'select__field--error' : ''}`}
        value={value}
        onChange={e => setValue(e.target.value)}>
          <option value="">-- Selecione --</option>
          {options.map((option, index) => (
            <option value={option.value} key={index}>{option.label || option.value}</option>
          ))}
      </select>
    </div>
  )
}

export default Select