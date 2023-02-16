import React from 'react'
import { Link } from 'react-router-dom'
function ErrorPage() {
  return (
    <div className="Error flexColumn">
      
        <h1 id="ErrorTitle">Error 404!</h1>
        <h4>Page not found</h4>

      <Link to="/landing" className="moveTo" id="errorLink">Back Home</Link>
      
    </div>
  )
}

export default ErrorPage