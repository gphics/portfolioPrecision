import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTotalScore, updateScore } from '../../Model/ExamSlice'
import EachQuestionComponent from './Utils/EachQuestionComponent'
function Main({ handleSubmit, Test }) {


    const dispatch = useDispatch()

    useEffect(() => {
        let total = 0
        if (Test) {
            Test.map(elem => {
                if (elem.score) {
                    total += elem.score
                }
            })
            dispatch(setTotalScore(total))
        }
    },[Test])

    return (
        <form onSubmit={handleSubmit} id="examAnsweringForm" className='flexColumn'>
            {Test.map((item , index) => {
                return <EachQuestionComponent {...item} num={index} key={index} />
            })}
 
        </form>
    )
}



export default Main