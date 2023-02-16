import React from 'react'

function Input({type, name, holderClass, inpClass}) {
  return (
    <div className={`flexColumn ${holderClass}`}>
      <label htmlFor={name}>{name}</label>
          <input autocomplete className={inpClass} name={name} type={type} />
    </div>
  )
}

export default Input