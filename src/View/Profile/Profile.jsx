import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { setIsChange} from '../../Model/userSlice'



function Profil() {
  const state = useSelector(state => state.userSlice.user)
  const imgUrl = `https://jcvvwzvbnanankfrxxzd.supabase.co/storage/v1/object/public/user/folder/${state.user_img_name}`
  const dispatch = useDispatch()
  const Navigate = useNavigate()
  const profileContent = [
    { title: 'username', value: state.username },
    { title: 'user ID', value: state.user_id },
    { title: 'fullname', value: state.fullname },
    { title: 'role', value: state.role },
    { title: 'password', value: state.password },
    { title: 'location', value: state.location },
    {title: 'contact', value: `0${state.contact}`}
  ]

  useEffect(() => {
    dispatch(setIsChange()) 
  },[])

  const joinedDate = dayjs(state.created_at).toDate().toDateString()

  return (
    <div id='profile' className='flexColumn'>
      <h1>my profile</h1>
      <div className="profileImage flexColumn">
        <img src={imgUrl} alt="user image" />
        <h5> joined on {joinedDate} </h5>
      </div>
      <div className="profileInfo flexColumn">
        {profileContent.map((info, index) => {
          return <div className="infoField flexRow" key={index}>
            <h5>{info.title}: </h5>
            <h4> {info.value} </h4>
          </div>
  }) 
        }
      </div>
      <div className="profileUpdateSect">
        <button id="userUpdateBtn" onClick={(e) => {
          Navigate("updateUser")
        }} className="moveTo">Update</button>
      </div>
    </div>
  )
}

export default Profil