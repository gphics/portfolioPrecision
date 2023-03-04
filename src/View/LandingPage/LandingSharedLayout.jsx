import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import LandingNavbar from './LandingNavbar'

function LandingSharedLayout({ user}) {
  const Navigate = useNavigate()
  useEffect(() => {
   
    if (user) {
      return Navigate("/")
    }

   
  }, [user])

  return (
      <>
        <LandingNavbar/>
      <Outlet/>
      </>
  )
}

export default LandingSharedLayout