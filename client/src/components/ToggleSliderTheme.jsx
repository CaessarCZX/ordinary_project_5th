import PropTypes from 'prop-types'
import { useTheme } from '../hooks/useTheme.js'
import { ControlSlider, Slider } from '../styled components/Darth-theme.js'

export function ToggleSliderTheme ({ id }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <>
      <ControlSlider
        id={id}
        checked={isDark}
        type='checkbox'
        onChange={() => toggleTheme()}
      />
      <Slider htmlFor={id} title='Cambiar el tema' />
    </>
  )
}

ToggleSliderTheme.propTypes = {
  id: PropTypes.string.isRequired
}
