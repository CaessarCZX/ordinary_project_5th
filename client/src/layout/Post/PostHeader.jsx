import PropTypes from 'prop-types'
import { useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { SlOptionsVertical } from 'react-icons/sl'
import { useDispatch } from 'react-redux'
import defaultUserImg from '../../assets/defaultUserImg.svg'
import { IconContext } from '../../components/IconContext.jsx'
import { ALERT_TYPES } from '../../redux/actions/alertActions.js'
import { DivFlex, SmallText, Subtitle } from '../../styled components/Darth-theme'
import { DefaultLink } from '../../styled components/Darth-theme-Router-Links.js'
import { DropShadowOutset } from '../../styled components/IluminationShadows-containers.js'
import { PostCardAvatarImg, PostCardAvatarWrap, PostCardDropdownOpcion, PostCardDropdownWrap } from '../../styled components/Post-theme.js'
import { extractDateFromString, getTimeFromStringDate } from '../../utils/getDates.js'
import { TitleCase } from '../../utils/getStrings.js'

export function PostHeader ({
  theme: isDark,
  avatar,
  firstname,
  lastname,
  lastMondification,
  _id,
  isSelfUser,
  postInfo
}) {
  const Fullname = TitleCase(`${firstname} ${lastname}`)
  const Date = extractDateFromString(lastMondification)
  const TimeAgo = getTimeFromStringDate(lastMondification)

  // To close when user click outside
  const [showDropdown, setShowDropdown] = useState(false)

  const dispatch = useDispatch()

  // To edit post
  const handleEdit = (postInfo) => {
    // Close dropdown
    setShowDropdown(false)
    dispatch({
      type: ALERT_TYPES.STATUS,
      payload: {
        ...postInfo,
        edit: true
      }
    })
  }

  return (
    <DivFlex $jBetween $margin='0 1rem'>

      <DivFlex>

        <PostCardAvatarWrap>
          <PostCardAvatarImg src={avatar || defaultUserImg} alt='image' />
        </PostCardAvatarWrap>

        <DivFlex $col $jCenter $margin='0 0 0 0.5rem'>
          <DefaultLink to={`/profile/${_id}`}>
            <Subtitle $micro $isDark={isDark}>{Fullname}</Subtitle>
          </DefaultLink>

          <DivFlex $gap='1.5rem'>
            <SmallText $isDark={isDark}>{Date}</SmallText>
            <SmallText $bold $isDark={isDark}>{`Publicado: ${TimeAgo}`}</SmallText>
          </DivFlex>
        </DivFlex>

      </DivFlex>
      {
        isSelfUser && (
          <DivFlex $relative $aiCenter $jsEnd>
            <DropShadowOutset $duration='0.2s' $timingFunc='ease-out' onClick={() => setShowDropdown(!showDropdown)}>
              <IconContext size='1.5rem' icon={showDropdown ? IoCloseSharp : SlOptionsVertical} />
            </DropShadowOutset>
            {
              showDropdown && (
                <PostCardDropdownWrap>
                  <PostCardDropdownOpcion onClick={() => handleEdit(postInfo)}>Editar</PostCardDropdownOpcion>
                  <PostCardDropdownOpcion>Eliminar</PostCardDropdownOpcion>
                </PostCardDropdownWrap>
              )
            }
          </DivFlex>
        )
      }

    </DivFlex>
  )
}

PostHeader.propTypes = {
  theme: PropTypes.bool.isRequired,
  avatar: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  lastMondification: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  isSelfUser: PropTypes.bool.isRequired,
  postInfo: PropTypes.object.isRequired
}
