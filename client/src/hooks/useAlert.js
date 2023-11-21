import { useSelector } from 'react-redux'

/*
  useAlert:
  It's a custom hook that checks the current alerts in the redux
  global state or false when it is missing

  !IMPORTATN:
  This custom Hook require to be instantied with a 'const' variable.

  **This custom Hook only works with redux context
*/
export const useAlert = () => {
  const alert = useSelector(state => state.alert)

  return alert
}
