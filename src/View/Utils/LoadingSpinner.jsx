import React from 'react'

function LoadingSpinner({customID}) {
  return (
    <section id="backdrop">
      <div id={customID || null} className='loading'>
        <div className='spinner'></div>
      </div>
    </section>
 
  )
} 

export default LoadingSpinner