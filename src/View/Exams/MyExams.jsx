import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeIsRedirect, getMyExam, sortMyExam } from '../../Model/ExamSlice'
import {LoadingSpinner} from '../Utils'
import ExamList from './ExamList'
import { refreshUser } from '../../Model/userSlice'
import { supabase } from '../../Controller'
function MyExam() {
  const dispatch = useDispatch()
  const state = useSelector(state => state.examSlice)
  const isLoading = useSelector(state => state.examSlice.isLoading)
  const myExamSearch = useSelector(state => state.examSlice.myExamSearch)
  const place = window.location.pathname === '/allexams' ? true : false
  console.log(place)
  useEffect(() => {
    if (place) {
      
      dispatch(getMyExam())
      return;
    }
    ///
    dispatch(refreshUser())
    dispatch(changeIsRedirect())
    dispatch(getMyExam())

  }, [])
  
  function handleChange(e) {
    if (place) {
      const obj = state.allExamCopy.filter(elem => {
        const val = e.target.value.toLowerCase()
        return elem.title.toLowerCase().includes(val)
      })
      dispatch(sortMyExam({ obj, value: e.target.value, type: 'all' }))
    }
    const obj = state.myExamCopy.filter(elem => {
      const val = e.target.value.toLowerCase()
      return elem.title.toLowerCase().includes(val)
    })
    dispatch(sortMyExam({obj, value: e.target.value, type: 'mine'}))
  }
  return (
    <div id="myExams" className='flexColumn'>
      <section id="myExamsListHeader">
        {isLoading &&
          <LoadingSpinner />}
        {place ? <h1>All exams </h1> : <h1>My exams</h1>}
        <input type="text" id="myExamsSearch" placeholder='search by title ....' value={myExamSearch} onChange={handleChange}/>
      </section>
      {/* section 2 */}
      <section id="myExamsListing">
        {place === true ? state.allExam.length !== 0 ? state.allExam.map(item => <ExamList key={item.exam_id}
          {...item} />) : <h1 id='myExamNotFound'> Empty !!! </h1> : state.myExam.length !== 0 ? state.myExam.map(item => <ExamList key={item.id}  {...item} />) :
          <h1 id='myExamNotFound'> Empty !!! </h1>}
     
      </section>
    </div>

  )
}

export default MyExam