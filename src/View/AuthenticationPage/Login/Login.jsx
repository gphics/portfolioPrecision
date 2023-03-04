import React from 'react'
import Hero from '../../../Asset/SVG/Auth_Hero.svg'
import { Input, LoadingSpinner } from '../../Utils'
import { Link } from 'react-router-dom'
import { loginFormInput } from './utils'
import { useSelector, useDispatch } from 'react-redux'
import { changeInput } from '../../../Model/userSlice'
import {Notification} from '../../Utils'
import { showNotification } from '../../../Controller'
import { loginUser } from '../../../Model/userSlice'
function Login() {
    const dispatch = useDispatch()
    const state = useSelector(store => store.userSlice.login)
    const isLoading = useSelector(store => store.userSlice.isLoading)
    
    function onChangeHandler(e) {
        const name = e.target.name
        const value = e.target.value
        const act = 'login'
        dispatch(changeInput({value, name, act}))
    }
    function handleSubit(e) {
        e.preventDefault()
        if (state.email.length <= 1 || state.password.length <= 1) {
            return showNotification("Input field can't be empty")
        }
        dispatch(loginUser())
    }
  return (
      <div id="login" className="flexRow">
          <Notification />
          {isLoading && <LoadingSpinner/>}
          <div className="loginHero">
              <img src={Hero} alt="Auth_Hero" className="authHero" />
          </div>
          <div className="mainLogin flexColumn">
           
              <form onSubmit={handleSubit} className="loginFormHolder flexColumn">
                  <h2>login</h2>
                  {loginFormInput.map((info, i) => <Input key={i}
                      action={onChangeHandler} data={state[info.name]} holderClass="loginInputHolder" inpClass="loginInput" {...info} />)}
                  <button id="loginBtn" type="submit" className="moveTo">login</button>
                  <p className="loginNote">Not yet a member ? <Link className="authNote" to="/landing/register">Signup</Link></p>
              </form>
          </div>
    </div>
  )
}

export default Login