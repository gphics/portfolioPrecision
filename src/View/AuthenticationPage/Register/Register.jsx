import React from 'react'
import {Input} from '../../Utils'
import Hero from '../../../Asset/SVG/Auth_Hero.svg'
import { RegisterControl } from '../../Utils'
import { Link } from 'react-router-dom'

const personalInfo = [{ name: 'fullname', type: 'text' }, { name: 'username', type: "text" }
  , { name: 'profileimage', type: "file" }]

const contactInfo = [{type: 'email', name:'email'}, {name:'location', type:'text'}, {name:'contact', type:"number"}]
function Register() {
  return (
    <div id="register" className="flexRow">
      <div id="regHero" className="flexRow">
       
        <img src={Hero} alt="" />
        <div className="controlHolder">
          <RegisterControl />
        </div>
      </div>
      <div className="regFormHolder flexColumn">
        <form className="regForm flexColumn">
          <h1>register</h1>
          {/* partOne */}
          <div data-tab="1" className="regFormSect1 regPart flexColumn">
            {personalInfo.map((item, i) => <Input holderClass="regInputHolder" key = {45544*i} {...item} />)}
          </div>

          {/* partTwo */}

          <div data-tab="2" className="regFormSect2 regPart hideForm flexColumn">
            {contactInfo.map((info, i) => <Input key={i*534443} {...info} holderClass="regInputHolder" />)}
          </div>
          
          {/* partThree */}
          <div data-tab="3" className="regFormSect3 hideForm regPart flexColumn">
            <label htmlFor="role">Role</label>
            <select name="role" id="regSelect">
              <option value="tutor">Tutor</option>
              <option value="student">Student</option>
          </select>
          </div> 
          <div id="controlMobile" className="controlHolder">
            <RegisterControl />
          </div>

          <button id="regBtn" className="moveTo hideForm" type="submit"> register</button>
          <p className="regNote">
            Already a member ? <Link to="/landing/login" className="regLink">Login</Link>
       </p>
        </form>
      </div>
    </div>
  )
}

export default Register