import PropTypes from 'prop-types'
import defaultImg from '../../assets/defaultUserImg.svg'
import { useDataUser } from '../../hooks/useDataUser.js'
import { useTheme } from '../../hooks/useTheme.js'
import {
  ArticleFlex,
  SmallText,
  Subtitle, SubtitleHighlight
} from '../../styled components/Darth-theme.js'
import { SideBarProfileData, SideBarProfileImg, SideBarWrapProfileImg } from '../../styled components/SideBarMenu-theme.js'
import { TitleCase } from '../../utils/getStrings.js'

export function SideBarMenuCardView ({ isOpen }) {
  // Theme
  const { isDark } = useTheme()
  // Get data from global state
  const {
    email,
    firstname,
    lastname,
    username,
    avatar
  } = useDataUser()

  // Apply Title Case to fullname user
  const displayFullName = TitleCase(`${firstname} ${lastname}`)

  return (
    <ArticleFlex $col $padding='0.7rem' $margin='0.5rem 0 0'>
      <SideBarWrapProfileImg>
        <SideBarProfileImg
          src={avatar || defaultImg}
          alt='perfil de displayName'
        />
      </SideBarWrapProfileImg>
      <SideBarProfileData $isOpen={isOpen}>
        <Subtitle $isDark={isDark} $medium>{displayFullName}</Subtitle>
        <SubtitleHighlight $medium>{username}</SubtitleHighlight>
        <SmallText $isDark={isDark}>{email}</SmallText>
      </SideBarProfileData>
    </ArticleFlex>
  )
}

SideBarMenuCardView.propTypes = {
  isOpen: PropTypes.bool.isRequired
}
