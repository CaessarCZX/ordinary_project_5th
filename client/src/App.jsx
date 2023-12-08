import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AlertSystem } from './components/AlertSystem.jsx'
import { ProtectedRoutes } from './components/ProtectedRoutes.jsx'
import { useAuth } from './hooks/useAuth.js'
import { DefaultLayout } from './layout/DefaultLayout/DefaultLayout.jsx'
import { EditProfile } from './pages/EditProfile.jsx'
import { Home } from './pages/Home.jsx'
import { Landing } from './pages/Landing.jsx'
import { Login } from './pages/Login.jsx'
import { NotFound } from './pages/NotFound.jsx'
import { Profile } from './pages/Profile.jsx'
import { Register } from './pages/Register.jsx'
import { Settings } from './pages/Settings.jsx'
import { SinglePost } from './pages/SinglePost.jsx'
import { refreshToken } from './redux/actions/authActions'
import { selectToken, setToken } from './redux/reducers/authReducer.js'

function App () {
  // Redux actions
  const dispatch = useDispatch()
  const token = useSelector(selectToken)
  const auth = useAuth()

  useEffect(() => {
    dispatch(
      refreshToken()
    )
  }, [dispatch])

  // Save or delete token in localStorage
  useEffect(
    () => {
      if (!token) {
        dispatch(
          setToken({ token: auth.token })
        )
      } else if (!auth.token) {
        dispatch(
          setToken({ token: '' })
        )
      }
    }, [dispatch, token, auth.token]
  )

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
            <Route path='/profile/:id/edit' element={<EditProfile />} />
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
