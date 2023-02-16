import React from 'react'
import Hero from '../../Asset/SVG/SecondHero.svg'
function PartTwo() {
  return (
    <div className="flexRow"  id="partTwo">
      <div className="secondHero">
        <img src={Hero} className="heroTwo" alt="" />
      </div>
      <article className="secondArticle flexColumn">
        <h1>why precision</h1>
        <p>We help you transform your tutor-student relationship with the 
          great technological advancement to increase the efficiency of the educational system.
        </p>
      </article>
    </div>
  )
}

export default PartTwo