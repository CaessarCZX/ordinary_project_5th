import PropTypes from 'prop-types'
import { DivFlex } from '../../styled components/Darth-theme.js'
import { MidContainerWrap } from '../../styled components/MidContainerLayout-theme.js'

export function MidContainerLayout ({ children }) {
  return (
    <MidContainerWrap>
      <DivFlex
        $col
        $aiCenter
        $gap='2rem'
        $padding='0 1rem'
      >
        {children}
      </DivFlex>
    </MidContainerWrap>
  )
}

MidContainerLayout.propTypes = {
  children: PropTypes.any.isRequired
}
