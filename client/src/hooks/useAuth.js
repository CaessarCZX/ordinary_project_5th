import { useSelector } from 'react-redux'

/*
  useAuth:
  It's a custom hook that checks if the current user is authenticated.
  based on the response the hook returns true if the user is in the redux
  global state or false when it is missing

  !IMPORTATN:
  This custom Hook require to be instantied with a 'const' variable.

  **This custom Hook only works with redux context
*/
export const useAuth = () => {
  const auth = useSelector(state => state.auth)

  return auth
}
