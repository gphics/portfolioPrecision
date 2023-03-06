import React, { useEffect, useState } from 'react'
import { Input } from '../Utils'
import { partOne } from './Utils'
import { ExamForm } from '../Utils'
import { IncreaseQuestion, DecreaseQuestion, changeInput, onRender, fetchUpdateExam, updateExam } from '../../Model/ExamSlice'
import { useDispatch, useSelector } from 'react-redux'
import shortUUID from 'short-uuid'
import { FunctionsClient } from '@supabase/functions-js'
import { Notification } from '../Utils'
import { showNotification, supabase } from '../../Controller'
import { createExam } from '../../Model/ExamSlice'
import LoadingSpinner from '../Utils/LoadingSpinner'
import dayjs from 'dayjs'
import { useNavigate, useParams } from 'react-router-dom'
function ExamCre() {
    const { examID } = useParams()
    const isUpdate = examID ? true : false
    const [part, setPart] = useState(1)
    const [fileState, setFileState] = useState(null)
    const examState = useSelector(state => state.examSlice)
    const user_id = useSelector(state => state.userSlice.user.user_id)
    const examArr = examState.examCreate.Test
    const { isLoading, isRedirect } = useSelector(state => state.examSlice)
    const { is_available } = examState.examCreate
    const dispatch = useDispatch()
    const [uploadQuestionImage, setUploadQuestionImage] = useState(false)
    const Navigate = useNavigate()
    function ToggleAvailable() {
        const field = 'is_available'
        dispatch(changeInput({ value: !is_available, field }))
    
    }
  
    function onChangeHandler(e) {
        const value = e.target.value;
        const field = e.target.dataset.field
        dispatch(changeInput({ value, field }))



    }
    useEffect(() => {
        if (isUpdate) {
            setTimeout(() => {
                alert("No need to re-upload another image for any image field that you have uploaded before unless you want to update the image.")
            }, 5000)
        }
    },[])
    function fileHandler(e) {
        const {exam_img_name} = examState.examCreate
        const value = isUpdate ? exam_img_name : shortUUID.generate() + e.target.files[0].name
        const field = 'exam_img_name'

        dispatch(changeInput({ value, field }))
        const reader = new FileReader()
        reader.readAsArrayBuffer(e.target.files[0])
        reader.addEventListener('load', (e) => {
            const file = e.target.result
            setFileState({ value, file })
        })
    }

    useEffect(() => {
        if (isUpdate) {
            dispatch(fetchUpdateExam(examID))
            return;
        }
        const id = shortUUID.generate()
        dispatch(onRender({ id, user_id }))
        
    }, [])
    const Back = (e) => {
        e.preventDefault()
        setPart(1)
    }
    const Next = (e) => {
        e.preventDefault()
        const { starting_date, ending_date, duration, description, exam_img_name } = examState.examCreate
        const start = dayjs(starting_date).toDate()
        const end = dayjs(ending_date).toDate()
        if (starting_date === '' || ending_date === '' || duration === '' || description === '' || exam_img_name === '') return showNotification('Input field cant be empty')
        if (start > end) return showNotification("Starting date is higher than the ending date")
        return setPart(2)
    }

    async function uploadFile() {
        if(fileState === null) return 'okay'
        const { value, file } = fileState
        if (isUpdate) {
            const { data, error } = await supabase.storage
                .from("exam")
                .update("folder/" + value, file)
            return data
        }
        const { data, error } = await supabase.storage
            .from("exam")
            .upload('folder/' + value, file)
        return data
    }
    function submitHandler(e) {
        e.preventDefault()
        const examImageUpload = uploadFile()
        if (isUpdate && examImageUpload) {
           
            dispatch(updateExam())
            return
        }
        if (examImageUpload) {
            setUploadQuestionImage(true)
            dispatch(createExam())
        }
        // showNotification()
    }
    useEffect(() => {
        if (isRedirect) {
            return Navigate("/myexams")
        }
    }, [isRedirect])
    return (
        <div id="examCreateContainer">
            {isLoading &&
            <LoadingSpinner customID="adjustLoading" />}
            <Notification  customID="examNotificationError"/>
            {part === 1 ? < h1 className='examCreateA'>{isUpdate ? 'update': 'create'} exam</h1> :
                <div className="changeAmount flexRow">
                    <button id="changeBtnA" onClick={() => {
                        dispatch(IncreaseQuestion())
                    }} className='moveTo'>Add</button>
                    <h2> {examArr.length} </h2>
                    <button id="changeBtnB" onClick={() => {
                        dispatch(DecreaseQuestion())
                    }} className='moveTo'>Remove</button>
                </div>

            } <div className='examCreateB'>
                <form action="" id="examCreateForm" onSubmit={submitHandler}>
                    {/* Part one */}


                    <div id={part === 1 ? "examCreatePartOne" : 'hidePart'} className='flexColumn'>
                        <Notification />
                        {partOne.map((info, i) => {

                            return <Input action={onChangeHandler}
                                data={examState.examCreate[info.field]} holderClass="examCreateInputHolder" {...info} key={i} />
                        })}
                        <div className="examCreateInputHolder">
                            <Input name="exam Image" action={fileHandler} type="file" />
                        </div>

                        <div id="isAvailable" className="flexColumn examCreateInputHolder">

                            <h4>Available</h4>
                            <aside id="switch">
                                <div className={`roll ${is_available && 'exchangeRoll'}`} onClick={ToggleAvailable}></div>
                            </aside>
                        </div>
                    </div>

                    {/* Part two */}


                    <div id={part === 2 ? "examCreatePartTwo" : "hidePart"}>
                        {examArr.map((info, i) => {
                            return <ExamForm isUpdate={isUpdate} uploadQuestionImage={uploadQuestionImage} index={i} key={i * 545} />
                        })}

                        <button id="btnCreate" type='submit' className="moveTo"> {isUpdate ? 'update' : 'create'} </button>
                    </div>


                </form>
            </div>
            <div className='examCreateC flexRow'>
                {part === 2 ? <button id="btnBack" className='moveTo' onClick={Back} >Back</button>
                    :
                    <button className='moveTo' id="btnNext" onClick={Next}>Next</button>
                }
            </div>
        </div>
    )
}

export default ExamCre