import React from 'react'
import { Link } from 'react-router-dom'

function ExamList({ exam_img_name, title, description, exam_id , starting_date}) {
    const imgUrl = `https://jcvvwzvbnanankfrxxzd.supabase.co/storage/v1/object/public/exam/folder/${exam_img_name}`
  const first = new Date(starting_date)
  const second = first.toDateString()
  const timeStamp = new Date().getMilliseconds()
  return (
      <Link className='myExamList' to={`${exam_id}`} >
          <img src={`${imgUrl}?t="${timeStamp}`} alt={`${title} exam Image`} />
          <div>
                <h3> {title.slice(0, 25)}  {title.length > 30 && "..."} </h3>
              <p> { description.slice(0, 30)} {description.length > 30 && "..."} </p>
         <small> {Date.now() < first ?'starting' : 'started' } on {second} </small>
        </div>
      
    </Link>
  )
}

export default ExamList