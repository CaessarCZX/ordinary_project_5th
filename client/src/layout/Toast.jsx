import PropTypes from 'prop-types'
import { useTheme } from '../hooks/useTheme.js'
import {
  SmallText,
  SubtitleHighlight
} from '../styled components/Darth-theme.js'
import {
  ToastBody,
  ToastCloseBtn,
  ToastHeader,
  ToastWrapp
} from '../styled components/Toast-theme.js'

export function Toast ({ msg, handleShow }) {
  const { isDark } = useTheme()
  const { title, bodyTxt } = msg

  return (
    <ToastWrapp $isDark={isDark}>
      <ToastHeader>
        <SubtitleHighlight $medium $isDark={isDark}>{title}</SubtitleHighlight>
        <ToastCloseBtn onClick={handleShow} $isDark={isDark}>&times;</ToastCloseBtn>
      </ToastHeader>
      <ToastBody>
        <SmallText $isDark={isDark}>{bodyTxt}</SmallText>
      </ToastBody>
    </ToastWrapp>
  )
}

Toast.propTypes = {
  msg: PropTypes.object.isRequired,
  handleShow: PropTypes.any.isRequired
}
