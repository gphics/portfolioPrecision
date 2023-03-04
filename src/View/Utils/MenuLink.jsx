import React from 'react'
import { NavLink } from 'react-router-dom'
function MenuLink({text, url,holderClass, linkClass,action, activeLink=""}) {
  return (
      <div className={"menulink " + holderClass}>
          
          <NavLink to={url} onClick={action} className={({isActive}) => isActive ? `${linkClass} ${activeLink}`: `${linkClass}`}>
              {text}
          </NavLink>
    </div>
  )
}

export default MenuLink