import '../Asset/Style/Main.css'
import { LandingPage, LandingShared } from './LandingPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Error } from './ErrorPage'
import { Register, Login } from './AuthenticationPage'
import { Shared, Dashboard } from './DashboardPage'
import { useSelector } from 'react-redux'
import { MyExams, SingleExam } from './Exams'
import { Profile, SharedProfile} from './Profile'
import { MyResults } from './Result'
import { ExamCreate, SharedExamLayout } from './ExamCreationPage'
import { SharedSpacing } from './Utils'
import { ExamAnswering } from './ExamAnswering'
import { supabase } from '../Controller'
import { useEffect } from 'react'
import EachResultOwner from './Result/EachResultOwner'

function App() {
  const state = useSelector(state => state.userSlice.user)
  const user = state?.user_id
  const role = state?.role
  const { isUpdate, isChange } = useSelector(state => state.userSlice)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/landing' element={<LandingShared user={user}/>} >
          <Route index element={<LandingPage/>} />
          <Route path="login" element={<Login/>} />
          <Route path="register" element={<Register/>} />
        </Route>
        <Route path="/" element={<Shared user={user} />}>
          <Route index element={<Dashboard />} />
          <Route path="answerExam" element={<ExamAnswering/>} />
          <Route path="myexams" element={<SharedSpacing />} >
            <Route index element={<MyExams />} />
            <Route path=":examID" element={<SingleExam/>} />
          </Route>
          <Route path="allexams" element={<SharedSpacing />} >
            <Route index element={<MyExams />} />
            <Route path=":examID" element={<SingleExam/>} />
          </Route>
          <Route path="profile" element={<SharedProfile />}>
            <Route index element={<Profile/>} />
            <Route path="updateUser" element={<Register isChange={isChange} isUpdate={isUpdate} />} />
            </Route>
          <Route path="myresults" element={<SharedSpacing />}>
            <Route index element={<MyResults />} />
            <Route path=":userID" element={<EachResultOwner/>} />
          </Route>
          <Route path="examcreate" element={<SharedExamLayout role={role} />}>
            <Route index element={<ExamCreate />} />
            <Route path=":examID" element={<ExamCreate/>} />
          </Route>
       </Route>
        <Route path="*" element={<Error/>} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
