import React, { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
function SharedExamLay({ role }) {
const Navigate = useNavigate()


    useEffect(() => {
        if (role !== 'tutor') {
            return Navigate("/")
        }
    }, [role])
  return (
    <Outlet/>
  )
}

export default SharedExamLay