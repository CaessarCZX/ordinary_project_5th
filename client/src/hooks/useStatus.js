import { useSelector } from 'react-redux'

export const useStatus = () => {
  const status = useSelector(state => state.status)

  return status
}
