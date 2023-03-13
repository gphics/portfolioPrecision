import React, { useRef, useEffect, useState } from 'react'
import { Input, LoadingSpinner } from '../../Utils'
import Hero from '../../../Asset/SVG/Auth_Hero.svg'
import { RegisterControl } from '../../Utils'
import { Link , useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { changeInput, setUserDefault } from '../../../Model/userSlice'
import { contactInfo, personalInfo, fileObj } from './utils'
import { supabase, showNotification } from '../../../Controller'
import {Notification} from '../../Utils'
import shortUUID from 'short-uuid'
import { registerUser, setIsLoading, updateUser } from '../../../Model/userSlice'
function Register({isChange}) {

  const Navigate = useNavigate()
  const dispatch = useDispatch()
  const state = useSelector(state => state.userSlice.register)


  const windowLocation = window.location.pathname === '/profile/updateUser' ? true : false
  const realUser = useSelector(state => state.userSlice.user)
  const isLoading = useSelector(state => state.userSlice.isLoading)

  const [fileState, setFileState] = useState(null)

  const {user_img_name,username, fullname, role, contact, location, email, password} = state

  

  function onChangeHandler(e) {
    const name = e.target.name
    const value = e.target.value
    const act = 'register'
    const obj = { name, value, act }
    dispatch(changeInput(obj))

  }

  function fileHandler(e) {
    const name = e.target.name 
    const data = e.target.files[0]
    const value = windowLocation ? user_img_name :shortUUID.generate()+data.name
    const reader = new FileReader()

    reader.readAsArrayBuffer(data)
    reader.addEventListener("load", (e) => {
      const file = e.target.result
      const obj = { value, file }
      setFileState(obj)

    })

    if (windowLocation) return;
    const act = 'register'
    dispatch(changeInput({name, value, act}))
    
  }

  useEffect(() => {
    if (!windowLocation) {
      dispatch(setUserDefault())
    }
  },[windowLocation])

  useEffect(() => {
    if (isChange) {
      Navigate("/profile")
      return 
    }
  },[realUser])

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 8) {
      showNotification("password less than eight")
      return
   }
    if (user_img_name.length <= 1 || fullname.length <= 1 || role.length <= 1 || password.length <= 1 || email.length <= 1 || location.length <= 1 || username.length <= 1 || contact.length <= 1) {
      showNotification("Input field cannot be empty")
      return
    }
// Update
    // 
    // 
    if (windowLocation) {
      dispatch(setIsLoading())
      if (fileState !== null) {
        const file = uploadImage()
        if (file) {
          dispatch(updateUser())
          return;
        }

      }
      dispatch(updateUser())
      return
    }

    // Register
      // 
      // 
    dispatch(setIsLoading())
    const { data, error } = await supabase.from('user')
      .select().eq('email', state.email).single()
  
    
    if (data) {
      showNotification("user already exist")
      dispatch(setIsLoading())
      return;
    }
    dispatch(setIsLoading())
    const file = uploadImage()
    if (file) {
      dispatch(registerUser())
    }
  }

  async function uploadImage() {
    const {value, file} = fileState
    
    if (windowLocation) {
      const {data, error}= await supabase.storage.from("user")
        .update('folder/' + value, file)
      console.log(data, error)
      return data
    }
    const { data, error } = await supabase.storage
      .from("user")
      .upload('folder/' + value, file)
    console.log(data)
    if(data) return data
}
  
  return (
    <div id="register" className={windowLocation ? 'expand flexRow' : "flexRow"}>
      <Notification />
      {isLoading && <LoadingSpinner />}
      <div id="regHero" className="flexRow">

        <img src={Hero} alt="" />
        <div className="controlHolder">
          <RegisterControl />
        </div>
      </div>
      <div className="regFormHolder flexColumn">
        <form className="regForm flexColumn" onSubmit={handleSubmit}>
          <h1> {windowLocation ? 'update' : 'register'} </h1>

          {/* partOne */}
          <div data-tab="1" className="regFormSect1 regPart flexColumn">
            {personalInfo.map((info, i) => <Input
              data={state[info.name]} action={onChangeHandler}
              holderClass="regInputHolder" key={45544 * i} {...info} />)}
            <div className="flexColumn regInputHolder">
              <label htmlFor="">
                {fileObj.name}
              </label>
              <input onChange={fileHandler} type={fileObj.type} name={fileObj.fieldname} />
            </div>
          </div>

          {/* partTwo */}

          <div data-tab="2" className="regFormSect2 regPart hideForm flexColumn">
            {contactInfo.map((info, i) => <Input data={state[info.name]} action={onChangeHandler} key={i * 534443} {...info} holderClass="regInputHolder" />)}
          </div>

          {/* partThree */}
          <div data-tab="3" className="regFormSect3 hideForm regPart flexColumn">
            <label htmlFor="role">Role</label>
            <select disabled={windowLocation} onChange={onChangeHandler} value={state.role} name="role" id="regSelect">
              <option value="tutor">Tutor</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div id="controlMobile" className="controlHolder">
            <RegisterControl />
          </div>

          <button id="regBtn" className="moveTo hideForm"
            type="submit"> {windowLocation ? 'Update' : 'register'} </button>
        </form>
      </div>
    </div>
  )
}

export default Register