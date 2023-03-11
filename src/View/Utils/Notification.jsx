import React, { useEffect } from 'react'
import { FaTimesCircle } from 'react-icons/fa'


function Notification({customID}) {
  
    return ( 
        <div id={customID} className="Notification flexColumn hideForm">
           
            <h3 id='alert'></h3>
        </div>
    )
}

export default Notification