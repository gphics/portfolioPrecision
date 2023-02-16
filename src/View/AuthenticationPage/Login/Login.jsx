import React from 'react'
import Hero from '../../../Asset/SVG/Auth_Hero.svg'
import { Input } from '../../Utils'
import { Link } from 'react-router-dom'



const formInput = [{type:"email", name:"email"}, {type:'password', name:"password"}]
function Login() {
  return (
      <div id="login" className="flexRow">
          <div className="loginHero">
              <img src={Hero} alt="Auth_Hero" className="authHero" />
          </div>
          <div className="mainLogin flexColumn">
           
              <form className="loginFormHolder flexColumn">
                  <h2>login</h2>
                  {formInput.map((info, i) => <Input key={i} holderClass="loginInputHolder" inpClass="loginInput" {...info} />)}
                  <button id="loginBtn" type="submit" className="moveTo">login</button>
                  <p className="loginNote">Not yet a member ? <Link className="authNote" to="/landing/register">Signup</Link></p>
              </form>
          </div>
    </div>
  )
}

export default Login