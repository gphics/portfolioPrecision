import React from 'react'
import Hero from '../../Asset/SVG/Footer_Hero.svg'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
function Dashboard() {
  const state = useSelector(state => state.userSlice.user)
  return (
    <div id="dashboard" >
      <section id="dashboardSectionOne" className="flexRow">
        <div className='flexColumn'>
          <h1>Welcome, Mr {state.username} </h1>
          <p> Your exam will be here in a short time, while waiting kindly make use of the
            past question section of the platform.
          </p>
          <Link to="/pastquestions" id="dashboardLink1" className='moveTo'>Past question</Link>
        </div>
        <div className='dashboardSectionOneHero'>
          <img src={Hero} alt="success image" />
        </div>
      </section>
      <section id='dashboardSectionTwo' className='flexColumn'>
        <div id="sectionTwoHeader" className="flexRow">
          <h1>my exams</h1>
          <Link to="/myexams" className="viewAll"> view all</Link>
        </div>
        <div id="sectionTwoList" className='flexRow'>
          
      <div></div>
      <div></div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard