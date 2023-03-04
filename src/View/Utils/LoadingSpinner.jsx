import React from 'react'

function LoadingSpinner({customID}) {
  return (
    <div id={customID ||  null} className='loading'>
      <div className='spinner'></div>
    </div>
  )
}

export default LoadingSpinner