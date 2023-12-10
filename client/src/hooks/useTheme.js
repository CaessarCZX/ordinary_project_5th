import { useContext } from 'react'
import { ThemeContext } from '../components/ThemeContext'

/*
  useTheme:
  It's a custom hook that checks the context of the Theme value in global state

  !IMPORTATN:
  This custom Hook require to be instantied with a 'const' variable.

  **This custom Hook only works with useContext with the Theme value has been
    previously assigned
*/
export function useTheme () {
  return useContext(ThemeContext)
}
