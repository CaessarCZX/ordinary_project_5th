import PropTypes from 'prop-types'
import { FaPlus } from 'react-icons/fa'
import { RotableItem } from '../../styled components/Animation-containers'
import { DivFlex, Subtitle } from '../../styled components/Darth-theme'
import { FollowerCardAddFriendBtnWrap } from '../../styled components/Profile-theme'

export function FollowerCardFollowBtn ({ addAction }) {
  return (
    <FollowerCardAddFriendBtnWrap onClick={addAction}>
      <DivFlex $aiCenter $gap='0.5rem'>
        <RotableItem>
          <FaPlus color='#fff' />
        </RotableItem>
        <Subtitle $micro $isDark>Seguir</Subtitle>
      </DivFlex>
    </FollowerCardAddFriendBtnWrap>
  )
}

FollowerCardFollowBtn.propTypes = {
  addAction: PropTypes.func.isRequired
}
