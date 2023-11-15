import PropTypes from 'prop-types'
import {
  createContext,
  useEffect,
  useState
} from 'react'

export const ThemeContext = createContext()

export function ThemeProvider ({ children }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme')
    if (currentTheme) {
      setIsDark(currentTheme === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    localStorage.setItem('theme', isDark ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.any.isRequired
}
