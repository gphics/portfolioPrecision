import React from 'react'
import {MenuLink} from '../Utils'
import Logo from '../../Asset/SVG/Black logo.svg'
import {BiMenu} from 'react-icons/bi'
import ToggleShow from '../../Controller/Utils/ToggleShow'
const Links = [{ text: 'home', url: "/landing" },
    { text: 'login', url: "/landing/login" },
{text:"register", url:"/landing/register"}]
function LandingNavbar() {

    function toggle() {
        const elem = document.querySelector("#sideDrawer")
        ToggleShow(elem, 'hide')
    }
  return (
      <div id="landingPageNavbar" className="flexRow">
          <div className="logoHolder">
              <img src={Logo} alt="" className="logo" />
          </div>
          <div className="linkHolder">
              {Links.map((link, i) =><MenuLink {...link}  key={i} activeLink="aLink" linkClass="linkItem" /> )} 
          </div>
          <div className="menuHolder">
              <BiMenu className="menuIcon" onClick={toggle} />
          </div>
          <div id="sideDrawer" className="flexColumn hide">
              {Links.map((link, i) => <MenuLink {...link} key={i} action={toggle}  activeLink="aLink" linkClass="linkItem" />)} 
          </div>
    </div>
  )
}

export default LandingNavbar

