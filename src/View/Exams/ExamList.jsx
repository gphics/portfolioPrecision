import React from 'react'
import { Link } from 'react-router-dom'

function ExamList({ exam_img_name, title, description, exam_id }) {
    const imgUrl = `https://jcvvwzvbnanankfrxxzd.supabase.co/storage/v1/object/public/exam/folder/${exam_img_name}`
    return (
      <Link className='myExamList' to={`${exam_id}`} >
          <img src={imgUrl} alt={`${title} exam Image`} />
          <div>
                <h3> {title.slice(0, 25)}  {title.length > 30 && "..."} </h3>
              <p> { description.slice(0, 30)} {description.length > 30 && "..."} </p>
          </div>
      
    </Link>
  )
}

export default ExamList