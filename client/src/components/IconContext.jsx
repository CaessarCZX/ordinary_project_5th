import PropTypes from 'prop-types'
import { useTheme } from '../hooks/useTheme.js'
import {
  DARTH_THEME_DARK_MODE as dark,
  DARTH_THEME_LIGHT_MODE as light
} from '../styled components/Darth-theme.var.js'

export const IconContext = (
  {
    icon: Icon,
    ...rest
  }
) => {
  // Theme
  const { isDark } = useTheme()

  // Icon color variables
  const LightTheme = light.titlePrimary
  const DarkTheme = dark.titlePrimary

  return (
    <Icon
      size='2rem'
      color={
        isDark
          ? DarkTheme
          : LightTheme
      }
      {...rest}
    />
  )
}

IconContext.propTypes = {
  icon: PropTypes.func.isRequired
}
