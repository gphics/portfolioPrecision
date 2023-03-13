import React, { useEffect } from 'react'
import { MenuLink } from '../Utils'
import Logo from "../../Asset/SVG/Black logo.svg"
import { IoIosNotifications } from 'react-icons/io'
import { useSelector, useDispatch } from 'react-redux'
import { logOut } from '../../Model/userSlice'
import { Link } from 'react-router-dom'
import { setDefault } from '../../Model/ExamSlice'
const list = [{ text: 'Dashboard', url: '/' }, { text: 'all exams', url: "allexams" },
{ text: 'my exams', url: 'myexams' }, { text: 'my results', url: "myresults" },

]
function Sidebar() {
    const dispatch = useDispatch()
    const state = useSelector(state => state.userSlice.user)
    const imgUrl = `https://jcvvwzvbnanankfrxxzd.supabase.co/storage/v1/object/public/user/folder/${state.user_img_name}`
   const timeStamp = new Date().getUTCMilliseconds()

    function ToggleSidebar() {
        const elem = document.querySelector("#sidebar")
        elem.classList.toggle("hideSidebar")
    }


    return (
        <div id="sidebar" className='flexColumn hideSidebar'>
            <div className='flexRow sidebarHero'>
                <img src={Logo} alt="logo" />
                
            </div>
            <div className='flexColumn sidebarLinkContainer'>
                {list.map((info, i) => {
               
                    return <MenuLink action={ToggleSidebar}
                        holderClass="sidebarLinkHolder"
                        activeLink='sidebarActive'
                        linkClass="sidebarLink" key={i} {...info} />
                })}
                {state.role === 'tutor' && <MenuLink
                     holderClass="sidebarLinkHolder"
                    activeLink='sidebarActive'
                    linkClass="sidebarLink" url="examcreate" text="create exam"
                    action={ToggleSidebar} />}
                
                <button id="logout" onClick={() => {
                    dispatch(logOut())
                    dispatch(setDefault())
                }} className="sidebarLink">logout</button>
               
            </div>
            <Link to="/profile" onClick={ToggleSidebar} className="userInfo flexRow">
                <img src={`${imgUrl}?t="${timeStamp}`} alt="user image" />
                <h4> {state.username} </h4>
            </Link> 
        </div>
    )
}

export default Sidebar

