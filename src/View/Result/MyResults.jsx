import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyExam } from '../../Model/ExamSlice'
import CreatorResult from './Utils/Creator'
import StudentResults from './Utils/Student'

function MyResult() {
  const { user: { role } } = useSelector(state => state.userSlice)
  const { myExam } = useSelector(state => state.examSlice)
  const creatorState = role === 'tutor' ? true : false
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getMyExam())
  }, [])

  if (myExam.length === 0) {
    return <div id="myResult">
      <h3>No result to display</h3>
    </div>
  }
  if (!creatorState) {
    return <div id="myResult" className="flexColumn">
      <h1>my results</h1>
      <div className="ResultListing">
        {myExam && myExam.map((item, i) => {
          return <StudentResults key={i} {...item} />
        })}
        
      </div>

    </div>
  }
  return (
    <div id="myResult" className="flexColumn">
      <h1>my results</h1>
      <div className="ResultListing">

{myExam && myExam.map((item, i) => <CreatorResult {...item} key={i} />)}
     
      </div>
    </div>
  )
}

export default MyResult 