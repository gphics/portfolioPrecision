import React from 'react'
import { Outlet } from 'react-router-dom'
import LandingNavbar from './LandingNavbar'

function LandingSharedLayout() {
  return (
      <>
        <LandingNavbar/>
      <Outlet/>
      </>
  )
}

export default LandingSharedLayout