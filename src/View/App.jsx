import '../Asset/Style/Main.css'
import { LandingPage, LandingShared } from './LandingPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Error } from './ErrorPage'
import { Register,Login } from './AuthenticationPage'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/landing' element={<LandingShared />} >
          <Route index element={<LandingPage/>} />
          <Route path="login" element={<Login/>} />
          <Route path="register" element={<Register/>} />
        </Route>
       
        <Route path="*" element={<Error/>} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
