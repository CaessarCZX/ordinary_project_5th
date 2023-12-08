import PropTypes from 'prop-types'
import { useTheme } from '../../hooks/useTheme'
import { DivFlex, Subtitle, Text } from '../../styled components/Darth-theme'
import { FollowerCard } from './FollowerCard'

export function ProfileInfoFollowers ({
  isSelfUser,
  userData,
  auth
}) {
  // Theme
  const { isDark } = useTheme()
  const currentUser = userData[0]
  const friendList = currentUser.friends

  return (
    <DivFlex $col $gap='1.5rem' $width='100%'>
      <Subtitle $isDark={isDark}>{isSelfUser ? 'Tus seguidores' : `Los seguidores de ${currentUser.username}`}</Subtitle>
      <DivFlex $col $gap='1.5rem'>
        {
          friendList.length > 0
            ? (
                friendList.map((user, index) => (
                  <FollowerCard userData={user} auth={auth} key={`${user.username}${index}`} />
                ))
              )
            : <Text $isDark={isDark}>{isSelfUser ? 'Aun no cuentas con seguidores.' : `${currentUser.username} aun no tiene seguidores.`}</Text>
        }
      </DivFlex>
    </DivFlex>
  )
}

ProfileInfoFollowers.propTypes = {
  isSelfUser: PropTypes.bool.isRequired,
  userData: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired
}
