import { useSelector } from 'react-redux'

export const useDataUser = () => {
  const userData = useSelector(state => state.auth.user)

  return userData
}
