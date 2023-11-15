import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AlertSystem } from './components/AlertSystem'
import { ProtectedRoutes } from './components/ProtectedRoutes.jsx'
import { useAuth } from './hooks/useAuth.js'
import { DefaultLayout } from './layout/DefaultLayout/DefaultLayout.jsx'
import { Home } from './pages/Home.jsx'
import { Landing } from './pages/Landing.jsx'
import { Login } from './pages/Login.jsx'
import { NotFound } from './pages/NotFound.jsx'
import { Profile } from './pages/Profile.jsx'
import { Register } from './pages/Register.jsx'
import { Settings } from './pages/Settings.jsx'
import { SinglePost } from './pages/SinglePost.jsx'
import { refreshToken } from './redux/actions/authActions'

function App () {
  // Redux actions
  const dispatch = useDispatch()
  const auth = useAuth()

  useEffect(() => {
    dispatch(
      refreshToken()
    )
  }, [dispatch])

  return (
    <div className='App'>
      <BrowserRouter>
        <AlertSystem />
        {auth.token && <DefaultLayout />}
        <Routes>

          <Route index element={<Landing />} />

          <Route path='/landingPage' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route element={<ProtectedRoutes redirecTo='/' />}>
            <Route path='/home' element={<Home />} />
            <Route path='/profile/:id' element={<Profile />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/post/:id' element={<SinglePost />} />
          </Route>

          <Route path='*' element={<Navigate to='/404' replace />} />
          <Route path='/404' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
