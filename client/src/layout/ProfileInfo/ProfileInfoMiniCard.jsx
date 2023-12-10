import PropTypes from 'prop-types'
import { ImPencil2 } from 'react-icons/im'
import defaultUserImg from '../../assets/defaultUserImg.svg'
import { IconContext } from '../../components/IconContext.jsx'
import { useDataUser } from '../../hooks/useDataUser'
import { useTheme } from '../../hooks/useTheme'
import { Div, DivFlex, SmallText, SubtitleHighlight, Text } from '../../styled components/Darth-theme'
import { ButtonLink } from '../../styled components/Darth-theme-Router-Links.js'
import { AvatarImg, MiniCardWrap, ProfileAvatarWrap } from '../../styled components/Profile-theme'

export function ProfileInfoMiniCard (
  {
    story,
    avatar,
    username,
    email,
    gender,
    phone,
    website,
    id
  }
) {
  // Theme
  const { isDark } = useTheme()

  // Redux
  const currentUser = useDataUser()

  const EmptyInfo = {
    story: 'Escribe tu historia...',
    phone: 'Privado...',
    website: 'Ninguna'
  }
  return (
    <MiniCardWrap
      $isDark={isDark}
      $padding='2rem'
      $minWidth='250px'
    >

      <ProfileAvatarWrap>
        <AvatarImg
          src={avatar || defaultUserImg}
          alt='Foto de perfil'
        />
      </ProfileAvatarWrap>

      <DivFlex
        $margin='1.5rem 0 0'
        $col
        $width='100%'
        $gap='0.5rem'
      >
        <Div $txtCenter $margin='0 0 0.7rem'>
          <SmallText
            $isDark={isDark}
          >
            {story || EmptyInfo.story}
          </SmallText>
        </Div>

        <div>
          <SmallText
            $bold
            $isDark={isDark}
          >Nombre de usuario:
          </SmallText>
          <Div $txtCenter>
            <SubtitleHighlight>
              {username}
            </SubtitleHighlight>
          </Div>
        </div>

        <div>
          <SmallText
            $bold
            $isDark={isDark}
          >Correo electrónico:
          </SmallText>
          <Div $txtRight>
            <Text
              $medium
              $isDark={isDark}
            >
              {email}
            </Text>
          </Div>
        </div>

        <div>
          <SmallText
            $bold
            $isDark={isDark}
          >Género:
          </SmallText>
          <Div $txtRight>
            <Text
              $medium
              $isDark={isDark}
            >
              {gender}
            </Text>
          </Div>
        </div>

        <div>
          <SmallText
            $bold
            $isDark={isDark}
          >Teléfono:
          </SmallText>
          <Div $txtRight>
            <Text
              $medium
              $isDark={isDark}
            >
              {phone || EmptyInfo.phone}
            </Text>
          </Div>
        </div>

        <div>
          <SmallText
            $bold
            $isDark={isDark}
          >Redes:
          </SmallText>
          <Div $txtCenter>
            <Text
              $medium
              $isDark={isDark}
            >
              {website || EmptyInfo.website}
            </Text>
          </Div>
        </div>

        {/* Enable the Edit Page */}
        {
          currentUser &&
          currentUser._id === id && (
            <ButtonLink
              $action
              $isDark={isDark}
              $margin='1rem 0 0'
              to={`/profile/${id}/edit`}
            >
              <DivFlex $aiCenter $gap='1.2rem'>
                <IconContext size='0.97rem' icon={ImPencil2} />
                <p>Editar Perfil</p>
              </DivFlex>
            </ButtonLink>
          )
        }
      </DivFlex>
    </MiniCardWrap>
  )
}

ProfileInfoMiniCard.propTypes = {
  story: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  website: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
}
