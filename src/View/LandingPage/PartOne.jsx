import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../../Asset/SVG/HeroFirst.png'

function PartOne() {
  return (
      <div id="partOne">
          <article className="flexColumn firstArticle">
              <aside className="intro flexColumn">
                  <h1>Transforming the</h1>
                  <h1>examination system</h1>
              </aside>
              <aside className="intro flexColumn">
                  <p>
                      We host examination for Tutors, delivering it to Students and returning back 
                      the result swiftly.
                  </p>
              </aside>
              <aside className="intro flexColumn">
                  <h1>ready for</h1>
                  <h1>the transformation ?</h1>
                  <Link to='/landing/register' className="moveTo">get started</Link>
              </aside>
          </article>
          <div className="firstHero flexColumn">
              <img className="heroOne" src={Hero} alt="Tutor image" />
          </div>
          
    </div>
  )
}

export default PartOne