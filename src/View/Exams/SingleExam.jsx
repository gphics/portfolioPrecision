import React, { useEffect, useState } from 'react'
import { getCurrentExam } from '../../Model/ExamSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { LoadingSpinner } from '../Utils'
import { SingleExamInfo, CreatorInfo } from './Utils'
function SingleExa() {
  const { examID } = useParams()
  const dispatch = useDispatch()
  const state = useSelector(state => state.examSlice)
  const [part, setPart] = useState(0)

  useEffect(() => {
    dispatch(getCurrentExam(examID))
  },[])
  return (
    <div id="singleExamContainer" className='flexColumn'>
      {state.isLoading ? <LoadingSpinner customID="singleExamLoadingSpinner" />:
      <>
      <div id="singleExamBtn" className='flexRow'>
        <button style={{background: part === 0 ? "var(--accent-color)":"var(--primary-color)"}} onClick={()=>setPart(0)}  className="moveTo">Exam</button>
        <button style={{background: part === 1 ? "var(--accent-color)":"var(--primary-color)"}} onClick={()=>setPart(1)} className="moveTo">creator</button>
      </div>
          {part === 0 && state.currentExam.length !== 0 ? <SingleExamInfo {...state.currentExam[0]} /> : <CreatorInfo {...state.currentExam[1]} />}
        </>
  }
    </div>
  )
}




export default SingleExa