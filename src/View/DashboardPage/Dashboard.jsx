import React, { useEffect } from 'react'
import Hero from '../../Asset/SVG/Footer_Hero.svg'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getMyExam } from '../../Model/ExamSlice'
import { refreshUser } from '../../Model/userSlice'
function Dashboard() {
  const state = useSelector(state => state.userSlice.user)
  const role = state.role === 'tutor' ? true : false
  const examStore = useSelector(state => state.examSlice)
  const myExam = examStore.myExam.slice(0, 2)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getMyExam())
  },[])
  return (
    <div id="dashboard" >
      <section id="dashboardSectionOne" className="flexRow">
        <div className='flexColumn'>
          <h1>Welcome, Mr {state.username} </h1>
          <p> Your exam will be here in a short time, while waiting kindly
            checkout other exams on the platform.
          </p>
          <Link to="/allexams" id="dashboardLink1" className='moveTo'>all exam</Link>
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
          {myExam.length !== 0 ? myExam.map(elem => <Link className='dashboardMyExam flexColumn'
            to={`myexams/${elem.exam_id}`} key={elem.exam_id}>
            <img className='dashboardMyExamImg' alt={elem.title} src={`https://jcvvwzvbnanankfrxxzd.supabase.co/storage/v1/object/public/exam/folder/${elem.exam_img_name}`} />
            <div className="dashboardMyExamNote">
              <h3 > {elem.title} {elem.title.length > 25 && "....."} </h3>
              <p> {elem.description.slice(0, 25)} {elem.description.length > 25 ? "....." : null} </p>
            </div>
          </Link>) : <>
              <h1 id='dashboardNoExam'>You have no exam Currently</h1>
              {role ? <Link to="examcreate" id="dashboardExamRegBtn" className='moveTo'>create exam</Link> :
                <Link to="allexams" id="dashboardExamRegBtn" className='moveTo'>register for exam</Link>}
           
            </>
           }
        </div>
      </section>
    </div>
  )
}
export default Dashboard