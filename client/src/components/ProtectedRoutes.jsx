import PropTypes from 'prop-types'
import { Navigate, Outlet } from 'react-router-dom'
// import { useAuth } from '../hooks/useAuth'

/*
  Protected routes need to be instantiated within a React router route component

  Tested with React Router v6.

  This component allows us to redirect to the landing page or index page whenever
  there is an unauthenticated user in the application. Otherwise, internal
  components will be rendered.
*/

export function ProtectedRoutes ({ redirecTo, children }) {
  // const auth = useAuth()

  // if (!auth) {
  //   return <Navigate to={redirecTo} replace />
  // }
  const isLogin = window.localStorage.getItem('login')
  if (!isLogin) {
    return <Navigate to={redirecTo} replace />
  }

  return (children || <Outlet />)
}

ProtectedRoutes.propTypes = {
  redirecTo: PropTypes.string.isRequired,
  children: PropTypes.func
}
