import React from 'react'
import { NavLink } from 'react-router-dom'
function MenuLink({text, url, linkClass,action, activeLink=""}) {
  return (
      <div className="menuLink">
          
          <NavLink to={url} style={{width: '500px'}} onClick={action} className={({isActive}) => isActive ? `${linkClass} ${activeLink}`: `${linkClass}`}>
              {text}
          </NavLink>
    </div>
  )
}

export default MenuLink