import PropTypes from 'prop-types'
import {
  DivFlex,
  TextAlert
} from '../styled components/Darth-theme.js'

export function AlertIntoForm ({ value = false, children }) {
  return (
    <>
      {
        value && (
          <DivFlex $jCenter>
            <TextAlert>
              {children}
            </TextAlert>
          </DivFlex>)
      }
    </>
  )
}

AlertIntoForm.propTypes = {
  value: PropTypes.bool.isRequired,
  children: PropTypes.any.isRequired
}
