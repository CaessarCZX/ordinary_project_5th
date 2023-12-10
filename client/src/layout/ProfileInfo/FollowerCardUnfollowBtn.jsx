import PropTypes from 'prop-types'
import { FaMinus } from 'react-icons/fa'
import { RotableItem } from '../../styled components/Animation-containers'
import { DivFlex, Subtitle } from '../../styled components/Darth-theme'
import { FollowerCardRemoveFriendBtnWrap } from '../../styled components/Profile-theme'

export function FollowerCardUnfollowBtn ({ removeAction }) {
  return (
    <FollowerCardRemoveFriendBtnWrap onClick={removeAction}>
      <DivFlex $aiCenter $gap='0.5rem'>
        <RotableItem>
          <FaMinus color='#fff' />
        </RotableItem>
        <Subtitle $micro $isDark>Dejar de seguir</Subtitle>
      </DivFlex>
    </FollowerCardRemoveFriendBtnWrap>
  )
}

FollowerCardUnfollowBtn.propTypes = {
  removeAction: PropTypes.func.isRequired
}
