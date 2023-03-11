import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { submitExam } from '../../Model/ExamSlice'
import LoadingSpinner from '../Utils/LoadingSpinner'
import Main from './Main'
function ExamAnswerin() {
    const dispatch = useDispatch()
    const state = useSelector(state => state.examSlice.currentExam[0])
    const {isPreview, isLoading} = useSelector(state => state.examSlice)
    const currentExam = useSelector(state => state.examSlice.currentExam)
    const Test = state && state.Test
    const [questionNumber, setQuestionNumber] = useState(0)
    const length = Test && Test.length - 1
    const Navigate = useNavigate()
    const submitState = length === questionNumber ? true : false
    const [redirectDuration, setRedirectDuration] = useState(6)
    const [durationSeconds, setDurationSeconds] = useState(60)
    const [durationMinutes, setDurationMinutes] = useState(currentExam.length > 0 && +currentExam[0].duration)
    const [isShowDuration, setIsShowDuration] = useState(true)
    let redirectDurationClearer;
    useEffect(() => {

        if (currentExam.length === 0) {
            redirectDurationClearer = setInterval(() => {
                setRedirectDuration(prev => prev - 1)
            }, 1000)
        }
        return ()=> clearInterval(redirectDurationClearer)
    }, [])

    function changeQuestionVisible(n = "") {
        const eachQuestionComponents = document.querySelectorAll('.eachQuestionComponent')
        eachQuestionComponents.forEach(elem => {
            const tab = +elem.dataset.tab
            elem.classList.add("hideEachExamQuestionComponent")
            if (n !== '') {
                if (tab === n) {
                    elem.classList.remove("hideEachExamQuestionComponent")
                }
                return
            }
            if (tab === questionNumber) {
                elem.classList.remove("hideEachExamQuestionComponent")
            }
        })
    }

    function Next(e) {
        e.preventDefault()
        setQuestionNumber(prev => {

            const ans = prev === length ? prev : prev + 1
            changeQuestionVisible(ans)
            return ans
        })
    }
    function Previous(e) {
        e.preventDefault()
        setQuestionNumber(prev => {

            const ans = prev === 0 ? prev : prev - 1
            changeQuestionVisible(ans)
            return ans
        })
    }
    useEffect(() => {
        if (redirectDuration === 0) {
            Navigate("/myexams")
            return
        }
    }, [redirectDuration])
    useEffect(() => {
        changeQuestionVisible()
    },[])
    // second timer
    let firstDurationTimer;
    
    useEffect(() => {
        if (currentExam?.length === 0) return
        firstDurationTimer = setInterval(() => {
            setDurationSeconds(prev => prev !== 0 ? prev - 1 : 59)
        }, 1000)
        return ()=> clearInterval(firstDurationTimer)
    }, [])
    
    useEffect(() => {
        if (currentExam?.length === 0) return
        if (durationSeconds === 59) {
            setDurationMinutes(prev => prev !== 0 ? prev - 1 : 0)
           return 
        }
       
    }, [durationSeconds])

    useEffect(() => {
        if (currentExam?.length === 0) return;
        if (durationMinutes === 0 && durationSeconds === 0 && isPreview === false) {
            setIsShowDuration(false)
            handleSubmit()
        }
    },[durationMinutes, durationSeconds])
    function handleSubmit(e) {
       if(e) e.preventDefault()
        dispatch(submitExam())
        Navigate("/myexams")
    }

    if (currentExam?.length === 0) {
        return <div id="examAnswering" className='examTakenAlready'>
            <h3>You have taken the exam already</h3>
            <h4 style={{ color: redirectDuration <= 2 ? 'red' : 'black' }}>you will be redirected in {redirectDuration} seconds  </h4>
        </div>
    }
    return (
        <div id="examAnswering">
            <div className="examAnsweringIntro">
                <h3> {state?.title} </h3>
                <h3> question {questionNumber + 1} </h3>
                {isShowDuration && <h4> {durationMinutes.toString().padStart(2, 0)}:{durationSeconds.toString().padStart(2, 0)} </h4>}
            </div>
            {isLoading && <LoadingSpinner/>}
            {Test && <Main Test={Test} handleSubmit={handleSubmit} questionNumber={questionNumber} />}

            <div className="answeringBtnHolder flexRow">
                {questionNumber !== 0 &&
                    <button className="moveTo" onClick={Previous} >previous</button>
                }
                {length !== questionNumber &&
                    <button className="moveTo" onClick={Next}>Next</button>
                }
                {length === questionNumber && !isPreview && <button  onClick={handleSubmit} className='moveTo'> submit</button>}

            </div>
        </div>
    )
}

export default ExamAnswerin