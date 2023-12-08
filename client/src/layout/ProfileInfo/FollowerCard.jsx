import PropTypes from 'prop-types'
import { HiOutlineViewGrid } from 'react-icons/hi'
import defaultUserImg from '../../assets/defaultUserImg.svg'
import { RotableItem } from '../../styled components/Animation-containers.js'
import { Div, DivFlex, SmallText, Subtitle } from '../../styled components/Darth-theme'
import {
  FollowerCardAvatarImg,
  FollowerCardAvatarWrap,
  FollowerCardProfileAccessBtn,
  FollowerCardWrapper
} from '../../styled components/Profile-theme'
import { TitleCase } from '../../utils/getStrings'
import { FollowerCardManageFollowButtons } from './FollowerCardManageFollowButtons.jsx'

export function FollowerCard ({ userData, auth }) {
  const {
    _id,
    username,
    firstname,
    lastname,
    avatar
  } = userData

  const fullname = TitleCase(`${firstname} ${lastname}`)

  return (
    <FollowerCardWrapper
      $width='100%'
      $padding='0.7rem'
      $borderRadius='17px'
      $gap='1.2rem'
      $wrap
      $jBetween
      $aiCenter
      $overHidden
    >
      <DivFlex $gap='1rem' $aiCenter>

        <FollowerCardAvatarWrap>
          <FollowerCardAvatarImg src={avatar || defaultUserImg} />
        </FollowerCardAvatarWrap>

        <Div>
          <Subtitle $micro $isDark>{fullname}</Subtitle>
          <SmallText $isDark>{username}</SmallText>
        </Div>

      </DivFlex>

      <DivFlex $gap='1rem'>

        <FollowerCardProfileAccessBtn to={`/profile/${_id}`}>
          <DivFlex $aiCenter $gap='0.5rem'>
            <RotableItem>
              <HiOutlineViewGrid color='#fff' />
            </RotableItem>
            <Subtitle $micro $isDark>Ver perfil</Subtitle>
          </DivFlex>
        </FollowerCardProfileAccessBtn>

        {
          auth && auth.user?._id && auth.user._id !== _id && <FollowerCardManageFollowButtons currentUser={userData} />
        }

      </DivFlex>
    </FollowerCardWrapper>
  )
}

FollowerCard.propTypes = {
  userData: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}
