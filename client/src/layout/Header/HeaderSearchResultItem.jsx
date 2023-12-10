import PropTypes from 'prop-types'
import defaultUserImg from '../../assets/defaultUserImg.svg'
import { Div, DivFlex, SmallText, Text } from '../../styled components/Darth-theme'
import {
  SearchResultsItemAvatarImg,
  SearchResultsItemAvatarWrap
} from '../../styled components/Header-theme.js'
import { TitleCase } from '../../utils/getStrings.js'

export function HeaderSearchResultItem (
  {
    firstname,
    lastname,
    avatar,
    username
  }
) {
  const fullName = TitleCase(`${firstname} ${lastname}`)

  return (
    <DivFlex $aiCenter $gap='0.5rem'>
      <SearchResultsItemAvatarWrap>
        <SearchResultsItemAvatarImg
          src={avatar || defaultUserImg}
          alt={`Imagen de perfil de ${fullName}`}
        />
      </SearchResultsItemAvatarWrap>
      <Div>
        <Text $medium $isDark>{fullName}</Text>
        <SmallText $bold $isDark>{username}</SmallText>
      </Div>
    </DivFlex>
  )
}

HeaderSearchResultItem.propTypes = {
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired
}
