import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import shortUUID from 'short-uuid'
import { supabase } from '../../Controller'
import { changeTest, isExamLoading, isExamNotLoading } from '../../Model/ExamSlice'


function ExamFor({ index, uploadQuestionImage, isUpdate }) {
  const dispatch = useDispatch()
  const arr = useSelector(state => state.examSlice.examCreate.Test[index])
  const {queImg} = useSelector(state => state.examSlice)
  const [fileState, setFileState] = useState(null)
  const { optionA, optionB, optionC, optionD, answer, question, question_img_name } = arr

  function validateAnswer() {
    const elem = document.querySelectorAll(".questionAnswer")
    elem.forEach(el => {
      const check = el.dataset.main
      if (+check === index) {
        if (optionA === answer || optionB === answer
          || optionC === answer || optionD === answer) {
          el.style.background = 'black'
          el.style.color = ' white'
        } else {
          el.style.background = "red"
        }
      }
    })

  }
  async function upload() {
    
    const { value, file } = fileState
    console.log(fileState)
    const { data: secondData, error: secondError } = await supabase.storage
      .from("question").list('folder')
    
    const check = secondData.filter(elem => elem.name === value)
    
    if (check.length !== 0) {
      dispatch(isExamLoading())
      const { data, error } = await supabase.storage
        .from("question")
        .update('folder/' + value, file)
      if(data) dispatch(isExamNotLoading())
      return;
    }
    // On creation
    dispatch(isExamLoading())
    const { data, error } = await supabase.storage
      .from("question")
      .upload('folder/' + value, file)
    if (data) dispatch(isExamNotLoading())
    
  }
  useEffect(() => {
    if (uploadQuestionImage && fileState !== null) {
      upload()
      return
    }
    return
  }, [uploadQuestionImage] )
  useEffect(() => {
    validateAnswer()
  }, [arr])
  function fileHandler(e) {
    const value = isUpdate && question_img_name !== '' ? question_img_name : shortUUID.generate()+e.target.files[0].name
    const field = 'question_img_name'
    const i = index

 
    
    const reader = new FileReader()
    reader.readAsArrayBuffer(e.target.files[0])
    reader.addEventListener('load', (e) => {
      const file = e.target.result
      console.log(file)
      setFileState({value, file})
    })
    if (isUpdate && question_img_name) return;
    dispatch(changeTest({ i, field, value }))
  }

  function onChangeHandler(e) {
    const value = e.target.value
    const field = e.target.name
    const i = index

    dispatch(changeTest({ i, field, value }))
  }
  return (
      <div className='examCreateInput flexColumn'>
          <h1 id="examQuestionCount"> {index + 1} </h1>
          <div id="examQuestionImage" className="examInputHouse flexColumn">
              <label htmlFor="">question image</label>
              <input type="file" className="examImage" onChange={fileHandler} />
          </div>
          <div id="examQuestionArea" className="examInputHouse flexColumn">
              <label htmlFor="">Question</label>
        <textarea name="question" value={question} onChange={onChangeHandler} ></textarea>
          </div>
          <div id="examOption" className="examInputHouse flexColumn">
              <label htmlFor="">options</label>
              <input type="text" name='optionA'  onChange={onChangeHandler} value={optionA} />
              <input type="text" name='optionB' onChange={onChangeHandler} value={optionB}/>
              <input type="text" name='optionC'  onChange={onChangeHandler} value={optionC} />
              <input type="text" name='optionD'  onChange={onChangeHandler}  value={optionD}/>
          </div>
          <div id="examAnswer" className="examInputHouse flexColumn">
              <label htmlFor="">answer</label>
              <input type="text" data-main={index} name="answer" className="questionAnswer"  onChange={onChangeHandler} value={answer} />
          </div>
    </div>
  )
}

export default ExamFor