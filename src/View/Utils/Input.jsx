import React from 'react'

function Input({type, action, name,holderClass, data, field}) {

  return (
    <div className={`flexColumn ${holderClass}`}>
      <label htmlFor={name}>{name}</label>
      <input onChange={action} value={data}
        autoComplete="true" data-field={field}
         name={name} type={type} />
   
    </div>
  )
}

export default Input