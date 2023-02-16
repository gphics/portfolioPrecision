import React from 'react'

function Card({mainClass, img, body, title}) {
  return (
      <div className={mainClass}>
          <h3> {title} </h3>
          <img src={img} alt="card-image" />
          <p> {body} </p>
    </div>
  )
}

export default Card