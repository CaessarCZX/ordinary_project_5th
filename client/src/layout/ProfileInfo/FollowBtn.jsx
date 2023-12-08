import PropTypes from 'prop-types'
import { MdPersonAdd } from 'react-icons/md'
import { IconContext } from '../../components/IconContext'
import { useTheme } from '../../hooks/useTheme'
import { Div, DivFlex, SubtitleHighlight } from '../../styled components/Darth-theme'
import { AddFriendButton } from '../../styled components/Profile-theme'

export function FollowBtn ({ addAction }) {
  // Theme
  const { isDark } = useTheme()

  return (
    <AddFriendButton
      $isDark={isDark}
      onClick={addAction}
    >
      <DivFlex
        $gap='0.7rem'
        $aiCenter
      >
        <IconContext color='#a855f7' icon={MdPersonAdd} />
        <Div>
          <SubtitleHighlight>Seguir</SubtitleHighlight>
        </Div>
      </DivFlex>
    </AddFriendButton>
  )
}

FollowBtn.propTypes = {
  addAction: PropTypes.func.isRequired
}
