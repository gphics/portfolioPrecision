import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../Controller'
import LoadingSpinner from '../Utils/LoadingSpinner'
import { Link } from 'react-router-dom'

function EachResultOwner() {
    const imgUrl = 'https://jcvvwzvbnanankfrxxzd.supabase.co/storage/v1/object/public/user/folder/'
    const {userID} = useParams()
    const [owner, setOwner] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    async function fetchUser() {
        const { data, error } = await supabase.from("user")
            .select()
            .eq("user_id", userID)
            .single()
        if (data) {
            setOwner(data)
           setIsLoading(false)
       }
    }
    useEffect(() => {
        fetchUser()
    },[])
  return (
      <div id="myResult">
          {isLoading && <LoadingSpinner />}
          
          {owner && <section className='resultOWnerInfo flexColumn'>
              <img src={imgUrl + owner.user_img_name} alt={owner.username} />
              <div className="eachResult flexRow">
                  <h4> username </h4>
                  <h4> {owner.username} </h4>
              </div>
              <div className="eachResult flexRow">
                  <h4> fullname </h4>
                  <h4> {owner.fullname} </h4>
              </div>
              <div className="eachResult flexRow">
                  <h4> email </h4>
                  <h4 style={{textTransform: 'none'}}> {owner.email} </h4>
              </div>
              <div className="eachResult flexRow">
                  <h4> contact </h4>
                  <h4> 0{owner.contact} </h4>
              </div>
              <div style={{background: 'transparent'}} className="eachResult flexRow">
                  <Link id="eachResultBtn" className='moveTo' to="/myresults">go back </Link>
              </div>
          </section>}
    </div>
  )
}

export default EachResultOwner