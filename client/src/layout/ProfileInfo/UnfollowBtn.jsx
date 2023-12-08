import PropTypes from 'prop-types'
import { MdPersonRemove } from 'react-icons/md'
import { IconContext } from '../../components/IconContext'
import { useTheme } from '../../hooks/useTheme'
import { Div, DivFlex, TextAlert } from '../../styled components/Darth-theme'
import { RemoveFriendButton } from '../../styled components/Profile-theme'

export function UnfollowBtn ({ removeAction }) {
  // Theme
  const { isDark } = useTheme()

  return (
    <RemoveFriendButton
      $isDark={isDark}
      onClick={removeAction}
    >
      <DivFlex
        $gap='0.7rem'
        $aiCenter
      >
        <IconContext color='red' icon={MdPersonRemove} />
        <Div>
          <TextAlert>Dejar de seguir</TextAlert>
        </Div>
      </DivFlex>
    </RemoveFriendButton>
  )
}

UnfollowBtn.propTypes = {
  removeAction: PropTypes.func.isRequired
}
