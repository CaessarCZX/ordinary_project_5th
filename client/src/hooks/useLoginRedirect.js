import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth.js'

/*
  useLoginRedirect:
  It's a custom hook that checks if the current user is authenticated.
  when the user has a token. The user is compulsorily redirected to the home
  component.

  !IMPORTATN:
  This custom Hook doesn't need to be instantiated with any variable
*/

export const useLoginRedirect = () => {
  // User autentication
  const auth = useAuth()
  // To redirect
  const navigate = useNavigate()

  useEffect(
    () => {
      if (auth.token) {
        navigate('/home')
      }
    }, [auth.token, navigate])
}
