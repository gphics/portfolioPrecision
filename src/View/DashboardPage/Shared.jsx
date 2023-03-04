import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useDispatch } from 'react-redux'

import { BiMenu } from 'react-icons/bi'
function Shared({ user }) {
    const dispatch = useDispatch()
    const Navigate = useNavigate()
    
    useEffect(() => {
        if (!user) {
            return Navigate("/landing")
        }
    }, [user])

   
  return (
      <main id="main" className='flexRow'>
          <div className="openMenu">
              <BiMenu id='menuControl' onClick={() => {
                  const elem = document.querySelector("#sidebar")
                  elem.classList.toggle("hideSidebar")
              }} />
          </div>
          <Sidebar/>
      <Outlet/>
      </main>
  )
}

export default Shared