import duration from 'dayjs/plugin/duration'
import dayjs from 'dayjs'
dayjs.extend(duration)
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteExam, getCurrentExam, registerForExam, setIsPreview, setTotalScore} from '../../../Model/ExamSlice'
import { refreshUser } from '../../../Model/userSlice'

export default function SingleExamInf({exam_id, starting_date, title, creator, description, ending_date, exam_img_name, participants, is_available, duration, taken_by }) {
    const imgUrl = `https://jcvvwzvbnanankfrxxzd.supabase.co/storage/v1/object/public/exam/folder/${exam_img_name}`
    const user = useSelector(state => state.userSlice.user)
    const state = useSelector(state => state.examSlice)
    const creatorState = creator === user.user_id ? true : false
    const [regState, setRegState] = useState(false)
    const beginDate = dayjs(starting_date)
    const presentDate = dayjs()
    const overDate = dayjs(ending_date)
    const isExamEnd = presentDate > overDate ? true : false
    const isRegisterEnd = presentDate > beginDate
    const [takenState, setTakenState] = useState(false)
    const showStartBtn =!isExamEnd && !creatorState && !takenState && regState && presentDate >= beginDate && presentDate <= overDate ? true : false
    const showTimer = !isExamEnd && !creatorState && !takenState && regState && presentDate < beginDate ? true : false
    // const startState = !creatorState && is_available && regState && !takenState && showStart ? true : false
    //const timerState = regState && !takenState && !creatorState && showTimer ? true : false
    
    const [months, setMonths] = useState(0)
    const [days, setDays] = useState(0)
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)
    const dispatch = useDispatch()
    const Navigate = useNavigate()
    
    
    function updateDuration() {
        setInterval(() => {
            const startDate = dayjs(starting_date)
            const now = dayjs()
            const mid = dayjs.duration(startDate - now) 
             
            setMonths(mid.months())
            setDays(mid.days())
            setHours(mid.hours())
            setMinutes(mid.minutes())
            setSeconds(mid.seconds())
        }, 1000)
    }

    useEffect(() => {
        dispatch(refreshUser())
        dispatch(setTotalScore(0))
    },[])
    useEffect(() => { 
        if (state.currentExam[0]) {
            state.currentExam[0].participants.forEach(id => {
                if (id === user.user_id) setRegState(true)
            })

            state.currentExam[0].taken_by.forEach(id => {
                if (id === user.user_id) setTakenState(true)
            })
      }

        
   
    }, [state.currentExam])

    useEffect(() => {
        if (showTimer) updateDuration()
    }, [showTimer])
    return <section id="singleExamInfo" className='flexColumn'>
        <img src={imgUrl} alt={title} />
        <div id="singleExamInfoIntro">
            <h1> {title} </h1>
            <p> {description}{description && description.at(-1) === '.' ? null : '.'} </p>
        </div>
        <div className="restInfo flexRow">
            <h4>participants</h4>
            <h4> {participants && participants.length} </h4>
        </div>
        {creatorState && <div className="restInfo flexRow">
            <h4>number of attempts</h4>
            <h4> {taken_by && taken_by.length} </h4>
        </div>}
        <div className="restInfo flexRow">
            <h4>starting date</h4>
            <h4> {new Date(starting_date).toDateString()} </h4>
        </div>
        <div className="restInfo flexRow">
            <h4>ending date</h4>
            <h4> {new Date(ending_date).toDateString()} </h4>
        </div>
        <div className="restInfo flexRow">
            <h4>duration</h4>
            <h4> {duration} minutes </h4>
        </div>

        {/* updating and deleting an exam */}

        {creatorState && <div className='creatorStateBtns'>
            <button className="moveTo" onClick={(e) => {
                e.preventDefault()
                Navigate(`/examcreate/${exam_id}`)
            }} >update</button>
            <button className="moveTo" onClick={(e) => {
                e.preventDefault()
                dispatch(deleteExam())
                Navigate("/myexams")
            }}>delete</button>
        </div>}
         
        {/* Registering for an exam */}
        {!isRegisterEnd && !creatorState && !takenState && !regState && <div className='creatorStateBtns'>
            <button className="moveTo" onClick={(e) => {
                e.preventDefault()
                dispatch(registerForExam())
            }}>register</button>

        </div>}
        {creatorState &&
            <div className='creatorStateBtns'>
                <button className="moveTo" onClick={(e) => {
                    e.preventDefault()
                    dispatch(setIsPreview())
                    Navigate("/answerexam")

                }}>preview</button>

            </div>
        }
        {/* start Btn */}
        {is_available &&  showStartBtn && !showTimer && <div className='creatorStateBtns'>
            <button className="moveTo" onClick={(e) => {
                e.preventDefault()
                Navigate("/answerexam")
            }} >start</button>
        </div>

        }
     {/* show timer */}
        {showTimer &&
            <div className="durationTo">
                <article className="flexColumn">
                    <h5>month{months > 1 && 's'}  </h5>
                    <h4> {months.toString().padStart(2, 0)} </h4>
                </article>
                <article className="flexColumn">
                    <h5>day{days > 1 && 's'} </h5>
                    <h4> {days.toString().padStart(2, 0)} </h4>
                </article>
                <article className="flexColumn">
                    <h5>hour{hours > 1 && 's'}  </h5>
                    <h4> {hours.toString().padStart(2, 0)} </h4>
                </article>
                <article className="flexColumn">
                    <h5>minute{minutes > 1 && 's'}  </h5>
                    <h4> {minutes.toString().padStart(2, 0)} </h4>
                </article>
                <article className="flexColumn">
                    <h5>second{seconds > 1 && 's'}  </h5>
                    <h4> {seconds.toString().padStart(2, 0)} </h4>
                </article>
            </div>
        }
        {showStartBtn && regState && !creatorState && !isExamEnd && !is_available && <div className='creatorStateBtns'>
            <h3 style={{
                width: "100%",

                textAlign: 'center'
            }}>exam not available, contact the creator</h3>
        </div>}
        {takenState && !creatorState && !isExamEnd && <div className='creatorStateBtns'>
            <h3 style={{
                width: "100%",
                textAlign: 'center'
            }}>You attempted the exam already</h3>
        </div>}
        {/* Exam ended message */}
        {isExamEnd && <div className='creatorStateBtns'>
            <h3 style={{
                width: "100%",
                textAlign: 'center'
            }}>Exam ended already</h3>
        </div>}

        {/* exam registration ended */}
        {!creatorState && !takenState && !regState && isRegisterEnd && <div>
            <h3 style={{
                width: "100%",

                textAlign: 'center'
            }}>Exam registration ended already</h3></div>}
        
        
    </section>
}