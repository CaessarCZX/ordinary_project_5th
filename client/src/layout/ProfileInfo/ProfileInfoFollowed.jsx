import PropTypes from 'prop-types'
import { useTheme } from '../../hooks/useTheme'
import { DivFlex, Subtitle, Text } from '../../styled components/Darth-theme'
import { FollowerCard } from './FollowerCard'

export function ProfileInfoFollowed ({
  isSelfUser,
  userData,
  auth
}) {
  // Theme
  const { isDark } = useTheme()
  const currentUser = userData[0]
  const friendList = currentUser.following

  return (
    <DivFlex $col $gap='1.5rem' $width='100%'>
      <Subtitle $isDark={isDark}>{isSelfUser ? 'Tus seguidos' : `Los seguidos de ${currentUser.username}`}</Subtitle>
      <DivFlex $col $gap='1.5rem'>
        {
          friendList.length > 0
            ? (
                friendList.map((user, index) => (
                  <FollowerCard userData={user} auth={auth} key={`${user.username}${index}`} />
                ))
              )
            : <Text $isDark={isDark}>{isSelfUser ? 'Aun no sigues a nadie.' : `${currentUser.username} aun no sigue a nadie.`}</Text>
        }
      </DivFlex>
    </DivFlex>
  )
}

ProfileInfoFollowed.propTypes = {
  isSelfUser: PropTypes.bool.isRequired,
  userData: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired
}
